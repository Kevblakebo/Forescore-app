import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";

/* ===================================================================
   PART 1 — STORAGE + STORE
   Everything down to "PART 2" is pure logic with no UI. Move it to
   sideGamesStore.js in your repo and import from there; it's kept in
   one file here so the preview runs.
=================================================================== */

/* --- storage adapters: any object with get/set/remove works --- */

export const memoryAdapter = () => {
  const m = new Map();
  return {
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async set(k, v) { m.set(k, v); },
    async remove(k) { m.delete(k); },
  };
};

/* Browser / Next.js client */
export const localStorageAdapter = () => ({
  async get(k) { return window.localStorage.getItem(k); },
  async set(k, v) { window.localStorage.setItem(k, v); },
  async remove(k) { window.localStorage.removeItem(k); },
});

/* React Native / Expo — pass in @react-native-async-storage/async-storage */
export const asyncStorageAdapter = (AsyncStorage) => ({
  async get(k) { return AsyncStorage.getItem(k); },
  async set(k, v) { return AsyncStorage.setItem(k, v); },
  async remove(k) { return AsyncStorage.removeItem(k); },
});

/* Supabase / Firebase / your own API — give it two async functions */
export const remoteAdapter = ({ load, save, clear }) => ({
  async get(k) { const v = await load(k); return typeof v === "string" ? v : v ? JSON.stringify(v) : null; },
  async set(k, v) { return save(k, v); },
  async remove(k) { return clear ? clear(k) : save(k, null); },
});

/* Preview-only: Claude's artifact storage, else in-memory */
const defaultAdapter = () => {
  if (typeof window !== "undefined" && window.storage) {
    return {
      async get(k) { try { const r = await window.storage.get(k); return r ? r.value : null; } catch { return null; } },
      async set(k, v) { await window.storage.set(k, v); },
      async remove(k) { try { await window.storage.delete(k); } catch { /* noop */ } },
    };
  }
  return memoryAdapter();
};

/* --- catalog --------------------------------------------------- */

export const DEFAULT_GAMES = [
  { id: "ctp", name: "Closest to the Pin", rule: "Par 3s only. Winner takes the pot.", pars: [3] },
  { id: "long", name: "Long Drive", rule: "Longest drive in the fairway.", pars: [4, 5] },
  { id: "greenie", name: "Greenies", rule: "Closest to the pin on a par 3, only if you make par or better.", pars: [3] },
  { id: "sandy", name: "Sandies", rule: "Save par after hitting a bunker.", pars: [3, 4, 5] },
  { id: "barkie", name: "Barkies", rule: "Make par after hitting a tree.", pars: [3, 4, 5] },
  { id: "arnie", name: "Arnies", rule: "Par without ever being on the fairway (named after Arnold Palmer).", pars: [3, 4, 5] },
  { id: "polie", name: "Polies", rule: "Make par after hitting the flagstick.", pars: [3, 4, 5] },
];

export const DEFAULT_PARS = [4, 5, 3, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4];

const DEFAULT_PLAYERS = [
  { id: "p1", name: "Marcus", venmo: "@marcus-tran" },
  { id: "p2", name: "Dave", venmo: "@dave-okafor" },
  { id: "p3", name: "Tim", venmo: "@tim-hollis" },
  { id: "p4", name: "Ray", venmo: "@ray-castillo" },
];

export const SCHEMA_VERSION = 1;
export const storageKey = (roundId) => `sidegames:v${SCHEMA_VERSION}:${roundId}`;

/* Migrate old payloads here as the shape changes */
function hydrate(raw) {
  if (!raw) return null;
  const d = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!d || typeof d !== "object") return null;
  return {
    pars: Array.isArray(d.pars) && d.pars.length === 18 ? d.pars : DEFAULT_PARS,
    records: Array.isArray(d.records) ? d.records : [],
    customGames: Array.isArray(d.customGames) ? d.customGames : [],
  };
}

/* --- the store hook -------------------------------------------- */

export function useSideGames({
  roundId = "demo-round",
  players = DEFAULT_PLAYERS,
  storage,
  debounceMs = 500,
} = {}) {
  const adapter = useMemo(() => storage || defaultAdapter(), [storage]);
  const key = storageKey(roundId);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [pars, setPars] = useState(DEFAULT_PARS);
  const [records, setRecords] = useState([]);
  const [customGames, setCustomGames] = useState([]);

  const timer = useRef(null);
  const latest = useRef(null);
  const loaded = useRef(false);

  /* load once per round */
  useEffect(() => {
    let alive = true;
    loaded.current = false;
    setReady(false);
    (async () => {
      try {
        const data = hydrate(await adapter.get(key));
        if (alive && data) {
          setPars(data.pars);
          setRecords(data.records);
          setCustomGames(data.customGames);
        }
      } catch (e) {
        console.warn("[sidegames] load failed", e);
        if (alive) setStatus("error");
      } finally {
        if (alive) { loaded.current = true; setReady(true); }
      }
    })();
    return () => { alive = false; };
  }, [key, adapter]);

  /* debounced write on any change */
  useEffect(() => {
    if (!loaded.current) return;
    const payload = JSON.stringify({
      version: SCHEMA_VERSION,
      roundId,
      updatedAt: new Date().toISOString(),
      pars,
      records,
      customGames,
    });
    latest.current = payload;
    setStatus("saving");
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await adapter.set(key, payload);
        setStatus("saved");
      } catch (e) {
        console.warn("[sidegames] save failed", e);
        setStatus("error");
      }
    }, debounceMs);
    return () => clearTimeout(timer.current);
  }, [pars, records, customGames, key, adapter, roundId, debounceMs]);

  /* flush anything pending when the screen closes */
  useEffect(() => () => {
    clearTimeout(timer.current);
    if (latest.current) adapter.set(key, latest.current).catch(() => {});
  }, [key, adapter]);

  const games = useMemo(() => [...DEFAULT_GAMES, ...customGames], [customGames]);

  /* --- actions --- */
  const setPar = useCallback((hole, par) => {
    setPars((p) => p.map((v, i) => (i === hole - 1 ? par : v)));
  }, []);

  const carryFor = useCallback((gameId, beforeHole) =>
    records.filter((r) => r.gameId === gameId && r.winnerId === "push" && !r.resolved && r.hole < beforeHole),
    [records]);

  const saveHole = useCallback((hole, rows) => {
    setRecords((prev) => {
      const resolved = new Set();
      const added = [];
      Object.entries(rows).forEach(([gameId, row]) => {
        if (!row || !row.checked) return;
        if (row.winnerId && row.winnerId !== "push") {
          prev.forEach((r) => {
            if (r.gameId === gameId && r.winnerId === "push" && !r.resolved && r.hole < hole) resolved.add(r.id);
          });
        }
        added.push({
          id: `${hole}-${gameId}`,
          hole,
          gameId,
          gameName: row.gameName,
          prize: row.prize,
          mode: row.mode || "each",
          winnerId: row.winnerId,
          venmo: row.venmo,
          note: row.note,
          settled: !!row.settled,
        });
      });
      return prev
        .filter((r) => r.hole !== hole)
        .map((r) => (resolved.has(r.id) ? { ...r, resolved: true } : r))
        .concat(added);
    });
  }, []);

  const removeRecord = useCallback((id) => setRecords((rs) => rs.filter((r) => r.id !== id)), []);
  const toggleSettled = useCallback((id) =>
    setRecords((rs) => rs.map((r) => (r.id === id ? { ...r, settled: !r.settled } : r))), []);

  const addCustomGame = useCallback((name) => {
    const clean = name.trim();
    if (!clean) return null;
    const id = "custom-" + clean.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let created = null;
    setCustomGames((g) => {
      if (g.some((x) => x.id === id)) return g;
      created = { id, name: clean, rule: "Your own game.", pars: [3, 4, 5], custom: true };
      return [...g, created];
    });
    return id;
  }, []);

  const resetRound = useCallback(async () => {
    setRecords([]); setCustomGames([]); setPars(DEFAULT_PARS);
    try { await adapter.remove(key); } catch { /* noop */ }
  }, [adapter, key]);

  /* --- settlement --- */
  const ledger = useMemo(() => {
    const rows = [];
    records.forEach((r) => {
      const amt = parseFloat(r.prize) || 0;
      if (!r.winnerId || r.winnerId === "push" || amt <= 0) return;
      const losers = players.filter((p) => p.id !== r.winnerId);
      if (!losers.length) return;
      const each = r.mode === "pot" ? amt / losers.length : amt;
      losers.forEach((l) => rows.push({
        recordId: r.id, from: l.id, to: r.winnerId, amount: each,
        label: `${r.gameName} · hole ${r.hole}`, settled: !!r.settled, venmo: r.venmo,
      }));
    });
    return rows;
  }, [records, players]);

  const byWinner = useMemo(() => {
    const map = {};
    ledger.forEach((row) => {
      if (!map[row.to]) map[row.to] = { total: 0, venmo: row.venmo, from: {}, lines: [] };
      map[row.to].total += row.amount;
      map[row.to].from[row.from] = (map[row.to].from[row.from] || 0) + row.amount;
      if (row.venmo) map[row.to].venmo = row.venmo;
      if (!map[row.to].lines.includes(row.label)) map[row.to].lines.push(row.label);
    });
    return map;
  }, [ledger]);

  const net = useMemo(() => {
    const n = {};
    players.forEach((p) => (n[p.id] = 0));
    ledger.forEach((row) => { n[row.to] += row.amount; n[row.from] -= row.amount; });
    return n;
  }, [ledger, players]);

  const totals = useMemo(() => ({
    riding: ledger.reduce((s, r) => s + r.amount, 0),
    open: ledger.filter((r) => !r.settled).reduce((s, r) => s + r.amount, 0),
  }), [ledger]);

  return {
    ready, status, players, games, pars, records,
    setPar, saveHole, removeRecord, toggleSettled, addCustomGame, resetRound, carryFor,
    ledger, byWinner, net, totals,
  };
}

/* ===================================================================
   PART 2 — UI
=================================================================== */

const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "");
const initials = (name) => name.slice(0, 1).toUpperCase();

export default function SideGames({ roundId = "demo-round", players = DEFAULT_PLAYERS, storage, initialHole = 3 }) {
  const store = useSideGames({ roundId, players, storage });
  const {
    ready, status, games, pars, records, setPar, saveHole, removeRecord,
    toggleSettled, addCustomGame, resetRound, carryFor, byWinner, net, totals,
  } = store;

  const [hole, setHole] = useState(initialHole);
  const [view, setView] = useState("hole");
  const [draft, setDraft] = useState({});
  const [newGame, setNewGame] = useState("");
  const [copied, setCopied] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  const par = pars[hole - 1];
  const holeRecords = records.filter((r) => r.hole === hole);

  useEffect(() => {
    const d = {};
    games.forEach((g) => {
      const existing = holeRecords.find((r) => r.gameId === g.id);
      const carry = carryFor(g.id, hole).reduce((s, r) => s + (parseFloat(r.prize) || 0), 0);
      d[g.id] = existing
        ? { ...existing, gameName: g.name, checked: true }
        : { checked: false, gameName: g.name, prize: carry > 0 ? String(carry) : "", mode: "each", winnerId: "", venmo: "", note: "" };
    });
    setDraft(d);
    // Deliberately only re-initializes on an actual hole change, not
    // on every games/customGames update - handleAddCustom already
    // updates draft directly for a newly-added game, and re-running
    // this on that same change would immediately clobber that,
    // resetting the new game back to unchecked. A later hole change
    // still correctly picks up any custom game added in the meantime,
    // since the effect reads the latest `games` value when it runs
    // regardless of what's listed as a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hole]);

  function setField(gameId, k, v) {
    setDraft((d) => {
      const row = { ...d[gameId], [k]: v };
      if (k === "winnerId" && v && v !== "push" && !row.venmoTouched) {
        const p = players.find((x) => x.id === v);
        if (p) row.venmo = p.venmo;
      }
      if (k === "venmo") row.venmoTouched = true;
      return { ...d, [gameId]: row };
    });
  }

  function handleAddCustom() {
    const id = addCustomGame(newGame);
    if (id) {
      setDraft((d) => ({ ...d, [id]: { checked: true, gameName: newGame.trim(), prize: "", mode: "each", winnerId: "", venmo: "", note: "" } }));
      setNewGame("");
    }
  }

  function copySummary() {
    const lines = ["Side games — settle up", ""];
    Object.entries(byWinner).forEach(([wid, w]) => {
      const winner = players.find((p) => p.id === wid);
      lines.push(`${winner.name} wins ${money(w.total)}  ${w.venmo || ""}`.trim());
      Object.entries(w.from).forEach(([fid, amt]) =>
        lines.push(`  ${players.find((p) => p.id === fid).name} → ${money(amt)}`));
      lines.push("");
    });
    try { navigator.clipboard.writeText(lines.join("\n")); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!ready) {
    return (
      <div className="sg"><style>{CSS}</style>
        <div className="loading">Loading your round…</div>
      </div>
    );
  }

  return (
    <div className="sg">
      <style>{CSS}</style>

      <button className="rulesLink" onClick={() => setRulesOpen(true)}>{"\u{1F4D6}"} Side Game Rules</button>

      <div className="tabs">
        <button className={view === "hole" ? "tab on" : "tab"} onClick={() => setView("hole")}>By hole</button>
        <button className={view === "settle" ? "tab on" : "tab"} onClick={() => setView("settle")}>
          Settle up{totals.open > 0 && <span className="dot" />}
        </button>
      </div>

      {rulesOpen && (
        <div className="rulesScrim" onClick={() => setRulesOpen(false)}>
          <div className="rulesCard" onClick={(e) => e.stopPropagation()}>
            <div className="rulesHead">
              <span className="rulesTitle">Side Games</span>
              <button className="rulesClose" onClick={() => setRulesOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="rulesBody">
              {DEFAULT_GAMES.map((g) => (
                <div key={g.id} className="ruleItem">
                  <div className="ruleName">{g.name}</div>
                  <div className="ruleText">{"\u2022"} {g.rule}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === "hole" && (
        <>
          <div className="holebar">
            <button className="arrow" onClick={() => setHole((h) => Math.max(1, h - 1))} disabled={hole === 1} aria-label="Previous hole">‹</button>
            <div className="holeinfo">
              <div className="holenum">Hole {hole}</div>
              <button className="par" onClick={() => setPar(hole, par === 5 ? 3 : par + 1)} title="Tap to change par">Par {par}</button>
            </div>
            <button className="arrow" onClick={() => setHole((h) => Math.min(18, h + 1))} disabled={hole === 18} aria-label="Next hole">›</button>
          </div>

          <div className="strip">
            {pars.map((_, i) => {
              const n = i + 1;
              const has = records.some((r) => r.hole === n);
              return (
                <button key={n} className={`pip${n === hole ? " cur" : ""}${has ? " has" : ""}`} onClick={() => setHole(n)}>{n}</button>
              );
            })}
          </div>

          <div className="stack">
            {games.map((g) => {
              const row = draft[g.id] || {};
              const eligible = g.pars.includes(par);
              const carried = carryFor(g.id, hole);
              const carry = carried.reduce((s, r) => s + (parseFloat(r.prize) || 0), 0);
              const existing = holeRecords.find((r) => r.gameId === g.id);
              return (
                <div className={`gwrap${row.checked ? " open" : ""}`} key={g.id}>
                  <button className="grow" onClick={() => eligible && setField(g.id, "checked", !row.checked)} disabled={!eligible}>
                    <span className={row.checked ? "box on" : "box"}>{row.checked ? "✓" : ""}</span>
                    <span className="gtext">
                      <span className="gname">{g.name}</span>
                      <span className="grule">{eligible ? g.rule : `Not played on a par ${par}.`}</span>
                    </span>
                  </button>

                  {row.checked && (
                    <div className="fields">
                      {carry > 0 && (
                        <div className="carry">
                          {money(carry)} riding from hole{carried.length > 1 ? "s" : ""} {carried.map((r) => r.hole).join(", ")}
                        </div>
                      )}

                      <label className="lab">Prize</label>
                      <div className="prizeRow">
                        <div className="dollar">
                          <span>$</span>
                          <input inputMode="decimal" placeholder="0" value={row.prize} onChange={(e) => setField(g.id, "prize", e.target.value)} />
                        </div>
                        <div className="seg">
                          <button className={row.mode !== "pot" ? "segb on" : "segb"} onClick={() => setField(g.id, "mode", "each")}>Each pays</button>
                          <button className={row.mode === "pot" ? "segb on" : "segb"} onClick={() => setField(g.id, "mode", "pot")}>Total pot</button>
                        </div>
                      </div>

                      <label className="lab">Winner</label>
                      <div className="pills">
                        {players.map((p) => (
                          <button key={p.id} className={row.winnerId === p.id ? "pill on" : "pill"} onClick={() => setField(g.id, "winnerId", p.id)}>{p.name}</button>
                        ))}
                        <button className={row.winnerId === "push" ? "pill push on" : "pill push"} onClick={() => setField(g.id, "winnerId", "push")}>
                          No winner — carry over
                        </button>
                      </div>

                      {row.winnerId && row.winnerId !== "push" && (
                        <>
                          <label className="lab">Settle at</label>
                          <input className="text" placeholder="@venmo-handle" value={row.venmo || ""} onChange={(e) => setField(g.id, "venmo", e.target.value)} />
                        </>
                      )}

                      <label className="lab">Note</label>
                      <input className="text" placeholder="Six feet, back pin" value={row.note || ""} onChange={(e) => setField(g.id, "note", e.target.value)} />

                      {existing && (
                        <div className="recActions">
                          <button className={existing.settled ? "chip on" : "chip"} onClick={() => toggleSettled(existing.id)}>
                            {existing.settled ? "Paid" : "Mark paid"}
                          </button>
                          <button className="chip danger" onClick={() => removeRecord(existing.id)}>Remove</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="addGame">
              <input className="text" placeholder="Add your own game" value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustom()} />
              <button className="addBtn" onClick={handleAddCustom}>Add</button>
            </div>
          </div>

          <button className="primary wide" style={{ background: "#A42E2D" }} onClick={() => saveHole(hole, draft)}>
            Save side games
          </button>
        </>
      )}

      {view === "settle" && (
        <div className="settle">
          <div className="totals">
            <div><div className="tLab">Riding today</div><div className="tVal">{money(totals.riding)}</div></div>
            <div><div className="tLab">Still open</div><div className="tVal open">{money(totals.open)}</div></div>
          </div>

          <div className="netlist">
            {players.map((p) => (
              <div className="netrow" key={p.id}>
                <span className="av">{initials(p.name)}</span>
                <span className="netname">{p.name}</span>
                <span className={net[p.id] >= 0 ? "netamt up" : "netamt down"}>
                  {net[p.id] > 0 ? "+" : ""}{money(Math.abs(net[p.id]))}
                </span>
              </div>
            ))}
          </div>

          {Object.keys(byWinner).length === 0 ? (
            <div className="empty"><p>Nothing to settle yet. Win a hole first.</p></div>
          ) : (
            <>
              {Object.entries(byWinner).map(([wid, w]) => {
                const winner = players.find((p) => p.id === wid);
                return (
                  <div className="rec" key={wid}>
                    <div className="recTop">
                      <span className="recName">{winner.name}</span>
                      <span className="recPrize">{money(w.total)}</span>
                    </div>
                    {w.venmo && <div className="venmoBig">Settle at {w.venmo}</div>}
                    <div className="owes">
                      {Object.entries(w.from).map(([fid, amt]) => (
                        <div className="oweRow" key={fid}>
                          <span>{players.find((p) => p.id === fid).name}</span>
                          <span className="oweAmt">{money(amt)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="note">{w.lines.join(" · ")}</div>
                  </div>
                );
              })}
              <button className="primary wide" onClick={copySummary}>
                {copied ? "Copied to clipboard" : "Copy settle-up summary"}
              </button>
            </>
          )}

          <div className="footRow">
            <span className={`save ${status}`}>
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved to this round" : status === "error" ? "Couldn't save — changes are in this session only" : ""}
            </span>
            <button className="chip danger" onClick={resetRound}>Clear round</button>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
.sg{--cream:#F2EFE5;--card:#fff;--green:#1C3D2B;--green6:#2F6B47;--ink:#3A403C;--mute:#767C75;--rule:#E6E1D2;--brass:#9A6F24;--red:#95392C;
  background:var(--cream);min-height:100vh;padding:16px 14px 40px;box-sizing:border-box;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.sg *{box-sizing:border-box}
.sg button{font:inherit;cursor:pointer;border:none;background:none;color:inherit}
.sg button:focus-visible,.sg input:focus-visible{outline:2px solid var(--green6);outline-offset:2px}
.sg input{font:inherit;color:var(--ink)}
.loading{padding:60px 0;text-align:center;color:var(--mute);font-size:15px}

.tabs{display:flex;gap:6px;background:#E7E3D4;padding:4px;border-radius:12px;margin-bottom:16px}
.tab{flex:1;padding:9px;border-radius:9px;font-size:14px;font-weight:600;color:var(--mute)}
.tab.on{background:var(--card);color:var(--green);box-shadow:0 1px 2px rgba(28,61,43,.08)}
.dot{width:6px;height:6px;border-radius:50%;background:var(--brass);display:inline-block;margin-left:6px;vertical-align:middle}

.holebar{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.arrow{width:40px;height:40px;border-radius:50%;background:var(--card);color:var(--green);font-size:24px;line-height:1;box-shadow:0 1px 2px rgba(28,61,43,.08)}
.arrow:disabled{opacity:.35}
.holeinfo{text-align:center}
.holenum{font-size:26px;font-weight:700;color:var(--green);letter-spacing:-.02em}
.par{font-size:13px;color:var(--mute);padding:2px 8px;border-radius:20px;border:1px solid var(--rule);margin-top:4px}

.strip{display:flex;gap:5px;overflow-x:auto;padding:2px 0 14px;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}
.pip{flex:0 0 auto;min-width:30px;height:30px;border-radius:8px;font-size:12.5px;font-weight:600;color:var(--mute);background:var(--card)}
.pip.has{color:var(--green);box-shadow:inset 0 -2px 0 var(--brass)}
.pip.cur{background:var(--green);color:#fff}

.empty{background:var(--card);border-radius:18px;padding:34px 22px;text-align:center;box-shadow:0 1px 2px rgba(28,61,43,.06)}
.empty p{margin:0 0 18px;color:var(--mute);font-size:15px}

.primary{background:var(--green6);color:#fff;padding:14px 22px;border-radius:13px;font-size:15.5px;font-weight:600}
.primary.wide{display:block;width:100%;margin-top:14px}

.stack{display:flex;flex-direction:column;gap:12px}
.rec{background:var(--card);border-radius:16px;padding:16px;box-shadow:0 1px 2px rgba(28,61,43,.06)}
.recTop{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.recName{font-size:17px;font-weight:700;color:var(--green)}
.recPrize{font-size:17px;font-weight:700;color:var(--brass);font-variant-numeric:tabular-nums}
.recRow{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
.av{width:26px;height:26px;border-radius:50%;background:#E3EAE2;color:var(--green);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.win{font-size:14.5px;font-weight:600}
.venmo{font-size:13px;color:var(--mute)}
.push{font-size:14px;color:var(--brass);font-weight:600}
.pending{font-size:14px;color:var(--mute)}
.note{margin-top:10px;font-size:13px;color:var(--mute);line-height:1.5}
.recActions{display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--rule)}
.chip{font-size:13px;font-weight:600;color:var(--mute);padding:6px 12px;border-radius:20px;border:1px solid var(--rule)}
.chip.on{background:#E3EAE2;color:var(--green6);border-color:#CBDAC9}
.chip.danger{color:var(--red)}

.totals{display:flex;gap:12px;margin-bottom:14px}
.totals>div{flex:1;background:var(--card);border-radius:16px;padding:14px 16px;box-shadow:0 1px 2px rgba(28,61,43,.06)}
.tLab{font-size:12.5px;color:var(--mute)}
.tVal{font-size:22px;font-weight:700;color:var(--green);margin-top:3px;font-variant-numeric:tabular-nums}
.tVal.open{color:var(--brass)}
.netlist{background:var(--card);border-radius:16px;padding:6px 16px;margin-bottom:14px;box-shadow:0 1px 2px rgba(28,61,43,.06)}
.netrow{display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--rule)}
.netrow:last-child{border-bottom:none}
.netname{flex:1;font-size:15px;font-weight:600}
.netamt{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums}
.netamt.up{color:var(--green6)}
.netamt.down{color:var(--red)}
.settle .rec{margin-bottom:12px}
.venmoBig{font-size:13.5px;color:var(--mute);margin-top:6px}
.owes{margin-top:12px;padding-top:10px;border-top:1px solid var(--rule)}
.oweRow{display:flex;justify-content:space-between;font-size:14px;padding:5px 0}
.oweAmt{font-variant-numeric:tabular-nums;font-weight:600}
.footRow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:20px}
.save{font-size:12.5px;color:var(--mute)}
.save.error{color:var(--red)}

.gwrap{background:var(--card);border-radius:14px;margin-bottom:9px;overflow:hidden}
.gwrap.open{box-shadow:0 0 0 1.5px var(--green6)}
.grow{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;padding:14px}
.grow:disabled{opacity:.45;cursor:default}
.box{width:21px;height:21px;border-radius:6px;border:1.5px solid #C9C4B2;flex:0 0 auto;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff}
.box.on{background:var(--green6);border-color:var(--green6)}
.gtext{display:flex;flex-direction:column;gap:2px}
.gname{font-size:15.5px;font-weight:700;color:var(--green)}
.grule{font-size:12.5px;color:var(--mute);line-height:1.45}

.fields{padding:2px 14px 16px}
.carry{background:#FAF3E2;color:var(--brass);font-size:13px;font-weight:600;padding:8px 11px;border-radius:9px;margin-bottom:12px}
.lab{display:block;font-size:12.5px;color:var(--mute);margin:12px 0 6px}
.prizeRow{display:flex;gap:8px;flex-wrap:wrap}
.dollar{display:flex;align-items:center;gap:3px;border:1px solid var(--rule);border-radius:10px;padding:0 12px;background:#FBFAF6;flex:0 0 104px}
.dollar span{color:var(--mute);font-size:15px}
.dollar input{border:none;background:none;width:100%;padding:11px 0;font-size:16px;font-weight:600;outline:none}
.seg{display:flex;border:1px solid var(--rule);border-radius:10px;overflow:hidden;flex:1;min-width:170px}
.segb{flex:1;padding:11px 8px;font-size:13px;font-weight:600;color:var(--mute);background:#FBFAF6}
.segb.on{background:#E3EAE2;color:var(--green6)}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:9px 14px;border-radius:20px;border:1px solid var(--rule);font-size:13.5px;font-weight:600;color:var(--ink);background:#FBFAF6}
.pill.on{background:var(--green6);border-color:var(--green6);color:#fff}
.pill.push{color:var(--mute)}
.pill.push.on{background:var(--brass);border-color:var(--brass);color:#fff}
.text{width:100%;border:1px solid var(--rule);border-radius:10px;padding:11px 12px;font-size:15px;background:#FBFAF6;outline:none}
.addGame{display:flex;gap:8px;margin:14px 0 4px}
.addBtn{padding:0 18px;border-radius:10px;background:#E3EAE2;color:var(--green6);font-size:14px;font-weight:600}

.rulesLink{display:block;font-size:13px;font-weight:600;color:var(--green6);margin-bottom:12px;text-decoration:underline}
.rulesScrim{position:fixed;inset:0;background:rgba(24,32,26,.42);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px}
.rulesCard{background:var(--cream);width:100%;max-width:420px;max-height:80vh;border-radius:18px;display:flex;flex-direction:column;overflow:hidden}
.rulesHead{display:flex;justify-content:space-between;align-items:center;padding:16px 18px 10px}
.rulesTitle{font-size:18px;font-weight:700;color:var(--green)}
.rulesClose{font-size:15px;color:var(--mute);padding:4px 6px}
.rulesBody{overflow-y:auto;padding:0 18px 18px}
.ruleItem{padding:10px 0;border-bottom:1px solid var(--rule)}
.ruleItem:last-child{border-bottom:none}
.ruleName{font-size:14.5px;font-weight:700;color:var(--green);margin-bottom:2px}
.ruleText{font-size:13px;color:var(--mute);line-height:1.5}
`;
