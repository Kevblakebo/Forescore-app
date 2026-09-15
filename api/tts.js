// Vercel serverless function - runs server-side only. Keeps the
// ElevenLabs API key out of the browser bundle, same reasoning as
// ai-recap.js for ANTHROPIC_API_KEY: the app calls THIS endpoint, and
// this function is the only thing that ever sees the real key, read
// from an environment variable Vite never exposes to client code (no
// VITE_ prefix).
//
// Converts text to speech via ElevenLabs and streams the raw MP3 bytes
// straight back to the client - not base64-encoded JSON, which would
// add roughly a third more data to every response for no benefit here,
// since the client just wants to play the audio, not inspect it.

export default async function handler(req, res) {
  // CORS headers - required so this endpoint can be called from the
  // Capacitor iOS app, which serves the app from its own internal
  // address rather than the real ripscoregolf.com domain. Requests
  // from the same-origin website were never affected by this at all
  // (same-origin requests are never subject to CORS restrictions to
  // begin with), so this is purely additive - it only ever grants
  // access that wasn't being checked before, never removes any.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ELEVENLABS_API_KEY" });
  }

  const { text, voiceId } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text" });
  }
  if (!voiceId || typeof voiceId !== "string") {
    return res.status(400).json({ error: "Missing voiceId" });
  }
  // A standings announcement is always short - this caps things well
  // above anything the app itself would ever actually send, purely as
  // a guard against a malformed or abusive request racking up cost.
  if (text.length > 2000) {
    return res.status(400).json({ error: "Text is too long" });
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res.status(response.status).json({ error: `ElevenLabs speech request failed: ${errText || response.statusText}` });
    }
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);
  } catch (e) {
    return res.status(500).json({ error: `Couldn't reach ElevenLabs: ${e.message}` });
  }
}
