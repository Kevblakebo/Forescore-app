// Vercel serverless function - runs server-side only. Fetches full course
// detail from golfapi.io - par, stroke index, and tee-by-tee yardage - the
// primary course data source, replacing the old GolfCourseAPI-based
// course-detail.js. Keeps the golfapi.io key server-side only.
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
