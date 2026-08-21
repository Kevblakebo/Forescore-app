// Polyfills the Claude-artifact-only `window.storage` API so the app's
// existing code (storageGet/storageSet/storageDelete in App.jsx) works
// completely unchanged outside of Claude.ai.
//
// - shared === false (personal data: active round pointer, finished-round
//   archive, last-tournament pointer, local course fallback) -> localStorage.
//   This data was only ever meant to live on one device, so no backend
//   is needed for it.
// - shared === true (round data, tournament data, saved courses - anything
//   accessed by a code from multiple devices) -> Supabase, so joining a
//   round/tournament from another phone still works.
//
// Requires two Vite env vars (see .env.example): VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Not fatal - personal (localStorage) storage still works fine. Only
  // shared features (joining a round/tournament, saved courses, and now
  // account login) need this.
  console.warn(
    "[RipScore] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. " +
      "Personal storage (this device only) will work, but sharing rounds " +
      "and tournaments across devices, and account login, will not, until " +
      "these are configured."
  );
}

// Exported so App.jsx can use this exact same client for Supabase Auth
// (login/register/session) - deliberately one shared client instance
// rather than creating a second one, so auth state and database access
// are never out of sync with each other.
export { supabase };

function localGet(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    // Matches the "not found" phrasing the app already knows how to treat
    // as a normal missing-key case rather than a scary error.
    throw new Error("Not Found: no such key");
  }
  return { key, value: raw, shared: false };
}

function localSet(key, value) {
  localStorage.setItem(key, value);
  return { key, value, shared: false };
}

function localDelete(key) {
  localStorage.removeItem(key);
  return { key, deleted: true, shared: false };
}

async function sharedGet(key) {
  if (!supabase) throw new Error("Shared storage is not configured (missing Supabase env vars)");
  const { data, error } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Not Found: no such key");
  return { key, value: data.value, shared: true };
}

async function sharedSet(key, value) {
  if (!supabase) throw new Error("Shared storage is not configured (missing Supabase env vars)");
  const { error } = await supabase
    .from("kv_store")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  return { key, value, shared: true };
}

async function sharedDelete(key) {
  if (!supabase) throw new Error("Shared storage is not configured (missing Supabase env vars)");
  const { error } = await supabase.from("kv_store").delete().eq("key", key);
  if (error) throw new Error(error.message);
  return { key, deleted: true, shared: true };
}

window.storage = {
  async get(key, shared) {
    return shared ? sharedGet(key) : localGet(key);
  },
  async set(key, value, shared) {
    return shared ? sharedSet(key, value) : localSet(key, value);
  },
  async delete(key, shared) {
    return shared ? sharedDelete(key) : localDelete(key);
  },
};
