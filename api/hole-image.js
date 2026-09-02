// Vercel serverless function - runs server-side only. Keeps the Google
// Maps API key out of the browser bundle, same reasoning as
// course-gps-search.js and ai-recap.js for their own keys: the app
// calls THIS endpoint, and this function is the only thing that ever
// sees the real key, read from an environment variable Vite never
// exposes to client code (no VITE_ prefix).
//
// Cached by a rounded lat/lng bucket, same reasoning and pattern as
// course-gps-search.js's GPS mode: a given hole's satellite image
// never changes, so the very first view of a hole pays Google once,
// and every other view of that same hole afterward - by anyone,
// forever - is served from Supabase for free.
import { createClient } from "@supabase/supabase-js";

// 4 decimal places is roughly 30-40 feet of precision - tight enough
// that this never blurs together two different holes, loose enough
// that the golfapi.io-provided coordinates for the same green always
// land in the same bucket.
const BUCKET_DECIMALS = 4;

export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOOGLE_MAPS_API_KEY" });
  }

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  const latBucket = Number(lat.toFixed(BUCKET_DECIMALS));
  const lngBucket = Number(lng.toFixed(BUCKET_DECIMALS));

  // Cache check is best-effort - if Supabase isn't reachable or isn't
  // configured, this just falls through to a normal Google call
  // rather than failing the whole request over a cache problem.
  if (supabase) {
    try {
      const { data: cached } = await supabase
        .from("hole_image_cache")
        .select("image_base64")
        .eq("lat_bucket", latBucket)
        .eq("lng_bucket", lngBucket)
        .maybeSingle();
      if (cached && cached.image_base64) {
        return res.status(200).json({ image: cached.image_base64 });
      }
    } catch (e) {
      // Fall through to the real API call below.
    }
  }

  try {
    const params = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: "17",
      size: "400x400",
      scale: "2",
      maptype: "satellite",
      key: apiKey,
    });
    const upstream = await fetch(`https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Hole image service returned ${upstream.status}` });
    }
    const arrayBuffer = await upstream.arrayBuffer();
    const image = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;

    if (supabase) {
      // Awaited, not fire-and-forget - a serverless function can be
      // torn down right after the response is sent, before an
      // un-awaited promise actually finishes. Still best-effort on
      // failure (a cache write error doesn't fail the response the
      // person is waiting on), but it needs to actually run to
      // completion to work at all.
      try {
        const { error } = await supabase
          .from("hole_image_cache")
          .upsert(
            { lat_bucket: latBucket, lng_bucket: lngBucket, image_base64: image, cached_at: new Date().toISOString() },
            { onConflict: "lat_bucket,lng_bucket" }
          );
        if (error) console.warn("Couldn't cache hole image:", error.message);
      } catch (e) {
        // Ignore - caching is a bonus, not a requirement for this response.
      }
    }

    return res.status(200).json({ image });
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the hole image service" });
  }
}
