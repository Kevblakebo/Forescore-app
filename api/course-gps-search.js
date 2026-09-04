// Vercel serverless function - runs server-side only. Keeps the golfapi.io
// key out of the browser bundle: the app calls THIS endpoint (same domain,
// no key needed from the client), and this function is the only thing that
// ever sees the real key, read from an environment variable that Vite
// never exposes to client code (no VITE_ prefix).
//
// Base URL and /v2.3 version confirmed working via a real test URL from
// golfapi.io. The query parameter name for filtering /courses by name is
// still unconfirmed - the response for search=q came back unfiltered
// (alphabetically first courses, ignoring the search term entirely),
// so this sends several likely candidate names at once and we'll see
// from the actual filtered results which one golfapi.io recognizes.
export default async function handler(req, res) {
  // CORS headers - required so this endpoint can be called from the
  // Capacitor iOS app, which serves the app from its own internal
  // address rather than the real ripscoregolf.com domain. Requests
  // from the same-origin website were never affected by this at all
  // (same-origin requests are never subject to CORS restrictions to
  // begin with), so this is purely additive - it only ever grants
  // access that wasn't being checked before, never removes any.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const q = (req.query.q || "").toString().trim();
  if (q.length < 2) {
    return res.status(400).json({ error: "Search text too short" });
  }

  const apiKey = process.env.GOLFAPI_IO_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFAPI_IO_KEY" });
  }

  try {
    const params = new URLSearchParams({
      search: q,
      clubName: q,
      courseName: q,
      name: q,
      q,
    });
    const upstream = await fetch(
      `https://golfapi.io/api/v2.3/courses?${params.toString()}`,
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
