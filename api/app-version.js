// Vercel serverless function. Returns the newest RipScore version that is
// live on the App Store, so the iPhone app can show an "Update" pill when
// the installed version is older. Asked of Apple here (server-side) rather
// than from inside the app, since Apple's lookup endpoint isn't reliably
// callable straight from a web view.
const APP_STORE_ID = "6808406365";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const upstream = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=us`);
    if (!upstream.ok) return res.status(502).json({ error: "App Store lookup failed" });
    const data = await upstream.json();
    const hit = data && data.results && data.results[0];
    if (!hit || !hit.version) return res.status(404).json({ error: "App not found" });
    // Short cache: new versions show up within minutes of release, but
    // we don't hit Apple on every single app launch.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ version: hit.version });
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the App Store" });
  }
}
