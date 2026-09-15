// Vercel serverless function - runs server-side only. Keeps the
// ElevenLabs API key out of the browser bundle, same reasoning as
// ai-recap.js for ANTHROPIC_API_KEY: the app calls THIS endpoint, and
// this function is the only thing that ever sees the real key, read
// from an environment variable Vite never exposes to client code (no
// VITE_ prefix).
//
// Lists the ElevenLabs voices actually available on this account, so
// the app's voice picker always reflects whatever premade or cloned
// voices exist there - never a hardcoded list that could drift out of
// date or include a voice the account doesn't actually have access to.

export default async function handler(req, res) {
  // CORS headers - required so this endpoint can be called from the
  // Capacitor iOS app, which serves the app from its own internal
  // address rather than the real ripscoregolf.com domain. Requests
  // from the same-origin website were never affected by this at all
  // (same-origin requests are never subject to CORS restrictions to
  // begin with), so this is purely additive - it only ever grants
  // access that wasn't being checked before, never removes any.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ELEVENLABS_API_KEY" });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: { "xi-api-key": apiKey },
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res.status(response.status).json({ error: `ElevenLabs voices request failed: ${errText || response.statusText}` });
    }
    const data = await response.json();
    // Only pass through what the picker UI actually needs - never the
    // full ElevenLabs object, which includes internal settings that
    // aren't the client's concern.
    const voices = (data.voices || []).map((v) => ({
      voiceId: v.voice_id,
      name: v.name,
      category: v.category || "",
      accent: (v.labels && v.labels.accent) || "",
      gender: (v.labels && v.labels.gender) || "",
      previewUrl: v.preview_url || "",
    }));
    return res.status(200).json({ voices });
  } catch (e) {
    return res.status(500).json({ error: `Couldn't reach ElevenLabs: ${e.message}` });
  }
}
