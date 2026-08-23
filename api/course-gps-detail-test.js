// Vercel serverless function - runs server-side only. Temporary test
// endpoint to see golfapi.io's full course-detail response shape (par,
// stroke index, yardage, tees) - once confirmed, this may get folded into
// the main GPS flow or removed if it doesn't have what we need.
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
      `https://golfapi.io/api/v2.3/courses/${encodeURIComponent(id)}`,
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
