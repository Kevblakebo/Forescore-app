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
//
// GPS mode (added later): same uncertainty applies to golfapi.io's own
// geo-filtering, likely worse, since we've never confirmed it does any
// distance filtering at all. Same defensive approach: send several likely
// candidate parameter names for lat/lng/radius, but never actually rely
// on golfapi.io to do the filtering. Whatever list comes back, this
// function independently computes real distance itself (once we know
// which field names each course result actually uses for its own
// coordinates) and does the sorting/filtering here - so this works
// correctly regardless of whether golfapi.io's geo params do anything at
// all. Call with ?lat=..&lng=.. instead of ?q=.. to use this mode.
//
// GPS mode is also cached, same reasoning as course-gps-detail.js: which
// courses exist near a given spot doesn't change, so paying golfapi.io
// again for the same location (e.g. a group's regular course, searched
// by a different member each week) is pure waste. Cached by a rounded
// lat/lng bucket rather than exact coordinates, since GPS drift means
// two requests near the same course almost never share identical
// coordinates - name search is NOT cached, since a free-text query
// doesn't bucket the same reliable way.
import { createClient } from "@supabase/supabase-js";

const CACHE_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000; // 180 days
// 2 decimal places is roughly 0.6-1.1 miles of precision depending on
// latitude - tight enough that two different courses essentially never
// share a bucket, loose enough that GPS drift on repeat visits to the
// same course reliably lands in the same bucket.
const BUCKET_DECIMALS = 2;

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

  const apiKey = process.env.GOLFAPI_IO_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing GOLFAPI_IO_KEY" });
  }

  const latRaw = req.query.lat;
  const lngRaw = req.query.lng;
  const isGpsMode = latRaw !== undefined && lngRaw !== undefined;

  if (isGpsMode) {
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }
    const radiusMiles = 15;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
    const latBucket = Number(lat.toFixed(BUCKET_DECIMALS));
    const lngBucket = Number(lng.toFixed(BUCKET_DECIMALS));

    // Cache check is best-effort - if Supabase isn't reachable or isn't
    // configured, this just falls through to a normal golfapi.io call
    // rather than failing the whole request over a cache problem.
    if (supabase) {
      try {
        const { data: cached } = await supabase
          .from("course_gps_search_cache")
          .select("courses, cached_at")
          .eq("lat_bucket", latBucket)
          .eq("lng_bucket", lngBucket)
          .maybeSingle();
        if (cached && cached.courses && cached.cached_at) {
          const age = Date.now() - new Date(cached.cached_at).getTime();
          if (age < CACHE_MAX_AGE_MS) {
            // Distance is recomputed from the exact requested
            // coordinates every time, even on a cache hit - only the
            // underlying course list itself is what's cached, not the
            // distance figure, since that's specific to this exact
            // request, not the rounded bucket.
            return res.status(200).json({ courses: withDistances(cached.courses, lat, lng, radiusMiles) });
          }
        }
      } catch (e) {
        // Fall through to the real API call below.
      }
    }

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      lat: String(lat),
      lng: String(lng),
      lon: String(lng),
      radius: String(radiusMiles),
      distance: String(radiusMiles),
      miles: String(radiusMiles),
    });

    try {
      const upstream = await fetch(
        `https://golfapi.io/api/v2.3/courses?${params.toString()}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      if (!upstream.ok) {
        return res.status(upstream.status).json({ error: `Course GPS database returned ${upstream.status}` });
      }
      const data = await upstream.json();
      const rawCourses = Array.isArray(data.courses) ? data.courses : [];

      if (supabase) {
        // Awaited, not fire-and-forget - a serverless function can be
        // torn down right after the response is sent, before an
        // un-awaited promise actually finishes. Still best-effort on
        // failure (a cache write error doesn't fail the response the
        // person is waiting on), but it needs to actually run to
        // completion to work at all.
        try {
          const { error } = await supabase
            .from("course_gps_search_cache")
            .upsert(
              { lat_bucket: latBucket, lng_bucket: lngBucket, courses: rawCourses, cached_at: new Date().toISOString() },
              { onConflict: "lat_bucket,lng_bucket" }
            );
          if (error) console.warn("Couldn't cache GPS search results:", error.message);
        } catch (e) {
          // Ignore - caching is a bonus, not a requirement for this response.
        }
      }

      const withCoords = withDistances(rawCourses, lat, lng, radiusMiles);
      return res.status(200).json({
        courses: withCoords,
        // Lets the client tell the person clearly if golfapi.io's
        // results genuinely didn't include any usable coordinates at
        // all, rather than just silently showing an empty list as if
        // nothing was simply nearby.
        noCoordinatesAvailable: rawCourses.length > 0 && withCoords.length === 0,
      });
    } catch (e) {
      return res.status(500).json({ error: "Could not reach the course GPS database" });
    }
  }

  const q = (req.query.q || "").toString().trim();
  if (q.length < 2) {
    return res.status(400).json({ error: "Search text too short" });
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

// Uses golfapi.io's own provided distance field as the real source of
// truth - confirmed via a real test response that course objects from
// their /courses geo-search include a ready-made "distance" +
// "measureUnit" (km), sorted closest-first, rather than raw lat/lng
// coordinates. Falls back to computing haversine distance from raw
// coordinates only if a course is ever missing that field, for
// robustness against a response shape golfapi.io hasn't shown us yet.
function withDistances(rawCourses, lat, lng, radiusMiles) {
  return rawCourses
    .map((c) => {
      let distanceMiles = null;
      if (typeof c.distance === "number") {
        const unit = (c.measureUnit || "km").toLowerCase();
        distanceMiles = unit.startsWith("mi") ? c.distance : c.distance * 0.621371;
      } else {
        const cLat = Number(c.latitude ?? c.lat ?? c.Latitude);
        const cLng = Number(c.longitude ?? c.lng ?? c.lon ?? c.Longitude);
        if (Number.isFinite(cLat) && Number.isFinite(cLng)) {
          distanceMiles = haversineMiles(lat, lng, cLat, cLng);
        }
      }
      if (distanceMiles == null) return null;
      return { ...c, distanceMiles };
    })
    .filter(Boolean)
    .filter((c) => c.distanceMiles <= radiusMiles)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

// Standard great-circle distance between two lat/lng points, in miles.
function haversineMiles(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
