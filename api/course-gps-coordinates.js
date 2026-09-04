// Vercel serverless function - runs server-side only. Keeps the golfapi.io
// key out of the browser bundle - see course-gps-search.js for the full
// explanation of why this pattern exists.
//
// Base URL, /v2.3 version, and this exact endpoint path confirmed working
// via a real test URL from golfapi.io (they tested /clubs/{id}, same
// pattern applies to /coordinates/{id}).
//
// Checks a Supabase cache first, same reasoning as course-gps-detail.js -
// GPS coordinates for a course essentially never change, so caching them
// meaningfully cuts real API costs on repeat lookups.
import { createClient } from "@supabase/supabase-js";

const CACHE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

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

  const id = (req.query.id || "").toString().trim();
  if (!id) {
    return res.status(400).json({ error: "Missing course id" });
  }

  const apiKey = process.env.GOLFAPI_IO_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFAPI_IO_KEY" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

  if (supabase) {
    try {
      const { data: cached } = await supabase
        .from("course_cache")
        .select("coordinates, coordinates_cached_at")
        .eq("course_id", id)
        .maybeSingle();
      if (cached && cached.coordinates && cached.coordinates_cached_at) {
        const age = Date.now() - new Date(cached.coordinates_cached_at).getTime();
        if (age < CACHE_MAX_AGE_MS) {
          return res.status(200).json(cached.coordinates);
        }
      }
    } catch (e) {
      // Fall through to the real API call below.
    }
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

    if (supabase) {
      try {
        const { error } = await supabase
          .from("course_cache")
          .upsert(
            {
              course_id: id,
              coordinates: data,
              coordinates_cached_at: new Date().toISOString(),
            },
            { onConflict: "course_id" }
          );
        if (error) console.warn("Couldn't cache course coordinates:", error.message);
      } catch (e) {
        // Ignore - caching is a bonus, not a requirement for this response.
      }
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the course GPS database" });
  }
}
