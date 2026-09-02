// Vercel serverless function - runs server-side only. Keeps the
// Anthropic API key out of the browser bundle, same reasoning as
// course-gps-search.js and course-gps-detail.js for GOLFAPI_IO_KEY:
// the app calls THIS endpoint, and this function is the only thing
// that ever sees the real key, read from an environment variable Vite
// never exposes to client code (no VITE_ prefix).
//
// True, server-side "only once per round" enforcement - not just a
// missing button in the UI. This reads and writes the round's actual
// saved row in Supabase directly (the same kv_store table App.jsx's
// own storageGet/storageSet read and write), rather than trusting
// whatever a client claims about whether a recap already exists. That
// means a recap can only ever be generated, and billed, once per
// round, even if someone called this endpoint directly and repeatedly
// from outside the app entirely.
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Server is missing Supabase configuration" });
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { roundId, players, winners, game } = req.body || {};
  if (!roundId || typeof roundId !== "string") {
    return res.status(400).json({ error: "Missing roundId" });
  }
  if (!Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: "Missing round data" });
  }

  const kvKey = `golfround:${roundId}`;
  const { data: existingRow, error: readError } = await supabase.from("kv_store").select("value").eq("key", kvKey).maybeSingle();
  if (readError) {
    return res.status(500).json({ error: "Couldn't look up this round" });
  }
  if (!existingRow) {
    return res.status(404).json({ error: "That round couldn't be found" });
  }
  let roundRecord;
  try {
    roundRecord = JSON.parse(existingRow.value);
  } catch (e) {
    return res.status(500).json({ error: "That round's saved data is corrupted" });
  }

  // The actual enforcement point - if this round already has a recap,
  // hand back the existing one and stop here, before ever reaching the
  // billed Anthropic call below. This is checked against the round's
  // real, saved data, not anything the client sent.
  if (roundRecord.aiRecap) {
    return res.status(200).json({ recap: roundRecord.aiRecap, alreadyExisted: true });
  }

  // Only ever the facts actually computed by the app itself - the
  // model is explicitly told below never to invent anything beyond
  // this, so what's passed in here is the model's entire, complete
  // picture of what happened.
  const roundData = { game, players, winners };

  const prompt = `You're writing a short, funny recap for a golf app's group chat - think a golf buddy razzing the group after a round, not a sports broadcaster.

Rules:
- 2-4 sentences, plain text, no markdown
- Playful and roasting is great - genuinely funny, a little savage even - but never mean, never about anything outside the round itself
- Only use the facts given below. Never invent a stat, shot, or moment that isn't in the data
- Mention the winner, but don't just list scores - find the actual story (a comeback, a collapse, a photo finish, someone's mulligan habit)
- Vary your structure and jokes - don't fall into the same template every time

Round data:
${JSON.stringify(roundData, null, 2)}

Write the recap.`;

  let recapText;
  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!upstream.ok) {
      const errBody = await upstream.json().catch(() => null);
      const detail = errBody && errBody.error && errBody.error.message ? errBody.error.message : null;
      console.error("Anthropic API error:", upstream.status, detail || "(no detail)");
      return res.status(upstream.status).json({ error: detail || `AI recap service returned ${upstream.status}` });
    }
    const data = await upstream.json();
    recapText = (data.content || []).map((block) => block.text || "").join("").trim();
    if (!recapText) {
      return res.status(502).json({ error: "AI recap came back empty" });
    }
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the AI recap service" });
  }

  // Saved here, server-side, right after a successful generation - not
  // left to the client to persist afterward. This closes the same race
  // a client-side-only save would leave open: two nearly-simultaneous
  // requests could otherwise both pass the "no recap yet" check above
  // before either had saved its result.
  const { error: writeError } = await supabase
    .from("kv_store")
    .upsert({ key: kvKey, value: JSON.stringify({ ...roundRecord, aiRecap: recapText }), updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (writeError) {
    console.warn("Couldn't save AI recap to round:", writeError.message);
    // Still return the text that was generated and paid for - a failed
    // save shouldn't also throw away a successful, billed response.
  }

  return res.status(200).json({ recap: recapText });
}
