// Vercel serverless function - runs server-side only. Fetches full course
// detail from golfapi.io - par, stroke index, and tee-by-tee yardage - the
// primary course data source, replacing the old GolfCourseAPI-based
// course-detail.js. Keeps the golfapi.io key server-side only.
//
// Checks a Supabase cache first, since golfapi.io's own docs explicitly
// say to cache course data rather than re-fetch it - course detail like
// par/yardage essentially never changes, so a long cache lifetime is
// safe and meaningfully cuts real API costs on repeat lookups of the
// same course.
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

  // Cache check is best-effort - if Supabase isn't reachable or isn't
  // configured, this just falls through to a normal golfapi.io call
  // rather than failing the whole request over a cache problem.
  if (supabase) {
    try {
      const { data: cached } = await supabase
        .from("course_cache")
        .select("detail, detail_cached_at")
        .eq("course_id", id)
        .maybeSingle();
      if (cached && cached.detail && cached.detail_cached_at) {
        const age = Date.now() - new Date(cached.detail_cached_at).getTime();
        if (age < CACHE_MAX_AGE_MS) {
          return res.status(200).json(cached.detail);
        }
      }
    } catch (e) {
      // Fall through to the real API call below.
    }
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

    if (supabase) {
      // Awaited, not fire-and-forget - a serverless function can be torn
      // down right after the response is sent, before an un-awaited
      // promise actually finishes. Still best-effort on failure (a cache
      // write error doesn't fail the response the person is waiting on),
      // but it needs to actually run to completion to work at all.
      try {
        const { error } = await supabase
          .from("course_cache")
          .upsert(
            {
              course_id: id,
              club_name: data.clubName || null,
              course_name: data.courseName || null,
              detail: data,
              detail_cached_at: new Date().toISOString(),
            },
            { onConflict: "course_id" }
          );
        if (error) console.warn("Couldn't cache course detail:", error.message);
      } catch (e) {
        // Ignore - caching is a bonus, not a requirement for this response.
      }
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Could not reach the course GPS database" });
  }
}
