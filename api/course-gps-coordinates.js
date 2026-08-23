// Vercel serverless function - runs server-side only. Keeps the golfapi.io
// key out of the browser bundle - see course-gps-search.js for the full
// explanation of why this pattern exists.
//
// Base URL, /v2.3 version, and this exact endpoint path confirmed working
// via a real test URL from golfapi.io (they tested /clubs/{id}, same
// pattern applies to /coordinates/{id}).
export default async function handler(req, res) {
  const id = (req.query.id || "").toString().trim();
  if (!id) {
    return res.status(400).json({ error: "Missing course id" });
  }

  const apiKey = process.env.GOLFAPI_IO_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFAPI_IO_KEY" });
  }

  try {
    const upstream = await fetch(
      `https://golfapi.io/api/v2.3/coordinates/${encodeURIComponent(id)}`,
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
