// Vercel serverless function - runs server-side only. Permanently deletes
// a user's account and all associated data.
//
// This requires the Supabase service role key, not the regular anon key
// used elsewhere in this app - two reasons: (1) actually removing someone
// from Supabase's own auth system is an admin-only operation that never
// works with a regular user session, by design, and (2) this needs to
// bypass RLS to reliably clean up every table in one place rather than
// depending on several separate "delete your own row" policies. The
// service role key must NEVER be used client-side - it bypasses every
// security rule in the database, so it only ever lives here, read from
// an environment variable, and is never sent to the browser.
//
// Authorization works by verifying the person's own current session
// token (sent from the app) against Supabase directly - this confirms
// their identity and gets their real user id, so this endpoint can only
// ever delete the account making the request, never an arbitrary one.
import { createClient } from "@supabase/supabase-js";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "");
  if (!accessToken) {
    return res.status(401).json({ error: "Missing access token" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Server is missing Supabase service role configuration" });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  // Verify the token belongs to a real, currently-valid session, and get
  // the actual user id from it - never trust a user id passed directly in
  // the request body, since that could be spoofed to delete someone else.
  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (userErr || !userData || !userData.user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
  const userId = userData.user.id;

  try {
    // Clean up this user's own rows across every table first. Order
    // matters less here since these don't reference each other, but all
    // of this happens before touching the auth record itself.
    await supabaseAdmin.from("user_rounds").delete().eq("user_id", userId);
    await supabaseAdmin.from("group_members").delete().eq("user_id", userId);
    await supabaseAdmin.from("leaderboard_stats").delete().eq("user_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // Groups this user created stay intact for any other members still
    // using them - deleting the whole group would disrupt people who did
    // nothing wrong. Clearing created_by means that group can no longer
    // be renamed or have its avatar changed by anyone, which is an
    // acceptable tradeoff versus blocking this account deletion or
    // deleting a shared group out from under other people.
    await supabaseAdmin.from("groups").update({ created_by: null }).eq("created_by", userId);

    // Finally, remove the actual account from Supabase's auth system.
    const { error: deleteErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      return res.status(500).json({ error: `Data was cleared, but the account itself could not be removed (${deleteErr.message}). Please contact support.` });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong while deleting your account. Please contact support." });
  }
}
