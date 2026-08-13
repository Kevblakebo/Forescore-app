import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ---------- design tokens ----------
   Palette: fairway (#1B4332) deep green, paper (#F3EFE0) cream, ink (#2B2B28),
   flag (#C1440E) red accent for leaders/alerts, gold (#B08D57) for wins/prizes,
   sage (#8FA998) secondary. Display face: Georgia slab-serif (engraved-scorecard
   feel). Data face: ui-monospace (ledger digits).
------------------------------------- */

const LOGO_DATA_URI = "data:image/png;base64,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";

const STYLE = `
  .gsc { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#F3EFE0; color:#2B2B28; min-height:100vh; -webkit-tap-highlight-color: transparent; }
  .gsc * { box-sizing: border-box; }
  .gsc-display { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; }
  .gsc-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .gsc-header { background:#1B4332; color:#F3EFE0; padding:calc(16px + env(safe-area-inset-top)) 18px 16px; position:sticky; top:0; z-index:10; }
  .gsc-header-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .gsc-title { font-size:19px; font-weight:700; letter-spacing:0.3px; line-height:1.2; }
  .gsc-sub { font-size:11px; opacity:0.75; margin-top:2px; letter-spacing:0.5px; text-transform:uppercase; }
  .gsc-btn { border:none; border-radius:8px; padding:9px 14px; font-size:14px; font-weight:600; cursor:pointer; min-height:44px; touch-action:manipulation; }
  .gsc-btn-primary { background:#C1440E; color:#F3EFE0; }
  .gsc-btn-ghost { background:rgba(243,239,224,0.12); color:#F3EFE0; }
  .gsc-btn-outline { background:transparent; border:1.5px solid #1B4332; color:#1B4332; }
  .gsc-btn-gold { background:#B08D57; color:#F3EFE0; }
  .gsc-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .gsc-body { padding:16px; max-width:720px; margin:0 auto; padding-bottom:calc(60px + env(safe-area-inset-bottom)); }
  .gsc-card { background:#fff; border-radius:14px; padding:16px; margin-bottom:14px; box-shadow:0 1px 3px rgba(27,67,50,0.12); border:1px solid rgba(27,67,50,0.08); }
  .gsc-game-card { border:2px solid transparent; cursor:pointer; transition:border-color .15s; }
  .gsc-game-card:hover { border-color:#B08D57; }
  .gsc-game-title { font-size:20px; font-weight:700; color:#1B4332; }
  .gsc-tag { display:inline-block; background:#8FA998; color:#fff; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; padding:3px 8px; border-radius:20px; margin-top:6px; }
  .gsc-field { margin-bottom:12px; }
  .gsc-label { display:block; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:#6b6b63; margin-bottom:5px; }
  .gsc-input { width:100%; padding:9px 10px; border:1.5px solid #d8d2bd; border-radius:8px; font-size:15px; background:#FDFCF7; }
  .gsc-input[type="date"] { -webkit-appearance:none; appearance:none; min-width:0; }
  .gsc-row { display:flex; gap:10px; }
  .gsc-row > * { flex:1; }
  .gsc-hole-strip { display:flex; overflow-x:auto; gap:4px; padding:10px 16px; background:#16382C; -webkit-overflow-scrolling:touch; }
  .gsc-hole-pip { flex:0 0 auto; width:38px; min-height:38px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; color:#F3EFE0; opacity:0.55; padding:4px 0; border-radius:8px; cursor:pointer; font-family: ui-monospace, monospace; touch-action:manipulation; }
  .gsc-hole-pip.active { opacity:1; background:#C1440E; font-weight:700; }
  .gsc-hole-pip.done { opacity:0.9; border-bottom:2px solid #B08D57; }
  .gsc-hole-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .gsc-hole-big { font-size:38px; font-weight:800; font-family:Georgia,serif; color:#1B4332; line-height:1; }
  .gsc-par-badge { font-size:13px; color:#6b6b63; font-weight:600; }
  .gsc-stepper { display:flex; align-items:center; gap:10px; }
  .gsc-stepper button { width:44px; height:44px; border-radius:50%; border:1.5px solid #1B4332; background:#fff; font-size:18px; font-weight:700; color:#1B4332; cursor:pointer; touch-action:manipulation; }
  .gsc-stepper button:disabled { opacity:0.3; }
  .gsc-stepper-val { font-size:20px; font-weight:700; width:28px; text-align:center; font-family: ui-monospace, monospace; }
  .gsc-player-row { border-radius:10px; padding:12px; margin-bottom:10px; }
  .gsc-player-name { font-weight:700; font-size:15px; }
  .gsc-hcp { font-size:11px; color:#6b6b63; margin-left:6px; }
  .gsc-mull { display:flex; align-items:center; gap:6px; font-size:12px; margin-top:8px; }
  .gsc-chip { display:inline-block; font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px; margin-right:6px; margin-top:4px; }
  .gsc-lead { background:#B08D57; color:#fff; }
  .gsc-loss { background:#c7c2a8; color:#5b5b52; }
  .gsc-teamA { border-left:5px solid #1B4332; background:#F0EEE3; }
  .gsc-teamB { border-left:5px solid #C1440E; background:#FBEDE5; }
  .gsc-teamC { border-left:5px solid #B08D57; background:#F8F1E4; }
  .gsc-teamD { border-left:5px solid #4A6C5A; background:#EBF0EC; }
  table.gsc-grid { width:100%; border-collapse:collapse; font-size:11px; font-family: ui-monospace, monospace; }
  table.gsc-grid th, table.gsc-grid td { border:1px solid #e5e0cd; padding:4px 3px; text-align:center; }
  table.gsc-grid th { background:#1B4332; color:#F3EFE0; position:sticky; top:0; }
  .gsc-link { color:#1B4332; text-decoration:underline; font-weight:600; cursor:pointer; background:none; border:none; padding:0; font-size:inherit; }
  .gsc-empty { text-align:center; padding:40px 16px; color:#6b6b63; }
  .gsc-code { font-family: ui-monospace, monospace; font-weight:800; letter-spacing:2px; background:rgba(243,239,224,0.15); padding:4px 10px; border-radius:6px; }
  .gsc-modal-backdrop { position:fixed; inset:0; background:rgba(27,31,26,0.55); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
  .gsc-modal { background:#FDFCF7; border-radius:16px; padding:22px 20px; max-width:340px; width:100%; box-shadow:0 8px 30px rgba(0,0,0,0.25); }
  .gsc-modal-title { font-family: Georgia, serif; font-size:19px; font-weight:700; color:#1B4332; margin-bottom:8px; }
  .gsc-modal-body { font-size:14px; color:#4b4b45; line-height:1.5; margin-bottom:18px; }
  .gsc-modal-row { display:flex; gap:10px; }
  .gsc-modal-row > * { flex:1; }
`;

const GAMES = {
  seabluffe: {
    name: "Seabluffe Swap",
    tag: "Rotating teams - 4 players",
    desc: "Two 2-person teams that swap partners every 6 holes. Points for low combined score AND low combined putts each hole. Great for mixed handicaps.",
    rotates: true,
    hasScore: true,
    hasPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Rotating team overall and putting game.",
      {
        text: "Two 2-person rotating teams. Partners change every 6 holes:",
        sub: ["Holes 1-6: A+B vs C+D", "Holes 7-12: A+C vs B+D", "Holes 13-18: A+D vs B+C"],
      },
      {
        text: "0, 1, or 2 points possible per hole per team:",
        sub: ["1 pt per team for lowest combined putts", "1 pt per team for lowest combined strokes"],
      },
      "Top 2 highest total-point players win.",
      "Bottom 2 lowest total-point players lose.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for mixed handicap groups.",
    ],
  },
  ponto: {
    name: "Cardiff Combine",
    tag: "Fixed teams - 4 players",
    desc: "Two 2-person teams, same partners all 18 holes. Points for low combined score AND low combined putts each hole. Great for similar handicaps.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Two 2-person team strokes and putting competition (same game as Seabluffe Swap, except no team rotation).",
      {
        text: "0, 1, or 2 points possible per hole per team:",
        sub: ["1 pt per team for lowest combined putts", "1 pt per team for lowest combined strokes"],
      },
      "Highest total-point team wins.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for similar handicap groups.",
    ],
  },
  beachside: {
    name: "Beachside Best-Ball",
    tag: "Best-ball teams - 4 players",
    desc: "Two 2-person teams, best-ball scoring - the lower of the team's two strokes AND the lower of the team's two putts count each hole. Same structure as Cardiff Combine, but best-ball instead of combined. Great for similar handicap pairs.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    bestBall: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      {
        text: "Two 2-person team Best-Ball Strokes and Best-Ball Putts Skins competition (same as Cardiff Combine, except using best-ball scores from the 2-person team):",
        sub: [
          "Each player plays their own ball and records their own strokes and putts.",
          "The lower of the team's two strokes scores counts toward the game.",
          "The lower of the team's two putts scores counts toward the game.",
        ],
      },
      {
        text: "0, 1, or 2 points possible per hole per team:",
        sub: ["1 pt per team for best-ball putts", "1 pt per team for best-ball strokes"],
      },
      "Top total-point team wins.",
      "Bottom total-point team loses.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for mixed handicap teams.",
    ],
  },
  tourneybb: {
    name: "Beachside Best-Ball Tournament",
    tag: "4-person best-ball - Tournaments only",
    desc: "The whole foursome plays as one best-ball team - no 2-person sub-teams. The lowest strokes and lowest putts among all 4 players count each hole. Used only in Tournaments, where foursomes are ranked against each other by total best-ball strokes and total best-ball putts.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    bestBall: true,
    singleTeam: true,
    tournamentOnly: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "4-person team best-ball strokes and best-ball putts competition - the whole foursome plays as one team, not split into 2-person sub-teams.",
      "Each player plays their own ball and records their own strokes and putts.",
      {
        text: "Each hole, the foursome's score is the single lowest score among all 4 players:",
        sub: ["Strokes: the lowest strokes among all 4 players on that hole.", "Putts: the lowest putts among all 4 players on that hole."],
      },
      "Used only in Tournaments - foursomes are ranked against every other foursome by total best-ball strokes and total best-ball putts, tracked and ranked separately (lowest wins each).",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for foursome-vs-foursome tournament play.",
    ],
  },
  tourneygg: {
    name: "Cardiff Combine Tournament",
    tag: "4-person combined - Tournaments only",
    desc: "The whole foursome plays as one team - no 2-person sub-teams. All 4 players' strokes are added together, and all 4 players' putts are added together, each hole. Used only in Tournaments, where foursomes are ranked against each other by total combined strokes and total combined putts.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    bestBall: false,
    singleTeam: true,
    tournamentOnly: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "4-person team combined strokes and combined putts competition - the whole foursome plays as one team, not split into 2-person sub-teams.",
      "Each player plays their own ball and records their own strokes and putts.",
      {
        text: "Each hole, the foursome's score is all 4 players' scores added together:",
        sub: ["Strokes: all 4 players' strokes for that hole, combined.", "Putts: all 4 players' putts for that hole, combined."],
      },
      "Used only in Tournaments - foursomes are ranked against every other foursome by total combined strokes and total combined putts, tracked and ranked separately (lowest wins each).",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for foursome-vs-foursome tournament play.",
    ],
  },
  swami: {
    name: "Swami's Standard",
    tag: "Individual stroke play - 4 players",
    desc: "A standard, no-frills 4-player stroke play game. Lowest total strokes wins; total putts breaks a tie. Great for players who just want to keep an honest scorecard.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    totalScoring: true,
    defaults: { maxOver: "", maxPutts: "", mulliganSegment: "", prize: "" },
    rules: [
      "4-player individual strokes and putting game.",
      "Total strokes and putts are kept track of.",
      "Lowest total strokes wins. Total putts settles tie breaker.",
      "Prize: to be agreed on prior to round",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in) (to be agreed on)",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "Handicaps not used in game scoring, but are visible.",
    ],
  },
  dstreet: {
    name: "D-Street Drop",
    tag: "Individual skins - 4 players",
    desc: "4-player individual strokes and putting skins game (same as Cardiff Combine, but no teams). Points for low strokes AND low putts each hole. Great for similar handicap foursomes.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "4-player individual strokes and putting skins game (same game as Cardiff Combine, except no teams).",
      {
        text: "0, 1, or 2 points possible per hole per player:",
        sub: [
          "1 pt per player for lowest putts - if tied, the lowest tied players each get 1 pt",
          "1 pt per player for lowest strokes - if tied, the lowest tied players each get 1 pt",
        ],
      },
      "Most total points wins.",
      "Prize: to be agreed on prior to round",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "No carry-overs on ties.",
      "Handicaps not used in game scoring.",
      "Great for similar handicap foursomes.",
    ],
  },
};

// Reference-only library of other popular golf games/formats - informational,
// not trackable in this app. Grouped the same way the user organized them.
const GAME_LIBRARY = [
  {
    category: "Team Games",
    games: [
      {
        name: "Best Ball (Fourball)",
        lines: [
          "Each player plays their own ball.",
          "The lowest score on the team counts.",
          "Perfect for 2 vs 2 or 4 vs 4, especially with similar handicaps.",
        ],
      },
      {
        name: "Scramble",
        lines: [
          "Everyone hits, choose the best shot, then everyone hits from there.",
          { text: "Great for:", sub: ["Corporate outings", "Couples", "Higher handicaps"] },
        ],
      },
      {
        name: "Shamble",
        lines: [
          "Drive like a scramble - after the best drive, everyone plays their own ball.",
          "More golf than a scramble, while still rewarding a good drive.",
        ],
      },
      {
        name: "Alternate Shot (Foursomes)",
        lines: ["One ball - partners take turns hitting.", "Very challenging and surprisingly fun."],
      },
      {
        name: "Pinehurst (Chapman)",
        lines: [
          "Both players drive, then each hits the other's drive.",
          "Choose the better second shot, then alternate from there.",
          "One of the fairest partner formats.",
        ],
      },
      {
        name: "Wolf",
        lines: [
          "One of the best 4-player games.",
          {
            text: "Each hole:",
            sub: [
              "One player is the Wolf.",
              "The Wolf decides whether to choose a partner after seeing the other drives, or go Lone Wolf for bigger stakes.",
            ],
          },
          "Lots of strategy.",
        ],
      },
      {
        name: "Vegas",
        lines: [
          "Partners combine scores into a two-digit number.",
          { text: "Example:", sub: ["4 and 5 = 45", "Opponents shoot 5 and 6 = 56", "Difference = 11 points"] },
          "Can get wild if someone makes an 8 or 9!",
        ],
      },
      {
        name: "Bingo Bango Bongo",
        lines: [
          {
            text: "Three points available each hole:",
            sub: [
              "Bingo - first on the green",
              "Bango - closest to the pin once everyone is on",
              "Bongo - first to hole out",
            ],
          },
          "Excellent because shorter hitters can still win plenty of points.",
        ],
      },
      {
        name: "1-2-3 Best Ball",
        lines: [
          {
            text: "On each hole:",
            sub: ["Hole 1: count one score", "Hole 2: count two scores", "Hole 3: count all three scores"],
          },
          "Then repeat. Great for foursomes.",
        ],
      },
    ],
  },
  {
    category: "Individual Games",
    games: [
      {
        name: "Nassau",
        lines: [
          "The classic betting game.",
          {
            text: "",
            sub: ["Front 9 = 1 bet", "Back 9 = 1 bet", "Overall 18 = 1 bet", "Optional presses during the round"],
          },
          "Best for 2-4 players.",
        ],
      },
      {
        name: "Skins",
        lines: [
          {
            text: "Each hole is worth one \u201cskin\u201d:",
            sub: ["Lowest unique score wins the skin", "Ties carry over to the next hole", "Biggest pots often build late in the round"],
          },
          "Fun twist: make par worth 1 skin, birdie worth 2 skins.",
        ],
      },
      {
        name: "Stableford",
        lines: [
          "Instead of counting strokes, earn points.",
          { text: "Example:", sub: ["Double bogey or worse = 0", "Bogey = 1", "Par = 2", "Birdie = 4", "Eagle = 6"] },
          "Great because one bad hole doesn't ruin your day.",
        ],
      },
      {
        name: "Quota (Point Quota)",
        lines: [
          "Everyone starts with a quota based on handicap.",
          { text: "Example:", sub: ["Bogey = 1 point", "Par = 2", "Birdie = 4", "Eagle = 8"] },
          "Lower handicap players have higher quotas to reach. Excellent for mixed abilities.",
        ],
      },
      {
        name: "Match Play",
        lines: ["Forget total score - each hole is worth one point.", "Win the most holes. Simple and exciting."],
      },
    ],
  },
  {
    category: "Side Games",
    games: [
      { name: "Closest to the Pin", lines: ["Par 3s only. Winner takes the pot."] },
      { name: "Long Drive", lines: ["Longest drive in the fairway."] },
      { name: "Greenies", lines: ["Closest to the pin on a par 3, only if you make par or better."] },
      { name: "Sandies", lines: ["Save par after hitting a bunker."] },
      { name: "Barkies", lines: ["Make par after hitting a tree."] },
      { name: "Arnies", lines: ["Par without ever being on the fairway (named after Arnold Palmer)."] },
      { name: "Polies", lines: ["Make par after hitting the flagstick."] },
    ],
  },
  {
    category: "Fun / Crazy Games",
    games: [
      { name: "Worst Ball", lines: ["Everyone hits two balls, then plays the worst one.", "Humbling!"] },
      { name: "Three-Club Challenge", lines: ["Only three clubs plus a putter.", "Makes you creative."] },
      {
        name: "Poker Golf",
        lines: [
          "Earn cards throughout the round.",
          { text: "Examples:", sub: ["Birdie = draw a card", "Closest to pin = draw a card", "Long drive = draw a card"] },
          "Best poker hand wins.",
        ],
      },
      {
        name: "Dice Golf",
        lines: [
          "Roll a die before each hole.",
          { text: "Examples:", sub: ["Must use driver on first shot", "Double points", "Only irons", "Partner chooses club"] },
        ],
      },
    ],
  },
];

const DEFAULT_PAR = [4, 4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5];
const SEABLUFFE_PAIRINGS = [
  [[0, 1], [2, 3]],
  [[0, 2], [1, 3]],
  [[0, 3], [1, 2]],
];
const LETTERS = ["A", "B", "C", "D"];
const TEAM_CLASS = ["gsc-teamA", "gsc-teamB", "gsc-teamC", "gsc-teamD"];

// Ponto's mulligan allowance resets every 9 holes (front/back nine).
// Seabluffe's stays tied to its 6-hole partner-rotation.
function mulliganWindow(game) {
  if (game === "swami") return 18; // one mulligan allowance for the whole round
  return game === "ponto" || game === "dstreet" || game === "beachside" || game === "tourneybb" || game === "tourneygg" ? 9 : 6;
}
const ACTIVE_KEY = "gsc-active-round";
const LAST_TOURNAMENT_KEY = "gsc-last-tournament";
const FINISHED_INDEX_KEY = "gsc-finished-index";
const FINISHED_PREFIX = "gsc-finished-round:";
const TOURNAMENT_PREFIX = "gsc-tournament:";
// Tournaments only ever use the dedicated tournament game - a true 4-person
// best-ball format with no 2-person sub-teams. None of the other games are
// offered in Tournament creation.
const TOURNAMENT_GAME_KEYS = Object.keys(GAMES).filter((k) => GAMES[k].tournamentOnly);

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function encodeRoundData(round) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(round))));
}
function decodeRoundData(str) {
  return JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
}

function emptyScores() {
  const s = {};
  for (let h = 0; h < 18; h++) s[h] = {};
  return s;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Strips leading zeros (e.g. "02" -> "2") and returns "" for an empty
// field rather than forcing 0 - forcing a cleared field to 0 is what lets
// the next keystroke land on top of a phantom "0" and produce "02".
function cleanNumericText(raw) {
  return raw.replace(/^0+(?=\d)/, "");
}

function isNotFoundStorageError(msg) {
  const m = (msg || "").toLowerCase();
  return m.includes("not found") || m.includes("unexpected response type") || m.includes("no such key") || m.includes("does not exist");
}

async function storageGet(key, shared, attempt = 1) {
  try {
    if (!window.storage || !window.storage.get) return { ok: false, value: null, error: "Storage isn't available in this session." };
    const r = await window.storage.get(key, shared);
    return { ok: true, value: r ? r.value : null };
  } catch (e) {
    const msg = (e && (e.message || String(e))) || "Unknown storage error";
    // The storage bridge throws rather than returning null when a key
    // simply hasn't been created yet - treat that as "not found", not
    // as a connectivity failure, so retries/scary errors don't fire for
    // an ordinary "no round with that code" case.
    if (isNotFoundStorageError(msg)) {
      return { ok: true, value: null };
    }
    if (attempt < 3) {
      await sleep(350 * attempt);
      return storageGet(key, shared, attempt + 1);
    }
    return { ok: false, value: null, error: msg };
  }
}
async function storageSet(key, value, shared, attempt = 1) {
  try {
    if (!window.storage || !window.storage.set) return { ok: false, error: "Storage isn't available in this session." };
    const r = await window.storage.set(key, value, shared);
    if (!r) return { ok: false, error: "Storage returned no result." };
    return { ok: true };
  } catch (e) {
    const msg = (e && (e.message || String(e))) || "Unknown storage error";
    if (attempt < 3) {
      await sleep(350 * attempt);
      return storageSet(key, value, shared, attempt + 1);
    }
    return { ok: false, error: msg };
  }
}

async function storageDelete(key, shared, attempt = 1) {
  try {
    if (!window.storage || !window.storage.delete) return { ok: false, error: "Storage isn't available in this session." };
    await window.storage.delete(key, shared);
    return { ok: true };
  } catch (e) {
    const msg = (e && (e.message || String(e))) || "Unknown storage error";
    if (attempt < 3) {
      await sleep(300 * attempt);
      return storageDelete(key, shared, attempt + 1);
    }
    return { ok: false, error: msg };
  }
}

export default function GolfScorecard() {
  const [screen, setScreen] = useState("home");

  // Every screen change (any navigation button) should land at the top of
  // the page, rather than keeping whatever scroll position the previous
  // screen was left at.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [screen]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [recentCodes, setRecentCodes] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [storageBroken, setStorageBroken] = useState(false);
  const failCountRef = useRef(0);
  const [pasteData, setPasteData] = useState("");
  const [pasteMsg, setPasteMsg] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [copyFallbackText, setCopyFallbackText] = useState("");

  // wizard state
  const [gameKey, setGameKey] = useState(null);
  const [cfg, setCfg] = useState({});
  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [players, setPlayers] = useState([]); // {name, hcp}
  const [pontoPairing, setPontoPairing] = useState([[0, 1], [2, 3]]);
  const [par, setPar] = useState(DEFAULT_PAR);
  const [courseName, setCourseName] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [courseMsg, setCourseMsg] = useState("");

  // active round
  const [round, setRound] = useState(null); // full round object once loaded/created
  const [holeIdx, setHoleIdx] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [rulesOpenFor, setRulesOpenFor] = useState(null);
  const [tournamentRulesOpen, setTournamentRulesOpen] = useState(false);

  // ---- Tournament (multi-foursome) state ----
  const [activeTournament, setActiveTournament] = useState(null); // tournament object once created/joined, drives "foursome mode" in setup
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentDate, setTournamentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tournamentCourseName, setTournamentCourseName] = useState("");
  const [tournamentGameKey, setTournamentGameKey] = useState(null);
  const [tournamentRankBy, setTournamentRankBy] = useState("strokes"); // strokes-only for now (game points ranking removed)
  const [tournamentPar, setTournamentPar] = useState(DEFAULT_PAR);
  const [tournamentCfg, setTournamentCfg] = useState({});
  const [tournamentFoursomeCount, setTournamentFoursomeCount] = useState(2);
  const [tournamentFoursomesDraft, setTournamentFoursomesDraft] = useState([]);
  const [tournamentJoinCode, setTournamentJoinCode] = useState("");
  const [tournamentErr, setTournamentErr] = useState("");
  const [tournamentBusy, setTournamentBusy] = useState(false);
  const [board, setBoard] = useState(null); // { tournament, rows: [{...}] } for the leaderboard screen
  const [boardErr, setBoardErr] = useState("");
  const [lastTournament, setLastTournament] = useState(null); // {id, name} - lets Home screen jump back into a tournament from anywhere
  const [editFoursomeOpen, setEditFoursomeOpen] = useState(false);
  const [editFoursomeId, setEditFoursomeId] = useState(null);
  const [editFoursomeName, setEditFoursomeName] = useState("");
  const [editFoursomePlayers, setEditFoursomePlayers] = useState([]);
  const [editFoursomeErr, setEditFoursomeErr] = useState("");
  const [editFoursomeBusy, setEditFoursomeBusy] = useState(false);
  const [boardLoading, setBoardLoading] = useState(false);

  function openRules(key) {
    setRulesOpenFor(key);
  }
  function closeRules() {
    setRulesOpenFor(null);
  }

  function RulesModal() {
    if (!rulesOpenFor) return null;
    const rg = GAMES[rulesOpenFor];
    if (!rg) return null;
    return (
      <div className="gsc-modal-backdrop" onClick={closeRules}>
        <div className="gsc-modal" style={{ maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
          <div className="gsc-modal-title">{rg.name} - Full Rules</div>
          <ul style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6, paddingLeft: 18, margin: "0 0 16px" }}>
            {rg.rules.map((r, i) =>
              typeof r === "string" ? (
                <li key={i} style={{ marginBottom: 6 }}>{r}</li>
              ) : (
                <li key={i} style={{ marginBottom: 6 }}>
                  {r.text}
                  <ul style={{ marginTop: 4 }}>
                    {r.sub.map((s, j) => (
                      <li key={j} style={{ marginBottom: 2 }}>{s}</li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%" }} onClick={closeRules}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // Tournament-level rules are deliberately separate from each game's own
  // "Full Rules" - they describe how foursomes are scored *against each
  // other*, not how points are awarded inside a single foursome's game.
  function tournamentRulesFor(gameKey) {
    const g = GAMES[gameKey];
    const rules = [
      "Every foursome in the tournament plays the same game, under the same locked settings (course par, max strokes, max putts, mulligans, prize) - so every foursome's numbers are directly comparable.",
      "Foursomes are ranked two separate ways - by total strokes and by total putts. Each has its own leaderboard, and the lowest total wins each.",
    ];
    if (g.bestBall) {
      rules.push({
        text: `${g.name} uses best-ball scoring, so each hole's foursome score is the single lowest score in the whole foursome:`,
        sub: ["Strokes: the lowest strokes among all 4 players on that hole.", "Putts: the lowest putts among all 4 players on that hole."],
      });
    } else {
      rules.push({
        text: `In ${g.name}, each hole's foursome score is all 4 players' scores added together:`,
        sub: ["Strokes: all 4 players' strokes for that hole, combined.", "Putts: all 4 players' putts for that hole, combined."],
      });
    }
    rules.push(
      "A hole only counts toward a foursome's total once all 4 players have entered that category for the hole, so an in-progress round never shows a misleading total.",
      "This tournament-level scoring is separate from, and doesn't change, how points are awarded inside each foursome's own game."
    );
    return rules;
  }

  function TournamentRulesModal() {
    if (!tournamentRulesOpen) return null;
    const key = activeTournament ? activeTournament.game : tournamentGameKey;
    if (!key) return null;
    const rules = tournamentRulesFor(key);
    return (
      <div className="gsc-modal-backdrop" onClick={() => setTournamentRulesOpen(false)}>
        <div className="gsc-modal" style={{ maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
          <div className="gsc-modal-title">Tournament Scoring Rules</div>
          <ul style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6, paddingLeft: 18, margin: "0 0 16px" }}>
            {rules.map((r, i) =>
              typeof r === "string" ? (
                <li key={i} style={{ marginBottom: 6 }}>{r}</li>
              ) : (
                <li key={i} style={{ marginBottom: 6 }}>
                  {r.text}
                  <ul style={{ marginTop: 4 }}>
                    {r.sub.map((s, j) => (
                      <li key={j} style={{ marginBottom: 2 }}>{s}</li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%" }} onClick={() => setTournamentRulesOpen(false)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  function EditFoursomeModal() {
    if (!editFoursomeOpen) return null;
    return (
      <div className="gsc-modal-backdrop" onClick={() => setEditFoursomeOpen(false)}>
        <div className="gsc-modal" style={{ maxWidth: 420, maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
          <div className="gsc-modal-title">Edit Foursome</div>
          <div className="gsc-label">Foursome name</div>
          <input className="gsc-input" style={{ marginBottom: 14 }} value={editFoursomeName} onChange={(e) => setEditFoursomeName(e.target.value)} />
          <div className="gsc-label" style={{ marginBottom: 6 }}>Players</div>
          {editFoursomePlayers.map((p, i) => (
            <div className="gsc-row" key={i} style={{ marginBottom: 8 }}>
              <div style={{ flex: "0 0 22px", fontWeight: 800, color: "#1B4332", paddingTop: 9 }}>{LETTERS[i] || i + 1}</div>
              <input className="gsc-input" placeholder="Name" value={p.name} onChange={(e) => updateEditFoursomePlayer(i, "name", e.target.value)} />
              <input className="gsc-input" style={{ flex: "0 0 70px" }} placeholder="HCP" value={p.hcp} onChange={(e) => updateEditFoursomePlayer(i, "hcp", e.target.value)} />
            </div>
          ))}
          {editFoursomeErr && <div style={{ color: "#C1440E", fontSize: 13, margin: "8px 0" }}>{editFoursomeErr}</div>}
          <div className="gsc-modal-row" style={{ marginTop: 12 }}>
            <button className="gsc-btn gsc-btn-outline" onClick={() => setEditFoursomeOpen(false)}>Cancel</button>
            <button className="gsc-btn gsc-btn-primary" disabled={editFoursomeBusy} onClick={saveEditFoursome}>
              {editFoursomeBusy ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  const [activeRound, setActiveRound] = useState(null);
  const [resumeChecked, setResumeChecked] = useState(false);
  const [finishedRounds, setFinishedRounds] = useState([]);
  const [reopenErr, setReopenErr] = useState("");
  const [deleteRoundConfirm, setDeleteRoundConfirm] = useState(null); // {id, name} while confirming a delete
  const [deleteRoundBusy, setDeleteRoundBusy] = useState(false);
  const [deleteRoundErr, setDeleteRoundErr] = useState("");
  const [archiveErr, setArchiveErr] = useState("");

  // Keep the "Continue round" pointer mirrored to whatever round is
  // currently loaded, any time it changes (entering a score, toggling a
  // mulligan, etc.) - not just at the moment the round was first created
  // or opened. Without this, activeRound stays frozen at hole 1 while the
  // real round data moves on, so leaving and hitting "Continue round"
  // would resume from a stale, empty copy instead of where play left off.
  useEffect(() => {
    if (round) setActiveRound(round);
  }, [round]);

  useEffect(() => {
    (async () => {
      const res = await storageGet(ACTIVE_KEY, false);
      if (res.ok && res.value) {
        try {
          setActiveRound(JSON.parse(res.value));
        } catch (e) {}
      }
      setResumeChecked(true);
      const fres = await storageGet(FINISHED_INDEX_KEY, false);
      if (fres.ok && fres.value) {
        try {
          setFinishedRounds(JSON.parse(fres.value));
        } catch (e) {}
      }
      const ltRes = await storageGet(LAST_TOURNAMENT_KEY, false);
      if (ltRes.ok && ltRes.value) {
        try {
          setLastTournament(JSON.parse(ltRes.value));
        } catch (e) {}
      }
    })();
  }, []);

  function firstOpenHole(r) {
    for (let h = 0; h < 18; h++) {
      const hs = r.scores[h] || {};
      const filled = r.players.every((_, i) => hs[i] && (hs[i].strokes != null || hs[i].putts != null));
      if (!filled) return h;
    }
    return 17;
  }

  function resumeActiveRound() {
    setRound(activeRound);
    setGameKey(activeRound.game);
    setHoleIdx(firstOpenHole(activeRound));
    setScreen("card");
  }

  // Guard against accidentally losing an in-progress round: tapping Back
  // during a round asks for confirmation instead of leaving right away.
  function requestLeaveRound() {
    setConfirmLeaveOpen(true);
  }
  function confirmLeaveRound() {
    setConfirmLeaveOpen(false);
    setScreen("home");
  }
  function cancelLeaveRound() {
    setConfirmLeaveOpen(false);
  }

  // Best-effort guard for real navigation/close events while a round is
  // active (e.g. closing the tab or navigating the browser away). Note this
  // can only catch standard web navigation - a swipe gesture that dismisses
  // the whole artifact panel is handled by the host app itself and can't be
  // intercepted from inside the artifact. The round auto-saves regardless,
  // so it's always resumable via "Continue round" even if that happens.
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (screen === "card" && round) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [screen, round]);

  // Light auto-refresh while the leaderboard is open, so other foursomes'
  // progress shows up without the person needing to keep tapping refresh.
  useEffect(() => {
    if (screen !== "tournamentBoard" || !board) return;
    const id = setInterval(() => {
      loadTournamentBoard(board.tournament.id);
    }, 20000);
    return () => clearInterval(id);
  }, [screen, board && board.tournament && board.tournament.id]);

  async function discardActiveRound() {
    // Only clears the "continue where you left off" pointer - never deletes
    // the round itself, so it's never truly gone by mistake.
    await storageDelete(ACTIVE_KEY, false);
    setActiveRound(null);
  }

  async function discardTournament() {
    // Same idea as discardActiveRound - only clears this device's pointer
    // back to the tournament. The tournament and every foursome's data stay
    // fully intact in shared storage; anyone can still get back in with the
    // tournament code even after this.
    await storageDelete(LAST_TOURNAMENT_KEY, false);
    setLastTournament(null);
  }

  async function archiveAndExitRound(r) {
    // Move the round into a personal "finished" archive BEFORE clearing the
    // resume pointer, so exiting never destroys data. Both writes have to
    // actually succeed before we touch anything else - if we blindly cleared
    // the active-round pointer and updated the UI regardless of whether the
    // save worked, a failed write would silently orphan the round: it would
    // show up in "Finished rounds" from local state alone, but there'd be
    // nothing behind it in storage for Reopen to find.
    setErr("");
    setArchiveErr("");
    setBusy(true);
    const savedRoundRes = await storageSet(`${FINISHED_PREFIX}${r.id}`, JSON.stringify(r), false);
    if (!savedRoundRes.ok) {
      setBusy(false);
      setArchiveErr(`Couldn't save this round (${savedRoundRes.error || "storage error"}). Your round hasn't been touched - tap "Finish & exit" to retry, or "Copy round data to share" as a backup.`);
      return;
    }
    const idxRes = await storageGet(FINISHED_INDEX_KEY, false);
    let idx = [];
    if (idxRes.ok && idxRes.value) {
      try {
        idx = JSON.parse(idxRes.value);
      } catch (e) {}
    }
    idx = idx.filter((x) => x.id !== r.id);
    idx.unshift({ id: r.id, name: r.name, date: r.date, game: r.game });
    idx = idx.slice(0, 15);
    const idxSetRes = await storageSet(FINISHED_INDEX_KEY, JSON.stringify(idx), false);
    setBusy(false);
    if (!idxSetRes.ok) {
      // The round itself is safely saved at this point - only the index
      // listing it under "Finished rounds" failed. Don't delete the active
      // pointer or navigate away, so the round stays reachable and the user
      // can retry rather than losing track of it.
      setArchiveErr(`Saved the round, but couldn't add it to your finished-rounds list (${idxSetRes.error || "storage error"}). Tap "Finish & exit" again to retry.`);
      return;
    }
    setFinishedRounds(idx);
    await storageDelete(ACTIVE_KEY, false);
    setActiveRound(null);
    setRound(null);
    setScreen("home");
  }

  async function openFinishedRound(id) {
    setReopenErr("");
    setBusy(true);
    const res = await storageGet(`${FINISHED_PREFIX}${id}`, false);
    setBusy(false);
    if (!res.ok || !res.value) {
      setReopenErr(`Couldn't open that saved round (${res.error || "it may not have finished saving - try again"}).`);
      return;
    }
    const r = JSON.parse(res.value);
    setRound(r);
    setGameKey(r.game);
    setHoleIdx(firstOpenHole(r));
    setActiveRound(r);
    saveRound(r);
    setScreen("card");
  }

  function requestDeleteFinishedRound(f) {
    setDeleteRoundErr("");
    setDeleteRoundConfirm(f);
  }

  function cancelDeleteFinishedRound() {
    setDeleteRoundConfirm(null);
  }

  async function confirmDeleteFinishedRound() {
    if (!deleteRoundConfirm) return;
    const id = deleteRoundConfirm.id;
    setDeleteRoundBusy(true);
    setDeleteRoundErr("");
    const delRes = await storageDelete(`${FINISHED_PREFIX}${id}`, false);
    if (!delRes.ok) {
      setDeleteRoundBusy(false);
      setDeleteRoundErr(`Couldn't delete this round (${delRes.error}). Try again.`);
      return;
    }
    const idxRes = await storageGet(FINISHED_INDEX_KEY, false);
    let idx = [];
    if (idxRes.ok && idxRes.value) {
      try {
        idx = JSON.parse(idxRes.value);
      } catch (e) {}
    }
    idx = idx.filter((x) => x.id !== id);
    await storageSet(FINISHED_INDEX_KEY, JSON.stringify(idx), false);
    setFinishedRounds(idx);
    setDeleteRoundBusy(false);
    setDeleteRoundConfirm(null);
  }

  function rememberCode(code, label) {
    setRecentCodes((cur) => {
      const next = [{ code, label }, ...cur.filter((c) => c.code !== code)];
      return next.slice(0, 8);
    });
  }

  async function loadSavedCourses() {
    // Merge the shared (group-wide) list with a personal fallback list,
    // since a course may have been saved locally if group sync was down
    // at the time (see saveCourseToIndex).
    const [sharedRes, localRes] = await Promise.all([
      storageGet("courses-index", true),
      storageGet("courses-index-local", false),
    ]);
    let sharedList = [];
    let localList = [];
    if (sharedRes.ok && sharedRes.value) {
      try {
        sharedList = JSON.parse(sharedRes.value);
      } catch (e) {}
    }
    if (localRes.ok && localRes.value) {
      try {
        localList = JSON.parse(localRes.value);
      } catch (e) {}
    }
    const seen = new Set(sharedList.map((c) => c.name.toLowerCase()));
    const merged = [...sharedList, ...localList.filter((c) => !seen.has(c.name.toLowerCase()))];
    setSavedCourses(merged);
  }

  async function saveCourseToIndex(name, parArr) {
    const cleanName = name.trim();
    if (!cleanName) {
      setCourseMsg("Give the course a name first.");
      return;
    }
    const parArrClean = parArr.map((p) => (p === "" || p == null || isNaN(Number(p)) ? 4 : Number(p)));
    parArr = parArrClean;
    const res = await storageGet("courses-index", true);
    let list = [];
    if (res.ok && res.value) {
      try {
        list = JSON.parse(res.value);
      } catch (e) {
        list = [];
      }
    }
    list = list.filter((c) => c.name.toLowerCase() !== cleanName.toLowerCase());
    list.unshift({ name: cleanName, par: parArr });
    list = list.slice(0, 40);
    const w = await storageSet("courses-index", JSON.stringify(list), true);
    if (w.ok) {
      setCourseMsg(`Saved "${cleanName}" for next time.`);
      setSavedCourses(list);
      return;
    }
    // Group-wide save failed - fall back to saving on this device only,
    // so the course isn't lost even when shared storage is having issues.
    const localRes = await storageGet("courses-index-local", false);
    let localList = [];
    if (localRes.ok && localRes.value) {
      try {
        localList = JSON.parse(localRes.value);
      } catch (e) {}
    }
    localList = localList.filter((c) => c.name.toLowerCase() !== cleanName.toLowerCase());
    localList.unshift({ name: cleanName, par: parArr });
    localList = localList.slice(0, 40);
    const lw = await storageSet("courses-index-local", JSON.stringify(localList), false);
    if (lw.ok) {
      setCourseMsg(`Group sync is down, so "${cleanName}" was saved on this device only. It'll show up here again, but other players won't see it until sync recovers.`);
      setSavedCourses((cur) => {
        const filtered = cur.filter((c) => c.name.toLowerCase() !== cleanName.toLowerCase());
        return [{ name: cleanName, par: parArr }, ...filtered];
      });
    } else {
      setCourseMsg(`Couldn't save the course (${w.error}).`);
    }
  }

  function applySavedCourse(name) {
    const c = savedCourses.find((c) => c.name === name);
    if (c) {
      setCourseName(c.name);
      setPar(c.par);
      setCourseMsg(`Loaded par for "${c.name}".`);
    }
  }

  function startNewRound(key) {
    setActiveTournament(null);
    setGameKey(key);
    setCfg({ ...GAMES[key].defaults });
    setRoundName("");
    setRoundDate(new Date().toISOString().slice(0, 10));
    setPlayers([
      { name: "", hcp: "" },
      { name: "", hcp: "" },
      { name: "", hcp: "" },
      { name: "", hcp: "" },
    ]);
    setPontoPairing([[0, 1], [2, 3]]);
    setPar(DEFAULT_PAR);
    setCourseName("");
    setCourseMsg("");
    loadSavedCourses();
    setScreen("setup");
  }

  // Preps the same setup screen used for a normal round, but with the
  // game/par/settings locked in from the tournament so every foursome
  // plays under identical conditions. Only the foursome's own name and
  // players are still entered here.
  function startTournamentFoursome(tournament) {
    setActiveTournament(tournament);
    setGameKey(tournament.game);
    setCfg({ ...tournament.cfg });
    setRoundName("");
    setRoundDate(tournament.date);
    setPlayers([
      { name: "", hcp: "" },
      { name: "", hcp: "" },
      { name: "", hcp: "" },
      { name: "", hcp: "" },
    ]);
    setNumTeams(2);
    setPontoPairing([[0, 1], [2, 3]]);
    setPar([...tournament.par]);
    setCourseName(tournament.course || "");
    setCourseMsg("");
    setTournamentErr("");
    const pointer = { id: tournament.id, name: tournament.name };
    setLastTournament(pointer);
    storageSet(LAST_TOURNAMENT_KEY, JSON.stringify(pointer), false);
    setScreen("setup");
  }

  function updatePlayer(i, field, val) {
    setPlayers((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  async function registerFoursomeInTournament(tournamentId, foursomeId, foursomeName) {
    const res = await storageGet(`${TOURNAMENT_PREFIX}${tournamentId}`, true);
    if (!res.ok || !res.value) return { ok: false, error: res.error || "tournament not found" };
    let t;
    try {
      t = JSON.parse(res.value);
    } catch (e) {
      return { ok: false, error: "corrupt tournament data" };
    }
    t.foursomes = (t.foursomes || []).filter((f) => f.id !== foursomeId);
    t.foursomes.push({ id: foursomeId, name: foursomeName });
    const w = await storageSet(`${TOURNAMENT_PREFIX}${tournamentId}`, JSON.stringify(t), true);
    return w.ok ? { ok: true, tournament: t } : { ok: false, error: w.error };
  }

  async function finishSetup() {
    setErr("");
    const cleanPlayers = players.map((p) => ({ name: p.name.trim() || "Player", hcp: p.hcp }));
    if (cleanPlayers.length < 4) {
      setErr("Need 4 players.");
      return;
    }
    const code = genCode();
    const teams =
      gameKey === "ponto" || gameKey === "beachside"
        ? pontoPairing
        : gameKey === "dstreet" || gameKey === "swami"
        ? [[0], [1], [2], [3]] // individual - each player is their own "team" of one
        : gameKey === "tourneybb" || gameKey === "tourneygg"
        ? [[0, 1, 2, 3]] // whole foursome as a single team - no sub-teams
        : null; // seabluffe computes teams per-hole

    const cleanPar = par.map((p) => (p === "" || p == null || isNaN(Number(p)) ? 4 : Number(p)));
    const cleanCfg = {
      ...cfg,
      maxOver: cfg.maxOver === "" || cfg.maxOver == null || isNaN(Number(cfg.maxOver)) ? 3 : Number(cfg.maxOver),
      maxPutts: cfg.maxPutts === "" || cfg.maxPutts == null || isNaN(Number(cfg.maxPutts)) ? 3 : Number(cfg.maxPutts),
      mulliganSegment: cfg.mulliganSegment === "" || cfg.mulliganSegment == null || isNaN(Number(cfg.mulliganSegment)) ? 1 : Number(cfg.mulliganSegment),
    };

    // In tournament mode, always use the tournament's own locked settings
    // rather than whatever's in local state - those fields are hidden from
    // the foursome setup screen, but this keeps every foursome's numbers
    // directly comparable even if something odd happened to local state.
    const isTournament = !!activeTournament;
    const finalCfg = isTournament ? { ...activeTournament.cfg } : cleanCfg;
    const finalPar = isTournament ? [...activeTournament.par] : cleanPar;
    const finalCourse = isTournament ? activeTournament.course || "" : courseName.trim();
    const foursomeName = roundName.trim() || "Foursome";

    const newRound = {
      id: code,
      game: gameKey,
      name: roundName.trim() || (isTournament ? `${foursomeName} - ${activeTournament.name}` : GAMES[gameKey].name + " " + roundDate),
      date: roundDate,
      course: finalCourse,
      cfg: finalCfg,
      players: cleanPlayers,
      teams,
      par: finalPar,
      scores: emptyScores(),
      createdAt: Date.now(),
      tournamentId: isTournament ? activeTournament.id : null,
      foursomeName: isTournament ? foursomeName : null,
    };
    setBusy(true);
    failCountRef.current = 0;
    setStorageBroken(false);
    await saveRound(newRound);
    if (isTournament) {
      const reg = await registerFoursomeInTournament(activeTournament.id, code, foursomeName);
      if (!reg.ok) {
        setTournamentErr(`Your foursome was created and is playable, but couldn't be added to the tournament leaderboard yet (${reg.error}). Try refreshing the leaderboard from your scorecard once you're underway.`);
      }
    }
    setBusy(false);
    rememberCode(code, newRound.name);
    setActiveRound(newRound);
    setRound(newRound);
    setHoleIdx(0);
    setScreen("card");
  }

  function startTournamentCreateFlow() {
    setTournamentErr("");
    setTournamentName("");
    setTournamentDate(new Date().toISOString().slice(0, 10));
    setTournamentCourseName("");
    setTournamentGameKey(TOURNAMENT_GAME_KEYS[0]);
    setTournamentRankBy("strokes");
    setTournamentPar(DEFAULT_PAR);
    setTournamentCfg({ ...GAMES[TOURNAMENT_GAME_KEYS[0]].defaults });
    setTournamentFoursomeCount(2);
    setScreen("tournamentCreate");
  }

  function proceedToFoursomeRoster() {
    setTournamentErr("");
    const name = tournamentName.trim();
    if (!name) {
      setTournamentErr("Give the tournament a name first.");
      return;
    }
    const count = tournamentFoursomeCount === "" || tournamentFoursomeCount == null || isNaN(Number(tournamentFoursomeCount)) ? 2 : Math.max(1, Number(tournamentFoursomeCount));
    setTournamentFoursomeCount(count);
    setTournamentFoursomesDraft(
      Array.from({ length: count }, (_, i) => ({
        name: `Foursome ${i + 1}`,
        players: [
          { name: "", hcp: "" },
          { name: "", hcp: "" },
          { name: "", hcp: "" },
          { name: "", hcp: "" },
        ],
      }))
    );
    setScreen("tournamentRoster");
  }

  function updateFoursomeDraftName(fi, val) {
    setTournamentFoursomesDraft((draft) => {
      const next = [...draft];
      next[fi] = { ...next[fi], name: val };
      return next;
    });
  }

  function updateFoursomeDraftPlayer(fi, pi, field, val) {
    setTournamentFoursomesDraft((draft) => {
      const next = [...draft];
      const players = [...next[fi].players];
      players[pi] = { ...players[pi], [field]: val };
      next[fi] = { ...next[fi], players };
      return next;
    });
  }

  async function finishTournamentCreate() {
    setTournamentErr("");
    const name = tournamentName.trim();
    if (!name) {
      setTournamentErr("Give the tournament a name first.");
      return;
    }
    const code = genCode();
    const cleanPar = tournamentPar.map((p) => (p === "" || p == null || isNaN(Number(p)) ? 4 : Number(p)));
    const cleanCfg = {
      ...tournamentCfg,
      maxOver: tournamentCfg.maxOver === "" || tournamentCfg.maxOver == null || isNaN(Number(tournamentCfg.maxOver)) ? 3 : Number(tournamentCfg.maxOver),
      maxPutts: tournamentCfg.maxPutts === "" || tournamentCfg.maxPutts == null || isNaN(Number(tournamentCfg.maxPutts)) ? 3 : Number(tournamentCfg.maxPutts),
      mulliganSegment:
        tournamentCfg.mulliganSegment === "" || tournamentCfg.mulliganSegment == null || isNaN(Number(tournamentCfg.mulliganSegment)) ? 1 : Number(tournamentCfg.mulliganSegment),
    };

    setTournamentBusy(true);

    // Create every foursome's round first, then save the tournament once
    // with the full foursome list already attached - avoids N separate
    // read-modify-write round trips against the tournament record.
    const foursomeEntries = [];
    for (const draft of tournamentFoursomesDraft) {
      const foursomeCode = genCode();
      const foursomeName = draft.name.trim() || "Foursome";
      const cleanPlayers = draft.players.map((p) => ({ name: p.name.trim() || "Player", hcp: p.hcp }));
      const foursomeRound = {
        id: foursomeCode,
        game: tournamentGameKey,
        name: `${foursomeName} - ${name}`,
        date: tournamentDate,
        course: tournamentCourseName.trim(),
        cfg: cleanCfg,
        players: cleanPlayers,
        teams: [[0, 1, 2, 3]],
        par: cleanPar,
        scores: emptyScores(),
        createdAt: Date.now(),
        tournamentId: code,
        foursomeName,
      };
      const rw = await storageSet(`golfround:${foursomeCode}`, JSON.stringify(foursomeRound), true);
      if (!rw.ok) {
        setTournamentBusy(false);
        setTournamentErr(`Couldn't save "${foursomeName}" (${rw.error}). Try again.`);
        return;
      }
      foursomeEntries.push({ id: foursomeCode, name: foursomeName });
    }

    const tournament = {
      id: code,
      name,
      date: tournamentDate,
      course: tournamentCourseName.trim(),
      game: tournamentGameKey,
      rankBy: tournamentRankBy,
      cfg: cleanCfg,
      par: cleanPar,
      foursomes: foursomeEntries,
      createdAt: Date.now(),
    };
    const w = await storageSet(`${TOURNAMENT_PREFIX}${code}`, JSON.stringify(tournament), true);
    setTournamentBusy(false);
    if (!w.ok) {
      setTournamentErr(`All ${foursomeEntries.length} foursomes were saved, but the tournament record itself failed to save (${w.error}). Try again.`);
      return;
    }
    const pointer = { id: tournament.id, name: tournament.name };
    setLastTournament(pointer);
    storageSet(LAST_TOURNAMENT_KEY, JSON.stringify(pointer), false);
    openTournamentBoard(tournament.id);
  }

  async function joinTournament(codeRaw) {
    setTournamentErr("");
    const code = codeRaw.toUpperCase().trim();
    if (!code) return;
    setTournamentBusy(true);
    const res = await storageGet(`${TOURNAMENT_PREFIX}${code}`, true);
    setTournamentBusy(false);
    if (!res.ok) {
      setTournamentErr(`Couldn't reach the tournament (${res.error}).`);
      return;
    }
    if (!res.value) {
      setTournamentErr("No tournament found with that code.");
      return;
    }
    let tournament;
    try {
      tournament = JSON.parse(res.value);
    } catch (e) {
      setTournamentErr("That tournament's data looks corrupted.");
      return;
    }
    startTournamentFoursome(tournament);
  }

  // Loads the tournament plus every registered foursome's round, scores
  // each one with the same engine each foursome's own screen uses, and
  // ranks them by whichever method the organizer chose. Used both for the
  // initial open of the leaderboard and for manual/auto refresh.
  async function loadTournamentBoard(tournamentId) {
    setBoardErr("");
    setBoardLoading(true);
    const tRes = await storageGet(`${TOURNAMENT_PREFIX}${tournamentId}`, true);
    if (!tRes.ok || !tRes.value) {
      setBoardLoading(false);
      setBoardErr(`Couldn't load the tournament (${tRes.error || "not found"}).`);
      return;
    }
    let tournament;
    try {
      tournament = JSON.parse(tRes.value);
    } catch (e) {
      setBoardLoading(false);
      setBoardErr("That tournament's data looks corrupted.");
      return;
    }
    const foursomes = tournament.foursomes || [];
    const results = await Promise.all(
      foursomes.map(async (f) => {
        const r = await storageGet(`golfround:${f.id}`, true);
        if (!r.ok || !r.value) return { ...f, error: r.error || "not found" };
        try {
          const foursomeRound = JSON.parse(r.value);
          const totals = computeTournamentFoursomeTotals(foursomeRound);
          return {
            ...f,
            totalStrokes: totals.totalStrokes,
            totalPutts: totals.totalPutts,
            strokeHoles: totals.strokeHoles,
            puttHoles: totals.puttHoles,
            round: foursomeRound,
          };
        } catch (e) {
          return { ...f, error: "corrupted data" };
        }
      })
    );
    function rankedBy(key) {
      return [...results].sort((a, b) => {
        if (a.error && !b.error) return 1;
        if (!a.error && b.error) return -1;
        if (a.error && b.error) return 0;
        return a[key] - b[key]; // lower is better for both strokes and putts
      });
    }
    setBoardLoading(false);
    setBoard({ tournament, strokesRanked: rankedBy("totalStrokes"), puttsRanked: rankedBy("totalPutts") });
  }

  function openEditFoursome(id, roundData) {
    setEditFoursomeErr("");
    setEditFoursomeId(id);
    setEditFoursomeName(roundData.foursomeName || roundData.name || "");
    setEditFoursomePlayers(roundData.players.map((p) => ({ name: p.name, hcp: p.hcp })));
    setEditFoursomeOpen(true);
  }

  function updateEditFoursomePlayer(i, field, val) {
    setEditFoursomePlayers((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  async function saveEditFoursome() {
    setEditFoursomeErr("");
    setEditFoursomeBusy(true);
    const res = await storageGet(`golfround:${editFoursomeId}`, true);
    if (!res.ok || !res.value) {
      setEditFoursomeBusy(false);
      setEditFoursomeErr(`Couldn't load this foursome to edit it (${res.error || "not found"}).`);
      return;
    }
    let r;
    try {
      r = JSON.parse(res.value);
    } catch (e) {
      setEditFoursomeBusy(false);
      setEditFoursomeErr("This foursome's data looks corrupted.");
      return;
    }
    const cleanName = editFoursomeName.trim() || "Foursome";
    r.players = editFoursomePlayers.map((p) => ({ name: p.name.trim() || "Player", hcp: p.hcp }));
    if (r.tournamentId) {
      r.foursomeName = cleanName;
      r.name = cleanName + (activeTournament ? ` - ${activeTournament.name}` : "");
    } else {
      r.name = cleanName;
    }
    const w = await storageSet(`golfround:${editFoursomeId}`, JSON.stringify(r), true);
    if (!w.ok) {
      setEditFoursomeBusy(false);
      setEditFoursomeErr(`Couldn't save those changes (${w.error}). Try again.`);
      return;
    }
    // Keep the tournament's foursome index label in sync too.
    if (r.tournamentId) {
      await registerFoursomeInTournament(r.tournamentId, editFoursomeId, cleanName);
    }
    // If this is the foursome currently loaded on screen, refresh local state too.
    if (round && round.id === editFoursomeId) {
      setRound(r);
      setActiveRound(r);
    }
    setEditFoursomeBusy(false);
    setEditFoursomeOpen(false);
    if (board) loadTournamentBoard(board.tournament.id);
  }

  function openTournamentBoard(tournamentId) {
    setBoard(null);
    setBoardErr("");
    setScreen("tournamentBoard");
    loadTournamentBoard(tournamentId);
  }

  // Lets Home (or anywhere else) jump straight into "add a foursome" for a
  // known tournament id, without first having to open the leaderboard.
  async function addFoursomeToTournamentId(tournamentId) {
    setTournamentErr("");
    setTournamentBusy(true);
    const res = await storageGet(`${TOURNAMENT_PREFIX}${tournamentId}`, true);
    setTournamentBusy(false);
    if (!res.ok || !res.value) {
      setTournamentErr(`Couldn't reach that tournament (${res.error || "not found"}).`);
      return;
    }
    try {
      const tournament = JSON.parse(res.value);
      startTournamentFoursome(tournament);
    } catch (e) {
      setTournamentErr("That tournament's data looks corrupted.");
    }
  }

  async function loadRound(code) {
    setErr("");
    setBusy(true);
    const res = await storageGet(`golfround:${code.toUpperCase().trim()}`, true);
    setBusy(false);
    if (!res.ok) {
      setErr(`Couldn't reach shared rounds (${res.error}). If this keeps happening, ask whoever has the round to use "Copy round data to share" and send it to you directly instead.`);
      return;
    }
    if (!res.value) {
      setErr("No round found with that code.");
      return;
    }
    const r = JSON.parse(res.value);
    setRound(r);
    setGameKey(r.game);
    setHoleIdx(firstOpenHole(r));
    rememberCode(r.id, r.name);
    setActiveRound(r);
    saveRound(r);
    setScreen("card");
  }

  function loadFromPastedData() {
    setPasteMsg("");
    try {
      const r = decodeRoundData(pasteData);
      if (!r || !r.id || !r.game) throw new Error("not a round");
      setRound(r);
      setGameKey(r.game);
      setHoleIdx(firstOpenHole(r));
      rememberCode(r.id, r.name);
      setActiveRound(r);
      saveRound(r);
      setPasteData("");
      setScreen("card");
    } catch (e) {
      setPasteMsg("That doesn't look like valid round data. Make sure you copied the whole thing.");
    }
  }

  async function copyRoundData(r) {
    const text = encodeRoundData(r);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyMsg("Copied! Paste it into a text/message to your group.");
        setCopyFallbackText("");
      } else {
        throw new Error("no clipboard api");
      }
    } catch (e) {
      setCopyMsg("Couldn't copy automatically - select and copy the text below manually.");
      setCopyFallbackText(text);
    }
  }

  const saveRound = useCallback(async (r) => {
    if (failCountRef.current >= 1) {
      // Already confirmed storage isn't responding - don't hammer it on
      // every tap. Wait for a manual retry instead.
      return;
    }
    const [sharedRes, personalRes] = await Promise.all([
      storageSet(`golfround:${r.id}`, JSON.stringify(r), true),
      storageSet(ACTIVE_KEY, JSON.stringify(r), false),
    ]);
    if (!sharedRes.ok && !personalRes.ok) {
      failCountRef.current += 1;
      setStorageBroken(true);
      setStorageWarning("");
    } else if (!sharedRes.ok) {
      failCountRef.current = 0;
      setStorageBroken(false);
      setStorageWarning(`Saved on this device, but group sync isn't working right now.`);
    } else if (!personalRes.ok) {
      failCountRef.current = 0;
      setStorageBroken(false);
      setStorageWarning(`Group sync is fine, but this device's resume-save failed once.`);
    } else {
      failCountRef.current = 0;
      setStorageBroken(false);
      setStorageWarning("");
    }
  }, []);

  function retrySync() {
    failCountRef.current = 0;
    setStorageBroken(false);
    setStorageWarning("");
    if (round) saveRound(round);
  }

  function updateHoleEntry(playerIdx, field, value) {
    setRound((r) => {
      const next = { ...r, scores: { ...r.scores } };
      const holeScores = { ...(next.scores[holeIdx] || {}) };
      const entry = { ...(holeScores[playerIdx] || {}) };
      entry[field] = value;
      holeScores[playerIdx] = entry;
      next.scores[holeIdx] = holeScores;
      saveRound(next);
      return next;
    });
  }

  const game = round ? GAMES[round.game] : gameKey ? GAMES[gameKey] : null;

  // ---------- computed scoring ----------
// Pure scoring function - takes any round object and returns its full
// scoring breakdown. Extracted out of the component (rather than kept as a
// useMemo body) so the Tournament Leaderboard can score every foursome's
// round the exact same way the foursome's own screen does, not just the
// one currently loaded into component state.
// Tournament-level foursome totals - deliberately separate from the
// in-foursome scoring engine below, because "the foursome's number" means
// something different at the tournament level than it does inside the
// foursome's own game:
//  - Beachside Best-Ball: the single lowest strokes among all 4 players on
//    a hole is the foursome's stroke score for that hole; likewise the
//    single lowest putts is the foursome's putt score. (True 4-way best
//    ball, not the 2-person sub-team best ball used for in-foursome points.)
//  - Every other tournament-eligible game: the foursome's stroke score for
//    a hole is all 4 players' strokes added together; likewise putts.
// Strokes and putts are tracked as two fully independent totals - a hole
// only counts toward a total once all 4 players have a value for that
// category, so partial entries never produce a misleading total.
function computeTournamentFoursomeTotals(round) {
  const g = GAMES[round.game];
  const nPlayers = round.players.length;
  let totalStrokes = 0;
  let totalPutts = 0;
  let strokeHoles = 0;
  let puttHoles = 0;
  for (let h = 0; h < 18; h++) {
    const parH = round.par[h] ?? 4;
    const hs = round.scores[h] || {};
    const capStroke = (v) => (v == null || v === "" ? null : Math.min(Number(v), parH + (round.cfg.maxOver ?? 99)));
    const capPutt = (v) => (v == null || v === "" ? null : Math.min(Number(v), round.cfg.maxPutts ?? 99));
    const strokes = [];
    const putts = [];
    for (let p = 0; p < nPlayers; p++) {
      const e = hs[p];
      const cs = e ? capStroke(e.strokes) : null;
      const cp = e ? capPutt(e.putts) : null;
      if (cs != null) strokes.push(cs);
      if (cp != null) putts.push(cp);
    }
    if (strokes.length === nPlayers) {
      totalStrokes += g.bestBall ? Math.min(...strokes) : strokes.reduce((a, b) => a + b, 0);
      strokeHoles++;
    }
    if (putts.length === nPlayers) {
      totalPutts += g.bestBall ? Math.min(...putts) : putts.reduce((a, b) => a + b, 0);
      puttHoles++;
    }
  }
  return { totalStrokes, totalPutts, strokeHoles, puttHoles };
}

function computeRoundScoring(round) {
  if (!round) return null;
  const g = GAMES[round.game];
  const nPlayers = round.players.length;
  const playerPoints = Array(nPlayers).fill(0);
  const playerTotalScore = Array(nPlayers).fill(0);
  const playerTotalPutts = Array(nPlayers).fill(0);
  const playerParPlayed = Array(nPlayers).fill(0);
  const teamPointsByTeamIdx = null; // was only used by the now-removed Ponto Putt-Off game
  const holeResults = [];

  for (let h = 0; h < 18; h++) {
    const parH = round.par[h] ?? 4;
    const hs = round.scores[h] || {};
    let teamsThisHole;
    if (round.game === "seabluffe") {
      teamsThisHole = SEABLUFFE_PAIRINGS[Math.floor(h / 6)];
    } else if (round.game === "ponto") {
      teamsThisHole = round.teams;
    } else {
      teamsThisHole = round.teams;
    }

    const capStroke = (v) => (v == null || v === "" ? null : Math.min(Number(v), parH + (round.cfg.maxOver ?? 99)));
    const capPutt = (v) => (v == null || v === "" ? null : Math.min(Number(v), round.cfg.maxPutts ?? 99));

    // accumulate individual totals
    for (let p = 0; p < nPlayers; p++) {
      const e = hs[p];
      if (!e) continue;
      if (g.hasScore) {
        const cs = capStroke(e.strokes);
        if (cs != null) {
          playerTotalScore[p] += cs;
          playerParPlayed[p] += parH;
        }
      }
      if (g.hasPutts) {
        const cp = capPutt(e.putts);
        if (cp != null) playerTotalPutts[p] += cp;
      }
    }

    // Combined games (Seabluffe Swap, Cardiff Combine, D-Street
    // Duffers) sum every team/player's capped strokes or putts. Best-ball
    // games (Beachside Best-Ball) instead count only the lower of the
    // team's two - each player still records their own strokes/putts,
    // but only the best one counts toward the team's total that hole.
    const aggregate = (arr) => (g.bestBall ? Math.min(...arr) : arr.reduce((a, b) => a + b, 0));

    const teamRes = teamsThisHole.map((team) => {
      const strokes = team.map((p) => capStroke(hs[p] && hs[p].strokes));
      const putts = team.map((p) => capPutt(hs[p] && hs[p].putts));
      const strokeOk = strokes.every((v) => v != null);
      const puttOk = putts.every((v) => v != null);
      return {
        team,
        scoreSum: strokeOk ? aggregate(strokes) : null,
        puttSum: puttOk ? aggregate(putts) : null,
      };
    });

    // Award 1 pt to every team/player tied at the lowest sum for a
    // category, unless everyone is tied (a full push earns nobody a
    // point that hole - matches "no carry-overs on ties"). This works
    // the same for 2-team games (a tie just means nobody scores that
    // category) and for individual skins-style games with more entrants
    // (e.g. two players tied for lowest putts each get the point).
    function awardLowest(sums) {
      const awarded = sums.map(() => 0);
      if (!sums.every((v) => v != null)) return awarded;
      const min = Math.min(...sums);
      const winners = sums.filter((v) => v === min).length;
      if (winners < sums.length) {
        sums.forEach((v, i) => {
          if (v === min) awarded[i] = 1;
        });
      }
      return awarded;
    }

    let ptsAwarded = teamsThisHole.map(() => ({ score: 0, putt: 0 }));
    if (g.hasScore && !g.totalScoring) {
      const sums = teamRes.map((t) => t.scoreSum);
      awardLowest(sums).forEach((v, i) => (ptsAwarded[i].score = v));
    }
    if (g.hasPutts && !g.totalScoring) {
      const sums = teamRes.map((t) => t.puttSum);
      awardLowest(sums).forEach((v, i) => (ptsAwarded[i].putt = v));
    }

    teamsThisHole.forEach((team, ti) => {
      const pts = ptsAwarded[ti].score + ptsAwarded[ti].putt;
      team.forEach((p) => (playerPoints[p] += pts));
      if (teamPointsByTeamIdx) teamPointsByTeamIdx[ti] += pts;
    });

    holeResults.push({ teamsThisHole, teamRes, ptsAwarded, complete: teamRes.every((t) => (!g.hasScore || t.scoreSum != null) && (!g.hasPutts || t.puttSum != null)) });
  }

  // mulligan usage per player per segment
  const mulWindow = mulliganWindow(round.game);
  const mulligansUsed = Array(nPlayers)
    .fill(0)
    .map(() => [0, 0, 0]);
  for (let h = 0; h < 18; h++) {
    const seg = Math.floor(h / mulWindow);
    const hs = round.scores[h] || {};
    for (let p = 0; p < nPlayers; p++) {
      if (hs[p] && hs[p].mulligan) mulligansUsed[p][seg]++;
    }
  }

  return { playerPoints, playerTotalScore, playerTotalPutts, playerParPlayed, teamPointsByTeamIdx, holeResults, mulligansUsed };
}

  const computed = useMemo(() => computeRoundScoring(round), [round]);


  function playerRank() {
    if (!computed || !round) return [];
    const isTotalScoring = GAMES[round.game] && GAMES[round.game].totalScoring;
    return round.players
      .map((pl, i) => ({
        ...pl,
        idx: i,
        points: computed.playerPoints[i],
        score: computed.playerTotalScore[i],
        putts: computed.playerTotalPutts[i],
        relPar: computed.playerTotalScore[i] - computed.playerParPlayed[i],
      }))
      .sort((a, b) => {
        if (isTotalScoring) {
          if (a.score !== b.score) return a.score - b.score; // lowest strokes wins
          return a.putts - b.putts; // total putts breaks a tie
        }
        return b.points - a.points;
      });
  }

  // ---------- render helpers ----------
  function Header({ title, sub, onBack, right }) {
    return (
      <div className="gsc-header">
        <div className="gsc-header-row">
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {onBack && (
              <button className="gsc-btn gsc-btn-ghost" style={{ marginBottom: 6, padding: "5px 10px", fontSize: 12 }} onClick={onBack}>
                Back
              </button>
            )}
            <div className="gsc-title gsc-display">{title}</div>
            {sub && <div className="gsc-sub" style={{ whiteSpace: "nowrap" }}>{sub}</div>}
          </div>
          {right}
          <img
            src={LOGO_DATA_URI}
            alt="ForeScore logo"
            style={{ width: 68, height: "auto", objectFit: "contain", flexShrink: 0, alignSelf: "flex-start", marginRight: -8, marginTop: -2 }}
          />
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={<><span style={{ fontSize: 23 }}>ForeScore</span><br /><span style={{ fontSize: 11, opacity: 0.75, letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>Golf Game Scorecards</span></>}
          sub="Track games, teams &amp; points on the course"
        />
        <div className="gsc-body">
          <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.55, margin: "0 0 16px" }}>
            ForeScore's golf game scorecards tally and share your game live on the course, and settle who's buying at the 19th hole.
            <br />
            <br />
            To start a new round:
            <br />
            1) Select a game format below
            <br />
            2) Create your round details
            <br />
            3) Enter your strokes for each hole as you play
          </div>
          {activeRound && !activeRound.tournamentId && (
            <div className="gsc-card" style={{ border: "2px solid #B08D57" }}>
              <div className="gsc-label">Round in progress</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{activeRound.name}</div>
              <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                {GAMES[activeRound.game].name} - {activeRound.date}{activeRound.course ? " - " + activeRound.course : ""}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="gsc-btn gsc-btn-primary" style={{ flex: 1 }} onClick={resumeActiveRound}>Continue round</button>
                <button className="gsc-btn gsc-btn-outline" onClick={discardActiveRound}>Discard</button>
              </div>
            </div>
          )}
          {lastTournament && (
            <div className="gsc-card" style={{ border: "2px solid #B08D57" }}>
              <div className="gsc-label">Tournament in progress</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{lastTournament.name}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="gsc-btn gsc-btn-primary" style={{ flex: 1 }} onClick={() => openTournamentBoard(lastTournament.id)}>Continue tournament</button>
                <button className="gsc-btn gsc-btn-outline" onClick={discardTournament}>Discard</button>
              </div>
              <button
                className="gsc-link"
                style={{ marginTop: 10, fontSize: 12 }}
                disabled={tournamentBusy}
                onClick={() => addFoursomeToTournamentId(lastTournament.id)}
              >
                Add a foursome
              </button>
            </div>
          )}
          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Start a new round</div>

            <div className="gsc-label" style={{ marginTop: 4, marginBottom: 10, color: "#1B4332" }}>Team Game Formats</div>
            {Object.entries(GAMES)
              .filter(([key]) => key !== "dstreet" && key !== "swami" && !GAMES[key].tournamentOnly)
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
                  <button
                    className="gsc-link"
                    style={{ marginTop: 8, fontSize: 12 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openRules(key);
                    }}
                  >
                    View full rules
                  </button>
                </div>
              ))}

            <div className="gsc-label" style={{ marginTop: 14, marginBottom: 10, color: "#1B4332" }}>Individual Game Formats</div>
            {Object.entries(GAMES)
              .filter(([key]) => key === "swami" || key === "dstreet")
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
                  <button
                    className="gsc-link"
                    style={{ marginTop: 8, fontSize: 12 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openRules(key);
                    }}
                  >
                    View full rules
                  </button>
                </div>
              ))}
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6 }}>Tournaments</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>
              More than one foursome, all playing the same game. Everyone keeps their own scorecard, and can see how every foursome ranks along the way.
            </div>
            <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginBottom: 10 }} onClick={startTournamentCreateFlow}>
              Create a tournament
            </button>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Join a tournament</div>
            <div className="gsc-row">
              <input
                className="gsc-input gsc-mono"
                placeholder="TOURNAMENT CODE"
                value={tournamentJoinCode}
                onChange={(e) => setTournamentJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={tournamentBusy || !tournamentJoinCode} onClick={() => joinTournament(tournamentJoinCode)}>
                Join
              </button>
            </div>
            {tournamentErr && <div style={{ color: "#C1440E", fontSize: 13, marginTop: 8 }}>{tournamentErr}</div>}
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => setScreen("library")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Golf Games Library</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              Browse other popular team, individual, side, and just-for-fun formats worth trying on your next round.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => setScreen("library")}>
              Browse the library
            </button>
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => setScreen("about")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>About this App</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              What ForeScore tracks for you, and how a round works from tee to tally.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => setScreen("about")}>
              Read more
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label">Join an existing round</div>
            <div className="gsc-row" style={{ marginTop: 6 }}>
              <input className="gsc-input gsc-mono" placeholder="ROUND CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
              <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={busy || !joinCode} onClick={() => loadRound(joinCode)}>
                Open
              </button>
            </div>
            {err && <div style={{ color: "#C1440E", fontSize: 13, marginTop: 8 }}>{err}</div>}
            {recentCodes.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="gsc-label">Recent rounds this session</div>
                {recentCodes.map((c) => (
                  <div key={c.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee6cf" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</div>
                      <div className="gsc-mono" style={{ fontSize: 12, color: "#6b6b63" }}>{c.code}</div>
                    </div>
                    <button className="gsc-btn gsc-btn-outline" onClick={() => loadRound(c.code)}>Open</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="gsc-card">
            <div className="gsc-label">Or paste round data someone sent you</div>
            <div style={{ fontSize: 12, color: "#6b6b63", margin: "4px 0 8px" }}>
              If a round code isn't syncing, whoever's tracking scores can send you a block of text instead (via "Copy round data to share" on their screen). Paste it here.
            </div>
            <textarea className="gsc-input" style={{ minHeight: 70, fontFamily: "ui-monospace, monospace", fontSize: 11 }} placeholder="Paste round data here" value={pasteData} onChange={(e) => setPasteData(e.target.value)} />
            <button className="gsc-btn gsc-btn-primary" style={{ marginTop: 8 }} disabled={!pasteData.trim()} onClick={loadFromPastedData}>
              Load this round
            </button>
            {pasteMsg && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 6 }}>{pasteMsg}</div>}
          </div>

          {finishedRounds.length > 0 && (
            <div className="gsc-card">
              <div className="gsc-label">Finished rounds on this device</div>
              {finishedRounds.map((f) => (
                <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee6cf" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "#6b6b63" }}>{GAMES[f.game]?.name} - {f.date}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="gsc-btn gsc-btn-outline" disabled={busy} onClick={() => openFinishedRound(f.id)}>Reopen</button>
                    <button className="gsc-btn gsc-btn-outline" style={{ color: "#C1440E", borderColor: "#C1440E" }} onClick={() => requestDeleteFinishedRound(f)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {reopenErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8 }}>{reopenErr}</div>}
            </div>
          )}
          <div style={{ fontSize: 12, color: "#8a8a80", textAlign: "center", marginTop: 4 }}>
            Round data is stored so anyone with the round code can view or edit scores, when sync is working.
          </div>
        </div>
        {deleteRoundConfirm && (
          <div className="gsc-modal-backdrop" onClick={cancelDeleteFinishedRound}>
            <div className="gsc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gsc-modal-title">Delete this round?</div>
              <div className="gsc-modal-body">
                "{deleteRoundConfirm.name}" will be permanently deleted from this device. This can't be undone.
              </div>
              {deleteRoundErr && <div style={{ color: "#C1440E", fontSize: 13, marginBottom: 12 }}>{deleteRoundErr}</div>}
              <div className="gsc-modal-row">
                <button className="gsc-btn gsc-btn-outline" onClick={cancelDeleteFinishedRound}>Cancel</button>
                <button className="gsc-btn gsc-btn-primary" style={{ background: "#C1440E" }} disabled={deleteRoundBusy} onClick={confirmDeleteFinishedRound}>
                  {deleteRoundBusy ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        )}
        <RulesModal />
      </div>
    );
  }

  if (screen === "library") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Golf Games Library" sub="Other popular formats to try" onBack={() => setScreen("home")} />
        <div className="gsc-body">
          <div style={{ fontSize: 12, color: "#8a8a80", marginBottom: 4 }}>
            These are for reference only - they aren't trackable in this app, just handy to have on hand.
          </div>
          {GAME_LIBRARY.map((cat) => (
            <div key={cat.category} className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>{cat.category}</div>
              {cat.games.map((game, gi) => (
                <div key={game.name} style={{ marginBottom: gi === cat.games.length - 1 ? 0 : 16, paddingBottom: gi === cat.games.length - 1 ? 0 : 16, borderBottom: gi === cat.games.length - 1 ? "none" : "1px solid #eee6cf" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1B4332" }}>{game.name}</div>
                  <ul style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.55, margin: "6px 0 0", paddingLeft: 18 }}>
                    {game.lines.map((line, li) =>
                      typeof line === "string" ? (
                        <li key={li} style={{ marginBottom: 3 }}>{line}</li>
                      ) : (
                        <li key={li} style={{ marginBottom: 3, listStyle: line.text ? undefined : "none", marginLeft: line.text ? 0 : -18 }}>
                          {line.text}
                          <ul style={{ marginTop: 3 }}>
                            {line.sub.map((s, si) => (
                              <li key={si} style={{ marginBottom: 2 }}>{s}</li>
                            ))}
                          </ul>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "about") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="About this App" sub="What ForeScore does for you" onBack={() => setScreen("home")} />
        <div className="gsc-body">
          <div className="gsc-card">
            <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 14px" }}>
                The ForeScore golf games scorecard and tracking app handles and shares the detail of the various golf games you play within your group live on the course so you don't have to: game type, rules, players, teams, scoring, max scores, course pars, handicaps, mulligans, dates, and prizes. You no longer have to do it in your head or on a paper scorecard.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Before you tee off, you can quickly set the details that matter for your group. Just pick a game and enter the details before the round. Then each player enters their own scores during play (or one person can enter for everyone), and everyone can see where things stand as you go. When the round wraps up, points are calculated and saved automatically.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Playing with more than one foursome? Tournaments let every foursome play the same game under the same settings, so their scores are directly comparable. Everyone still keeps their own scorecard, but a shared leaderboard shows how all the foursomes stack up against each other as the round goes on.
              </p>
              <p style={{ margin: 0 }}>
                No more arguing about the rules, redoing the math, or waiting to find out who owes who at the 19th hole, it's all tracked right here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "setup") {
    const g = GAMES[gameKey];
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={activeTournament ? activeTournament.name : g.name}
          sub={activeTournament ? `${g.name} - Foursome setup` : "Round setup"}
          onBack={() => {
            if (activeTournament) setActiveTournament(null);
            setScreen("home");
          }}
        />
        <div className="gsc-body">
          <button className="gsc-link" style={{ marginBottom: 12, fontSize: 13 }} onClick={() => openRules(gameKey)}>
            View full rules for {g.name}
          </button>
          {activeTournament && (
            <div className="gsc-card" style={{ border: "2px solid #B08D57" }}>
              <div className="gsc-label" style={{ marginBottom: 6 }}>Tournament settings (locked)</div>
              <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.5 }}>
                {activeTournament.course && <>Course: {activeTournament.course}<br /></>}
                Max over par: {activeTournament.cfg.maxOver} - Max putts: {activeTournament.cfg.maxPutts} - Mulligans: {activeTournament.cfg.mulliganSegment} per {mulliganWindow(activeTournament.game)} holes
                <br />
                Prize: {activeTournament.cfg.prize}
                <br />
                Ranked by: strokes and putts (tracked separately, lowest wins each) - {GAMES[activeTournament.game].bestBall ? "best-ball (lowest single score) per hole" : "combined (all 4 players added) per hole"}
              </div>
              <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => setTournamentRulesOpen(true)}>
                View full tournament scoring rules
              </button>
              <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 8 }}>
                Every foursome in this tournament plays under these same settings so the leaderboard stays fair. Tournament code: <span className="gsc-mono" style={{ fontWeight: 700 }}>{activeTournament.id}</span>
              </div>
            </div>
          )}
          <div className="gsc-card">
            <div className="gsc-label">{activeTournament ? "Foursome name" : "Round name"}</div>
            <input
              className="gsc-input"
              placeholder={activeTournament ? "e.g. Foursome 1" : g.name + " at ..."}
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
            />
            {!activeTournament && (
              <div className="gsc-field" style={{ marginTop: 12 }}>
                <div className="gsc-label">Date</div>
                <input className="gsc-input" type="date" value={roundDate} onChange={(e) => setRoundDate(e.target.value)} />
              </div>
            )}
          </div>

          {!activeTournament && (
          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Game variables</div>
            {g.hasScore && (
              <div className="gsc-field">
                <div className="gsc-label">Max score over par per hole</div>
                <input
                  className="gsc-input"
                  type="number"
                  min="0"
                  value={cfg.maxOver}
                  onChange={(e) => {
                    const raw = cleanNumericText(e.target.value);
                    setCfg({ ...cfg, maxOver: raw === "" ? "" : Number(raw) });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") setCfg((c) => ({ ...c, maxOver: 3 }));
                  }}
                />
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Max putts per hole</div>
              <input
                className="gsc-input"
                type="number"
                min="1"
                value={cfg.maxPutts}
                onChange={(e) => {
                  const raw = cleanNumericText(e.target.value);
                  setCfg({ ...cfg, maxPutts: raw === "" ? "" : Number(raw) });
                }}
                onBlur={(e) => {
                  if (e.target.value === "") setCfg((c) => ({ ...c, maxPutts: 3 }));
                }}
              />
            </div>
            {g.rotates !== undefined && g.hasScore && (
              <div className="gsc-field">
                <div className="gsc-label">Mulligans per player, per {mulliganWindow(gameKey)} holes</div>
                <input
                  className="gsc-input"
                  type="number"
                  min="0"
                  value={cfg.mulliganSegment}
                  onChange={(e) => {
                    const raw = cleanNumericText(e.target.value);
                    setCfg({ ...cfg, mulliganSegment: raw === "" ? "" : Number(raw) });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") setCfg((c) => ({ ...c, mulliganSegment: 1 }));
                  }}
                />
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Prize / stakes</div>
              <input className="gsc-input" value={cfg.prize} onChange={(e) => setCfg({ ...cfg, prize: e.target.value })} />
            </div>
            <div className="gsc-field">
              <div className="gsc-label">Venmo handle for settling up (optional)</div>
              <input className="gsc-input" placeholder="@your-venmo" value={cfg.venmo || ""} onChange={(e) => setCfg({ ...cfg, venmo: e.target.value })} />
            </div>
          </div>
          )}

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Players</div>
            {players.map((p, i) => (
              <div className="gsc-row" key={i} style={{ marginBottom: 8 }}>
                <div style={{ flex: "0 0 26px", fontWeight: 800, color: "#1B4332", paddingTop: 9 }}>{LETTERS[i]}</div>
                <input className="gsc-input" placeholder={`Player ${LETTERS[i]} name`} value={p.name} onChange={(e) => updatePlayer(i, "name", e.target.value)} />
                <input className="gsc-input" style={{ flex: "0 0 70px" }} placeholder="HCP" value={p.hcp} onChange={(e) => updatePlayer(i, "hcp", e.target.value)} />
              </div>
            ))}
            {gameKey === "seabluffe" && (
              <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8, lineHeight: 1.5 }}>
                Rotation: Holes 1-6 {LETTERS[0]}+{LETTERS[1]} vs {LETTERS[2]}+{LETTERS[3]} - Holes 7-12 {LETTERS[0]}+{LETTERS[2]} vs {LETTERS[1]}+{LETTERS[3]} - Holes 13-18 {LETTERS[0]}+{LETTERS[3]} vs {LETTERS[1]}+{LETTERS[2]}
              </div>
            )}
            {(gameKey === "ponto" || gameKey === "beachside") && (
              <div style={{ marginTop: 10 }}>
                <div className="gsc-label">Teams</div>
                <div className="gsc-row">
                  <select className="gsc-input" value={pontoPairing[0][1]} onChange={(e) => {
                    const partner = Number(e.target.value);
                    const remaining = [0, 1, 2, 3].filter((x) => x !== 0 && x !== partner);
                    setPontoPairing([[0, partner], remaining]);
                  }}>
                    {[1, 2, 3].map((x) => (
                      <option key={x} value={x}>{LETTERS[0]} + {LETTERS[x]}</option>
                    ))}
                  </select>
                </div>
                <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 6 }}>
                  Team 1: {LETTERS[pontoPairing[0][0]]}+{LETTERS[pontoPairing[0][1]]} vs Team 2: {LETTERS[pontoPairing[1][0]]}+{LETTERS[pontoPairing[1][1]]}
                </div>
              </div>
            )}
          </div>

          {!activeTournament && (
          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Course</div>
            {savedCourses.length > 0 && (
              <div className="gsc-field">
                <div className="gsc-label">Load a saved course</div>
                <select className="gsc-input" defaultValue="" onChange={(e) => e.target.value && applySavedCourse(e.target.value)}>
                  <option value="">Choose a course you've saved before...</option>
                  {savedCourses.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Course name</div>
              <input className="gsc-input" placeholder="e.g. Seabluffe Golf Links" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            </div>
            <div style={{ fontSize: 12, color: "#6b6b63", lineHeight: 1.5, marginBottom: 10 }}>
              There's no public GHIN API this app can connect to directly, so par can't be pulled in automatically. The{" "}
              <a className="gsc-link" href="https://ncrdb.usga.org/" target="_blank" rel="noreferrer">USGA Course Rating Database</a>{" "}
              lets you look up any rated course's official par and hole handicaps - open it, find your course and tees, then enter the par below. Save it here once and it'll be ready to reuse next time you play that course.
            </div>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Par per hole</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {par.map((v, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, textAlign: "center", color: "#6b6b63" }}>H{i + 1}</div>
                  <input
                    className="gsc-input gsc-mono"
                    style={{ padding: "6px 2px", textAlign: "center" }}
                    type="number"
                    value={v}
                    onChange={(e) => {
                      // Strip any leading zeros (e.g. "02" -> "2"), and keep
                      // a cleared field truly empty rather than snapping to
                      // 0 - forcing it to 0 is what let the next keystroke
                      // land on top of a phantom "0" and produce "02".
                      const raw = e.target.value.replace(/^0+(?=\d)/, "");
                      const next = [...par];
                      next[i] = raw === "" ? "" : Number(raw);
                      setPar(next);
                    }}
                    onBlur={(e) => {
                      // On leaving the field, fill back in a sensible
                      // default if it was left empty.
                      if (e.target.value === "") {
                        const next = [...par];
                        next[i] = 4;
                        setPar(next);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8 }}>Total par: {par.reduce((a, b) => a + (Number(b) || 0), 0)}</div>
            <button className="gsc-btn gsc-btn-outline" style={{ marginTop: 10 }} onClick={() => saveCourseToIndex(courseName, par)}>
              Save this course for next time
            </button>
            {courseMsg && (
              <div style={{ fontSize: 12, color: courseMsg.startsWith("Couldn't") ? "#C1440E" : "#B08D57", marginTop: 8 }}>
                {courseMsg}{" "}
                {courseMsg.startsWith("Couldn't") && (
                  <button className="gsc-link" onClick={() => saveCourseToIndex(courseName, par)}>Try again</button>
                )}
              </div>
            )}
          </div>
          )}

          {err && <div style={{ color: "#C1440E", marginBottom: 10 }}>{err}</div>}
          {storageBroken && (
            <div style={{ background: "#F8F1E4", color: "#8a6a2f", fontSize: 12, padding: "8px 10px", borderRadius: 8, marginBottom: 10 }}>
              Storage isn't responding right now. Your round will still be created and playable this session -{" "}
              <button className="gsc-link" onClick={retrySync}>Retry storage</button>.
            </div>
          )}
          {!storageBroken && storageWarning && <div style={{ color: "#B08D57", fontSize: 13, marginBottom: 10 }}>{storageWarning}</div>}
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} disabled={busy} onClick={finishSetup}>
            {busy ? "Saving..." : activeTournament ? "Add my foursome & start playing" : "Create round & get code"}
          </button>
        </div>
        <RulesModal />
        <TournamentRulesModal />
      </div>
    );
  }

  if (screen === "tournamentCreate") {
    const tg = GAMES[tournamentGameKey];
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Create a Tournament" sub="Set it up once, everyone plays the same way" onBack={() => setScreen("home")} />
        <div className="gsc-body">
          <div className="gsc-card">
            <div className="gsc-label">Tournament name</div>
            <input className="gsc-input" placeholder="e.g. Club Championship" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} />
            <div className="gsc-field" style={{ marginTop: 12 }}>
              <div className="gsc-label">Date</div>
              <input className="gsc-input" type="date" value={tournamentDate} onChange={(e) => setTournamentDate(e.target.value)} />
            </div>
            <div className="gsc-field" style={{ marginTop: 12 }}>
              <div className="gsc-label">Course name</div>
              <input className="gsc-input" placeholder="e.g. Seabluffe Golf Links" value={tournamentCourseName} onChange={(e) => setTournamentCourseName(e.target.value)} />
            </div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Game (every foursome plays this)</div>
            {TOURNAMENT_GAME_KEYS.map((key) => (
              <div
                key={key}
                className="gsc-card gsc-game-card"
                style={{ marginBottom: 10, border: tournamentGameKey === key ? "2px solid #B08D57" : undefined }}
                onClick={() => {
                  setTournamentGameKey(key);
                  setTournamentCfg({ ...GAMES[key].defaults });
                  setTournamentPar(DEFAULT_PAR);
                }}
              >
                <div className="gsc-game-title">{GAMES[key].name}</div>
                <div className="gsc-tag">{GAMES[key].tag}</div>
                <div style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{GAMES[key].desc}</div>
              </div>
            ))}
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6 }}>How foursomes are ranked</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              Strokes and putts are tracked as two separate rankings - lowest total wins each. {tg.bestBall
                ? "For Beachside Best-Ball, each hole counts the single lowest strokes and single lowest putts among all 4 players in the foursome."
                : "Each hole counts all 4 players' strokes added together, and all 4 players' putts added together."}
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => setTournamentRulesOpen(true)}>
              View full tournament scoring rules
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Shared game variables</div>
            {tg.hasScore && (
              <div className="gsc-field">
                <div className="gsc-label">Max score over par per hole</div>
                <input
                  className="gsc-input"
                  type="number"
                  min="0"
                  value={tournamentCfg.maxOver}
                  onChange={(e) => {
                    const raw = cleanNumericText(e.target.value);
                    setTournamentCfg({ ...tournamentCfg, maxOver: raw === "" ? "" : Number(raw) });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") setTournamentCfg((c) => ({ ...c, maxOver: 3 }));
                  }}
                />
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Max putts per hole</div>
              <input
                className="gsc-input"
                type="number"
                min="1"
                value={tournamentCfg.maxPutts}
                onChange={(e) => {
                  const raw = cleanNumericText(e.target.value);
                  setTournamentCfg({ ...tournamentCfg, maxPutts: raw === "" ? "" : Number(raw) });
                }}
                onBlur={(e) => {
                  if (e.target.value === "") setTournamentCfg((c) => ({ ...c, maxPutts: 3 }));
                }}
              />
            </div>
            {tg.hasScore && (
              <div className="gsc-field">
                <div className="gsc-label">Mulligans per player, per {mulliganWindow(tournamentGameKey)} holes</div>
                <input
                  className="gsc-input"
                  type="number"
                  min="0"
                  value={tournamentCfg.mulliganSegment}
                  onChange={(e) => {
                    const raw = cleanNumericText(e.target.value);
                    setTournamentCfg({ ...tournamentCfg, mulliganSegment: raw === "" ? "" : Number(raw) });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") setTournamentCfg((c) => ({ ...c, mulliganSegment: 1 }));
                  }}
                />
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Prize / stakes</div>
              <input className="gsc-input" value={tournamentCfg.prize || ""} onChange={(e) => setTournamentCfg({ ...tournamentCfg, prize: e.target.value })} />
            </div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6 }}>Par per hole</div>
            <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10 }}>Every foursome in this tournament plays the same course par.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
              {tournamentPar.map((v, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, textAlign: "center", color: "#6b6b63" }}>H{i + 1}</div>
                  <input
                    className="gsc-input gsc-mono"
                    style={{ padding: "6px 2px", textAlign: "center" }}
                    type="number"
                    value={v}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/^0+(?=\d)/, "");
                      const next = [...tournamentPar];
                      next[i] = raw === "" ? "" : Number(raw);
                      setTournamentPar(next);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        const next = [...tournamentPar];
                        next[i] = 4;
                        setTournamentPar(next);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8 }}>Total par: {tournamentPar.reduce((a, b) => a + (Number(b) || 0), 0)}</div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label">Number of foursomes</div>
            <input
              className="gsc-input"
              type="number"
              min="1"
              max="20"
              value={tournamentFoursomeCount}
              onChange={(e) => {
                const raw = cleanNumericText(e.target.value);
                setTournamentFoursomeCount(raw === "" ? "" : Number(raw));
              }}
              onBlur={(e) => {
                if (e.target.value === "") setTournamentFoursomeCount(2);
              }}
            />
            <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8 }}>
              You'll add each foursome's name and 4 players next. More foursomes can always join later with the tournament code.
            </div>
          </div>

          {tournamentErr && <div style={{ color: "#C1440E", marginBottom: 10 }}>{tournamentErr}</div>}
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} onClick={proceedToFoursomeRoster}>
            Next: add foursomes
          </button>
        </div>
        <TournamentRulesModal />
      </div>
    );
  }

  if (screen === "tournamentRoster") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={tournamentName || "New Tournament"} sub="Add each foursome" onBack={() => setScreen("tournamentCreate")} />
        <div className="gsc-body">
          <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 12 }}>
            Enter each foursome's name and its 4 players. You can always add more foursomes later with the tournament code.
          </div>
          {tournamentFoursomesDraft.map((f, fi) => (
            <div key={fi} className="gsc-card">
              <div className="gsc-label">Foursome name</div>
              <input className="gsc-input" style={{ marginBottom: 12 }} value={f.name} onChange={(e) => updateFoursomeDraftName(fi, e.target.value)} />
              <div className="gsc-label" style={{ marginBottom: 6 }}>Players</div>
              {f.players.map((p, pi) => (
                <div className="gsc-row" key={pi} style={{ marginBottom: 8 }}>
                  <div style={{ flex: "0 0 26px", fontWeight: 800, color: "#1B4332", paddingTop: 9 }}>{LETTERS[pi]}</div>
                  <input
                    className="gsc-input"
                    placeholder={`Player ${LETTERS[pi]} name`}
                    value={p.name}
                    onChange={(e) => updateFoursomeDraftPlayer(fi, pi, "name", e.target.value)}
                  />
                  <input
                    className="gsc-input"
                    style={{ flex: "0 0 70px" }}
                    placeholder="HCP"
                    value={p.hcp}
                    onChange={(e) => updateFoursomeDraftPlayer(fi, pi, "hcp", e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
          {tournamentErr && <div style={{ color: "#C1440E", marginBottom: 10 }}>{tournamentErr}</div>}
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} disabled={tournamentBusy} onClick={finishTournamentCreate}>
            {tournamentBusy ? "Creating..." : `Create tournament with ${tournamentFoursomesDraft.length} foursome${tournamentFoursomesDraft.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    );
  }

  if (screen === "tournamentBoard") {
    const t = board && board.tournament;

    function renderFoursomeRow(row, idx, valueKey, holesKey) {
      return (
        <div
          key={row.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #eee6cf",
            background: round && row.id === round.id ? "#F0EEE3" : undefined,
            cursor: row.error ? "default" : "pointer",
          }}
          onClick={() => !row.error && loadRound(row.id)}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {idx + 1}. {row.name} {round && row.id === round.id && <span className="gsc-chip gsc-lead">YOU</span>}
            </div>
            <div style={{ fontSize: 12, color: "#6b6b63" }}>{row.error ? `Couldn't load (${row.error})` : `Thru ${row[holesKey]} holes`}</div>
            {!row.error && (
              <button
                className="gsc-link"
                style={{ fontSize: 11, marginTop: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditFoursome(row.id, row.round);
                }}
              >
                Edit foursome
              </button>
            )}
          </div>
          <div className="gsc-mono" style={{ fontWeight: 700, fontSize: 15 }}>
            {row.error ? "-" : row[valueKey]}
          </div>
        </div>
      );
    }

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={t ? t.name : "Tournament Leaderboard"}
          sub={t ? `${GAMES[t.game].name} - strokes and putts ranked separately` : ""}
          onBack={() => setScreen(round ? "card" : "home")}
        />
        <div className="gsc-body">
          {t && (
            <div className="gsc-card" style={{ textAlign: "center" }}>
              <div className="gsc-label" style={{ marginBottom: 6 }}>Tournament code</div>
              <div className="gsc-code" style={{ background: "#1B4332", color: "#F3EFE0", fontSize: 18, padding: "8px 16px" }}>{t.id}</div>
              <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 8 }}>Share this so more foursomes can join</div>
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={() => startTournamentFoursome(t)}>
                Add another foursome
              </button>
            </div>
          )}
          <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginBottom: 12 }} disabled={boardLoading} onClick={() => t && loadTournamentBoard(t.id)}>
            {boardLoading ? "Refreshing..." : "Refresh leaderboard"}
          </button>
          {boardErr && <div style={{ color: "#C1440E", marginBottom: 10 }}>{boardErr}</div>}
          {board && t && (
            <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 4 }}>
              {GAMES[t.game].bestBall
                ? "Best-ball scoring: each foursome's stroke and putt totals are the single lowest score among all 4 players on each hole."
                : "Combined scoring: each foursome's stroke and putt totals are all 4 players' scores added together."}
            </div>
          )}
          {board && t && (
            <button className="gsc-link" style={{ fontSize: 12, marginBottom: 12 }} onClick={() => setTournamentRulesOpen(true)}>
              View full tournament scoring rules
            </button>
          )}
          {board && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Ranked by Strokes</div>
              {board.strokesRanked.length === 0 && <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes have joined yet.</div>}
              {board.strokesRanked.map((row, idx) => renderFoursomeRow(row, idx, "totalStrokes", "strokeHoles"))}
            </div>
          )}
          {board && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Ranked by Putts</div>
              {board.puttsRanked.length === 0 && <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes have joined yet.</div>}
              {board.puttsRanked.map((row, idx) => renderFoursomeRow(row, idx, "totalPutts", "puttHoles"))}
            </div>
          )}
        </div>
        <EditFoursomeModal />
        <TournamentRulesModal />
      </div>
    );
  }

  if (screen === "card" && round && computed) {
    const g = GAMES[round.game];
    const parH = round.par[holeIdx] ?? 4;
    const hs = round.scores[holeIdx] || {};
    const seg = Math.floor(holeIdx / 6);
    const mulSeg = Math.floor(holeIdx / mulliganWindow(round.game));
    const teamsThisHole = round.game === "seabluffe" ? SEABLUFFE_PAIRINGS[seg] : round.teams;
    const hr = computed.holeResults[holeIdx];
    const ranks = playerRank();
    const foursomeTotals = g.singleTeam ? computeTournamentFoursomeTotals(round) : null;


    // Raw totals for the full 18-hole grid's Total and +/- Par rows - these
    // sum exactly what's shown in each cell (uncapped, as entered), and only
    // count holes that have actually been played so an in-progress round
    // doesn't show a misleading total.
    const gridTotals = round.players.map((_, i) => {
      let sSum = 0, sCount = 0, pSum = 0, pCount = 0, relPar = 0;
      for (let h = 0; h < 18; h++) {
        const e = (round.scores[h] || {})[i] || {};
        if (e.strokes != null && e.strokes !== "") {
          const s = Number(e.strokes);
          sSum += s;
          sCount++;
          relPar += s - (round.par[h] ?? 4);
        }
        if (e.putts != null && e.putts !== "") {
          pSum += Number(e.putts);
          pCount++;
        }
      }
      return { sSum, sCount, pSum, pCount, relPar };
    });
    const formatRelPar = (n) => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={round.name}
          sub={`${g.name} - ${round.date}${round.course ? " - " + round.course : ""}`}
          onBack={requestLeaveRound}
          right={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div className="gsc-code">{round.id}</div>
              <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => openRules(round.game)}>
                Rules
              </button>
              {round.tournamentId && (
                <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => openTournamentBoard(round.tournamentId)}>
                  Leaderboard
                </button>
              )}
              {round.tournamentId && (
                <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => addFoursomeToTournamentId(round.tournamentId)}>
                  Add foursome
                </button>
              )}
              {round.tournamentId && (
                <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => openEditFoursome(round.id, round)}>
                  Edit foursome
                </button>
              )}
            </div>
          }
        />
        {storageBroken ? (
          <div style={{ background: "#F8F1E4", color: "#8a6a2f", fontSize: 12, padding: "8px 16px", textAlign: "center" }}>
            Storage isn't responding right now, so nothing is saving automatically. Your scores are fine for this session -{" "}
            <button className="gsc-link" onClick={retrySync}>Retry storage</button>
            {" "}or tap "Copy round data to share" below as a backup.
          </div>
        ) : (
          storageWarning && (
            <div style={{ background: "#F8F1E4", color: "#8a6a2f", fontSize: 12, padding: "8px 16px", textAlign: "center" }}>{storageWarning}</div>
          )
        )}
        <div style={{ background: "#EBF0EC", fontSize: 11, padding: "5px 16px", textAlign: "center", color: "#4A6C5A" }}>
          {storageBroken ? "Keep playing - this tab has your scores." : "Saved automatically - close and reopen this app any time to pick back up here."}
        </div>
        <div className="gsc-hole-strip">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={`gsc-hole-pip ${i === holeIdx ? "active" : ""} ${computed.holeResults[i].complete ? "done" : ""}`} onClick={() => setHoleIdx(i)}>
              {i + 1}
            </div>
          ))}
        </div>
        <div className="gsc-body">
          <div className="gsc-card">
            <div className="gsc-hole-nav">
              <button className="gsc-btn gsc-btn-outline" disabled={holeIdx === 0} onClick={() => setHoleIdx((h) => h - 1)}>Prev</button>
              <div style={{ textAlign: "center" }}>
                <div className="gsc-hole-big">Hole {holeIdx + 1}</div>
                <div className="gsc-par-badge">Par {parH} - max {parH + round.cfg.maxOver}</div>
                {round.game === "seabluffe" && (
                  <div style={{ fontSize: 12, color: "#B08D57", fontWeight: 700, marginTop: 4 }}>
                    {LETTERS[teamsThisHole[0][0]]}+{LETTERS[teamsThisHole[0][1]]} vs {LETTERS[teamsThisHole[1][0]]}+{LETTERS[teamsThisHole[1][1]]}
                  </div>
                )}
              </div>
              <button className="gsc-btn gsc-btn-outline" disabled={holeIdx === 17} onClick={() => setHoleIdx((h) => h + 1)}>Next</button>
            </div>

            {round.players.map((p, i) => {
              const teamIdxInHole = teamsThisHole.findIndex((t) => t.includes(i));
              const cls = TEAM_CLASS[teamIdxInHole % 4];
              const e = hs[i] || {};
              const mulLeft = g.hasScore ? (round.cfg.mulliganSegment ?? 1) - computed.mulligansUsed[i][mulSeg] : null;
              return (
                <div key={i} className={`gsc-player-row ${cls}`}>
                  <div className="gsc-player-name">
                    <span style={{ color: "#B08D57" }}>{LETTERS[i]} - </span>
                    {p.name}
                    {p.hcp && <span className="gsc-hcp">HCP {p.hcp}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 22, marginTop: 8, flexWrap: "wrap" }}>
                    {g.hasScore && (
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3 }}>STROKES</div>
                        <div className="gsc-stepper">
                          <button onClick={() => updateHoleEntry(i, "strokes", Math.max(1, (Number(e.strokes) || parH) - 1))}>-</button>
                          <div className="gsc-stepper-val">{e.strokes ?? "-"}</div>
                          <button onClick={() => updateHoleEntry(i, "strokes", (Number(e.strokes) || parH - 1) + 1)}>+</button>
                        </div>
                      </div>
                    )}
                    {g.hasPutts && (
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3 }}>PUTTS</div>
                        <div className="gsc-stepper">
                          <button onClick={() => updateHoleEntry(i, "putts", Math.max(0, (Number(e.putts) || 2) - 1))}>-</button>
                          <div className="gsc-stepper-val">{e.putts ?? "-"}</div>
                          <button onClick={() => updateHoleEntry(i, "putts", (Number(e.putts) || 1) + 1)}>+</button>
                        </div>
                      </div>
                    )}
                    {mulLeft !== null && (
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3 }}>MULLIGAN ({Math.max(0, mulLeft)} left)</div>
                        <label className="gsc-mull">
                          <input type="checkbox" checked={!!e.mulligan} disabled={!e.mulligan && mulLeft <= 0} onChange={(ev) => updateHoleEntry(i, "mulligan", ev.target.checked)} />
                          used
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: 6 }}>
              {teamsThisHole.map((team, ti) => {
                const label = g.singleTeam ? "Foursome" : team.map((p) => LETTERS[p]).join("+");
                const r = hr.teamRes[ti];
                const pts = hr.ptsAwarded[ti];
                return (
                  <div key={ti} style={{ fontSize: 12, marginTop: 4 }}>
                    <b>{label}</b>{" "}
                    {g.hasScore && <span>{g.bestBall ? "best strokes" : g.singleTeam ? "combined strokes" : "score"} {r.scoreSum ?? "-"} </span>}
                    {g.hasPutts && <span>{g.bestBall ? "best putts" : g.singleTeam ? "combined putts" : "putts"} {r.puttSum ?? "-"} </span>}
                    {(pts.score > 0 || pts.putt > 0) && <span className="gsc-chip gsc-lead">+{pts.score + pts.putt} pt</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {g.singleTeam && (
            <div className="gsc-card" style={{ border: "2px solid #B08D57" }}>
              <div className="gsc-label" style={{ marginBottom: 8 }}>Foursome {g.bestBall ? "Best-Ball" : "Combined"} Totals</div>
              <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
                {g.bestBall ? "Best-ball" : "Combined"} strokes: <b>{foursomeTotals.totalStrokes}</b> (thru {foursomeTotals.strokeHoles} holes)
                <br />
                {g.bestBall ? "Best-ball" : "Combined"} putts: <b>{foursomeTotals.totalPutts}</b> (thru {foursomeTotals.puttHoles} holes)
              </div>
              <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 8 }}>
                This is what counts on the tournament leaderboard - check the Leaderboard link above to see how this foursome ranks against the others.
              </div>
            </div>
          )}

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>Standings</div>
            {ranks.map((p, idx) => (
              <div key={p.idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #eee6cf", fontSize: 13 }}>
                <div>
                  {LETTERS[p.idx]} - {p.name}
                  {g.totalScoring && holeIdx === 17 && hr.complete && idx === 0 && <span className="gsc-chip gsc-lead">WINNER</span>}
                  {!g.singleTeam && !g.totalScoring && holeIdx === 17 && hr.complete && idx < 2 && <span className="gsc-chip gsc-lead">WIN</span>}
                  {!g.singleTeam && !g.totalScoring && holeIdx === 17 && hr.complete && idx >= ranks.length - 2 && <span className="gsc-chip gsc-loss">LOSS</span>}
                </div>
                <div className="gsc-mono" style={{ fontWeight: 700 }}>
                  {!g.singleTeam && !g.totalScoring && <>{p.points} pts </>}
                  <span style={{ fontWeight: 400, color: "#6b6b63", whiteSpace: "nowrap" }}>({p.score}str/{p.putts}put/{formatRelPar(p.relPar)})</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 13 }}>
              <b>Prize:</b> {round.cfg.prize}
              {round.cfg.venmo && (
                <div style={{ marginTop: 6 }}>
                  <a className="gsc-btn gsc-btn-gold" style={{ display: "inline-block", textDecoration: "none" }} href={`https://venmo.com/${round.cfg.venmo.replace("@", "")}`} target="_blank" rel="noreferrer">
                    Settle up on Venmo
                  </a>
                </div>
              )}
            </div>
          </div>

          <button className="gsc-link" onClick={() => setShowGrid((s) => !s)}>{showGrid ? "Hide" : "Show"} full 18-hole grid</button>
          {showGrid && (
            <div className="gsc-card" style={{ overflowX: "auto", marginTop: 10 }}>
              <table className="gsc-grid">
                <thead>
                  <tr>
                    <th>Hole</th>
                    <th>Par</th>
                    {round.players.map((p, i) => (
                      <th key={i}>{LETTERS[i]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 18 }).map((_, h) => (
                    <tr key={h} onClick={() => setHoleIdx(h)} style={{ cursor: "pointer", background: h === holeIdx ? "#F0EEE3" : undefined }}>
                      <td>{h + 1}</td>
                      <td>{round.par[h]}</td>
                      {round.players.map((_, i) => {
                        const e = (round.scores[h] || {})[i] || {};
                        return (
                          <td key={i}>
                            {g.hasScore ? (e.strokes ?? "-") : ""}
                            {g.hasScore && g.hasPutts ? "/" : ""}
                            {g.hasPutts ? (e.putts ?? "-") : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 700, background: "#F0EEE3" }}>
                    <td colSpan={2}>Total</td>
                    {round.players.map((_, i) => {
                      const t = gridTotals[i];
                      return (
                        <td key={i}>
                          {g.hasScore ? (t.sCount ? t.sSum : "-") : ""}
                          {g.hasScore && g.hasPutts ? "/" : ""}
                          {g.hasPutts ? (t.pCount ? t.pSum : "-") : ""}
                        </td>
                      );
                    })}
                  </tr>
                  {g.hasScore && (
                    <tr style={{ fontWeight: 700, background: "#F8F1E4" }}>
                      <td colSpan={2}>+/- Par</td>
                      {round.players.map((_, i) => {
                        const t = gridTotals[i];
                        return <td key={i}>{t.sCount ? formatRelPar(t.relPar) : "-"}</td>;
                      })}
                    </tr>
                  )}
                  {!g.totalScoring && (
                    <tr style={{ fontWeight: 700, background: "#EBF0EC" }}>
                      <td colSpan={2}>Points</td>
                      {round.players.map((_, i) => (
                        <td key={i}>{computed.playerPoints[i]}</td>
                      ))}
                    </tr>
                  )}
                  <tr style={{ fontWeight: 700, background: "#F0EEE3" }}>
                    <td colSpan={2}>Handicap</td>
                    {round.players.map((p, i) => (
                      <td key={i}>{p.hcp !== "" && p.hcp != null ? p.hcp : "-"}</td>
                    ))}
                  </tr>
                  <tr style={{ fontWeight: 700, background: "#F8F1E4" }}>
                    <td colSpan={2}>Net Strokes</td>
                    {round.players.map((p, i) => {
                      const t = gridTotals[i];
                      const hcpNum = p.hcp !== "" && p.hcp != null && !isNaN(Number(p.hcp)) ? Number(p.hcp) : null;
                      const net = g.hasScore && t.sCount && hcpNum != null ? t.sSum - hcpNum : null;
                      return <td key={i}>{net != null ? net : "-"}</td>;
                    })}
                  </tr>
                </tfoot>
              </table>
              <div style={{ fontSize: 11, color: "#6b6b63", marginTop: 6 }}>Cell shows strokes/putts. Tap a row to jump to that hole. Total, +/- Par, and Net Strokes only count holes played so far. Net Strokes = Total strokes minus Handicap.</div>
            </div>
          )}

          <div style={{ fontSize: 12, color: "#8a8a80", textAlign: "center", marginTop: 16 }}>
            Share code <b className="gsc-mono">{round.id}</b> with your group so everyone can enter or view scores.
          </div>
          <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => copyRoundData(round)}>
            Copy round data to share
          </button>
          {copyMsg && <div style={{ fontSize: 12, color: "#B08D57", textAlign: "center", marginTop: 6 }}>{copyMsg}</div>}
          {copyFallbackText && (
            <textarea
              readOnly
              className="gsc-input"
              style={{ minHeight: 70, fontFamily: "ui-monospace, monospace", fontSize: 10, marginTop: 8 }}
              value={copyFallbackText}
              onFocus={(e) => e.target.select()}
            />
          )}
          <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginTop: 14 }} disabled={busy} onClick={() => archiveAndExitRound(round)}>
            {busy ? "Saving..." : "Finish & exit this round"}
          </button>
          {archiveErr && <div style={{ color: "#C1440E", fontSize: 12, textAlign: "center", marginTop: 8 }}>{archiveErr}</div>}
          <div style={{ fontSize: 11, color: "#8a8a80", textAlign: "center", marginTop: 6 }}>
            This saves it to "Finished rounds" on the home screen - it won't be deleted.
          </div>
        </div>
        {confirmLeaveOpen && (
          <div className="gsc-modal-backdrop" onClick={cancelLeaveRound}>
            <div className="gsc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gsc-modal-title">Leave this round?</div>
              <div className="gsc-modal-body">
                Your scores are saved, and you can pick up right where you left off from "Continue round" on the home screen. Are you sure you want to leave?
              </div>
              <div className="gsc-modal-row">
                <button className="gsc-btn gsc-btn-outline" onClick={cancelLeaveRound}>No, stay</button>
                <button className="gsc-btn gsc-btn-primary" onClick={confirmLeaveRound}>Yes, leave</button>
              </div>
            </div>
          </div>
        )}
        <RulesModal />
        <EditFoursomeModal />
      </div>
    );
  }

  return (
    <div className="gsc">
      <style>{STYLE}</style>
      <div className="gsc-empty">Loading...</div>
    </div>
  );
}
