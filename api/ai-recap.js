// Vercel serverless function - runs server-side only. Keeps the
// Anthropic API key out of the browser bundle, same reasoning as
// course-gps-search.js and course-gps-detail.js for GOLFAPI_IO_KEY:
// the app calls THIS endpoint, and this function is the only thing
// that ever sees the real key, read from an environment variable Vite
// never exposes to client code (no VITE_ prefix).
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  const { players, winners, game, moments, mulligans } = req.body || {};
  if (!Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: "Missing round data" });
  }

  // Only ever the facts actually computed by the app itself - the
  // model is explicitly told below never to invent anything beyond
  // this, so what's passed in here is the model's entire, complete
  // picture of what happened.
  const roundData = { game, players, winners, moments: moments || [], mulligans: mulligans || {} };

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
      return res.status(upstream.status).json({ error: `AI recap service returned ${upstream.status}` });
    }
    const data = await upstream.json();
    const text = (data.content || []).map((block) => block.text || "").join("").trim();
    if (!text) {
      return res.status(502).json({ error: "AI recap came back empty" });
    }
    return res.status(200).json({ recap: text });
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the AI recap service" });
  }
}
