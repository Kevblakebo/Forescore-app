// Vercel serverless function - runs server-side only. This is what keeps
// the GolfCourseAPI key out of the browser bundle: the app calls THIS
// endpoint (same domain, no key needed from the client), and this function
// is the only thing that ever sees the real key, read from an environment
// variable that Vite never exposes to client code (no VITE_ prefix).
export default async function handler(req, res) {
  const q = (req.query.q || "").toString().trim();
  if (q.length < 2) {
    return res.status(400).json({ error: "Search text too short" });
  }

  const apiKey = process.env.GOLFCOURSE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFCOURSE_API_KEY" });
  }

  try {
    const upstream = await fetch(
      `https://api.golfcourseapi.com/v1/search?search_query=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Key ${apiKey}` } }
    );
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Course database returned ${upstream.status}` });
    }
    const data = await upstream.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the course database" });
  }
}
