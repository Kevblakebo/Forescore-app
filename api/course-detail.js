// Vercel serverless function - runs server-side only, same reasoning as
// course-search.js: keeps the GolfCourseAPI key out of the browser.
export default async function handler(req, res) {
  const id = (req.query.id || "").toString().trim();
  if (!id) {
    return res.status(400).json({ error: "Missing course id" });
  }

  const apiKey = process.env.GOLFCOURSE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFCOURSE_API_KEY" });
  }

  try {
    const upstream = await fetch(
      `https://api.golfcourseapi.com/v1/courses/${encodeURIComponent(id)}`,
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
