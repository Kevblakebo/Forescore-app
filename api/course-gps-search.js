// Vercel serverless function - runs server-side only. Keeps the golfapi.io
// key out of the browser bundle: the app calls THIS endpoint (same domain,
// no key needed from the client), and this function is the only thing that
// ever sees the real key, read from an environment variable that Vite
// never exposes to client code (no VITE_ prefix).
//
// NOTE: the exact base URL and response field names below are our best
// reading of golfapi.io's documentation, which is a JavaScript-rendered
// page we can't fully inspect - this needs to be tested against the real
// API once deployed, and the URL/field names adjusted if needed based on
// what actually comes back.
export default async function handler(req, res) {
  const q = (req.query.q || "").toString().trim();
  if (q.length < 2) {
    return res.status(400).json({ error: "Search text too short" });
  }

  const apiKey = process.env.GOLFAPI_IO_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFAPI_IO_KEY" });
  }

  try {
    const upstream = await fetch(
      `https://golfapi.io/api/courses?search=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Course GPS database returned ${upstream.status}` });
    }
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the course GPS database" });
  }
}
