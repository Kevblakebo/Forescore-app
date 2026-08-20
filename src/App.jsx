import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Home as HomeIcon, Flag as FlagIcon, Trophy as TrophyIcon, User as UserIcon, Lock, Library as LibraryIcon, ShoppingBag } from "lucide-react";

/* ---------- design tokens ----------
   Palette: fairway (#1B4332) deep green, paper (#F3EFE0) cream, ink (#2B2B28),
   flag (#C1440E) red accent for leaders/alerts, gold (#B08D57) for wins/prizes,
   sage (#8FA998) secondary. Display face: native system font (San Francisco
   on iOS, Roboto on Android) throughout, including headings and modals.
   Data face: Courier New (ledger digits, plain zero - no slash/dot).
------------------------------------- */

const LOGO_DATA_URI = "data:image/png;base64,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";

const STYLE = `
  .gsc { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background:#F3EFE0; color:#2B2B28; min-height:100vh; -webkit-tap-highlight-color: transparent; overflow-x:hidden; overflow-anchor:none; }
  .gsc * { box-sizing: border-box; }
  .gsc-display { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; }
  .gsc-mono { font-family: "Courier New", Courier, monospace; }
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
  .gsc-game-title { font-size:18px; font-weight:700; color:#1B4332; }
  .gsc-tag { display:inline-block; background:#8FA998; color:#fff; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; padding:3px 8px; border-radius:20px; margin-top:6px; }
  .gsc-no-select { -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; }
  .gsc-field { margin-bottom:12px; }
  .gsc-label { display:block; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:#6b6b63; margin-bottom:5px; }
  .gsc-input { width:100%; padding:9px 10px; border:1.5px solid #d8d2bd; border-radius:8px; font-size:16px; background:#FDFCF7; }
  .gsc-input[type="date"] { -webkit-appearance:none; appearance:none; min-width:0; }
  .gsc-row { display:flex; gap:10px; }
  .gsc-row > * { flex:1; }
  .gsc-hole-strip { display:flex; overflow-x:auto; gap:4px; padding:10px 16px; background:#16382C; -webkit-overflow-scrolling:touch; }
  .gsc-hole-pip { flex:0 0 auto; width:38px; min-height:38px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; color:#F3EFE0; opacity:0.55; padding:4px 0; border-radius:8px; cursor:pointer; font-family: "Courier New", Courier, monospace; touch-action:manipulation; }
  .gsc-hole-pip.active { opacity:1; background:#C1440E; font-weight:700; }
  .gsc-hole-pip.done { opacity:0.9; border-bottom:2px solid #B08D57; }
  .gsc-hole-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .gsc-hole-big { font-size:38px; font-weight:800; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; color:#1B4332; line-height:1; }
  .gsc-par-badge { font-size:13px; color:#6b6b63; font-weight:600; }
  .gsc-stepper { display:flex; align-items:center; gap:10px; }
  .gsc-stepper button { width:44px; height:44px; border-radius:50%; border:1.5px solid #1B4332; background:#fff; font-size:18px; font-weight:700; color:#1B4332; cursor:pointer; touch-action:manipulation; }
  .gsc-stepper button:disabled { opacity:0.3; }
  .gsc-stepper-val { font-size:20px; font-weight:700; width:28px; text-align:center; font-family: "Courier New", Courier, monospace; }
  .gsc-player-row { border-radius:10px; padding:12px; margin-bottom:10px; }
  .gsc-player-name { font-weight:700; font-size:19px; }
  .gsc-hcp { font-size:11px; color:#6b6b63; margin-left:6px; }
  .gsc-mull { display:flex; align-items:center; gap:6px; font-size:12px; margin-top:8px; }
  .gsc-chip { display:inline-block; font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px; margin-left:6px; margin-right:6px; margin-top:4px; }
  .gsc-lead { background:#B08D57; color:#fff; }
  .gsc-loss { background:#c7c2a8; color:#5b5b52; }
  .gsc-teamA { border-left:5px solid #1B4332; background:#F0EEE3; }
  .gsc-teamB { border-left:5px solid #C1440E; background:#FBEDE5; }
  .gsc-teamC { border-left:5px solid #B08D57; background:#F8F1E4; }
  .gsc-teamD { border-left:5px solid #4A6C5A; background:#EBF0EC; }
  table.gsc-grid { width:100%; border-collapse:collapse; font-size:11px; font-family: "Courier New", Courier, monospace; }
  table.gsc-grid th, table.gsc-grid td { border:1px solid #e5e0cd; padding:4px 3px; text-align:center; }
  table.gsc-grid th { background:#1B4332; color:#F3EFE0; position:sticky; top:0; }
  .gsc-link { color:#1B4332; text-decoration:underline; font-weight:600; cursor:pointer; background:none; border:none; padding:0; font-size:inherit; }
  .gsc-empty { text-align:center; padding:40px 16px; color:#6b6b63; }
  .gsc-code { font-family: "Courier New", Courier, monospace; font-weight:800; letter-spacing:2px; background:rgba(243,239,224,0.15); padding:4px 10px; border-radius:6px; }
  .gsc-modal-backdrop { position:fixed; inset:0; background:rgba(27,31,26,0.55); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
  .gsc-modal { background:#FDFCF7; border-radius:16px; padding:22px 20px; max-width:340px; width:100%; box-shadow:0 8px 30px rgba(0,0,0,0.25); }
  .gsc-modal-title { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; font-size:19px; font-weight:700; color:#1B4332; margin-bottom:8px; }
  .gsc-modal-body { font-size:14px; color:#4b4b45; line-height:1.5; margin-bottom:18px; }
  .gsc-modal-row { display:flex; gap:10px; }
  .gsc-navbar { position:fixed; bottom:0; left:0; right:0; background:#1B4332; display:flex; padding:6px 4px calc(6px + env(safe-area-inset-bottom)); box-shadow:0 -2px 10px rgba(0,0,0,0.2); z-index:20; }
  @keyframes gsc-firework-particle { 0% { transform:translate(0,0) scale(1); opacity:1; } 100% { transform:translate(var(--dx), var(--dy)) scale(0.3); opacity:0; } }
  @keyframes gsc-firework-pop { 0% { opacity:0; } 15% { opacity:1; } 100% { opacity:0; } }
  .gsc-firework-field { position:absolute; inset:0; overflow:hidden; pointer-events:none; }
  .gsc-winner-card { border:2px solid #B08D57; background:linear-gradient(180deg, rgba(176,141,87,0.14), rgba(176,141,87,0.03)); }
  @keyframes gsc-accolade-pop { 0% { transform:translateX(-50%) scale(0.7); opacity:0; } 15% { transform:translateX(-50%) scale(1.08); opacity:1; } 25% { transform:translateX(-50%) scale(1); opacity:1; } 85% { transform:translateX(-50%) scale(1); opacity:1; } 100% { transform:translateX(-50%) scale(0.9); opacity:0; } }
  .gsc-accolade { position:fixed; top:calc(70px + env(safe-area-inset-top)); left:50%; z-index:40; background:#1B4332; color:#F3EFE0; border:2px solid #B08D57; border-radius:16px; padding:12px 22px; text-align:center; box-shadow:0 6px 20px rgba(0,0,0,0.3); animation: gsc-accolade-pop 2s ease-out both; pointer-events:none; }
  .gsc-navitem { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 2px; border-radius:10px; cursor:pointer; border:none; background:none; touch-action:manipulation; min-height:44px; }
  .gsc-navitem-label { font-size:10px; font-weight:600; letter-spacing:0.2px; }
  .gsc-body-tabbed { padding-bottom:calc(80px + env(safe-area-inset-bottom)); }
  .gsc-modal-row > * { flex:1; }
`;

const GAMES = {
  teamputts: {
    name: "Team Putts",
    tag: "Putting teams - 4 players",
    desc: "A simple points-based putting game for 4 players, 2 vs 2 teams. The team with the least combined putts earns 1 point per hole. Most points at the end of the round wins. Total strokes also kept track of.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    puttsOnlyScoring: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Team putting game for 4 players (2 vs 2 teams).",
      "Total strokes and putts are kept track of.",
      "1 point is earned per hole by the team with the lowest combined putts.",
      "0 points are earned for ties. Ties do not carry over.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in) (to be agreed on).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "Handicaps not used in game scoring, but are visible.",
    ],
  },
  seabluffe: {
    name: "Round Robin",
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
  moonlightwolf: {
    name: "Wolf",
    tag: "Rotating team - 4 players",
    desc: "A rotating team four-player game where one player acts as the \"Wolf\" on each hole. The Wolf watches the other drives (tees off last), then either chooses a partner or goes it alone (\"Lone Wolf\"), to win points based on a best-ball lowest strokes and putts format.",
    rotates: true,
    hasScore: true,
    hasPutts: true,
    bestBall: true,
    tracksWolf: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      {
        text: "Setting Up the Game",
        sub: [
          "The foursome: Wolf is designed for four players.",
          "Play order: players determine the initial tee-off order prior to the first hole. This will be Player 1, 2, 3, 4 in that order. Player 1 is the first hitter on hole 1, then player 2, then player 3, then player 4 - who is the last hitter and is the Wolf on hole one.",
          "Rotation: this exact rotation order shifts by one player on each subsequent hole. Example: Player 4 on hole one becomes the first hitter on hole two, Player 1 on hole two is the 2nd hitter, Player 2 is the 3rd hitter, and Player 3 is the 4th hitter and becomes the new Wolf. This continues for all 18 holes.",
        ],
      },
      {
        text: "Playing a Hole",
        sub: [
          "The Wolf's position: the Wolf always tees off last on every hole, allowing them to evaluate everyone else's shots.",
          "Selecting a partner: after each player hits a tee shot, the Wolf can immediately choose that player as a partner for the hole. The choice must be made before the next player hits.",
          "Going alone: if the Wolf declines all partners after watching every drive, they automatically become a \"Lone Wolf\" playing 1-against-3.",
        ],
      },
      {
        text: "Scoring System - 2-on-2 (Wolf picked a partner): best-ball for strokes and putts, same as Best Ball scoring:",
        sub: [
          "Each player plays their own ball and records their own strokes and putts.",
          "The lower of the Wolf team's two strokes scores counts toward the game.",
          "The lower of the Wolf team's two putts scores counts toward the game.",
          "0, 1, or 2 points possible per hole per team: 1 pt per team for best-ball putts, 1 pt per team for best-ball strokes.",
        ],
      },
      {
        text: "Scoring System - Lone Wolf (1-against-3):",
        sub: [
          "If the Lone Wolf wins the best-ball strokes outright (no ties), the Wolf earns 3 points. If the three-player team's best-ball score wins best strokes, each of the 3-person team players gets 1 point. If there is a tie on strokes between the Lone Wolf's score and the 3-person best-ball team score, no one earns a point.",
          "If the Lone Wolf wins the best-ball putts outright (doesn't tie), the Wolf earns 3 points. If the three-player team wins putts, each of the 3-person team players gets 1 point. If there is a tie between the Lone Wolf's score and the 3-player team's best-ball score on putts, no one earns a point.",
        ],
      },
      "Each hole: one player is the Wolf, who decides whether to choose a partner after seeing the other drives, or go Lone Wolf for bigger stakes.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Handicaps: not used in game scoring.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
    ],
  },
  ponto: {
    name: "Team Skins",
    tag: "Fixed teams - 4 players",
    desc: "Two 2-person teams, same partners all 18 holes. Points for low combined score AND low combined putts each hole. Great for similar handicaps.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Two 2-person team strokes and putting competition (same game as Round Robin, except no team rotation).",
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
    name: "Best Ball",
    tag: "Best-ball teams - 4 players",
    desc: "Two 2-person teams, best-ball scoring - the lower of the team's two strokes AND the lower of the team's two putts count each hole. Same structure as Team Skins, but best-ball instead of combined. Great for mixed handicap pairs.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    bestBall: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      {
        text: "Two 2-person team Best-Ball Strokes and Best-Ball Putts Skins competition (same as Team Skins, except using best-ball scores from the 2-person team):",
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
    name: "Best Ball Tournament",
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
    name: "Combined Strokes Tournament",
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
  avoscramble: {
    name: "Scramble Tournament",
    tag: "Choose best shot - Tournaments only",
    desc: "The whole foursome plays as one team. Every team member tees off on each hole, the team picks the best shot of the foursome, and all players hit their next shots from that same location. This cycle repeats until the ball is in the hole. The team's strokes score for the hole is then captured.",
    rotates: false,
    hasScore: true,
    hasPutts: false,
    bestBall: true,
    singleTeam: true,
    oneTeamScore: true,
    tournamentOnly: true,
    tracksDrives: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, minDrives: 3, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "4-person team strokes competition - the whole foursome plays as one team",
      {
        text: "Basic Play Sequence:",
        sub: [
          "Tee off: Every player hits a tee shot on every hole.",
          "Select the best shot: The group chooses the best ball and marks the spot.",
          "Place the ball: Other team members pick up their balls and place them within one club-length of the chosen spot, no closer to the hole.",
          "Maintain the lie: If the chosen shot is in the rough, sand, or fairway, the placed balls must stay in that same surface type or tier.",
          "On the green: Mark the chosen putt location; all players putt from that exact spot, usually within a putter head or scorecard length. The first ball holed counts as the team score.",
        ],
      },
      "For each hole, the foursome's score is just one team score.",
      "Used only in Tournaments - foursomes are ranked against every other foursome by total strokes, tracked and ranked (lowest score wins).",
      "Minimum drives: each player's tee shot must be used at least this many times over the round, set when the tournament is created and tracked hole by hole.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Handicaps: could be used in game scoring. If so, this would be an average of the 4 players' handicaps and subtracted from the Total Score to determine Net Score.",
      "Play OB shots as a lateral drop (1 out, 1 in).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "Great for foursome-vs-foursome tournament play w/higher handicaps.",
    ],
  },
  swami: {
    name: "Individual Strokes",
    tag: "Individual stroke play - up to 4 players",
    desc: "A standard, no-frills stroke play game for up to 4 players. Lowest total strokes wins; total putts breaks a tie. Great for players who just want to keep an honest scorecard.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    totalScoring: true,
    defaults: { maxOver: "", maxPutts: "", mulliganSegment: "", prize: "" },
    rules: [
      "Individual strokes and putting game for up to 4 players.",
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
    name: "Individual Skins",
    tag: "Individual skins - up to 4 players",
    desc: "Individual strokes and putting skins game for up to 4 players. Points for low strokes AND low putts each hole. Most points wins. Great for similar handicaps.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Individual strokes and putting skins game for up to 4 players. Points for low strokes AND low putts each hole. Most points wins.",
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
  individualputts: {
    name: "Individual Putts",
    tag: "Individual putting game - up to 4 players",
    desc: "A simple total putts game for up to 4 players, every player for themselves. The player with the least amount of putts at the end of the round wins. Total strokes also still kept track of.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    totalScoring: true,
    rankByPutts: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Individual putting game for up to 4 players.",
      "Total strokes and putts are kept track of.",
      "Lowest amount of putts at the end of the round wins.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in) (to be agreed on).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "Handicaps not used in game scoring, but are visible.",
    ],
  },
  pontobango: {
    name: "Bingo Bango Bongo",
    tag: "Individual points game - up to 4 players",
    desc: "Each hole is worth three points. The Bingo point goes to the first player on the green. The Bango point goes to the player closest to the pin once on the green. The Bongo point goes to the longest putt. The player with the most points wins. Strokes and putts still tracked.",
    rotates: false,
    hasScore: true,
    hasPutts: true,
    tracksPontoBangoBongo: true,
    defaults: { maxOver: 3, maxPutts: 3, mulliganSegment: 1, prize: "Losers buy winners a drink at the 19th hole" },
    rules: [
      "Individual strokes and putting game for up to 4 players.",
      "Total strokes and putts are still kept track of (similar to Individual Strokes).",
      {
        text: "There are however 3 points awarded per hole:",
        sub: [
          "The Bingo point goes to the player who is the first player on the green, regardless of the number of shots it took to get there.",
          "The Bango point goes to the player who is the closest to the hole once all players in the group are on the green.",
          "The Bongo point goes to the first player to hole out (longest putt).",
        ],
      },
      "The player with the most Bingo Bango Bongo points at the end of the round takes the pot.",
      "Proper etiquette must be followed with furthest player from pin shooting first from tee to hole.",
      "Prize: to be agreed on prior to round.",
      "Strokes max: to be agreed on prior to round.",
      "Putts max: to be agreed on prior to round.",
      "Mulligans: to be agreed on prior to round.",
      "Play OB shots as a lateral drop (1 out, 1 in) (to be agreed on).",
      "Must putt all the way into the hole.",
      "Flagstick can stay in.",
      "Putts start once on the putting green.",
      "Handicaps not used in game scoring, but are visible.",
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
const AVATAR_OPTIONS = [
  "\u{1F60E}", "\u{1F525}", "\u2B50", "\u{1F973}", "\u{1F3AF}", "\u{1F981}", "\u{1F43B}", "\u{1F985}", "\u{1F422}", "\u{1F41D}", "\u{1F30A}", "\u{1F335}",
  "\u{1F9B8}", "\u{1F9B9}", "\u{1F977}", "\u{1F987}", "\u{1F577}\u{FE0F}", "\u26A1", "\u{1F4A5}", "\u{1F6E1}\u{FE0F}", "\u{1F4AA}", "\u{1F680}",
  "\u{1F42F}", "\u{1F988}",
  "\u{1F40A}", "\u{1F986}", "\u{1F43A}", "\u{1F989}", "\u{1F409}", "\u{1F451}", "\u{1F3A9}", "\u{1F340}", "\u{1F334}", "\u{1F3B2}", "\u{1F947}", "\u{1F9CA}",
];
const TEAM_CLASS = ["gsc-teamA", "gsc-teamB", "gsc-teamC", "gsc-teamD"];

// Ponto's mulligan allowance resets every 9 holes (front/back nine).
// Seabluffe's stays tied to its 6-hole partner-rotation.
// Detects an actual phone, deliberately excluding tablets and desktops -
// this app's layout and interactions are built for mobile only. iPadOS
// reports itself as a Mac in modern Safari, so that's checked separately
// via touch support; Android tablets typically drop "Mobile" from their
// user agent string even though they still say "Android", so that's
// checked too rather than treating any "Android" match as a phone.
// Both sounds are synthesized directly with the Web Audio API rather than
// external audio files - keeps the app self-contained (nothing extra to
// host or upload) and works reliably offline. Wrapped in try/catch since
// audio can fail silently in some contexts (autoplay restrictions, older
// browsers) and that should never break the actual score entry.

function playBirdieSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    // Two quick overlapping upward pitch-sweeps - the classic bird "tweet-tweet".
    [0, 0.13].forEach((startOffset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const start = now + startOffset;
      osc.frequency.setValueAtTime(2200, start);
      osc.frequency.exponentialRampToValueAtTime(3400, start + 0.06);
      osc.frequency.exponentialRampToValueAtTime(2600, start + 0.11);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
    setTimeout(() => ctx.close(), 600);
  } catch (e) {
    // Silently ignore - sound is a nice-to-have, never worth surfacing an error over.
  }
}

function playFireworksSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    // Whoosh (launch): filtered noise with a rising bandpass sweep.
    const whooshBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const whooshData = whooshBuffer.getChannelData(0);
    for (let i = 0; i < whooshData.length; i++) whooshData[i] = Math.random() * 2 - 1;
    const whooshSource = ctx.createBufferSource();
    whooshSource.buffer = whooshBuffer;
    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = "bandpass";
    whooshFilter.Q.value = 1;
    whooshFilter.frequency.setValueAtTime(400, now);
    whooshFilter.frequency.exponentialRampToValueAtTime(2500, now + 0.35);
    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0.15, now);
    whooshGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
    whooshSource.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whooshSource.start(now);
    whooshSource.stop(now + 0.4);

    // Boom (explosion): filtered noise burst right after the whoosh.
    const boomStart = now + 0.38;
    const boomBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
    const boomData = boomBuffer.getChannelData(0);
    for (let i = 0; i < boomData.length; i++) boomData[i] = Math.random() * 2 - 1;
    const boomSource = ctx.createBufferSource();
    boomSource.buffer = boomBuffer;
    const boomFilter = ctx.createBiquadFilter();
    boomFilter.type = "lowpass";
    boomFilter.frequency.setValueAtTime(1800, boomStart);
    boomFilter.frequency.exponentialRampToValueAtTime(150, boomStart + 0.5);
    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.5, boomStart);
    boomGain.gain.exponentialRampToValueAtTime(0.001, boomStart + 0.6);
    boomSource.connect(boomFilter);
    boomFilter.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomSource.start(boomStart);
    boomSource.stop(boomStart + 0.6);

    // A few sparkle/crackle pops trailing after the boom.
    [0.55, 0.68, 0.8].forEach((offset) => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(900 + Math.random() * 600, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);
    });

    setTimeout(() => ctx.close(), 1300);
  } catch (e) {
    // Silently ignore - see note above.
  }
}

function isPhoneDevice() {
  if (typeof navigator === "undefined") return true; // server-side render safety, shouldn't occur in this app
  const ua = navigator.userAgent || "";
  const isIPadOS = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPad/i.test(ua) || isIPadOS) return false;
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return false; // Android tablet
  return /iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(ua);
}

function mulliganWindow(game) {
  if (game === "seabluffe") return 6; // tied to the 6-hole team rotation - left as-is
  return 18; // one mulligan allowance for the whole round, for every other game
}

// The Wolf rotates by exactly one position each hole: Player 4 (index 3)
// is the Wolf on hole 1, Player 3 on hole 2, Player 2 on hole 3, Player 1
// on hole 4, then the whole 4-hole cycle repeats. This is fully derivable
// from the hole index alone - no extra state needs to be stored.
function wolfIndexForHole(h) {
  return 3 - (h % 4);
}

// Great-circle distance between two GPS points, in yards. Standard
// Haversine formula - works with coordinates from any data source, so
// this doesn't need to change no matter which GPS provider eventually
// supplies the actual green coordinates.
function haversineYards(lat1, lon1, lat2, lon2) {
  const R_METERS = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = R_METERS * c;
  return meters * 1.09361; // meters -> yards
}

// Single source of truth for "who's on which team this hole" - used by
// both the scoring engine and the card screen's own render. These two
// used to compute this independently, which is exactly how a game like
// Wolf (dynamic per-hole teams) could work correctly in the
// engine but still crash on the card screen, which had its own simpler
// copy that never learned about it.
function computeTeamsForHole(round, h, hs) {
  if (round.game === "seabluffe") {
    return SEABLUFFE_PAIRINGS[Math.floor(h / 6)];
  }
  if (round.game === "moonlightwolf") {
    const wolfIdx = wolfIndexForHole(h);
    const partner = hs.wolfPartner;
    if (partner === "lone") {
      return [[wolfIdx], [0, 1, 2, 3].filter((i) => i !== wolfIdx)];
    }
    if (typeof partner === "number") {
      return [[wolfIdx, partner], [0, 1, 2, 3].filter((i) => i !== wolfIdx && i !== partner)];
    }
    // No decision made yet this hole - shape is a placeholder only;
    // point-awarding is separately gated on a decision existing.
    return [[wolfIdx], [0, 1, 2, 3].filter((i) => i !== wolfIdx)];
  }
  return round.teams;
}
const ACTIVE_KEY = "gsc-active-round";
const LAST_TOURNAMENT_KEY = "gsc-last-tournament";
const FINISHED_TOURNAMENT_INDEX_KEY = "gsc-finished-tournament-index";
const FINISHED_INDEX_KEY = "gsc-finished-index";
const FINISHED_PREFIX = "gsc-finished-round:";
const TOURNAMENT_PREFIX = "gsc-tournament:";
// Tournaments only ever use the dedicated tournament game - a true 4-person
// best-ball format with no 2-person sub-teams. None of the other games are
// offered in Tournament creation.
// Explicit order (not auto-derived from GAMES) so display order is
// deliberate and controllable - remember to add any new tournamentOnly
// game here too, or it won't show up in the Tournament Game Formats list.
const TOURNAMENT_GAME_KEYS = ["avoscramble", "tourneybb", "tourneygg"];

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
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
  // Generic "wherever you actually came from" back-navigation - forward
  // navigation calls goToScreen() (instead of setScreen() directly),
  // which pushes the current screen onto a plain ref-based stack before
  // switching. Back buttons call goBack() to pop it. This replaced an
  // earlier version that tried to auto-detect navigation reactively via
  // a useEffect and called setScreen from inside another setState's
  // updater function - that's a React anti-pattern (nested state-update
  // side effects don't run in a reliably predictable order), which is
  // exactly why Back needed multiple taps and often still landed on the
  // wrong screen. A plain ref for the stack sidesteps all of that, since
  // ref reads/writes are synchronous and don't interact with React's
  // update scheduling at all.
  const screenHistoryRef = useRef([]);
  function goToScreen(next) {
    screenHistoryRef.current = [...screenHistoryRef.current, screen];
    setScreen(next);
  }
  function goBack(fallback) {
    const h = screenHistoryRef.current;
    if (h.length === 0) {
      setScreen(fallback || "home");
      return;
    }
    const prev = h[h.length - 1];
    screenHistoryRef.current = h.slice(0, -1);
    setScreen(prev);
  }
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [recentCodes, setRecentCodes] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [storageBroken, setStorageBroken] = useState(false);
  const failCountRef = useRef(0);
  const lastLocalEditRef = useRef(0);
  // One ref array per manual par-entry grid (Setup, Wizard, Tournament
  // create) - used to auto-advance focus to the next hole's input once a
  // par digit is typed, since real par values are always a single digit
  // (3-6), so there's never a legitimate second keystroke to wait for.
  const parRefsSetup = useRef([]);
  const parRefsWizard = useRef([]);
  const parRefsTournament = useRef([]);

  // wizard state
  const [gameKey, setGameKey] = useState(null);
  const [cfg, setCfg] = useState({});
  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [players, setPlayers] = useState([]); // {name, hcp}
  const [pontoPairing, setPontoPairing] = useState([[0, 1], [2, 3]]);
  const [par, setPar] = useState(DEFAULT_PAR);
  const [yardage, setYardage] = useState(Array(18).fill(""));
  const [strokeIndex, setStrokeIndex] = useState(Array(18).fill(""));
  const [courseName, setCourseName] = useState("");
  const [savedCourses, setSavedCourses] = useState([]);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseSearchResults, setCourseSearchResults] = useState([]);
  const [courseSearchBusy, setCourseSearchBusy] = useState(false);
  const [courseSearchErr, setCourseSearchErr] = useState("");
  const [courseTeeOptions, setCourseTeeOptions] = useState(null); // {courseLabel, tees: [...]} once a course is picked
  const [showManualCourse, setShowManualCourse] = useState(false);
  const [courseSelectedViaSearch, setCourseSelectedViaSearch] = useState(false);
  const [avatarPickerFor, setAvatarPickerFor] = useState(null); // player index currently showing its avatar picker, or null
  const [scoringAvatarPickerFor, setScoringAvatarPickerFor] = useState(null); // same idea, but for the scoring screen, kept separate since it edits an already-saved round rather than in-progress setup

  // ---- Live GPS for distance-to-green ----
  // This is intentionally provider-independent: it just tracks the
  // player's own live position. Which data source actually supplies the
  // green's coordinates (round.holeGPS) is a separate concern - this part
  // works the same no matter what fills that in later.
  const [playerGPS, setPlayerGPS] = useState(null); // { lat, lng, accuracy } or null
  const [gpsStatus, setGpsStatus] = useState("idle"); // "idle" | "locating" | "active" | "denied" | "unsupported" | "error"
  const gpsWatchIdRef = useRef(null);

  function startGPSWatch() {
    if (!("geolocation" in navigator)) {
      setGpsStatus("unsupported");
      return;
    }
    setGpsStatus("locating");
    gpsWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsStatus("active");
        setPlayerGPS({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      },
      (err) => {
        setGpsStatus(err.code === 1 ? "denied" : "error");
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
    );
  }

  function stopGPSWatch() {
    if (gpsWatchIdRef.current != null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(gpsWatchIdRef.current);
    }
    gpsWatchIdRef.current = null;
    setGpsStatus("idle");
    setPlayerGPS(null);
  }

  const [wizardStepId, setWizardStepId] = useState("playerCount");
  const [wizardAnswers, setWizardAnswers] = useState({});
  const [wizardHistory, setWizardHistory] = useState([]); // stack of actually-visited step ids, for Back
  const [wizardFieldErr, setWizardFieldErr] = useState("");
  const [wizardOnlyMode, setWizardOnlyMode] = useState(null); // null (any format) | "rounds" | "tournament"
  const [courseDetailBusy, setCourseDetailBusy] = useState(false);

  // Every screen change (any navigation button) should land at the top of
  // the page, rather than keeping whatever scroll position the previous
  // screen was left at. Also fires on wizard step changes specifically,
  // since those happen within the same "gameWizard" screen and wouldn't
  // otherwise trigger this - which is what caused the wizard to visually
  // jump around between questions instead of starting cleanly at the top.
  // Deferred via double requestAnimationFrame, and paired with
  // overflow-anchor:none in the stylesheet - both needed because the
  // browser's own scroll-anchoring feature actively tries to preserve
  // scroll position when content above the viewport resizes (exactly
  // what happens switching between a 2-button question and an 18-hole
  // grid), and can override a scroll reset that runs too early.
  useEffect(() => {
    const reset = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };
    reset();
    const raf1 = requestAnimationFrame(() => {
      reset();
      requestAnimationFrame(reset);
    });
    return () => cancelAnimationFrame(raf1);
  }, [screen, wizardStepId]);
  const [courseMsg, setCourseMsg] = useState("");

  // active round
  const [round, setRound] = useState(null); // full round object once loaded/created
  const [holeIdx, setHoleIdx] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [rulesOpenFor, setRulesOpenFor] = useState(null);

  // ---- Tournament (multi-foursome) state ----
  const [activeTournament, setActiveTournament] = useState(null); // tournament object once created/joined, drives "foursome mode" in setup
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentDate, setTournamentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [tournamentCourseName, setTournamentCourseName] = useState("");
  const [tournamentGameKey, setTournamentGameKey] = useState(null);
  const [tournamentRankBy, setTournamentRankBy] = useState("strokes"); // strokes-only for now (game points ranking removed)
  const [tournamentPar, setTournamentPar] = useState(DEFAULT_PAR);
  const [tournamentYardage, setTournamentYardage] = useState(Array(18).fill(""));
  const [tournamentStrokeIndex, setTournamentStrokeIndex] = useState(Array(18).fill(""));
  const [tournamentCfg, setTournamentCfg] = useState({});
  const [tournamentFoursomeCount, setTournamentFoursomeCount] = useState(2);
  const [tournamentFoursomesDraft, setTournamentFoursomesDraft] = useState([]);
  const [tournamentJoinCode, setTournamentJoinCode] = useState("");
  const [tournamentErr, setTournamentErr] = useState("");
  const [tournamentBusy, setTournamentBusy] = useState(false);
  const [board, setBoard] = useState(null); // { tournament, rows: [{...}] } for the leaderboard screen
  const [tournamentFinishSnapshot, setTournamentFinishSnapshot] = useState(null); // captured winner data for the finish-tournament celebration
  const [tournamentCreatedSnapshot, setTournamentCreatedSnapshot] = useState(null); // captured data for the "tournament just created" celebration

  // ---- Feedback survey state ----
  const FEEDBACK_FEATURES = ["Mulligan tracking", "Course search (auto-fill par)", "Avatars", "Tournaments / Leaderboard", "Full 18-hole grid view", "Accolades (birdie/eagle celebrations)"];
  const [feedbackAnswers, setFeedbackAnswers] = useState({
    setupMethod: null,
    setupEase: null,
    setupFriction: "",
    formats: [],
    scoringEase: null,
    confusion: "",
    features: {},
    dataTrust: null,
    dataTrustDetail: "",
    wishlist: "",
    npsScore: null,
  });
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackErr, setFeedbackErr] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  function updateFeedback(field, value) {
    setFeedbackAnswers((a) => ({ ...a, [field]: value }));
  }
  function toggleFeedbackFormat(format) {
    setFeedbackAnswers((a) => {
      const has = a.formats.includes(format);
      return { ...a, formats: has ? a.formats.filter((f) => f !== format) : [...a.formats, format] };
    });
  }
  function updateFeedbackFeature(feature, value) {
    setFeedbackAnswers((a) => ({ ...a, features: { ...a.features, [feature]: value } }));
  }
  function resetFeedbackForm() {
    setFeedbackAnswers({
      setupMethod: null, setupEase: null, setupFriction: "", formats: [], scoringEase: null,
      confusion: "", features: {}, dataTrust: null, dataTrustDetail: "", wishlist: "", npsScore: null,
    });
    setFeedbackSubmitted(false);
    setFeedbackErr("");
  }
  async function submitFeedback() {
    setFeedbackErr("");
    const a = feedbackAnswers;
    if (a.setupMethod == null || a.setupEase == null || a.scoringEase == null || a.dataTrust == null || a.npsScore == null || a.formats.length === 0) {
      setFeedbackErr("Please answer the required questions above (marked without \"Optional\") before submitting.");
      return;
    }
    setFeedbackBusy(true);
    try {
      const resp = await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, submittedAt: new Date().toISOString() }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setFeedbackBusy(false);
        setFeedbackErr(`Couldn't send feedback (${data.error || resp.status}). Please try again.`);
        return;
      }
      setFeedbackBusy(false);
      setFeedbackSubmitted(true);
    } catch (e) {
      setFeedbackBusy(false);
      setFeedbackErr(`Couldn't send feedback (${e.message || "network error"}). Please try again.`);
    }
  }

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
          <ul className="gsc-no-select" style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6, paddingLeft: 18, margin: "0 0 16px" }}>
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
  const [finishedTournaments, setFinishedTournaments] = useState([]);
  const [deleteTournamentConfirm, setDeleteTournamentConfirm] = useState(null); // {id, name} while confirming a delete
  const [deleteTournamentBusy, setDeleteTournamentBusy] = useState(false);
  const [deleteTournamentErr, setDeleteTournamentErr] = useState("");
  const [finishTournamentBusy, setFinishTournamentBusy] = useState(false);
  const [finishTournamentErr, setFinishTournamentErr] = useState("");

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
      const ftRes = await storageGet(FINISHED_TOURNAMENT_INDEX_KEY, false);
      if (ftRes.ok && ftRes.value) {
        try {
          setFinishedTournaments(JSON.parse(ftRes.value));
        } catch (e) {}
      }
    })();
  }, []);

  function firstOpenHole(r) {
    for (let h = 0; h < 18; h++) {
      const hs = r.scores[h] || {};
      const filled = r.players.every((_, i) => hs[i] && ((hs[i].strokes != null && hs[i].strokes !== "") || (hs[i].putts != null && hs[i].putts !== "")));
      if (!filled) return h;
    }
    return 17;
  }

  function resumeActiveRound() {
    setRound(activeRound);
    setGameKey(activeRound.game);
    setHoleIdx(firstOpenHole(activeRound));
    goToScreen("card");
  }

  // Guard against accidentally losing an in-progress round: tapping Back
  // during a round asks for confirmation instead of leaving right away.
  function requestLeaveRound() {
    setConfirmLeaveOpen(true);
  }
  function confirmLeaveRound() {
    setConfirmLeaveOpen(false);
    if (round && round.tournamentId) {
      openTournamentBoard(round.tournamentId);
    } else {
      setScreen("home");
    }
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

  // Moves a tournament from "in progress" to "finished" on this device.
  // Unlike finished rounds, there's no separate snapshot to save here -
  // the tournament's live data already lives in shared storage under its
  // own code, and stays there untouched. This just adds a personal
  // bookmark (name/date/game/id) so it shows up under Finished
  // Tournaments and can be reopened anytime - it never deletes the
  // tournament or any foursome's data.
  async function finishTournament(t) {
    if (!t) return;
    setFinishTournamentErr("");
    setFinishTournamentBusy(true);
    const idxRes = await storageGet(FINISHED_TOURNAMENT_INDEX_KEY, false);
    let idx = [];
    if (idxRes.ok && idxRes.value) {
      try {
        idx = JSON.parse(idxRes.value);
      } catch (e) {}
    }
    idx = idx.filter((x) => x.id !== t.id);
    idx.unshift({ id: t.id, name: t.name, date: t.date, game: t.game, foursomeCount: (t.foursomes || []).length });
    idx = idx.slice(0, 15);
    const w = await storageSet(FINISHED_TOURNAMENT_INDEX_KEY, JSON.stringify(idx), false);
    setFinishTournamentBusy(false);
    if (!w.ok) {
      setFinishTournamentErr(`Couldn't save this to your finished tournaments (${w.error}). Try again - the tournament itself is unaffected either way.`);
      return;
    }
    setFinishedTournaments(idx);
    // If this was the device's "in progress" tournament, clear that pointer
    // too, so it moves cleanly from "in progress" to "finished" rather than
    // showing in both places.
    if (lastTournament && lastTournament.id === t.id) {
      await storageDelete(LAST_TOURNAMENT_KEY, false);
      setLastTournament(null);
    }
    // Snapshot the current leaderboard (already loaded on this screen) so
    // the celebration screen has stable winner data to show, regardless of
    // whatever board/lastTournament state changes happen next.
    setTournamentFinishSnapshot({
      tournament: t,
      strokesRanked: board && board.tournament && board.tournament.id === t.id ? board.strokesRanked : [],
      puttsRanked: board && board.tournament && board.tournament.id === t.id ? board.puttsRanked : [],
      hasPutts: GAMES[t.game] ? GAMES[t.game].hasPutts : false,
    });
    goToScreen("tournamentFinishCelebration");
  }

  function requestDeleteFinishedTournament(t) {
    setDeleteTournamentErr("");
    setDeleteTournamentConfirm(t);
  }
  function cancelDeleteFinishedTournament() {
    setDeleteTournamentConfirm(null);
  }
  async function confirmDeleteFinishedTournament() {
    if (!deleteTournamentConfirm) return;
    const id = deleteTournamentConfirm.id;
    setDeleteTournamentBusy(true);
    setDeleteTournamentErr("");
    const idxRes = await storageGet(FINISHED_TOURNAMENT_INDEX_KEY, false);
    let idx = [];
    if (idxRes.ok && idxRes.value) {
      try {
        idx = JSON.parse(idxRes.value);
      } catch (e) {}
    }
    idx = idx.filter((x) => x.id !== id);
    const w = await storageSet(FINISHED_TOURNAMENT_INDEX_KEY, JSON.stringify(idx), false);
    if (!w.ok) {
      setDeleteTournamentBusy(false);
      setDeleteTournamentErr(`Couldn't remove this (${w.error}). Try again.`);
      return;
    }
    setFinishedTournaments(idx);
    setDeleteTournamentBusy(false);
    setDeleteTournamentConfirm(null);
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
      setArchiveErr(`Couldn't save this round (${savedRoundRes.error || "storage error"}). Your round hasn't been touched - tap "Finish & exit" to retry.`);
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
    // Celebrate on a dedicated screen with final standings before heading
    // home - keep `round` populated so that screen can show the finished
    // scorecard; it gets cleared when the person taps through to Home from
    // there. Tapping "Finish & exit" is already the explicit signal the
    // round is done, so this always celebrates rather than requiring every
    // single cell across all 18 holes to be filled in - that stricter check
    // used to silently skip the celebration over one missed entry, with no
    // indication why.
    goToScreen("roundComplete");
  }

  function finishCelebrationAndGoHome() {
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
    goToScreen("card");
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
      setCourseSelectedViaSearch(true);
    }
  }

  // Looks up real courses (by name) from a public course database, via a
  // server-side proxy that keeps the API key out of the browser. Returns
  // a short list of candidates - the person still picks the right one
  // (and the right tee, since par can differ between tees at the same
  // course) before anything gets filled in.
  async function searchCourses() {
    const q = courseSearchQuery.trim();
    if (q.length < 2) {
      setCourseSearchErr("Type at least 2 characters to search.");
      return;
    }
    setCourseSearchBusy(true);
    setCourseSearchErr("");
    setCourseSearchResults([]);
    try {
      const res = await fetch(`/api/course-search?q=${encodeURIComponent(q)}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setCourseSearchErr((data && data.error) || "Course search isn't available right now. You can still enter par manually below.");
        setCourseSearchBusy(false);
        return;
      }
      setCourseSearchResults(data.courses || []);
      if (!data.courses || data.courses.length === 0) {
        setCourseSearchErr("No matches. Try a shorter or differently spelled name, or enter par manually below.");
      }
    } catch (e) {
      setCourseSearchErr("Course search isn't available right now. You can still enter par manually below.");
    }
    setCourseSearchBusy(false);
  }

  // Fetches full detail (every tee, every hole's par) for a chosen course,
  // then shows a tee picker rather than guessing which tee to use.
  async function selectCourseResult(course) {
    setCourseDetailBusy(true);
    setCourseSearchErr("");
    try {
      const res = await fetch(`/api/course-detail?id=${encodeURIComponent(course.id)}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        setCourseSearchErr((data && data.error) || "Couldn't load that course's details. You can still enter par manually below.");
        setCourseDetailBusy(false);
        return;
      }
      // The course fields may come back at the top level, or wrapped in a
      // "course" key (mirroring how search results are wrapped in
      // "courses") - handle either shape rather than assuming one.
      const courseObj = data.course && typeof data.course === "object" ? data.course : data;
      const allTees = Object.values(courseObj.tees || {}).flat();
      if (allTees.length === 0) {
        setCourseSearchErr(
          `That course doesn't have hole-by-hole par data available. You can still enter par manually below. (debug: response keys were ${Object.keys(data).join(", ")})`
        );
        setCourseDetailBusy(false);
        return;
      }
      setCourseTeeOptions({
        courseLabel: courseObj.club_name === courseObj.course_name ? courseObj.club_name : `${courseObj.club_name} - ${courseObj.course_name}`,
        tees: allTees,
      });
    } catch (e) {
      setCourseSearchErr("Couldn't load that course's details. You can still enter par manually below.");
    }
    setCourseDetailBusy(false);
  }

  // Applies a specific tee's par values. Courses aren't always 18 holes
  // exactly in the database, so this fills in whatever's available and
  // leaves the rest blank rather than guessing - the existing "every hole
  // needs par" check before creating the round will catch anything short.
  function applyCourseTee(tee, forTournament) {
    const holePars = (tee.holes || []).map((h) => h.par);
    const holeYardage = (tee.holes || []).map((h) => h.yardage);
    const holeStrokeIndex = (tee.holes || []).map((h) => h.handicap);
    const next = Array(18).fill("");
    const nextYardage = Array(18).fill("");
    const nextStrokeIndex = Array(18).fill("");
    for (let i = 0; i < Math.min(18, holePars.length); i++) {
      next[i] = holePars[i];
      if (holeYardage[i] != null) nextYardage[i] = holeYardage[i];
      if (holeStrokeIndex[i] != null) nextStrokeIndex[i] = holeStrokeIndex[i];
    }
    if (forTournament) {
      setTournamentPar(next);
      setTournamentYardage(nextYardage);
      setTournamentStrokeIndex(nextStrokeIndex);
      setTournamentCourseName(courseTeeOptions.courseLabel);
    } else {
      setPar(next);
      setYardage(nextYardage);
      setStrokeIndex(nextStrokeIndex);
      setCourseName(courseTeeOptions.courseLabel);
    }
    if (holePars.length !== 18) {
      setCourseMsg(`Loaded ${holePars.length} of 18 holes from "${courseTeeOptions.courseLabel}" (${tee.tee_name}) - fill in the rest manually.`);
    } else {
      setCourseMsg(`Loaded par for "${courseTeeOptions.courseLabel}" (${tee.tee_name}).`);
    }
    setCourseTeeOptions(null);
    setCourseSearchResults([]);
    setCourseSearchQuery("");
    setCourseSelectedViaSearch(true);
  }

  // ---------- Game Wizard ----------
  // Resets the same underlying state startNewRound uses, since the wizard
  // ultimately drives those exact fields - this lets the wizard finish by
  // calling the existing finishSetup()/proceedToFoursomeRoster() functions
  // directly instead of duplicating their validation and round-creation
  // logic.
  function startWizard() {
    setActiveTournament(null);
    setWizardStepId("playerCount");
    setWizardAnswers({});
    setWizardHistory([]);
    setWizardOnlyMode(null);
    setErr("");
    setTournamentErr("");
    setRoundName("");
    setRoundDate(new Date().toISOString().slice(0, 10));
    setPlayers([
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
    ]);
    setPontoPairing([[0, 1], [2, 3]]);
    setPar(Array(18).fill(""));
    setYardage(Array(18).fill(""));
    setStrokeIndex(Array(18).fill(""));
    setCourseName("");
    setCourseSelectedViaSearch(false);
    setCourseMsg("");
    setCourseSearchQuery("");
    setCourseSearchResults([]);
    setCourseSearchErr("");
    setCourseTeeOptions(null);
    setShowManualCourse(false);
    loadSavedCourses();
    goToScreen("gameWizard");
  }

  // Same reset as startWizard, but scoped to only ever produce a Round
  // format - the "More than 4 (a tournament)" option gets hidden on the
  // player-count question, so this path can never end up in a tournament.
  function startWizardForRounds() {
    startWizard();
    setWizardOnlyMode("rounds");
  }

  // Scoped the other direction - skips the player-count question entirely
  // (tournaments don't need it the same way a round does) and starts
  // directly on the tournament scoring question, pre-seeding the answers
  // a normal "more than 4 players" path would have set.
  function startWizardForTournament() {
    startWizard();
    setWizardOnlyMode("tournament");
    setWizardStepId("tournamentScoring");
    setWizardAnswers({ playerCount: 8 });
  }

  function wizardNextStepId(stepId, answers) {
    switch (stepId) {
      case "playerCount":
        if (Number(answers.playerCount) > 4) return "tournamentScoring";
        if (Number(answers.playerCount) === 1) return "confirmGame";
        return Number(answers.playerCount) === 4 ? "roundMode" : "individualScoring";
      case "roundMode":
        return answers.roundMode === "team" ? "teamType" : "individualScoring";
      case "teamType":
        return answers.resolvedGameKey ? "confirmGame" : "teamScoring";
      case "teamScoring":
      case "individualScoring":
      case "tournamentScoring":
        return "confirmGame";
      case "confirmGame":
        return "field_name";
      case "field_name":
        return "field_course";
      case "field_course":
        return "field_limits";
      case "field_limits":
        return answers.isTournament ? "field_foursomeCount" : "field_prize";
      case "field_foursomeCount":
        return "field_prize";
      case "field_prize":
        return answers.isTournament ? "finish" : "field_venmo";
      case "field_venmo":
        return "field_players";
      case "field_players":
        return "finish";
      default:
        return "finish";
    }
  }

  // Rough-but-reasonable progress percentage, derived fresh from the
  // current step id each render rather than tracked incrementally - the
  // field-collection phase (once the game is picked) is a known, fixed
  // list per path, so that part is precise; the branching phase before
  // that is an approximation, since the total step count isn't knowable
  // until enough questions are answered.
  function wizardProgress() {
    const roundFields = ["field_name", "field_course", "field_limits", "field_prize", "field_venmo", "field_players"];
    const tournamentFields = ["field_name", "field_course", "field_limits", "field_foursomeCount", "field_prize"];
    const fields = wizardAnswers.isTournament ? tournamentFields : roundFields;
    const fieldIdx = fields.indexOf(wizardStepId);
    if (fieldIdx >= 0) return Math.round(38 + (60 * fieldIdx) / fields.length);
    if (wizardStepId === "confirmGame") return 35;
    if (wizardStepId === "finish") return 100;
    const branchOrder = ["playerCount", "roundMode", "teamType", "teamScoring", "individualScoring", "tournamentScoring"];
    const idx = branchOrder.indexOf(wizardStepId);
    return Math.min(30, 8 + Math.max(0, idx) * 7);
  }

  function wizardGoNext(stepId, patch) {
    setWizardFieldErr("");
    const nextAnswers = { ...wizardAnswers, ...patch };
    const next = wizardNextStepId(stepId, nextAnswers);
    if (next === "confirmGame" && nextAnswers.resolvedGameKey) {
      const key = nextAnswers.resolvedGameKey;
      if (nextAnswers.isTournament) {
        setTournamentGameKey(key);
        setTournamentCfg({ ...GAMES[key].defaults });
        setTournamentPar(Array(18).fill(""));
        setTournamentYardage(Array(18).fill(""));
        setTournamentStrokeIndex(Array(18).fill(""));
        setTournamentCourseName("");
        setCourseSelectedViaSearch(false);
        setTournamentName("");
        setTournamentFoursomeCount(Math.max(2, Math.ceil((Number(nextAnswers.playerCount) || 8) / 4)));
      } else {
        setGameKey(key);
        setCfg({ ...GAMES[key].defaults });
        const count = key === "swami" || key === "dstreet" || key === "pontobango" || key === "individualputts" ? Math.max(1, Math.min(4, Number(nextAnswers.playerCount) || 4)) : 4;
        setPlayers((p) => {
          const base = [...p];
          while (base.length < count) base.push({ name: "", hcp: "", avatar: "" });
          return base.slice(0, count);
        });
      }
    }
    setWizardAnswers(nextAnswers);
    setWizardHistory((h) => [...h, stepId]);
    setWizardStepId(next);
  }

  function wizardGoBack() {
    setWizardFieldErr("");
    // Uses an explicit history stack (pushed in wizardGoNext) rather than
    // trying to infer the previous step from the current one - several
    // different questions (rotating teams, best-ball vs combined,
    // individual scoring, tournament scoring) all lead to the same
    // "confirm game" step, so guessing backwards from just the current
    // step id is ambiguous and was picking the wrong branch. An explicit
    // stack of what was actually visited has no such ambiguity.
    if (wizardHistory.length === 0) {
      goBack("home");
      return;
    }
    const prev = wizardHistory[wizardHistory.length - 1];
    setWizardHistory((h) => h.slice(0, -1));
    setWizardStepId(prev);
  }

  // Unlike wizardGoBack (which steps back one question at a time, and
  // ultimately returns to wherever the wizard was actually launched from),
  // Cancel always jumps straight to Home and fully resets the wizard - for
  // when someone just wants out immediately, not a multi-tap trip back
  // through every question they already answered.
  function cancelWizard() {
    setWizardStepId("playerCount");
    setWizardAnswers({});
    setWizardHistory([]);
    setWizardOnlyMode(null);
    setWizardFieldErr("");
    goToScreen("home");
  }

  function startNewRound(key) {
    setActiveTournament(null);
    setGameKey(key);
    setCfg({ ...GAMES[key].defaults });
    setRoundName("");
    setRoundDate(new Date().toISOString().slice(0, 10));
    setPlayers([
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
    ]);
    setPontoPairing([[0, 1], [2, 3]]);
    setPar(Array(18).fill(""));
    setYardage(Array(18).fill(""));
    setStrokeIndex(Array(18).fill(""));
    setCourseName("");
    setCourseSelectedViaSearch(false);
    setCourseMsg("");
    setCourseSearchQuery("");
    setCourseSearchResults([]);
    setCourseSearchErr("");
    setCourseTeeOptions(null);
    loadSavedCourses();
    goToScreen("setup");
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
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
      { name: "", hcp: "", avatar: "" },
    ]);
    setPontoPairing([[0, 1], [2, 3]]);
    setPar([...tournament.par]);
    setCourseName(tournament.course || "");
    setCourseMsg("");
    setTournamentErr("");
    const pointer = { id: tournament.id, name: tournament.name };
    setLastTournament(pointer);
    storageSet(LAST_TOURNAMENT_KEY, JSON.stringify(pointer), false);
    goToScreen("setup");
  }

  function updatePlayer(i, field, val) {
    setPlayers((p) => {
      const next = [...p];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  }

  // Only used by individual game formats (Individual Strokes, Individual Skins) -
  // team games and tournaments always need exactly 4 (2v2 or a foursome),
  // so this stays unused/inaccessible there.
  function addPlayerSlot() {
    setPlayers((p) => (p.length >= 4 ? p : [...p, { name: "", hcp: "", avatar: "" }]));
  }
  function removePlayerSlot(i) {
    setPlayers((p) => (p.length <= 1 ? p : p.filter((_, idx) => idx !== i)));
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
    const cleanPlayers = players.map((p, i) => ({ name: p.name.trim() || `Player ${LETTERS[i]}`, hcp: p.hcp, avatar: p.avatar || "" }));
    const isIndividual = gameKey === "dstreet" || gameKey === "swami" || gameKey === "pontobango" || gameKey === "individualputts";
    if (isIndividual) {
      const needsTwo = gameKey === "pontobango" || gameKey === "individualputts";
      const minPlayers = needsTwo ? 2 : 1;
      if (cleanPlayers.length < minPlayers) {
        setErr(needsTwo ? "Need at least 2 players." : "Need at least 1 player.");
        return;
      }
    } else if (cleanPlayers.length < 4) {
      setErr("Need 4 players.");
      return;
    }
    if (!activeTournament) {
      const parIncomplete = par.some((p) => p === "" || p == null || isNaN(Number(p)) || Number(p) <= 0);
      if (parIncomplete) {
        setErr("Enter par for every hole above, or load a saved course, before creating the round.");
        return;
      }
    }
    const code = genCode();
    const teams =
      gameKey === "ponto" || gameKey === "beachside" || gameKey === "teamputts"
        ? pontoPairing
        : isIndividual
        ? cleanPlayers.map((_, i) => [i]) // individual - each player is their own "team" of one, however many were entered
        : gameKey === "tourneybb" || gameKey === "tourneygg"
        ? [[0, 1, 2, 3]] // whole foursome as a single team - no sub-teams
        : null; // seabluffe computes teams per-hole

    const cleanPar = par.map((p) => (p === "" || p == null || isNaN(Number(p)) ? 4 : Number(p)));
    const cleanYardage = yardage.map((y) => (y === "" || y == null || isNaN(Number(y)) ? null : Number(y)));
    const cleanStrokeIndex = strokeIndex.map((s) => (s === "" || s == null || isNaN(Number(s)) ? null : Number(s)));
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
    const finalYardage = isTournament ? [...(activeTournament.yardage || Array(18).fill(null))] : cleanYardage;
    const finalStrokeIndex = isTournament ? [...(activeTournament.strokeIndex || Array(18).fill(null))] : cleanStrokeIndex;
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
      yardage: finalYardage,
      strokeIndex: finalStrokeIndex,
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
    if (isTournament) {
      openTournamentBoard(activeTournament.id);
    } else {
      goToScreen("card");
    }
  }

  function startTournamentCreateFlow(preselectedGameKey) {
    const key = typeof preselectedGameKey === "string" && GAMES[preselectedGameKey] ? preselectedGameKey : TOURNAMENT_GAME_KEYS[0];
    setTournamentErr("");
    setTournamentName("");
    setTournamentDate(new Date().toISOString().slice(0, 10));
    setTournamentCourseName("");
    setCourseSelectedViaSearch(false);
    setTournamentGameKey(key);
    setTournamentRankBy("strokes");
    setTournamentPar(Array(18).fill(""));
    setTournamentYardage(Array(18).fill(""));
    setTournamentStrokeIndex(Array(18).fill(""));
    setTournamentCfg({ ...GAMES[key].defaults });
    setTournamentFoursomeCount(2);
    setCourseSearchQuery("");
    setCourseSearchResults([]);
    setCourseSearchErr("");
    setCourseTeeOptions(null);
    setCourseMsg("");
    setShowManualCourse(false);
    goToScreen("tournamentCreate");
  }

  function proceedToFoursomeRoster() {
    setTournamentErr("");
    const name = tournamentName.trim();
    if (!name) {
      setTournamentErr("Give the tournament a name first.");
      return;
    }
    const parIncomplete = tournamentPar.some((p) => p === "" || p == null || isNaN(Number(p)) || Number(p) <= 0);
    if (parIncomplete) {
      setTournamentErr("Enter par for every hole above before continuing.");
      return;
    }
    const count = tournamentFoursomeCount === "" || tournamentFoursomeCount == null || isNaN(Number(tournamentFoursomeCount)) ? 2 : Math.max(1, Number(tournamentFoursomeCount));
    setTournamentFoursomeCount(count);
    setTournamentFoursomesDraft(
      Array.from({ length: count }, (_, i) => ({
        name: `Foursome ${i + 1}`,
        players: [
          { name: "", hcp: "", avatar: "" },
          { name: "", hcp: "", avatar: "" },
          { name: "", hcp: "", avatar: "" },
          { name: "", hcp: "", avatar: "" },
        ],
      }))
    );
    goToScreen("tournamentRoster");
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
    const cleanYardage = tournamentYardage.map((y) => (y === "" || y == null || isNaN(Number(y)) ? null : Number(y)));
    const cleanStrokeIndex = tournamentStrokeIndex.map((s) => (s === "" || s == null || isNaN(Number(s)) ? null : Number(s)));
    const cleanCfg = {
      ...tournamentCfg,
      maxOver: tournamentCfg.maxOver === "" || tournamentCfg.maxOver == null || isNaN(Number(tournamentCfg.maxOver)) ? 3 : Number(tournamentCfg.maxOver),
      maxPutts: tournamentCfg.maxPutts === "" || tournamentCfg.maxPutts == null || isNaN(Number(tournamentCfg.maxPutts)) ? 3 : Number(tournamentCfg.maxPutts),
      mulliganSegment:
        tournamentCfg.mulliganSegment === "" || tournamentCfg.mulliganSegment == null || isNaN(Number(tournamentCfg.mulliganSegment)) ? 1 : Number(tournamentCfg.mulliganSegment),
      minDrives: tournamentCfg.minDrives === "" || tournamentCfg.minDrives == null || isNaN(Number(tournamentCfg.minDrives)) ? 3 : Number(tournamentCfg.minDrives),
    };

    setTournamentBusy(true);

    // Create every foursome's round first, then save the tournament once
    // with the full foursome list already attached - avoids N separate
    // read-modify-write round trips against the tournament record.
    const foursomeEntries = [];
    for (const draft of tournamentFoursomesDraft) {
      const foursomeCode = genCode();
      const foursomeName = draft.name.trim() || "Foursome";
      const cleanPlayers = draft.players.map((p, i) => ({ name: p.name.trim() || `Player ${LETTERS[i]}`, hcp: p.hcp, avatar: p.avatar || "" }));
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
        yardage: cleanYardage,
        strokeIndex: cleanStrokeIndex,
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
      yardage: cleanYardage,
      strokeIndex: cleanStrokeIndex,
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
    setTournamentCreatedSnapshot({ tournament, foursomeCount: foursomeEntries.length });
    goToScreen("tournamentCreatedCelebration");
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
    r.players = editFoursomePlayers.map((p, i) => ({ name: p.name.trim() || `Player ${LETTERS[i]}`, hcp: p.hcp }));
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
    goToScreen("tournamentBoard");
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
      setErr(`Couldn't reach shared rounds (${res.error}). Please try again in a moment.`);
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
    goToScreen("card");
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

  const [accolade, setAccolade] = useState(null); // {emoji, text, big, player, key}
  const [inPlayFireworks, setInPlayFireworks] = useState(false);
  const inPlayFireworksTimerRef = useRef(null);
  const [accoladeQueue, setAccoladeQueue] = useState([]); // holds multiple accolades to show one at a time
  const prevHoleIdxRef = useRef(holeIdx);
  const latestRoundRef = useRef(round);
  useEffect(() => {
    latestRoundRef.current = round;
  }, [round]);
  const accoladeTimerRef = useRef(null);

  // Figures out whether a just-entered stroke/putt count deserves a fun
  // celebratory toast - pars/birdies/eagles/aces for strokes (relative to
  // that hole's par), one-putts/zero-putts for putts. Returns null for
  // anything that isn't worth calling out.
  function getAccolade(field, value, parH) {
    if (field === "strokes") {
      if (value === 1) return { emoji: "\u{1F3C6}\u{1F389}", text: "HOLE IN ONE!!!", big: true };
      if (parH == null) return null;
      const diff = value - parH;
      if (diff <= -2) return { emoji: "\u{1F985}", text: "EAGLE!", big: true };
      if (diff === -1) return { emoji: "\u{1F426}", text: "BIRDIE!", big: false };
      if (diff === 0) return { emoji: "\u{1F44D}", text: "Nice par!", big: false };
      return null;
    }
    if (field === "putts") {
      if (value === 0) return { emoji: "\u{1F3AF}\u{1F525}", text: "ZERO PUTTS!", big: true };
      return null;
    }
    return null;
  }

  // Shows accolades for the hole you just left, not while you're still
  // dialing in a score on the hole you're currently on - so tapping the
  // stepper through 3, 4, 5 on the way to your actual score doesn't flash
  // a premature "Nice par!" partway there. Fires once per hole change,
  // checking every player's final entered values for that completed hole.
  useEffect(() => {
    const prevIdx = prevHoleIdxRef.current;
    const r = latestRoundRef.current;
    if (prevIdx !== holeIdx && r) {
      const prevParH = r.par ? r.par[prevIdx] : null;
      const holeScores = r.scores[prevIdx] || {};
      const newAccolades = [];
      const isOneTeamScore = r.game && GAMES[r.game] && GAMES[r.game].oneTeamScore;
      const playersToCheck = isOneTeamScore ? (r.players || []).slice(0, 1) : r.players || [];
      playersToCheck.forEach((p, i) => {
        const entry = holeScores[i] || {};
        const playerName = isOneTeamScore ? "Team" : p.name || `Player ${LETTERS[i]}`;
        if (entry.strokes != null && entry.strokes !== "") {
          const acc = getAccolade("strokes", Number(entry.strokes), prevParH);
          if (acc) newAccolades.push({ ...acc, player: playerName, key: `${Date.now()}-${i}-s` });
        }
        if (entry.putts != null && entry.putts !== "") {
          const acc = getAccolade("putts", Number(entry.putts), prevParH);
          if (acc) newAccolades.push({ ...acc, player: playerName, key: `${Date.now()}-${i}-p` });
        }
      });
      if (newAccolades.length > 0) setAccoladeQueue((q) => [...q, ...newAccolades]);
    }
    prevHoleIdxRef.current = holeIdx;
  }, [holeIdx]);

  // Displays queued accolades one at a time rather than all at once, in
  // case several players earned one on the same hole.
  useEffect(() => {
    if (accoladeQueue.length > 0 && !accolade) {
      const [next, ...rest] = accoladeQueue;
      setAccolade(next);
      setAccoladeQueue(rest);
      if (accoladeTimerRef.current) clearTimeout(accoladeTimerRef.current);
      accoladeTimerRef.current = setTimeout(() => setAccolade(null), next.big ? 3200 : 2000);
      if (next.text === "BIRDIE!") {
        playBirdieSound();
      } else if (next.text === "HOLE IN ONE!!!") {
        playFireworksSound();
        setInPlayFireworks(true);
        if (inPlayFireworksTimerRef.current) clearTimeout(inPlayFireworksTimerRef.current);
        inPlayFireworksTimerRef.current = setTimeout(() => setInPlayFireworks(false), 4700);
      }
    }
  }, [accoladeQueue, accolade]);

  function updateHoleEntry(playerIdx, field, value) {
    lastLocalEditRef.current = Date.now();
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

  // Used by "one team score" games (like Scramble Tournament) where there's
  // only a single shared number per hole, not 4 individual player entries.
  // Writes the same value to all 4 players' slots in one atomic update, so
  // the existing engine (which already knows how to take the minimum of 4
  // entries via bestBall) correctly treats it as a single team score
  // without needing its own separate scoring code path.
  function updateTeamHoleEntry(field, value) {
    lastLocalEditRef.current = Date.now();
    setRound((r) => {
      const next = { ...r, scores: { ...r.scores } };
      const holeScores = { ...(next.scores[holeIdx] || {}) };
      r.players.forEach((_, idx) => {
        const entry = { ...(holeScores[idx] || {}) };
        entry[field] = value;
        holeScores[idx] = entry;
      });
      next.scores[holeIdx] = holeScores;
      saveRound(next);
      return next;
    });
  }

  // Records which player's tee shot was used on this hole - a single
  // shared choice for the whole team, so it's stored as a hole-level
  // property (driveUsedBy) rather than nested inside any one player's own
  // entry, the same way a mulligan is a per-player flag but this is a
  // per-hole one.
  function updateDriveUsedBy(playerIdx) {
    lastLocalEditRef.current = Date.now();
    setRound((r) => {
      const next = { ...r, scores: { ...r.scores } };
      const holeScores = { ...(next.scores[holeIdx] || {}) };
      holeScores.driveUsedBy = holeScores.driveUsedBy === playerIdx ? null : playerIdx;
      next.scores[holeIdx] = holeScores;
      saveRound(next);
      return next;
    });
  }

  // Generic version of the same pattern, used for Bingo/Bango/Bongo -
  // three independent hole-level "who achieved this" selections rather
  // than just one.
  function updateHoleWinner(field, playerIdx) {
    lastLocalEditRef.current = Date.now();
    setRound((r) => {
      const next = { ...r, scores: { ...r.scores } };
      const holeScores = { ...(next.scores[holeIdx] || {}) };
      holeScores[field] = holeScores[field] === playerIdx ? null : playerIdx;
      next.scores[holeIdx] = holeScores;
      saveRound(next);
      return next;
    });
  }

  // Lets a player change their own avatar mid-round from the scoring
  // screen, not just during initial setup. Saves immediately so it syncs
  // to everyone else viewing the same round.
  function updateRoundPlayerAvatar(playerIdx, avatar) {
    lastLocalEditRef.current = Date.now();
    setRound((r) => {
      const nextPlayers = r.players.map((p, i) => (i === playerIdx ? { ...p, avatar } : p));
      const next = { ...r, players: nextPlayers };
      saveRound(next);
      return next;
    });
    setScoringAvatarPickerFor(null);
  }

  const [syncStatus, setSyncStatus] = useState(""); // "", "syncing", "synced", "error"

  // Pulls the latest saved version of the round from shared storage and
  // merges in anything that changed - this is what lets other players'
  // score entries actually show up without leaving and rejoining. Skips
  // applying the fetched data if a local edit happened very recently, so a
  // slightly-stale poll response can't momentarily stomp on an edit that's
  // still in flight.
  async function syncRoundFromServer(isManual) {
    if (!round) return;
    if (isManual) setSyncStatus("syncing");
    const res = await storageGet(`golfround:${round.id}`, true);
    if (!res.ok || !res.value) {
      if (isManual) {
        setSyncStatus("error");
        setTimeout(() => setSyncStatus(""), 2500);
      }
      return;
    }
    try {
      const fresh = JSON.parse(res.value);
      if (Date.now() - lastLocalEditRef.current > 3000) {
        setRound((prev) => {
          if (!prev || prev.id !== fresh.id) return prev;
          if (JSON.stringify(fresh.scores) === JSON.stringify(prev.scores) && JSON.stringify(fresh.players) === JSON.stringify(prev.players)) {
            return prev; // nothing actually changed - bail out to avoid an unnecessary re-render
          }
          return { ...prev, scores: fresh.scores, players: fresh.players, teams: fresh.teams, cfg: fresh.cfg, par: fresh.par };
        });
      }
      if (isManual) {
        setSyncStatus("synced");
        setTimeout(() => setSyncStatus(""), 1800);
      }
    } catch (e) {
      if (isManual) {
        setSyncStatus("error");
        setTimeout(() => setSyncStatus(""), 2500);
      }
    }
  }

  // Background auto-sync while actively viewing the scorecard - checks for
  // other players' updates every 8 seconds. This is polling, not a true
  // realtime push, so there's a small delay rather than instant sync, but
  // it needs no extra setup and works with the storage already in place.
  useEffect(() => {
    if (screen !== "card" || !round) return;
    const interval = setInterval(() => {
      syncRoundFromServer(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [screen, round && round.id]);

  // "One team score" games (like Scramble Tournament) show the tournament
  // leaderboard directly on the scorecard instead of a per-player Standings
  // box, since there's only one shared team score - individual player
  // rankings wouldn't mean anything. Load it once on arrival so it's not
  // blank before the first manual refresh.
  useEffect(() => {
    if (screen !== "card" || !round || !round.tournamentId) return;
    if (!GAMES[round.game] || !GAMES[round.game].oneTeamScore) return;
    loadTournamentBoard(round.tournamentId);
  }, [screen, round && round.id]);

  useEffect(() => {
    if (screen === "tournamentFinishCelebration" || screen === "tournamentCreatedCelebration") playFireworksSound();
  }, [screen]);

  useEffect(() => {
    setScoringAvatarPickerFor(null);
  }, [holeIdx]);

  useEffect(() => {
    if (screen === "card") {
      startGPSWatch();
    } else {
      stopGPSWatch();
    }
    return () => stopGPSWatch();
  }, [screen]);


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
//  - Best Ball: the single lowest strokes among all 4 players on
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
    const teamsThisHole = computeTeamsForHole(round, h, hs);

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

    // Combined games (Round Robin, Team Skins, Seaside
    // Skins) sum every team/player's capped strokes or putts. Best-ball
    // games (Best Ball) instead count only the lower of the
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
    if (g.tracksPontoBangoBongo) {
      // Bingo/Bango/Bongo points are manually observed during play (who
      // got on the green first, etc.) rather than derived from strokes or
      // putts, so they can't use the awardLowest() comparison above - each
      // is a direct hole-level selection of a single winning player.
      [hs.pontoBy, hs.bangoBy, hs.bongoBy].forEach((winnerIdx) => {
        if (winnerIdx == null) return;
        const ti = teamsThisHole.findIndex((team) => team.includes(winnerIdx));
        if (ti >= 0) ptsAwarded[ti].score += 1;
      });
    } else if (g.tracksWolf) {
      // No points at all until the Wolf has actually made a choice this
      // hole (partner or Lone Wolf) - awarding points off a placeholder
      // team shape before a real decision exists would be meaningless.
      if (hs.wolfPartner != null) {
        const isLoneWolf = teamsThisHole[0].length === 1;
        if (isLoneWolf) {
          // Symmetric on the edges, asymmetric in the middle: a strict win
          // by either side pays out (3 for the Lone Wolf, 1 each for the
          // three-player team), but an exact tie is a push - nobody scores
          // that category.
          const loneWolfAward = (wolfSum, teamSum) => {
            if (wolfSum == null || teamSum == null) return [0, 0];
            if (wolfSum < teamSum) return [3, 0];
            if (teamSum < wolfSum) return [0, 1];
            return [0, 0];
          };
          const [wolfScorePts, teamScorePts] = loneWolfAward(teamRes[0].scoreSum, teamRes[1].scoreSum);
          ptsAwarded[0].score = wolfScorePts;
          ptsAwarded[1].score = teamScorePts;
          const [wolfPuttPts, teamPuttPts] = loneWolfAward(teamRes[0].puttSum, teamRes[1].puttSum);
          ptsAwarded[0].putt = wolfPuttPts;
          ptsAwarded[1].putt = teamPuttPts;
        } else {
          // Standard 2v2 best-ball, same mechanic as Best Ball.
          const strokeSums = teamRes.map((t) => t.scoreSum);
          awardLowest(strokeSums).forEach((v, i) => (ptsAwarded[i].score = v));
          const puttSums = teamRes.map((t) => t.puttSum);
          awardLowest(puttSums).forEach((v, i) => (ptsAwarded[i].putt = v));
        }
      }
    } else if (g.hasScore && !g.totalScoring && !g.puttsOnlyScoring) {
      const sums = teamRes.map((t) => t.scoreSum);
      awardLowest(sums).forEach((v, i) => (ptsAwarded[i].score = v));
    }
    if (!g.tracksPontoBangoBongo && !g.tracksWolf && g.hasPutts && !g.totalScoring) {
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

  // RipScore is built for phones only - this gate runs after every hook
  // above has already executed (Rules of Hooks requires hooks to run
  // unconditionally), so it's safe to return early here for anyone on a
  // tablet or desktop instead of rendering the app itself.
  if (!isPhoneDevice()) {
    return (
      <div className="gsc" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <style>{STYLE}</style>
        <div>
          <img src={LOGO_DATA_URI} alt="RipScore logo" style={{ width: 120, height: "auto", marginBottom: 16 }} />
          <div className="gsc-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>RipScore is built for phones</div>
          <div style={{ fontSize: 14, color: "#4b4b45", lineHeight: 1.6, maxWidth: 360 }}>
            This app is designed for use on a mobile phone out on the course, and isn't optimized for tablets or desktop browsers. Please open this link on your phone to play.
          </div>
        </div>
      </div>
    );
  }

  function playerRank() {
    if (!computed || !round) return [];
    const isTotalScoring = GAMES[round.game] && GAMES[round.game].totalScoring;
    const rankByPutts = GAMES[round.game] && GAMES[round.game].rankByPutts;
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
        if (rankByPutts) {
          if (a.putts !== b.putts) return a.putts - b.putts; // lowest putts wins
          return a.score - b.score; // total strokes breaks a tie
        }
        if (isTotalScoring) {
          if (a.score !== b.score) return a.score - b.score; // lowest strokes wins
          return a.putts - b.putts; // total putts breaks a tie
        }
        return b.points - a.points;
      });
  }

  // ---------- render helpers ----------
  function Header({ title, sub, onBack, backExtra, right }) {
    return (
      <div className="gsc-header">
        <div className="gsc-header-row">
          <div style={{ flex: "1 1 auto", minWidth: 0 }}>
            {onBack && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <button className="gsc-btn gsc-btn-ghost" style={{ padding: "5px 6px", fontSize: 12, width: 84, textAlign: "center" }} onClick={onBack}>Back</button>
                {backExtra}
              </div>
            )}
            <div className="gsc-title gsc-display">{title}</div>
            {sub && <div className="gsc-sub" style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{sub}</div>}
          </div>
          {right}
          <img
            src={LOGO_DATA_URI}
            alt="RipScore logo"
            style={{ width: 70, height: "auto", objectFit: "contain", flexShrink: 0, alignSelf: "flex-start", marginRight: 0, marginTop: -2 }}
          />
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { key: "home", label: "Home", icon: HomeIcon },
    { key: "roundsTab", label: "Rounds", icon: FlagIcon },
    { key: "tournamentsTab", label: "Tournaments", icon: TrophyIcon },
    { key: "libraryTab", label: "Library", icon: LibraryIcon },
    { key: "profileTab", label: "Profile", icon: UserIcon },
  ];

  // Persistent bottom tab bar - only rendered on the five top-level "tab"
  // screens (see NAV_ITEMS), never on focused sub-flows like Setup or the
  // active scorecard, matching standard mobile tab-bar conventions.
  function BottomNav() {
    return (
      <div className="gsc-navbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = screen === item.key;
          return (
            <button
              key={item.key}
              className="gsc-navitem"
              style={{ background: active ? "rgba(243,239,224,0.12)" : "none" }}
              onClick={() => goToScreen(item.key)}
            >
              <Icon size={20} color={active ? "#F3EFE0" : "#8FA998"} strokeWidth={active ? 2.4 : 2} />
              <span className="gsc-navitem-label" style={{ color: active ? "#F3EFE0" : "#8FA998" }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // A short, tasteful CSS-only fireworks burst for the round-complete
  // celebration - a handful of bursts, each a ring of small particles that
  // fly outward and fade. No animation library needed, and it runs once
  // (not on a loop) so it doesn't linger or distract from the standings
  // shown right below it.
  function Fireworks() {
    const colors = ["#C1440E", "#B08D57", "#8FA998", "#F3EFE0", "#3F6B54"];
    const bursts = [
      { left: "18%", top: "22%", delay: 0 },
      { left: "78%", top: "16%", delay: 0.35 },
      { left: "50%", top: "30%", delay: 0.7 },
      { left: "30%", top: "45%", delay: 1.05 },
      { left: "68%", top: "42%", delay: 1.4 },
      { left: "12%", top: "38%", delay: 1.8 },
      { left: "85%", top: "35%", delay: 2.2 },
      { left: "42%", top: "18%", delay: 2.6 },
      { left: "60%", top: "48%", delay: 3.0 },
      { left: "25%", top: "20%", delay: 3.4 },
    ];
    return (
      <div className="gsc-firework-field">
        {bursts.map((b, bi) => (
          <div key={bi} style={{ position: "absolute", left: b.left, top: b.top }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = ((360 / 12) * i * Math.PI) / 180;
              const dist = 55 + (i % 3) * 20;
              const dx = Math.cos(angle) * dist;
              const dy = Math.sin(angle) * dist;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: colors[(bi + i) % colors.length],
                    opacity: 0,
                    "--dx": `${dx}px`,
                    "--dy": `${dy}px`,
                    animation: `gsc-firework-particle 1.3s ease-out ${b.delay}s both`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={<><span style={{ fontSize: 23 }}>RipScore Golf</span><div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75, letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 2, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>Play the game. We'll keep score.</div></>}
          sub=""
        />
        <div className="gsc-body gsc-body-tabbed">
          <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.55, margin: "0 0 16px" }}>
            We all love playing games on the course, but who wants to keep track of all the scores and rules? RipScore makes it easy and fun to play various golf game formats, share scores live on the course, and settle who's buying at the 19th hole!
            <br />
            <br />
            To start a new round or tournament:
            <br />
            1) Select your game format below
            <br />
            2) Set up your round detail
            <br />
            3) Enter your strokes for each hole as you play
            <br />
            <br />
            You're all set, next hole... the 19th!
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

          <div className="gsc-card gsc-winner-card" style={{ cursor: "pointer" }} onClick={startWizard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{"\u{1F9D9}"} Not sure which game to pick?</div>
                <div style={{ fontSize: 13, color: "#4b4b45", marginTop: 3 }}>
                  Answer a few quick questions and we'll pick the right format and set everything up for you.
                </div>
              </div>
            </div>
            <button className="gsc-btn gsc-btn-gold" style={{ width: "100%", marginTop: 10 }} onClick={startWizard}>
              Start the Game Wizard
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6, fontSize: 17 }}>Join an Existing Round</div>
            <div className="gsc-row">
              <input className="gsc-input gsc-mono" id="round-join-code-home" name="round-join-code-home" autoComplete="off" placeholder="ROUND CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
              <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={busy || !joinCode} onClick={() => loadRound(joinCode)}>
                Join
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
            <div className="gsc-label" style={{ marginBottom: 6, fontSize: 17 }}>Start a New Round</div>

            <div className="gsc-label" style={{ marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Individual Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>Up to 4 Players</div>
            {["dstreet", "swami", "individualputts", "pontobango"]
              .map((key) => [key, GAMES[key]])
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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

            <div className="gsc-label" style={{ marginTop: 14, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Team Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>2 vs 2</div>
            {["ponto", "teamputts", "beachside", "seabluffe", "moonlightwolf"]
              .map((key) => [key, GAMES[key]])
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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
            <div className="gsc-label" style={{ marginBottom: 6, fontSize: 17 }}>Start a New Tournament</div>

            <div className="gsc-label" style={{ marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Tournament Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>Multiple Foursomes</div>
            {TOURNAMENT_GAME_KEYS.map((key) => {
              const g = GAMES[key];
              return (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startTournamentCreateFlow(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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
              );
            })}

            <div className="gsc-label" style={{ marginTop: 14, marginBottom: 6 }}>Join an existing tournament</div>
            <div className="gsc-row">
              <input
                className="gsc-input gsc-mono"
                id="tournament-join-code-home"
                name="tournament-join-code-home"
                autoComplete="off"
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

          <div className="gsc-card gsc-game-card" onClick={() => goToScreen("libraryTab")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Library</div>
                <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>Golf Games Library</div>
                <div style={{ fontSize: 12, color: "#6b6b63" }}>About this App</div>
              </div>
              <LibraryIcon size={20} color="#8FA998" />
            </div>
          </div>

          <div className="gsc-card gsc-game-card" style={{ opacity: 0.7 }} onClick={() => goToScreen("profileTab")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
                  Profile <Lock size={13} color="#8a8a80" />
                </div>
                <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>Saved defaults and account</div>
                <div style={{ fontSize: 12, color: "#6b6b63" }}>Stats - your rounds, averages, and wins</div>
              </div>
              <UserIcon size={20} color="#8FA998" />
            </div>
          </div>
        </div>
        {RulesModal()}
        <BottomNav />
      </div>
    );
  }

  if (screen === "roundsTab") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={<span style={{ fontSize: 23 }}>Rounds</span>} sub="Join, create, or revisit" />
        <div className="gsc-body gsc-body-tabbed">
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

          <div className="gsc-card">
            <div className="gsc-label">Join an existing round</div>
            <div className="gsc-row" style={{ marginTop: 6 }}>
              <input className="gsc-input gsc-mono" id="round-join-code" name="round-join-code" autoComplete="off" placeholder="ROUND CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} maxLength={6} />
              <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={busy || !joinCode} onClick={() => loadRound(joinCode)}>
                Join
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

          <div className="gsc-card gsc-winner-card" style={{ cursor: "pointer" }} onClick={startWizardForRounds}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{"\u{1F9D9}"} Not sure which round format to pick?</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginTop: 3 }}>
              Answer a few quick questions and we'll pick the right round format and set everything up for you.
            </div>
            <button className="gsc-btn gsc-btn-gold" style={{ width: "100%", marginTop: 10 }} onClick={startWizardForRounds}>
              Start the Game Wizard
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6, fontSize: 17 }}>Start a New Round</div>

            <div className="gsc-label" style={{ marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Individual Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>Up to 4 Players</div>
            {["dstreet", "swami", "individualputts", "pontobango"]
              .map((key) => [key, GAMES[key]])
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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

            <div className="gsc-label" style={{ marginTop: 14, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Team Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>2 vs 2</div>
            {["ponto", "teamputts", "beachside", "seabluffe", "moonlightwolf"]
              .map((key) => [key, GAMES[key]])
              .map(([key, g]) => (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startNewRound(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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

          <div style={{ fontSize: 12, color: "#8a8a80", textAlign: "center", marginTop: 4 }}>
            Round data is stored so anyone with the round code can view or edit scores, when sync is working.
          </div>

          {finishedRounds.length > 0 && (
            <div className="gsc-card" style={{ marginTop: 14 }}>
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
        {RulesModal()}
        <BottomNav />
      </div>
    );
  }

  if (screen === "tournamentsTab") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={<span style={{ fontSize: 23 }}>Tournaments</span>} sub="Join, create, or revisit" />
        <div className="gsc-body gsc-body-tabbed">
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
            <div className="gsc-label" style={{ marginBottom: 6 }}>Join an existing tournament</div>
            <div className="gsc-row">
              <input
                className="gsc-input gsc-mono"
                id="tournament-join-code"
                name="tournament-join-code"
                autoComplete="off"
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

          <div className="gsc-card gsc-winner-card" style={{ cursor: "pointer" }} onClick={startWizardForTournament}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{"\u{1F9D9}"} Not sure which tournament format to pick?</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginTop: 3 }}>
              Answer a few quick questions and we'll pick the right tournament format and set everything up for you.
            </div>
            <button className="gsc-btn gsc-btn-gold" style={{ width: "100%", marginTop: 10 }} onClick={startWizardForTournament}>
              Start the Game Wizard
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6, fontSize: 17 }}>Start a New Tournament</div>
            <div className="gsc-label" style={{ marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Tournament Game Formats</div>
            <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 10 }}>Multiple Foursomes</div>
            {TOURNAMENT_GAME_KEYS.map((key) => {
              const g = GAMES[key];
              return (
                <div key={key} className="gsc-card gsc-game-card" style={{ marginBottom: 10 }} onClick={() => startTournamentCreateFlow(key)}>
                  <div className="gsc-game-title">{g.name}</div>
                  <div className="gsc-tag">{g.tag}</div>
                  <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 8, color: "#4b4b45" }}>{g.desc}</div>
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
              );
            })}
          </div>

          {finishedTournaments.length > 0 && (
            <div className="gsc-card">
              <div className="gsc-label">Finished tournaments</div>
              {finishedTournaments.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee6cf" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#6b6b63" }}>
                      {GAMES[t.game]?.name} - {t.date}{t.foursomeCount != null ? ` - ${t.foursomeCount} foursome${t.foursomeCount === 1 ? "" : "s"}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="gsc-btn gsc-btn-outline" onClick={() => openTournamentBoard(t.id)}>View</button>
                    <button className="gsc-btn gsc-btn-outline" style={{ color: "#C1440E", borderColor: "#C1440E" }} onClick={() => requestDeleteFinishedTournament(t)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {deleteTournamentConfirm && (
          <div className="gsc-modal-backdrop" onClick={cancelDeleteFinishedTournament}>
            <div className="gsc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gsc-modal-title">Remove this tournament?</div>
              <div className="gsc-modal-body">
                "{deleteTournamentConfirm.name}" will be removed from your finished tournaments list on this device. The tournament and every foursome's data stay fully intact - you could still rejoin later with the tournament code.
              </div>
              {deleteTournamentErr && <div style={{ color: "#C1440E", fontSize: 13, marginBottom: 12 }}>{deleteTournamentErr}</div>}
              <div className="gsc-modal-row">
                <button className="gsc-btn gsc-btn-outline" onClick={cancelDeleteFinishedTournament}>Cancel</button>
                <button className="gsc-btn gsc-btn-primary" style={{ background: "#C1440E" }} disabled={deleteTournamentBusy} onClick={confirmDeleteFinishedTournament}>
                  {deleteTournamentBusy ? "Removing..." : "Yes, remove"}
                </button>
              </div>
            </div>
          </div>
        )}
        {RulesModal()}
        <BottomNav />
      </div>
    );
  }

  if (screen === "profileTab") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={<span style={{ fontSize: 23 }}>Profile</span>} sub="Your account & stats" />
        <div className="gsc-body gsc-body-tabbed">
          <div className="gsc-card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <Lock size={28} color="#8FA998" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Profile & Stats Under Construction</div>
            <div style={{ fontSize: 13, color: "#6b6b63", lineHeight: 1.5 }}>
              Saved defaults (name, handicap, Venmo, home course), account login, and your stats (rounds played, average strokes and putts, wins) will all live here. Logging in will be optional - you'll always be able to keep playing instantly with just a round or tournament code, the way it works today.
            </div>
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => goToScreen("feedback")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Give Feedback</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              Two minutes, ten questions - tell us what's working and what isn't.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => goToScreen("feedback")}>
              Start feedback survey
            </button>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 6 }}>Post to GHIN</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              Head to GHIN.com to post your score toward your official handicap.
            </div>
            <a href="https://www.ghin.com" target="_blank" rel="noreferrer" className="gsc-link" style={{ marginTop: 8, fontSize: 12, display: "inline-block" }}>
              Open GHIN.com {"\u2197"}
            </a>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (screen === "libraryTab") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={<span style={{ fontSize: 23 }}>Library</span>} sub="Games & about this app" />
        <div className="gsc-body gsc-body-tabbed">
          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => goToScreen("library")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Golf Games Library</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              Browse other popular team, individual, side, and just-for-fun formats worth trying on your next round.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => goToScreen("library")}>
              Browse the library
            </button>
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => goToScreen("about")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>About this App</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              What RipScore tracks for you, and how a round works from tee to tally.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => goToScreen("about")}>
              Read more
            </button>
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => goToScreen("termsOfService")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Terms of Service</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              The terms for using RipScore.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => goToScreen("termsOfService")}>
              Read more
            </button>
          </div>

          <div className="gsc-card" style={{ cursor: "pointer" }} onClick={() => goToScreen("privacyPolicy")}>
            <div className="gsc-label" style={{ marginBottom: 6 }}>Privacy Policy</div>
            <div style={{ fontSize: 13, color: "#4b4b45" }}>
              How RipScore handles your data.
            </div>
            <button className="gsc-link" style={{ marginTop: 8, fontSize: 12 }} onClick={() => goToScreen("privacyPolicy")}>
              Read more
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (screen === "library") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Golf Games Library" sub="Other popular formats to try" onBack={() => goBack("libraryTab")} />
        <div className="gsc-body">
          <div style={{ fontSize: 12, color: "#8a8a80", marginBottom: 4 }}>
            These are for reference only - they aren't trackable in this app, just handy to have on hand.
          </div>
          {GAME_LIBRARY.map((cat) => (
            <div key={cat.category} className="gsc-card gsc-no-select">
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
        <Header title="About this App" sub="What RipScore does for you" onBack={() => goBack("libraryTab")} />
        <div className="gsc-body">
          <div className="gsc-card gsc-no-select">
            <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 14px" }}>
                The RipScore golf game scorecard app manages and shares the detail of various golf game formats you can play with your group live on the course so you don't have to: game type, rules, players, teams, scoring, max scores, course pars, handicaps, mulligans, dates, and prizes. You no longer have to do it in your head or on a paper scorecard.
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

  if (screen === "termsOfService") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Terms of Service" sub="The terms for using RipScore" onBack={() => goBack("libraryTab")} />
        <div className="gsc-body">
          <div className="gsc-card gsc-no-select">
            <div style={{ fontSize: 12, color: "#8a8a80", marginBottom: 14 }}>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 14px" }}>
                By using RipScore Golf ("RipScore," "the app," "we," or "us"), you agree to these terms. If you don't agree with them, please don't use the app.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>What RipScore Is</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore is a casual scorekeeping companion for golf rounds and tournaments played with friends. It helps you set up game formats, track strokes and putts, and share results with your group live on the course. It's built for fun, organized golf - not as an official scoring, handicap, or ratings authority.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Not an Official Handicap Service</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore is not affiliated with, endorsed by, or connected to the USGA, GHIN, or any official handicapping body. Any link to GHIN.com is provided only as a convenience. Posting scores for handicap purposes is entirely your own responsibility, done directly through GHIN or your club - RipScore does not submit anything on your behalf.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Access via Codes, Not Accounts</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore doesn't currently require you to create an account. Rounds and tournaments are accessed using a share code, and anyone with that code can view or enter scores for that round - so treat your codes the way you'd treat access to a shared document, and only share them with people you actually want in your group.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Your Responsibilities</p>
              <p style={{ margin: "0 0 14px" }}>
                You agree to use RipScore for its intended purpose - organizing and tracking casual golf play - and not to misuse it, attempt to disrupt it, or use it to harm, harass, or deceive other players. You're responsible for the accuracy of the names, scores, and other information you or your group enter.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Prizes and Wagers Between Players</p>
              <p style={{ margin: "0 0 14px" }}>
                Some game formats reference a prize or settling up at the 19th hole. Any money, prizes, or wagers exchanged between players are agreements solely between those players. RipScore does not facilitate, process, hold, or guarantee any payment, and takes no responsibility for disputes about them.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Provided As-Is</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore is provided "as is," without warranties of any kind. We work to keep scores accurate and the app available, but we can't guarantee it will always be error-free, uninterrupted, or available - especially out on the course, where connectivity isn't always reliable. To the fullest extent the law allows, RipScore and its creator aren't liable for any loss, dispute, or damages arising from your use of the app, including lost or inaccurate score data.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Changes</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore is an evolving, independent project. Features, game formats, and these terms may change as the app improves. We'll update the date at the top of this page when that happens.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Contact</p>
              <p style={{ margin: 0 }}>
                Questions about these terms? Reach out at{" "}
                <a href="mailto:support@foresagolf.com" style={{ color: "#1B4332", fontWeight: 700 }}>support@foresagolf.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "privacyPolicy") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Privacy Policy" sub="How RipScore handles your data" onBack={() => goBack("libraryTab")} />
        <div className="gsc-body">
          <div className="gsc-card gsc-no-select">
            <div style={{ fontSize: 12, color: "#8a8a80", marginBottom: 14 }}>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
              <p style={{ margin: "0 0 14px" }}>
                This page explains what information RipScore Golf collects, how it's used, and who it's shared with. We've tried to write it in plain language rather than dense legal text.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Information Kept Only On Your Device</p>
              <p style={{ margin: "0 0 14px" }}>
                Some information never leaves your phone: which round you're currently in, your history of past rounds on that device, and your last tournament. This is stored locally in your browser and isn't sent to us or anyone else.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Information Shared With Your Group</p>
              <p style={{ margin: "0 0 14px" }}>
                When you create a round or tournament, details like player names, handicaps, avatars, scores, putts, mulligans used, and prize text are saved so your group can access them from different phones using a share code. Anyone with that code can view and enter scores for that round - it isn't a private, individually-authenticated account system. Please only share codes with people you actually want in your group.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Feedback Submissions</p>
              <p style={{ margin: "0 0 14px" }}>
                If you use the in-app Feedback form, your answers are sent to the person maintaining RipScore via email. The form is intentionally built to not ask for your name or contact info, so submissions are anonymous on our end.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Third-Party Services We Use</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore relies on a small number of outside services to work: a golf course database (to look up par and yardage when you search for a course), a cloud database (to store and sync round and tournament data across devices), and an email delivery service (to send Feedback submissions). Each of these only receives the specific information needed to perform its part - for example, the course lookup service only ever receives the course name or location you search for, never your scores or player info.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>What We Don't Do</p>
              <p style={{ margin: "0 0 14px" }}>
                We don't sell your data, show you ads, or use tracking or analytics tools to follow you across other apps or websites. RipScore doesn't currently use cookies.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Data Retention and Deletion</p>
              <p style={{ margin: "0 0 14px" }}>
                Round and tournament data is kept for as long as needed to support the app's features (like viewing past rounds). Since RipScore doesn't have account logins today, there's no self-service "delete my account" option yet - if you'd like a specific round or tournament's data removed, email us and we'll take care of it.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Children</p>
              <p style={{ margin: "0 0 14px" }}>
                RipScore isn't directed at children under 13, and we don't knowingly collect information from them.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Changes</p>
              <p style={{ margin: "0 0 14px" }}>
                As RipScore evolves - like if account logins are added in the future - this page will be updated to reflect it, and the date at the top will change accordingly.
              </p>

              <p style={{ fontWeight: 700, color: "#1B4332", margin: "0 0 6px" }}>Contact</p>
              <p style={{ margin: 0 }}>
                Questions about your data, or want something deleted? Reach out at{" "}
                <a href="mailto:support@foresagolf.com" style={{ color: "#1B4332", fontWeight: 700 }}>support@foresagolf.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "swagStore") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Swag Store" sub="Order your RipScore Golf swag here" onBack={() => goBack("libraryTab")} />
        <div className="gsc-body">
          <div className="gsc-card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <ShoppingBag size={28} color="#8FA998" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Swag Store Under Construction</div>
            <div style={{ fontSize: 13, color: "#6b6b63", lineHeight: 1.5 }}>
              RipScore Golf hats, shirts, and more will be available to order here soon.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "feedback") {
    const a = feedbackAnswers;

    if (feedbackSubmitted) {
      return (
        <div className="gsc">
          <style>{STYLE}</style>
          <Header title="Feedback" sub="Thanks for taking the time" onBack={() => goBack("profileTab")} />
          <div className="gsc-body">
            <div className="gsc-card gsc-winner-card" style={{ textAlign: "center", padding: "36px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>{"\u{1F3CC}\u{FE0F}"}</div>
              <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Thanks for the feedback</div>
              <div style={{ fontSize: 13, color: "#6b6b63", lineHeight: 1.6 }}>
                This genuinely helps shape what gets built next. See you on the course.
              </div>
            </div>
            <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginTop: 4 }} onClick={resetFeedbackForm}>
              Submit another response
            </button>
            <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={() => goBack("profileTab")}>
              Back to Profile
            </button>
          </div>
        </div>
      );
    }

    const choiceBtn = (selected) => ({
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "11px 14px",
      marginBottom: 8,
      borderRadius: 10,
      border: selected ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
      background: selected ? "#EBF0EC" : "#fff",
      fontWeight: selected ? 700 : 500,
      fontSize: 14.5,
      cursor: "pointer",
      color: "#2B2B28",
      fontFamily: "inherit",
    });
    const pillBtn = (selected) => ({
      padding: "9px 14px",
      borderRadius: 20,
      border: selected ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
      background: selected ? "#EBF0EC" : "#fff",
      fontWeight: selected ? 700 : 500,
      fontSize: 13.5,
      cursor: "pointer",
      color: "#2B2B28",
      fontFamily: "inherit",
    });
    const scaleBtn = (selected) => ({
      flex: 1,
      aspectRatio: "1",
      borderRadius: 10,
      border: selected ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
      background: selected ? "#1B4332" : "#fff",
      color: selected ? "#F3EFE0" : "#2B2B28",
      fontWeight: 700,
      fontSize: 16,
      cursor: "pointer",
      fontFamily: "inherit",
    });
    const npsBtn = (selected) => ({
      flex: 1,
      minWidth: 0,
      height: 36,
      borderRadius: 8,
      border: selected ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
      background: selected ? "#1B4332" : "#fff",
      color: selected ? "#F3EFE0" : "#2B2B28",
      fontWeight: 700,
      fontSize: 12,
      cursor: "pointer",
      fontFamily: "inherit",
      padding: 0,
    });

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title="Feedback" sub="Two minutes, ten questions" onBack={() => goBack("profileTab")} />
        <div className="gsc-body">
          <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.55, marginBottom: 4 }}>
            Your answers are emailed straight to the person building this - be honest, it genuinely helps.
          </div>

          <div className="gsc-label" style={{ marginTop: 18, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Getting Started</div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>How did you set up your round?</div>
            {["Used the Game Wizard", "Picked a game format directly", "Not sure / just followed the prompts"].map((opt) => (
              <button key={opt} style={choiceBtn(a.setupMethod === opt)} onClick={() => updateFeedback("setupMethod", opt)}>{opt}</button>
            ))}
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>How easy was it to get your round started and playing?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} style={scaleBtn(a.setupEase === n)} onClick={() => updateFeedback("setupEase", n)}>{n}</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b63", marginTop: 6 }}>
              <span>Confusing</span><span>Effortless</span>
            </div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>What almost stopped you from finishing setup, if anything? <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></div>
            <textarea className="gsc-input" style={{ minHeight: 70 }} value={a.setupFriction} onChange={(e) => updateFeedback("setupFriction", e.target.value)} />
          </div>

          <div className="gsc-label" style={{ marginTop: 18, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Core Usage</div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>Which game format(s) have you played? <span style={{ textTransform: "none", fontWeight: 400 }}>(select all that apply)</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Individual Strokes", "Individual Skins", "Bingo Bango Bongo", "Best Ball", "Team Skins", "Round Robin", "Wolf", "A tournament format"].map((opt) => (
                <button key={opt} style={pillBtn(a.formats.includes(opt))} onClick={() => toggleFeedbackFormat(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>How easy was entering scores while actually playing?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} style={scaleBtn(a.scoringEase === n)} onClick={() => updateFeedback("scoringEase", n)}>{n}</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b63", marginTop: 6 }}>
              <span>Frustrating</span><span>Effortless</span>
            </div>
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>Did you run into anything confusing, or that didn't work the way you expected? <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></div>
            <textarea className="gsc-input" style={{ minHeight: 70 }} value={a.confusion} onChange={(e) => updateFeedback("confusion", e.target.value)} />
          </div>

          <div className="gsc-label" style={{ marginTop: 18, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Specific Features</div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 10 }}>Rate each feature you've used <span style={{ textTransform: "none", fontWeight: 400 }}>(skip any you haven't tried)</span></div>
            {FEEDBACK_FEATURES.map((feature) => (
              <div key={feature} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #eee6cf", gap: 10 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{feature}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {["\u2014", "1", "2", "3", "4", "5"].map((label, i) => {
                    const val = i === 0 ? "not used" : i;
                    const selected = a.features[feature] === val;
                    return (
                      <button
                        key={label}
                        style={{
                          width: 30, height: 30, borderRadius: 7,
                          border: selected ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
                          background: selected ? "#1B4332" : "#fff",
                          color: selected ? "#F3EFE0" : "#6b6b63",
                          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", padding: 0,
                        }}
                        onClick={() => updateFeedbackFeature(feature, val)}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="gsc-label" style={{ marginTop: 18, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>Reliability</div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>Did the app ever lose your scores, fail to sync, or otherwise make you nervous about your data?</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Yes", "No"].map((opt) => (
                <button key={opt} style={{ ...pillBtn(a.dataTrust === opt), flex: "0 0 auto" }} onClick={() => updateFeedback("dataTrust", opt)}>{opt}</button>
              ))}
            </div>
            {a.dataTrust === "Yes" && (
              <textarea className="gsc-input" style={{ minHeight: 70, marginTop: 12 }} placeholder="Tell us more about what happened..." value={a.dataTrustDetail} onChange={(e) => updateFeedback("dataTrustDetail", e.target.value)} />
            )}
          </div>

          <div className="gsc-label" style={{ marginTop: 18, marginBottom: 4, color: "#1B4332", fontSize: 15 }}>The Big Picture</div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>What's one thing you'd add or change if you could wave a magic wand? <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></div>
            <textarea className="gsc-input" style={{ minHeight: 70 }} value={a.wishlist} onChange={(e) => updateFeedback("wishlist", e.target.value)} />
          </div>

          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>How likely are you to use this again for your next round?</div>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: 11 }).map((_, n) => (
                <button key={n} style={npsBtn(a.npsScore === n)} onClick={() => updateFeedback("npsScore", n)}>{n}</button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b63", marginTop: 6 }}>
              <span>Definitely not</span><span>Absolutely</span>
            </div>
          </div>

          {feedbackErr && <div style={{ color: "#C1440E", fontSize: 13, marginBottom: 10 }}>{feedbackErr}</div>}
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", padding: 14, fontSize: 16, marginTop: 4 }} disabled={feedbackBusy} onClick={submitFeedback}>
            {feedbackBusy ? "Sending..." : "Submit Feedback"}
          </button>
          <div style={{ fontSize: 11, color: "#8a8a80", textAlign: "center", marginTop: 8 }}>
            Your response is sent anonymously - no name or contact info collected.
          </div>
        </div>
      </div>
    );
  }

  if (screen === "gameWizard") {
    const g = wizardAnswers.resolvedGameKey ? GAMES[wizardAnswers.resolvedGameKey] : null;
    const isTournament = !!wizardAnswers.isTournament;
    const activePar = isTournament ? tournamentPar : par;
    const setActivePar = isTournament ? setTournamentPar : setPar;
    const activeCourseName = isTournament ? tournamentCourseName : courseName;
    const setActiveCourseName = isTournament ? setTournamentCourseName : setCourseName;
    const activeCfg = isTournament ? tournamentCfg : cfg;
    const setActiveCfg = isTournament ? setTournamentCfg : setCfg;
    const progress = wizardProgress();

    const OptionButton = ({ children, onClick }) => (
      <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginBottom: 10, padding: 14, fontSize: 15, textAlign: "left" }} onClick={onClick}>
        {children}
      </button>
    );

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={<span style={{ fontSize: 20 }}>{"\u{1F9D9}"} Game Wizard</span>}
          sub={wizardStepId === "finish" ? "All set!" : `${progress}% complete`}
          onBack={wizardGoBack}
          backExtra={
            <button className="gsc-btn gsc-btn-ghost" style={{ padding: "5px 6px", fontSize: 12, width: 84, textAlign: "center" }} onClick={cancelWizard}>
              Cancel
            </button>
          }
        />
        <div style={{ height: 6, background: "#e4ded0" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#C1440E", transition: "width 0.25s ease" }} />
        </div>
        <div className="gsc-body">
          {wizardStepId === "playerCount" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How many players are in your group?</div>
              {[1, 2, 3, 4].map((n) => (
                <OptionButton
                  key={n}
                  onClick={() =>
                    wizardGoNext("playerCount", n === 1 ? { playerCount: n, resolvedGameKey: "swami", isTournament: false } : { playerCount: n })
                  }
                >
                  {n === 1 ? "Just me - playing solo" : `${n} players`}
                </OptionButton>
              ))}
              {wizardOnlyMode !== "rounds" && (
                <OptionButton onClick={() => wizardGoNext("playerCount", { playerCount: 8 })}>More than 4 (a tournament)</OptionButton>
              )}
            </div>
          )}

          {wizardStepId === "roundMode" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How do you want to play?</div>
              <OptionButton onClick={() => wizardGoNext("roundMode", { roundMode: "team", resolvedGameKey: null })}>2 vs 2 Teams</OptionButton>
              <OptionButton onClick={() => wizardGoNext("roundMode", { roundMode: "individual", resolvedGameKey: null })}>Individually - every player for themselves</OptionButton>
            </div>
          )}

          {wizardStepId === "teamType" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>Rotating teams, or the same teams all round?</div>
              <OptionButton onClick={() => wizardGoNext("teamType", { teamType: "rotating", resolvedGameKey: "seabluffe", isTournament: false })}>
                Rotating teams - new partner every 6 holes
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("teamType", { teamType: "wolf", resolvedGameKey: "moonlightwolf", isTournament: false })}>
                Rotating teams - new partner every hole (the Wolf selects their partner, or goes "Lone Wolf")
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("teamType", { teamType: "fixed", resolvedGameKey: null })}>Same teams the whole round</OptionButton>
            </div>
          )}

          {wizardStepId === "teamScoring" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How should your team's score work each hole?</div>
              <OptionButton onClick={() => wizardGoNext("teamScoring", { teamScoring: "bestball", resolvedGameKey: "beachside", isTournament: false })}>
                Best-Ball - the lower of your two scores counts
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("teamScoring", { teamScoring: "combined", resolvedGameKey: "ponto", isTournament: false })}>
                Team Skins - both scores add together
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("teamScoring", { teamScoring: "teamputts", resolvedGameKey: "teamputts", isTournament: false })}>
                Team Putts - point per hole for lowest number of combined team putts
              </OptionButton>
            </div>
          )}

          {wizardStepId === "individualScoring" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How do you want to decide the winner?</div>
              <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 12 }}>All formats keep track of everyone's strokes and putts - this is just about how a winner gets picked.</div>
              <OptionButton onClick={() => wizardGoNext("individualScoring", { individualScoring: "totalscore", resolvedGameKey: "swami", isTournament: false })}>
                Total Score - lowest score wins, putts settle a tie
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("individualScoring", { individualScoring: "skins", resolvedGameKey: "dstreet", isTournament: false })}>
                Skins - points awarded each hole for strokes AND putts
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("individualScoring", { individualScoring: "individualputts", resolvedGameKey: "individualputts", isTournament: false })}>
                Player with lowest number of putts wins (strokes can still be kept track of)
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("individualScoring", { individualScoring: "pontobango", resolvedGameKey: "pontobango", isTournament: false })}>
                Points awarded for First on, closest to pin, & longest putt
              </OptionButton>
              {Number(wizardAnswers.playerCount) === 4 && (
                <OptionButton onClick={() => wizardGoNext("individualScoring", { individualScoring: "wolf", resolvedGameKey: "moonlightwolf", isTournament: false })}>
                  Rotating partner scores for each hole, chosen by that hole's Wolf
                </OptionButton>
              )}
            </div>
          )}

          {wizardStepId === "tournamentScoring" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How should each foursome's score work?</div>
              <OptionButton onClick={() => wizardGoNext("tournamentScoring", { tournamentScoring: "bestball", resolvedGameKey: "tourneybb", isTournament: true })}>
                Best-Ball - lowest score on each hole counts
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("tournamentScoring", { tournamentScoring: "combined", resolvedGameKey: "tourneygg", isTournament: true })}>
                Team Skins - all 4 players add together
              </OptionButton>
              <OptionButton onClick={() => wizardGoNext("tournamentScoring", { tournamentScoring: "scramble", resolvedGameKey: "avoscramble", isTournament: true })}>
                One score for the team - Teams play the best shot of the foursome from tee to hole for the score
              </OptionButton>
            </div>
          )}

          {wizardStepId === "confirmGame" && g && (
            <div className="gsc-card gsc-winner-card">
              <div className="gsc-label">{isTournament ? "Your tournament format" : "Your game format"}</div>
              <div style={{ fontWeight: 700, fontSize: 19, marginTop: 4 }}>{g.name}</div>
              <div className="gsc-tag" style={{ marginTop: 6 }}>{g.tag}</div>
              <div className="gsc-no-select" style={{ fontSize: 13, marginTop: 10, color: "#4b4b45" }}>{g.desc}</div>
              <button className="gsc-link" style={{ marginTop: 10, fontSize: 13 }} onClick={() => openRules(wizardAnswers.resolvedGameKey)}>
                View full rules
              </button>
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => wizardGoNext("confirmGame", {})}>
                This is the one - continue
              </button>
            </div>
          )}

          {wizardStepId === "field_name" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>
                What do you want to name your {isTournament ? "tournament" : "round"}?
              </div>
              <input
                className="gsc-input"
                placeholder={isTournament ? "e.g. Club Championship" : `${g ? g.name : ""} at ...`}
                value={isTournament ? tournamentName : roundName}
                onChange={(e) => (isTournament ? setTournamentName(e.target.value) : setRoundName(e.target.value))}
              />
              <button
                className="gsc-btn gsc-btn-primary"
                style={{ width: "100%", marginTop: 14 }}
                onClick={() => {
                  if (isTournament && !tournamentName.trim()) {
                    setWizardFieldErr("Give your tournament a name before continuing.");
                    return;
                  }
                  wizardGoNext("field_name", {});
                }}
              >
                Continue
              </button>
              {wizardFieldErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8, textAlign: "center" }}>{wizardFieldErr}</div>}
            </div>
          )}

          {wizardStepId === "field_course" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>What course are you playing?</div>
              {activeCourseName && courseSelectedViaSearch ? (
                <div className="gsc-card gsc-winner-card" style={{ padding: 12 }}>
                  <div className="gsc-label" style={{ marginBottom: 4 }}>Selected Course</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{activeCourseName}</div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                    Par {activePar.reduce((a, b) => a + (Number(b) || 0), 0)} - {activePar.filter((p) => p !== "" && p != null).length}/18 holes entered
                  </div>
                  <button
                    className="gsc-link"
                    style={{ marginTop: 8, fontSize: 12 }}
                    onClick={() => {
                      setActiveCourseName("");
                      setCourseMsg("");
                      setCourseSelectedViaSearch(false);
                    }}
                  >
                    Change course
                  </button>
                </div>
              ) : (
                <>
              <div className="gsc-row">
                <input
                  className="gsc-input"
                  placeholder="e.g. Pebble Beach"
                  value={courseSearchQuery}
                  onChange={(e) => setCourseSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchCourses()}
                />
                <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={courseSearchBusy} onClick={searchCourses}>
                  {courseSearchBusy ? "Searching..." : "Search"}
                </button>
              </div>
              {courseSearchErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8 }}>{courseSearchErr}</div>}
              {courseSearchResults.length > 0 && !courseTeeOptions && (
                <div style={{ marginTop: 10 }}>
                  {courseSearchResults.slice(0, 8).map((c) => (
                    <div key={c.id} className="gsc-card gsc-game-card" style={{ marginBottom: 8, padding: 10 }} onClick={() => selectCourseResult(c)}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.club_name === c.course_name ? c.club_name : `${c.club_name} - ${c.course_name}`}</div>
                      {c.location && <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>{c.location.address}</div>}
                    </div>
                  ))}
                  {courseDetailBusy && <div style={{ fontSize: 12, color: "#6b6b63" }}>Loading course details...</div>}
                </div>
              )}
              {courseTeeOptions && (
                <div style={{ marginTop: 10 }}>
                  <div className="gsc-label">Pick a tee ({courseTeeOptions.courseLabel})</div>
                  {courseTeeOptions.tees.map((tee, i) => (
                    <div key={i} className="gsc-card gsc-game-card" style={{ marginBottom: 8, padding: 10 }} onClick={() => applyCourseTee(tee, isTournament)}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{tee.tee_name}</div>
                      <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                        Par {tee.par_total} - {tee.number_of_holes} holes{tee.total_yards ? ` - ${tee.total_yards} yds` : ""}
                      </div>
                    </div>
                  ))}
                  <button className="gsc-link" style={{ marginTop: 4, fontSize: 12 }} onClick={() => setCourseTeeOptions(null)}>Back to search results</button>
                </div>
              )}
              {courseMsg && <div style={{ fontSize: 12, color: courseMsg.startsWith("Couldn't") ? "#C1440E" : "#B08D57", marginTop: 8 }}>{courseMsg}</div>}

              <button className="gsc-link" style={{ marginTop: 12, fontSize: 12 }} onClick={() => setShowManualCourse((s) => !s)}>
                {showManualCourse ? "Hide manual par entry" : "Course not listed? Enter par manually"}
              </button>
              {showManualCourse && (
                <div style={{ marginTop: 10 }}>
                  <div className="gsc-field">
                    <div className="gsc-label">Course name</div>
                    <input className="gsc-input" placeholder="e.g. Seabluffe Golf Links" value={activeCourseName} onChange={(e) => setActiveCourseName(e.target.value)} />
                  </div>
                  <div className="gsc-label" style={{ marginTop: 10, marginBottom: 6 }}>Par per hole</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                    {activePar.map((v, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, textAlign: "center", color: "#6b6b63" }}>H{i + 1}</div>
                        <input
                          ref={(el) => (parRefsWizard.current[i] = el)}
                          className="gsc-input gsc-mono"
                          style={{ padding: "6px 2px", textAlign: "center", borderColor: v === "" || v == null ? "#C1440E" : undefined }}
                          type="number"
                          placeholder="-"
                          value={v}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/^0+(?=\d)/, "");
                            const next = [...activePar];
                            next[i] = raw === "" ? "" : Number(raw);
                            setActivePar(next);
                            if (raw !== "" && i < 17 && parRefsWizard.current[i + 1]) {
                              parRefsWizard.current[i + 1].focus({ preventScroll: true });
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8 }}>Total par: {activePar.reduce((a, b) => a + (Number(b) || 0), 0)}</div>
                </div>
              )}
                </>
              )}
              <button
                className="gsc-btn gsc-btn-primary"
                style={{ width: "100%", marginTop: 14 }}
                onClick={() => {
                  const incomplete = activePar.some((p) => p === "" || p == null || isNaN(Number(p)) || Number(p) <= 0);
                  if (incomplete) {
                    setWizardFieldErr("Search for your course above (or enter par manually) before continuing - every hole needs a par.");
                    return;
                  }
                  wizardGoNext("field_course", {});
                }}
              >
                Continue
              </button>
              {wizardFieldErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8, textAlign: "center" }}>{wizardFieldErr}</div>}
            </div>
          )}

          {wizardStepId === "field_limits" && g && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>Set your game limits (optional)</div>
              {g.hasScore && (
                <div className="gsc-field">
                  <div className="gsc-label">Max strokes over par per hole</div>
                  <input className="gsc-input" type="number" min="0" placeholder="No max" value={activeCfg.maxOver} onChange={(e) => setActiveCfg({ ...activeCfg, maxOver: cleanNumericText(e.target.value) })} />
                </div>
              )}
              {g.hasPutts && (
                <div className="gsc-field" style={{ marginTop: 10 }}>
                  <div className="gsc-label">Max putts per hole</div>
                  <input className="gsc-input" type="number" min="0" placeholder="No max" value={activeCfg.maxPutts} onChange={(e) => setActiveCfg({ ...activeCfg, maxPutts: cleanNumericText(e.target.value) })} />
                </div>
              )}
              <div className="gsc-field" style={{ marginTop: 10 }}>
                <div className="gsc-label">Mulligans per player{wizardAnswers.resolvedGameKey === "seabluffe" ? ", per 6 holes" : ""}</div>
                <input className="gsc-input" type="number" min="0" placeholder="0" value={activeCfg.mulliganSegment} onChange={(e) => setActiveCfg({ ...activeCfg, mulliganSegment: cleanNumericText(e.target.value) })} />
              </div>
              {g.tracksDrives && (
                <div className="gsc-field" style={{ marginTop: 10 }}>
                  <div className="gsc-label">Minimum drives per player</div>
                  <input className="gsc-input" type="number" min="0" placeholder="3" value={activeCfg.minDrives} onChange={(e) => setActiveCfg({ ...activeCfg, minDrives: cleanNumericText(e.target.value) })} />
                  <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 6 }}>
                    Each player's tee shot must be used at least this many times over the round.
                  </div>
                </div>
              )}
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => wizardGoNext("field_limits", {})}>
                Continue
              </button>
            </div>
          )}

          {wizardStepId === "field_foursomeCount" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>How many foursomes?</div>
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
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => wizardGoNext("field_foursomeCount", {})}>
                Continue
              </button>
            </div>
          )}

          {wizardStepId === "field_prize" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>What's the prize for winning? (optional)</div>
              <input className="gsc-input" placeholder="e.g. Losers buy winners a drink at the 19th hole" value={activeCfg.prize} onChange={(e) => setActiveCfg({ ...activeCfg, prize: e.target.value })} />
              <button
                className="gsc-btn gsc-btn-primary"
                style={{ width: "100%", marginTop: 14 }}
                disabled={tournamentBusy}
                onClick={() => (isTournament ? proceedToFoursomeRoster() : wizardGoNext("field_prize", {}))}
              >
                Continue
              </button>
              {tournamentErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8 }}>{tournamentErr}</div>}
            </div>
          )}

          {wizardStepId === "field_venmo" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>Venmo handle for settling up? (optional)</div>
              <input className="gsc-input" placeholder="@your-venmo" value={cfg.venmo || ""} onChange={(e) => setCfg({ ...cfg, venmo: e.target.value })} />
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => wizardGoNext("field_venmo", {})}>
                Continue
              </button>
            </div>
          )}

          {wizardStepId === "field_players" && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10, fontSize: 16 }}>Who's playing? Add names and handicaps (optional)</div>
              <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10, fontWeight: 700 }}>
                Tap the circle next to a player's name to pick a fun avatar (optional).
              </div>
              {players.map((p, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div className="gsc-row">
                    <button
                      onClick={() => setAvatarPickerFor(avatarPickerFor === i ? null : i)}
                      style={{ position: "relative", flex: "0 0 40px", height: 40, borderRadius: "50%", border: p.avatar ? "1.5px solid #1B4332" : "1.5px dashed #B08D57", background: p.avatar ? "#fff" : "#EBF0EC", fontSize: p.avatar ? 20 : 12, fontWeight: 800, color: "#1B4332", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {p.avatar || LETTERS[i]}
                      {!p.avatar && (
                        <span style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#C1440E", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #F3EFE0" }}>
                          +
                        </span>
                      )}
                    </button>
                    <input className="gsc-input" placeholder={`Player ${LETTERS[i]} name`} value={p.name} onChange={(e) => updatePlayer(i, "name", e.target.value)} />
                    <input className="gsc-input" style={{ flex: "0 0 70px" }} placeholder="HCP" value={p.hcp} onChange={(e) => updatePlayer(i, "hcp", e.target.value)} />
                  </div>
                  {avatarPickerFor === i && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 4px 4px 46px" }}>
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => { updatePlayer(i, "avatar", p.avatar === emoji ? "" : emoji); setAvatarPickerFor(null); }}
                          style={{ width: 36, height: 36, borderRadius: "50%", border: p.avatar === emoji ? "2px solid #C1440E" : "1.5px solid #d8d2bd", background: "#fff", fontSize: 18, cursor: "pointer" }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 14 }} onClick={() => wizardGoNext("field_players", {})}>
                Continue
              </button>
            </div>
          )}

          {wizardStepId === "finish" && (
            <div className="gsc-card gsc-winner-card" style={{ textAlign: "center", padding: "32px 20px" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{"\u{1F389}"}</div>
              <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 8 }}>You're all set!</div>
              <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 16 }}>
                Time to head to the first hole.
              </div>
              {err && <div style={{ color: "#C1440E", fontSize: 13, marginBottom: 12 }}>{err}</div>}
              <button
                className="gsc-btn gsc-btn-primary"
                style={{ width: "100%" }}
                disabled={busy}
                onClick={finishSetup}
              >
                Let's play! {"\u26F3"}
              </button>
            </div>
          )}
        </div>
        {RulesModal()}
      </div>
    );
  }

  if (screen === "setup") {
    const g = GAMES[gameKey];
    const isTeamGame = gameKey === "seabluffe" || gameKey === "ponto" || gameKey === "beachside" || gameKey === "teamputts";
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header
          title={activeTournament ? activeTournament.name : g.name}
          sub={activeTournament ? `${g.name} - Foursome setup` : isTeamGame ? "Round setup (2 vs 2)" : "Round setup"}
          onBack={() => {
            if (activeTournament) setActiveTournament(null);
            goBack("roundsTab");
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
                Max over par: {activeTournament.cfg.maxOver}{GAMES[activeTournament.game].hasPutts ? ` - Max putts: ${activeTournament.cfg.maxPutts}` : ""} - Mulligans: {activeTournament.cfg.mulliganSegment}{activeTournament.game === "seabluffe" ? ` per ${mulliganWindow(activeTournament.game)} holes` : " per player"}
                <br />
                Prize: {activeTournament.cfg.prize}
                <br />
                Ranked by: strokes and putts (tracked separately, lowest wins each) - {GAMES[activeTournament.game].bestBall ? "best-ball (lowest single score) per hole" : "combined (all 4 players added) per hole"}
              </div>
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
            {!activeTournament && (
              <div className="gsc-field" style={{ marginTop: 12 }}>
                {courseName && courseSelectedViaSearch ? (
                  <div className="gsc-card gsc-winner-card" style={{ padding: 12 }}>
                    <div className="gsc-label" style={{ marginBottom: 4 }}>Selected Course</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{courseName}</div>
                    <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                      Par {par.reduce((a, b) => a + (Number(b) || 0), 0)} - {par.filter((p) => p !== "" && p != null).length}/18 holes entered
                    </div>
                    <button
                      className="gsc-link"
                      style={{ marginTop: 8, fontSize: 12 }}
                      onClick={() => {
                        setCourseName("");
                        setCourseSelectedViaSearch(false);
                        setCourseMsg("");
                      }}
                    >
                      Change course
                    </button>
                  </div>
                ) : (
                  <>
                <div className="gsc-label">Search for your course</div>
                <div className="gsc-row">
                  <input
                    className="gsc-input"
                    placeholder="e.g. Pebble Beach"
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchCourses()}
                  />
                  <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={courseSearchBusy} onClick={searchCourses}>
                    {courseSearchBusy ? "Searching..." : "Search"}
                  </button>
                </div>
                {courseSearchErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8 }}>{courseSearchErr}</div>}

                {courseSearchResults.length > 0 && !courseTeeOptions && (
                  <div style={{ marginTop: 10 }}>
                    {courseSearchResults.slice(0, 8).map((c) => (
                      <div
                        key={c.id}
                        className="gsc-card gsc-game-card"
                        style={{ marginBottom: 8, padding: 10 }}
                        onClick={() => selectCourseResult(c)}
                      >
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{c.club_name === c.course_name ? c.club_name : `${c.club_name} - ${c.course_name}`}</div>
                        {c.location && <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>{c.location.address}</div>}
                      </div>
                    ))}
                    {courseDetailBusy && <div style={{ fontSize: 12, color: "#6b6b63" }}>Loading course details...</div>}
                  </div>
                )}

                {courseTeeOptions && (
                  <div style={{ marginTop: 10 }}>
                    <div className="gsc-label">Pick a tee ({courseTeeOptions.courseLabel})</div>
                    <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 8 }}>
                      Par can differ slightly between tees at the same course - pick the one your group is actually playing.
                    </div>
                    {courseTeeOptions.tees.map((tee, i) => (
                      <div
                        key={i}
                        className="gsc-card gsc-game-card"
                        style={{ marginBottom: 8, padding: 10 }}
                        onClick={() => applyCourseTee(tee)}
                      >
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{tee.tee_name}</div>
                        <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                          Par {tee.par_total} - {tee.number_of_holes} holes{tee.total_yards ? ` - ${tee.total_yards} yds` : ""}
                        </div>
                      </div>
                    ))}
                    <button className="gsc-link" style={{ marginTop: 4, fontSize: 12 }} onClick={() => setCourseTeeOptions(null)}>
                      Back to search results
                    </button>
                  </div>
                )}
                {courseMsg && (
                  <div style={{ fontSize: 12, color: courseMsg.startsWith("Couldn't") ? "#C1440E" : "#B08D57", marginTop: 8 }}>
                    {courseMsg}
                  </div>
                )}
                <button className="gsc-link" style={{ marginTop: 10, fontSize: 12 }} onClick={() => setShowManualCourse((s) => !s)}>
                  {showManualCourse ? "Hide manual course entry" : "Course not listed? Enter or edit par manually"}
                </button>
                {showManualCourse && (
                  <div style={{ marginTop: 12 }}>
                    <div className="gsc-label" style={{ marginBottom: 10 }}>Enter or Edit Par Manually</div>
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
                    <div className="gsc-label" style={{ marginBottom: 6 }}>Par per hole</div>
                    <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 8 }}>
                      Enter par for every hole, or load a saved course above - you won't be able to create the round until all 18 are filled in.
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                      {par.map((v, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, textAlign: "center", color: "#6b6b63" }}>H{i + 1}</div>
                          <input
                            ref={(el) => (parRefsSetup.current[i] = el)}
                            className="gsc-input gsc-mono"
                            style={{ padding: "6px 2px", textAlign: "center", borderColor: v === "" || v == null ? "#C1440E" : undefined }}
                            type="number"
                            placeholder="-"
                            value={v}
                            onChange={(e) => {
                              // Strip any leading zeros (e.g. "02" -> "2"),
                              // and keep a cleared field truly empty rather
                              // than snapping to 0 - forcing it to 0 is what
                              // let the next keystroke land on top of a
                              // phantom "0" and produce "02".
                              const raw = e.target.value.replace(/^0+(?=\d)/, "");
                              const next = [...par];
                              next[i] = raw === "" ? "" : Number(raw);
                              setPar(next);
                              if (raw !== "" && i < 17 && parRefsSetup.current[i + 1]) {
                                parRefsSetup.current[i + 1].focus({ preventScroll: true });
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
                  </div>
                )}
                  </>
                )}
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
                <div className="gsc-label">{gameKey === "seabluffe" ? `Mulligans per player, per ${mulliganWindow(gameKey)} holes` : "Mulligans per player"}</div>
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
            {(gameKey === "swami" || gameKey === "dstreet" || gameKey === "pontobango" || gameKey === "individualputts") && (
              <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10 }}>
                This format supports {gameKey === "pontobango" || gameKey === "individualputts" ? "2-4" : "1-4"} players - add or remove players below to match who's actually playing.
              </div>
            )}
            <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10 }}>
              Tap the circle next to a player's name to pick a fun avatar (optional).
            </div>
            {players.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="gsc-row">
                  <button
                    onClick={() => setAvatarPickerFor(avatarPickerFor === i ? null : i)}
                    style={{
                      position: "relative",
                      flex: "0 0 40px",
                      height: 40,
                      borderRadius: "50%",
                      border: p.avatar ? "1.5px solid #1B4332" : "1.5px dashed #B08D57",
                      background: p.avatar ? "#fff" : "#EBF0EC",
                      fontSize: p.avatar ? 20 : 12,
                      fontWeight: 800,
                      color: "#1B4332",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Choose an avatar (optional)"
                  >
                    {p.avatar || LETTERS[i]}
                    {!p.avatar && (
                      <span style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#C1440E", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #F3EFE0" }}>
                        +
                      </span>
                    )}
                  </button>
                  <input className="gsc-input" placeholder={`Player ${LETTERS[i]} name`} value={p.name} onChange={(e) => updatePlayer(i, "name", e.target.value)} />
                  <input className="gsc-input" style={{ flex: "0 0 70px" }} placeholder="HCP" value={p.hcp} onChange={(e) => updatePlayer(i, "hcp", e.target.value)} />
                  {(gameKey === "swami" || gameKey === "dstreet" || gameKey === "pontobango" || gameKey === "individualputts") && players.length > (gameKey === "pontobango" || gameKey === "individualputts" ? 2 : 1) && (
                    <button
                      className="gsc-btn gsc-btn-outline"
                      style={{ flex: "0 0 auto", color: "#C1440E", borderColor: "#C1440E", padding: "9px 12px" }}
                      onClick={() => removePlayerSlot(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {avatarPickerFor === i && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 4px 4px 46px" }}>
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          updatePlayer(i, "avatar", p.avatar === emoji ? "" : emoji);
                          setAvatarPickerFor(null);
                        }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          border: p.avatar === emoji ? "2px solid #C1440E" : "1.5px solid #d8d2bd",
                          background: "#fff",
                          fontSize: 18,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {(gameKey === "swami" || gameKey === "dstreet" || gameKey === "pontobango" || gameKey === "individualputts") && players.length < 4 && (
              <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginTop: 4 }} onClick={addPlayerSlot}>
                + Add another player
              </button>
            )}
            {gameKey === "seabluffe" && (
              <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8, lineHeight: 1.5 }}>
                Rotation: Holes 1-6 {LETTERS[0]}+{LETTERS[1]} vs {LETTERS[2]}+{LETTERS[3]} - Holes 7-12 {LETTERS[0]}+{LETTERS[2]} vs {LETTERS[1]}+{LETTERS[3]} - Holes 13-18 {LETTERS[0]}+{LETTERS[3]} vs {LETTERS[1]}+{LETTERS[2]}
              </div>
            )}
            {(gameKey === "ponto" || gameKey === "beachside" || gameKey === "teamputts") && (
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

          {err && <div style={{ color: "#C1440E", marginBottom: 10 }}>{err}</div>}
          {storageBroken && (
            <div style={{ background: "#F8F1E4", color: "#8a6a2f", fontSize: 12, padding: "8px 10px", borderRadius: 8, marginBottom: 10 }}>
              Storage isn't responding right now. Your round will still be created and playable this session -{" "}
              <button className="gsc-link" onClick={retrySync}>Retry storage</button>.
            </div>
          )}
          {!storageBroken && storageWarning && <div style={{ color: "#B08D57", fontSize: 13, marginBottom: 10 }}>{storageWarning}</div>}
          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} disabled={busy} onClick={finishSetup}>
            {busy ? "Saving..." : activeTournament ? "Add my foursome & start playing" : "Create Round & Generate Share Code"}
          </button>
        </div>
        {RulesModal()}
      </div>
    );
  }

  if (screen === "tournamentCreate") {
    const tg = GAMES[tournamentGameKey];
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={tg.name} sub="Tournament setup - every foursome plays this format" onBack={() => goBack("tournamentsTab")} />
        <div className="gsc-body">
          <button className="gsc-link" style={{ marginBottom: 12, fontSize: 13 }} onClick={() => openRules(tournamentGameKey)}>
            View full rules for {tg.name}
          </button>
          <div className="gsc-card">
            <div className="gsc-label">Tournament name</div>
            <input className="gsc-input" placeholder="e.g. Club Championship" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} />
            <div className="gsc-field" style={{ marginTop: 12 }}>
              <div className="gsc-label">Date</div>
              <input className="gsc-input" type="date" value={tournamentDate} onChange={(e) => setTournamentDate(e.target.value)} />
            </div>
            <div className="gsc-field" style={{ marginTop: 12 }}>
              {tournamentCourseName && courseSelectedViaSearch ? (
                <div className="gsc-card gsc-winner-card" style={{ padding: 12 }}>
                  <div className="gsc-label" style={{ marginBottom: 4 }}>Selected Course</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{tournamentCourseName}</div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                    Par {tournamentPar.reduce((a, b) => a + (Number(b) || 0), 0)} - {tournamentPar.filter((p) => p !== "" && p != null).length}/18 holes entered
                  </div>
                  <button
                    className="gsc-link"
                    style={{ marginTop: 8, fontSize: 12 }}
                    onClick={() => {
                      setTournamentCourseName("");
                      setCourseSelectedViaSearch(false);
                      setCourseMsg("");
                    }}
                  >
                    Change course
                  </button>
                </div>
              ) : (
                <>
              <div className="gsc-label">Search for your course</div>
              <div className="gsc-row">
                <input
                  className="gsc-input"
                  placeholder="e.g. Pebble Beach"
                  value={courseSearchQuery}
                  onChange={(e) => setCourseSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchCourses()}
                />
                <button className="gsc-btn gsc-btn-primary" style={{ flex: "0 0 auto" }} disabled={courseSearchBusy} onClick={searchCourses}>
                  {courseSearchBusy ? "Searching..." : "Search"}
                </button>
              </div>
              {courseSearchErr && <div style={{ color: "#C1440E", fontSize: 12, marginTop: 8 }}>{courseSearchErr}</div>}

              {courseSearchResults.length > 0 && !courseTeeOptions && (
                <div style={{ marginTop: 10 }}>
                  {courseSearchResults.slice(0, 8).map((c) => (
                    <div
                      key={c.id}
                      className="gsc-card gsc-game-card"
                      style={{ marginBottom: 8, padding: 10 }}
                      onClick={() => selectCourseResult(c)}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{c.club_name === c.course_name ? c.club_name : `${c.club_name} - ${c.course_name}`}</div>
                      {c.location && <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>{c.location.address}</div>}
                    </div>
                  ))}
                  {courseDetailBusy && <div style={{ fontSize: 12, color: "#6b6b63" }}>Loading course details...</div>}
                </div>
              )}

              {courseTeeOptions && (
                <div style={{ marginTop: 10 }}>
                  <div className="gsc-label">Pick a tee ({courseTeeOptions.courseLabel})</div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 8 }}>
                    Par can differ slightly between tees at the same course - pick the one the tournament is playing.
                  </div>
                  {courseTeeOptions.tees.map((tee, i) => (
                    <div
                      key={i}
                      className="gsc-card gsc-game-card"
                      style={{ marginBottom: 8, padding: 10 }}
                      onClick={() => applyCourseTee(tee, true)}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{tee.tee_name}</div>
                      <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 2 }}>
                        Par {tee.par_total} - {tee.number_of_holes} holes{tee.total_yards ? ` - ${tee.total_yards} yds` : ""}
                      </div>
                    </div>
                  ))}
                  <button className="gsc-link" style={{ marginTop: 4, fontSize: 12 }} onClick={() => setCourseTeeOptions(null)}>
                    Back to search results
                  </button>
                </div>
              )}
              {courseMsg && (
                <div style={{ fontSize: 12, color: courseMsg.startsWith("Couldn't") ? "#C1440E" : "#B08D57", marginTop: 8 }}>
                  {courseMsg}
                </div>
              )}
              <button className="gsc-link" style={{ marginTop: 10, fontSize: 12 }} onClick={() => setShowManualCourse((s) => !s)}>
                {showManualCourse ? "Hide manual course entry" : "Course not listed? Enter or edit par manually"}
              </button>
              {showManualCourse && (
                <div style={{ marginTop: 12 }}>
                  <div className="gsc-label" style={{ marginBottom: 10 }}>Enter or Edit Par Manually</div>
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
                    <input className="gsc-input" placeholder="e.g. Seabluffe Golf Links" value={tournamentCourseName} onChange={(e) => setTournamentCourseName(e.target.value)} />
                  </div>
                  <div className="gsc-label" style={{ marginBottom: 6 }}>Par per hole</div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 8 }}>
                    Every foursome in this tournament plays the same course par. Enter par for all 18 holes to continue.
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                    {tournamentPar.map((v, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, textAlign: "center", color: "#6b6b63" }}>H{i + 1}</div>
                        <input
                          ref={(el) => (parRefsTournament.current[i] = el)}
                          className="gsc-input gsc-mono"
                          style={{ padding: "6px 2px", textAlign: "center", borderColor: v === "" || v == null ? "#C1440E" : undefined }}
                          type="number"
                          placeholder="-"
                          value={v}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/^0+(?=\d)/, "");
                            const next = [...tournamentPar];
                            next[i] = raw === "" ? "" : Number(raw);
                            setTournamentPar(next);
                            if (raw !== "" && i < 17 && parRefsTournament.current[i + 1]) {
                              parRefsTournament.current[i + 1].focus({ preventScroll: true });
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 8 }}>Total par: {tournamentPar.reduce((a, b) => a + (Number(b) || 0), 0)}</div>
                  <button className="gsc-btn gsc-btn-outline" style={{ marginTop: 10 }} onClick={() => saveCourseToIndex(tournamentCourseName, tournamentPar)}>
                    Save this course for next time
                  </button>
                </div>
              )}
                </>
              )}
            </div>
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
            {tg.hasPutts && (
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
            )}
            {tg.hasScore && (
              <div className="gsc-field">
                <div className="gsc-label">{tournamentGameKey === "seabluffe" ? `Mulligans per player, per ${mulliganWindow(tournamentGameKey)} holes` : "Mulligans per player"}</div>
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
            {tg.tracksDrives && (
              <div className="gsc-field">
                <div className="gsc-label">Minimum drives per player</div>
                <input
                  className="gsc-input"
                  type="number"
                  min="0"
                  value={tournamentCfg.minDrives}
                  onChange={(e) => {
                    const raw = cleanNumericText(e.target.value);
                    setTournamentCfg({ ...tournamentCfg, minDrives: raw === "" ? "" : Number(raw) });
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") setTournamentCfg((c) => ({ ...c, minDrives: 3 }));
                  }}
                />
                <div style={{ fontSize: 12, color: "#6b6b63", marginTop: 6 }}>
                  Each player's tee shot must be used at least this many times over the round.
                </div>
              </div>
            )}
            <div className="gsc-field">
              <div className="gsc-label">Prize / stakes</div>
              <input className="gsc-input" value={tournamentCfg.prize || ""} onChange={(e) => setTournamentCfg({ ...tournamentCfg, prize: e.target.value })} />
            </div>
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
        {RulesModal()}
      </div>
    );
  }

  if (screen === "tournamentRoster") {
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <Header title={tournamentName || "New Tournament"} sub="Add each foursome" onBack={() => goBack("tournamentCreate")} />
        <div className="gsc-body">
          <div style={{ fontSize: 13, color: "#4b4b45", marginBottom: 12 }}>
            Enter each foursome's name and its 4 players. You can always add more foursomes later with the tournament code.
          </div>
          {tournamentFoursomesDraft.map((f, fi) => (
            <div key={fi} className="gsc-card">
              <div className="gsc-label">Foursome name</div>
              <input className="gsc-input" style={{ marginBottom: 12 }} value={f.name} onChange={(e) => updateFoursomeDraftName(fi, e.target.value)} />
              <div className="gsc-label" style={{ marginBottom: 6 }}>Players</div>
              <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10 }}>
                Tap the circle next to a player's name to pick a fun avatar (optional).
              </div>
              {f.players.map((p, pi) => {
                const avatarKey = `${fi}-${pi}`;
                return (
                <div key={pi} style={{ marginBottom: 8 }}>
                  <div className="gsc-row">
                    <button
                      onClick={() => setAvatarPickerFor(avatarPickerFor === avatarKey ? null : avatarKey)}
                      style={{
                        position: "relative",
                        flex: "0 0 40px",
                        height: 40,
                        borderRadius: "50%",
                        border: p.avatar ? "1.5px solid #1B4332" : "1.5px dashed #B08D57",
                        background: p.avatar ? "#fff" : "#EBF0EC",
                        fontSize: p.avatar ? 20 : 12,
                        fontWeight: 800,
                        color: "#1B4332",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {p.avatar || LETTERS[pi]}
                      {!p.avatar && (
                        <span style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: "50%", background: "#C1440E", color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #F3EFE0" }}>
                          +
                        </span>
                      )}
                    </button>
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
                  {avatarPickerFor === avatarKey && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 4px 4px 46px" }}>
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            updateFoursomeDraftPlayer(fi, pi, "avatar", p.avatar === emoji ? "" : emoji);
                            setAvatarPickerFor(null);
                          }}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: p.avatar === emoji ? "2px solid #C1440E" : "1.5px solid #d8d2bd",
                            background: "#fff",
                            fontSize: 18,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
            <div className="gsc-mono" style={{ fontWeight: 700, fontSize: 15 }}>
              {row.error ? "-" : row[valueKey]}
            </div>
            {!row.error && (
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1B4332", whiteSpace: "nowrap" }}>
                Enter scores {"\u203A"}
              </div>
            )}
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
          onBack={() => setScreen("home")}
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
              {GAMES[t.game].oneTeamScore
                ? "Scramble scoring: the whole foursome shares one team stroke total per hole."
                : GAMES[t.game].bestBall
                ? "Best-ball scoring: each foursome's stroke and putt totals are the single lowest score among all 4 players on each hole."
                : "Combined scoring: each foursome's stroke and putt totals are all 4 players' scores added together."}
            </div>
          )}
          {board && t && (
            <button className="gsc-link" style={{ fontSize: 12, marginBottom: 12 }} onClick={() => openRules(t.game)}>
              View full rules for {GAMES[t.game].name}
            </button>
          )}
          {board && t && board.strokesRanked.length > 0 && (
            <div className="gsc-card" style={{ background: "#EBF0EC", border: "1px solid #1B4332" }}>
              <div style={{ fontSize: 13, color: "#1B4332", fontWeight: 700 }}>
                Tap a foursome below to enter (or view) hole-by-hole scores as you play.
              </div>
            </div>
          )}
          {board && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Ranked by Strokes</div>
              {board.strokesRanked.length === 0 && <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes have joined yet.</div>}
              {board.strokesRanked.map((row, idx) => renderFoursomeRow(row, idx, "totalStrokes", "strokeHoles"))}
            </div>
          )}
          {board && t && GAMES[t.game].hasPutts && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Ranked by Putts</div>
              {board.puttsRanked.length === 0 && <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes have joined yet.</div>}
              {board.puttsRanked.map((row, idx) => renderFoursomeRow(row, idx, "totalPutts", "puttHoles"))}
            </div>
          )}
          {t && (
            <button className="gsc-btn gsc-btn-outline" style={{ width: "100%", marginTop: 14 }} disabled={finishTournamentBusy} onClick={() => finishTournament(t)}>
              {finishTournamentBusy ? "Saving..." : "Finish tournament"}
            </button>
          )}
          {finishTournamentErr && <div style={{ color: "#C1440E", fontSize: 12, textAlign: "center", marginTop: 8 }}>{finishTournamentErr}</div>}
          <div style={{ fontSize: 11, color: "#8a8a80", textAlign: "center", marginTop: 6 }}>
            This moves it to "Finished tournaments" on the Tournaments tab - it won't be deleted, and every foursome's data stays exactly as it is.
          </div>
        </div>
        {EditFoursomeModal()}
        {RulesModal()}
      </div>
    );
  }

  if (screen === "roundComplete" && round && computed) {
    const g = GAMES[round.game];
    const ranks = playerRank();
    let winners = [];
    const isTwoVsTwoGame = round.game === "seabluffe" || round.game === "ponto" || round.game === "beachside" || round.game === "teamputts";
    if (!g.singleTeam && ranks.length > 0) {
      if (isTwoVsTwoGame) {
        // These are always 2v2 - the winning team is the top 2 ranked
        // players, full stop. Not filtered by an exact points match, since
        // that's a fragile way to say "the winning team" even though
        // teammates normally do share identical points.
        winners = ranks.slice(0, Math.min(2, ranks.length));
      } else if (g.totalScoring) {
        winners = ranks.filter((r) => r.score === ranks[0].score && r.putts === ranks[0].putts);
      } else {
        winners = ranks.filter((r) => r.points === ranks[0].points);
      }
    }
    const formatRelPar = (n) => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <div style={{ position: "relative", background: "#1B4332", padding: "28px 18px 22px", overflow: "hidden" }}>
          <Fireworks />
          <div style={{ position: "relative", textAlign: "center" }}>
            <img src={LOGO_DATA_URI} alt="RipScore logo" style={{ width: 66, height: "auto", marginBottom: 10 }} />
            <div className="gsc-display" style={{ fontSize: 24, fontWeight: 700, color: "#F3EFE0" }}>Round Complete!</div>
            <div style={{ fontSize: 13, color: "#F3EFE0", opacity: 0.8, marginTop: 4 }}>
              {round.name} - {g.name} - {round.date}
            </div>
          </div>
        </div>

        <div className="gsc-body">
          {g.singleTeam ? (
            <div className="gsc-card gsc-winner-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>&#127942;</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Nice round with your foursome!</div>
              <div style={{ fontSize: 13, color: "#6b6b63" }}>
                {round.tournamentId ? "Check the tournament leaderboard to see how you stack up against the other foursomes." : "Great playing today."}
              </div>
              {round.tournamentId && (
                <button className="gsc-btn gsc-btn-primary" style={{ marginTop: 12 }} onClick={() => openTournamentBoard(round.tournamentId)}>
                  View Leaderboard
                </button>
              )}
            </div>
          ) : (
            winners.length > 0 && (
              <div className="gsc-card gsc-winner-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>&#127942;</div>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: "#B08D57", marginBottom: 6 }}>
                  {winners.length > 1 ? "Winners" : "Winner"}
                </div>
                <div style={{ fontSize: 19, fontWeight: 700 }}>
                  {winners.map((w) => `${w.avatar ? w.avatar + " " : ""}${w.name}`).join(" & ")}
                </div>
                <div style={{ fontSize: 13, color: "#6b6b63", marginTop: 4 }}>
                  {g.rankByPutts
                    ? `${winners[0].putts} putts (${winners[0].score} strokes)`
                    : g.totalScoring
                    ? `${winners[0].score} strokes (${winners[0].putts} putts)`
                    : `${winners[0].points} pts (${winners[0].score}str/${winners[0].putts}putt/${formatRelPar(winners[0].relPar)})`}
                </div>
              </div>
            )
          )}

          {!g.singleTeam && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Final Standings</div>
              {ranks.map((p, idx) => {
                const isWinner = winners.some((w) => w.idx === p.idx);
                return (
                  <div
                    key={p.idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: idx === ranks.length - 1 ? "none" : "1px solid #eee6cf",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>
                      {isWinner && <span style={{ marginRight: 6 }}>&#127942;</span>}
                      {p.avatar && <span style={{ marginRight: 4 }}>{p.avatar}</span>}
                      {p.name}
                    </div>
                    <div className="gsc-mono" style={{ fontWeight: 700 }}>
                      {g.rankByPutts ? (
                        <span style={{ fontSize: 17 }}>{p.putts}put/{p.score}str</span>
                      ) : g.totalScoring ? (
                        <span style={{ fontSize: 17 }}>{p.score}str/{p.putts}put</span>
                      ) : (
                        <>
                          {p.points} pts <span style={{ fontWeight: 700, color: "#6b6b63" }}>({p.score}str/{p.putts}putt/{formatRelPar(p.relPar)})</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <a
            href="https://www.ghin.com"
            target="_blank"
            rel="noreferrer"
            className="gsc-btn gsc-btn-outline"
            style={{ width: "100%", marginTop: 4, display: "block", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}
          >
            Post this score to GHIN {"\u2197"}
          </a>

          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={finishCelebrationAndGoHome}>
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  if (screen === "tournamentCreatedCelebration" && tournamentCreatedSnapshot) {
    const { tournament: ct, foursomeCount } = tournamentCreatedSnapshot;
    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <div style={{ position: "relative", background: "#1B4332", padding: "28px 18px 22px", overflow: "hidden" }}>
          <Fireworks />
          <div style={{ position: "relative", textAlign: "center" }}>
            <img src={LOGO_DATA_URI} alt="RipScore logo" style={{ width: 66, height: "auto", marginBottom: 10 }} />
            <div className="gsc-display" style={{ fontSize: 24, fontWeight: 700, color: "#F3EFE0" }}>You're All Set!</div>
            <div style={{ fontSize: 13, color: "#F3EFE0", opacity: 0.8, marginTop: 4 }}>
              {ct.name} - {GAMES[ct.game].name}
            </div>
          </div>
        </div>

        <div className="gsc-body">
          <div className="gsc-card gsc-winner-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>&#127943;</div>
            <div style={{ fontWeight: 700, fontSize: 19 }}>
              {foursomeCount} foursome{foursomeCount === 1 ? "" : "s"} ready to play
            </div>
            <div style={{ fontSize: 13, color: "#6b6b63", marginTop: 6 }}>
              Share tournament code <span className="gsc-mono" style={{ fontWeight: 700 }}>{ct.id}</span> so more foursomes can join any time.
            </div>
          </div>

          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={() => { setTournamentCreatedSnapshot(null); openTournamentBoard(ct.id); }}>
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  if (screen === "tournamentFinishCelebration" && tournamentFinishSnapshot) {
    const { tournament: ft, strokesRanked, puttsRanked, hasPutts } = tournamentFinishSnapshot;
    const strokesWinner = strokesRanked.find((r) => !r.error);
    const puttsWinner = hasPutts ? puttsRanked.find((r) => !r.error) : null;
    const sameWinner = puttsWinner && strokesWinner && puttsWinner.id === strokesWinner.id;

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        <div style={{ position: "relative", background: "#1B4332", padding: "28px 18px 22px", overflow: "hidden" }}>
          <Fireworks />
          <div style={{ position: "relative", textAlign: "center" }}>
            <img src={LOGO_DATA_URI} alt="RipScore logo" style={{ width: 66, height: "auto", marginBottom: 10 }} />
            <div className="gsc-display" style={{ fontSize: 24, fontWeight: 700, color: "#F3EFE0" }}>Tournament Complete!</div>
            <div style={{ fontSize: 13, color: "#F3EFE0", opacity: 0.8, marginTop: 4 }}>
              {ft.name} - {GAMES[ft.game].name} - {ft.date}
            </div>
          </div>
        </div>

        <div className="gsc-body">
          {strokesWinner ? (
            <div className="gsc-card gsc-winner-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>&#127942;</div>
              <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: "#B08D57", marginBottom: 6 }}>
                {sameWinner ? "Tournament Winner" : "Strokes Winner"}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{strokesWinner.name}</div>
              <div style={{ fontSize: 13, color: "#6b6b63", marginTop: 4 }}>{strokesWinner.totalStrokes} total strokes</div>
              {hasPutts && puttsWinner && !sameWinner && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #e4ded0" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: "#B08D57", marginBottom: 6 }}>
                    Putts Winner
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 700 }}>{puttsWinner.name}</div>
                  <div style={{ fontSize: 13, color: "#6b6b63", marginTop: 4 }}>{puttsWinner.totalPutts} total putts</div>
                </div>
              )}
            </div>
          ) : (
            <div className="gsc-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes finished this tournament.</div>
            </div>
          )}

          {strokesRanked.length > 0 && (
            <div className="gsc-card">
              <div className="gsc-label" style={{ marginBottom: 10 }}>Final Standings - Strokes</div>
              {strokesRanked.map((row, idx) => (
                <div key={row.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: idx === strokesRanked.length - 1 ? "none" : "1px solid #eee6cf" }}>
                  <div style={{ fontWeight: idx === 0 ? 700 : 400 }}>
                    {idx === 0 && <span style={{ marginRight: 6 }}>&#127942;</span>}
                    {idx + 1}. {row.name}
                  </div>
                  <div className="gsc-mono" style={{ fontWeight: 700 }}>{row.error ? "-" : row.totalStrokes}</div>
                </div>
              ))}
            </div>
          )}

          <button className="gsc-btn gsc-btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={() => { setTournamentFinishSnapshot(null); goToScreen("tournamentsTab"); }}>
            Continue to Tournaments
          </button>
        </div>
      </div>
    );
  }

  if (screen === "card" && round && computed) {
    const g = GAMES[round.game];
    const parH = round.par[holeIdx] ?? 4;
    const hs = round.scores[holeIdx] || {};
    const mulSeg = Math.floor(holeIdx / mulliganWindow(round.game));
    const teamsThisHole = computeTeamsForHole(round, holeIdx, hs);
    const hr = computed.holeResults[holeIdx];
    const ranks = playerRank();
    const foursomeTotals = g.singleTeam ? computeTournamentFoursomeTotals(round) : null;


    // Raw totals for the full 18-hole grid's Total and +/- Par rows - these
    // sum exactly what's shown in each cell (uncapped, as entered), and only
    // count holes that have actually been played so an in-progress round
    // doesn't show a misleading total.
    function rangeTotals(startHole, endHoleExclusive) {
      return round.players.map((_, i) => {
        let sSum = 0, sCount = 0, pSum = 0, pCount = 0, relPar = 0;
        for (let h = startHole; h < endHoleExclusive; h++) {
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
    }
    const gridTotals = rangeTotals(0, 18);
    const frontNineTotals = rangeTotals(0, 9);
    const backNineTotals = rangeTotals(9, 18);
    const formatRelPar = (n) => (n === 0 ? "E" : n > 0 ? `+${n}` : `${n}`);

    return (
      <div className="gsc">
        <style>{STYLE}</style>
        {inPlayFireworks && (
          <div style={{ position: "fixed", inset: 0, zIndex: 39, pointerEvents: "none" }}>
            <Fireworks />
          </div>
        )}
        {accolade && (
          <div key={accolade.key} className="gsc-accolade">
            <div style={{ fontSize: accolade.big ? 32 : 22 }}>{accolade.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: accolade.big ? 20 : 15, marginTop: 2 }}>{accolade.text}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{accolade.player}</div>
          </div>
        )}
        <Header
          title={round.name}
          sub={`${g.name} - ${round.date}${round.course ? " - " + round.course : ""}`}
          onBack={requestLeaveRound}
          backExtra={
            <button
              style={{
                background: "rgba(243,239,224,0.15)",
                border: "1px solid rgba(243,239,224,0.4)",
                color: "#F3EFE0",
                fontSize: 10,
                fontWeight: 600,
                padding: "5px 4px",
                borderRadius: 6,
                cursor: "pointer",
                width: 84,
                textAlign: "center",
                lineHeight: 1.25,
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => syncRoundFromServer(true)}
            >
              {syncStatus === "syncing" ? "Refreshing..." : syncStatus === "synced" ? "Up To Date \u2713" : syncStatus === "error" ? "Couldn't Refresh" : "Refresh Scores"}
            </button>
          }
          right={
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, alignSelf: "flex-start", marginRight: 10 }}>
              <div className="gsc-code" style={{ width: 84, textAlign: "center" }}>{round.id}</div>
              <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => openRules(round.game)}>
                Rules
              </button>
              {round.tournamentId && (
                <button className="gsc-link" style={{ color: "#F3EFE0", fontSize: 11, textDecoration: "underline" }} onClick={() => openTournamentBoard(round.tournamentId)}>
                  Leaderboard
                </button>
              )}
            </div>
          }
        />
        {storageBroken ? (
          <div style={{ background: "#F8F1E4", color: "#8a6a2f", fontSize: 12, padding: "8px 16px", textAlign: "center" }}>
            Storage isn't responding right now, so nothing is saving automatically. Your scores are fine for this session -{" "}
            <button className="gsc-link" onClick={retrySync}>Retry storage</button> to reconnect.
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
                {(() => {
                  const yd = (round.yardage || [])[holeIdx];
                  const si = (round.strokeIndex || [])[holeIdx];
                  if (yd == null && si == null) return null;
                  return (
                    <div style={{ fontSize: 12, color: "#6b6b63", fontWeight: 600, marginTop: 2 }}>
                      {yd != null && `${yd} yds`}
                      {yd != null && si != null && " \u00B7 "}
                      {si != null && `HCP ${si}`}
                    </div>
                  );
                })()}
                {round.holeGPS && round.holeGPS[holeIdx] && (() => {
                  const green = round.holeGPS[holeIdx];
                  let distanceLabel = null;
                  if (gpsStatus === "active" && playerGPS) {
                    const yds = Math.round(haversineYards(playerGPS.lat, playerGPS.lng, green.lat, green.lng));
                    distanceLabel = `${yds} yds to green`;
                  } else if (gpsStatus === "locating") {
                    distanceLabel = "Finding your location...";
                  } else if (gpsStatus === "denied") {
                    distanceLabel = "Location access denied - enable it to see distance";
                  } else if (gpsStatus === "unsupported") {
                    distanceLabel = "Distance to green isn't supported on this device";
                  } else if (gpsStatus === "error") {
                    distanceLabel = "Couldn't get your location";
                  }
                  return (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: "#EBF0EC", color: "#1B4332", fontWeight: 700, fontSize: 13, padding: "5px 12px", borderRadius: 20 }}>
                      {"\u26F3"} {distanceLabel}
                    </div>
                  );
                })()}
                {round.game === "seabluffe" && (
                  <div style={{ fontSize: 12, color: "#B08D57", fontWeight: 700, marginTop: 4 }}>
                    {round.players[teamsThisHole[0][0]].name}+{round.players[teamsThisHole[0][1]].name} vs {round.players[teamsThisHole[1][0]].name}+{round.players[teamsThisHole[1][1]].name}
                  </div>
                )}
              </div>
              <button className="gsc-btn gsc-btn-outline" disabled={holeIdx === 17} onClick={() => setHoleIdx((h) => h + 1)}>Next</button>
            </div>

            {g.oneTeamScore ? (
              (() => {
                const teamEntry = hs[0] || {};
                const driveUsedBy = hs.driveUsedBy;
                let driveCounts = null;
                if (g.tracksDrives) {
                  driveCounts = round.players.map(() => 0);
                  for (let h = 0; h < 18; h++) {
                    const usedBy = (round.scores[h] || {}).driveUsedBy;
                    if (usedBy != null && driveCounts[usedBy] != null) driveCounts[usedBy]++;
                  }
                }
                const minDrives = Number(round.cfg.minDrives) || 0;
                return (
                  <div className="gsc-player-row">
                    <div className="gsc-player-name">Team Strokes</div>
                    <div style={{ display: "flex", gap: 22, marginTop: 8, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3, textAlign: "center" }}>STROKES</div>
                        <div className="gsc-stepper">
                          <button
                            disabled={teamEntry.strokes === "" || teamEntry.strokes == null}
                            onClick={() => {
                              if (teamEntry.strokes === "" || teamEntry.strokes == null) return;
                              const n = Number(teamEntry.strokes);
                              updateTeamHoleEntry("strokes", n <= 1 ? "" : n - 1);
                            }}
                          >
                            -
                          </button>
                          <div className="gsc-stepper-val">{teamEntry.strokes === "" || teamEntry.strokes == null ? "-" : teamEntry.strokes}</div>
                          <button onClick={() => updateTeamHoleEntry("strokes", (Number(teamEntry.strokes) || 0) + 1)}>+</button>
                        </div>
                      </div>
                    </div>

                    {g.tracksDrives && (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 6 }}>WHOSE DRIVE WAS USED THIS HOLE?</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {round.players.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => updateDriveUsedBy(i)}
                              style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: driveUsedBy === i ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
                                background: driveUsedBy === i ? "#EBF0EC" : "#fff",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              {p.avatar && <span style={{ marginRight: 4 }}>{p.avatar}</span>}
                              {p.name}
                            </button>
                          ))}
                        </div>

                        <div style={{ fontSize: 11, color: "#6b6b63", marginTop: 14, marginBottom: 6 }}>
                          DRIVES USED (MIN {minDrives} EACH)
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {round.players.map((p, i) => {
                            const count = driveCounts[i];
                            const met = count >= minDrives;
                            return (
                              <div
                                key={i}
                                style={{
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  background: met ? "#EBF0EC" : "#FBEFE3",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: met ? "#1B4332" : "#8a6a2f",
                                }}
                              >
                                {p.name}: {count}/{minDrives} {met && "\u2713"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
            round.players.map((p, i) => {
              const teamIdxInHole = teamsThisHole.findIndex((t) => t.includes(i));
              const cls = TEAM_CLASS[teamIdxInHole % 4];
              const e = hs[i] || {};
              const mulLeft = g.hasScore ? (round.cfg.mulliganSegment ?? 1) - computed.mulligansUsed[i][mulSeg] : null;
              return (
                <div key={i} className={`gsc-player-row ${cls}`}>
                  <div className="gsc-player-name">
                    <button
                      onClick={() => setScoringAvatarPickerFor((cur) => (cur === i ? null : i))}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: p.avatar ? "1.5px solid #1B4332" : "1.5px dashed #B08D57",
                        background: p.avatar ? "#fff" : "#EBF0EC",
                        fontSize: p.avatar ? 15 : 10,
                        fontWeight: 800,
                        color: "#1B4332",
                        cursor: "pointer",
                        verticalAlign: "middle",
                        marginRight: 6,
                        padding: 0,
                      }}
                      title="Tap to change avatar"
                    >
                      {p.avatar || "+"}
                    </button>
                    {p.name}
                    {p.hcp && <span className="gsc-hcp">HCP {p.hcp}</span>}
                    {g.tracksWolf && i === wolfIndexForHole(holeIdx) && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 10,
                          fontWeight: 800,
                          color: "#fff",
                          background: "#C1440E",
                          padding: "2px 7px",
                          borderRadius: 20,
                          verticalAlign: "middle",
                        }}
                      >
                        {"\u{1F43A}"} WOLF
                      </span>
                    )}
                  </div>
                  {scoringAvatarPickerFor === i && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 0 4px" }}>
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => updateRoundPlayerAvatar(i, p.avatar === emoji ? "" : emoji)}
                          style={{ width: 34, height: 34, borderRadius: "50%", border: p.avatar === emoji ? "2px solid #C1440E" : "1.5px solid #d8d2bd", background: "#fff", fontSize: 17, cursor: "pointer" }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 22, marginTop: 8, flexWrap: "wrap" }}>
                    {g.hasScore && (
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3, textAlign: "center" }}>STROKES</div>
                        <div className="gsc-stepper">
                          <button
                            disabled={e.strokes === "" || e.strokes == null}
                            onClick={() => {
                              if (e.strokes === "" || e.strokes == null) return;
                              const n = Number(e.strokes);
                              updateHoleEntry(i, "strokes", n <= 1 ? "" : n - 1);
                            }}
                          >
                            -
                          </button>
                          <div className="gsc-stepper-val">{e.strokes === "" || e.strokes == null ? "-" : e.strokes}</div>
                          <button onClick={() => updateHoleEntry(i, "strokes", (Number(e.strokes) || 0) + 1)}>+</button>
                        </div>
                      </div>
                    )}
                    {g.hasPutts && (
                      <div>
                        <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 3, textAlign: "center" }}>PUTTS</div>
                        <div className="gsc-stepper">
                          <button
                            disabled={e.putts === "" || e.putts == null}
                            onClick={() => {
                              if (e.putts === "" || e.putts == null) return;
                              const n = Number(e.putts);
                              updateHoleEntry(i, "putts", n <= 0 ? "" : n - 1);
                            }}
                          >
                            -
                          </button>
                          <div className="gsc-stepper-val">{e.putts === "" || e.putts == null ? "-" : e.putts}</div>
                          <button onClick={() => updateHoleEntry(i, "putts", (Number(e.putts) || 0) + 1)}>+</button>
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
            })
            )}

            {g.tracksPontoBangoBongo && (() => {
              const selectors = [
                { field: "pontoBy", label: "BINGO - first player on the green" },
                { field: "bangoBy", label: "BANGO - closest to the pin once everyone's on" },
                { field: "bongoBy", label: "BONGO - first player to hole out" },
              ];
              return (
                <div className="gsc-card" style={{ marginTop: 10 }}>
                  <div className="gsc-label" style={{ marginBottom: 10 }}>Bingo Bango Bongo - who won this hole?</div>
                  {selectors.map(({ field, label }) => (
                    <div key={field} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: "#6b6b63", marginBottom: 6 }}>{label}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {round.players.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => updateHoleWinner(field, i)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: hs[field] === i ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
                              background: hs[field] === i ? "#EBF0EC" : "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            {p.avatar && <span style={{ marginRight: 4 }}>{p.avatar}</span>}
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {g.tracksWolf && (() => {
              const wolfIdx = wolfIndexForHole(holeIdx);
              const wolfPlayer = round.players[wolfIdx];
              const others = [0, 1, 2, 3].filter((i) => i !== wolfIdx);
              const current = hs.wolfPartner;
              return (
                <div className="gsc-card" style={{ marginTop: 10 }}>
                  <div className="gsc-label" style={{ marginBottom: 4 }}>
                    {"\u{1F43A}"} This hole's Wolf: {wolfPlayer ? wolfPlayer.name : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b6b63", marginBottom: 10 }}>
                    Wolf picks a partner after watching the other drives, or goes it alone.
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {others.map((i) => {
                      const p = round.players[i];
                      return (
                        <button
                          key={i}
                          onClick={() => updateHoleWinner("wolfPartner", i)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: current === i ? "2px solid #1B4332" : "1.5px solid #d8d2bd",
                            background: current === i ? "#EBF0EC" : "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          {p.avatar && <span style={{ marginRight: 4 }}>{p.avatar}</span>}
                          {p.name}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => updateHoleWinner("wolfPartner", "lone")}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: current === "lone" ? "2px solid #C1440E" : "1.5px solid #d8d2bd",
                        background: current === "lone" ? "#FBEFE3" : "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        color: current === "lone" ? "#8a4a1f" : undefined,
                      }}
                    >
                      {"\u{1F43A}"} Go Lone Wolf
                    </button>
                  </div>
                  {current == null && (
                    <div style={{ fontSize: 12, color: "#8a6a2f", marginTop: 10 }}>
                      No points are awarded for this hole until a partner (or Lone Wolf) is chosen.
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ marginTop: 6 }}>
              {teamsThisHole.map((team, ti) => {
                const label = g.singleTeam ? "Foursome" : team.map((p) => round.players[p].name).join("+");
                const r = hr.teamRes[ti];
                const pts = hr.ptsAwarded[ti];
                return (
                  <div key={ti} style={{ fontSize: 12, marginTop: 4 }}>
                    <b>{label}</b>{" "}
                    {g.hasScore && <span>{g.oneTeamScore ? "team strokes" : g.bestBall ? "best strokes" : g.singleTeam ? "combined strokes" : "score"} {r.scoreSum ?? "-"} </span>}
                    {g.hasPutts && <span>{g.bestBall ? "best putts" : g.singleTeam ? "combined putts" : "putts"} {r.puttSum ?? "-"} </span>}
                    {(pts.score > 0 || pts.putt > 0) && <span className="gsc-chip gsc-lead">+{pts.score + pts.putt} pt</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {g.singleTeam && (
            <div className="gsc-card" style={{ border: "2px solid #B08D57" }}>
              <div className="gsc-label" style={{ marginBottom: 8 }}>Foursome {g.oneTeamScore ? "Team" : g.bestBall ? "Best-Ball" : "Combined"} Totals</div>
              <div style={{ fontSize: 13, color: "#4b4b45", lineHeight: 1.6 }}>
                {g.oneTeamScore ? "Team" : g.bestBall ? "Best-ball" : "Combined"} strokes: <b>{foursomeTotals.totalStrokes}</b> (thru {foursomeTotals.strokeHoles} holes)
                {g.hasPutts && (
                  <>
                    <br />
                    {g.bestBall ? "Best-ball" : "Combined"} putts: <b>{foursomeTotals.totalPutts}</b> (thru {foursomeTotals.puttHoles} holes)
                  </>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#8a8a80", marginTop: 8 }}>
                This is what counts on the tournament leaderboard - check the Leaderboard link above to see how this foursome ranks against the others.
              </div>
              {g.tracksDrives && (() => {
                const minDrives = Number(round.cfg.minDrives) || 0;
                const driveCounts = round.players.map(() => 0);
                for (let h = 0; h < 18; h++) {
                  const usedBy = (round.scores[h] || {}).driveUsedBy;
                  if (usedBy != null && driveCounts[usedBy] != null) driveCounts[usedBy]++;
                }
                const shortPlayers = round.players.filter((_, i) => driveCounts[i] < minDrives);
                return (
                  <div style={{ fontSize: 12, marginTop: 8, color: shortPlayers.length === 0 ? "#1B4332" : "#8a6a2f" }}>
                    <b>Drive quota:</b>{" "}
                    {shortPlayers.length === 0
                      ? `All players have met the minimum ${minDrives} drives \u2713`
                      : `${shortPlayers.length} player${shortPlayers.length === 1 ? "" : "s"} still short of the minimum ${minDrives} drives`}
                  </div>
                );
              })()}
            </div>
          )}

          {g.oneTeamScore && round.tournamentId ? (
            <div className="gsc-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div className="gsc-label" style={{ marginBottom: 0 }}>Tournament Leaderboard</div>
                <button className="gsc-btn gsc-btn-outline" style={{ padding: "6px 10px", fontSize: 12, minHeight: "auto" }} disabled={boardLoading} onClick={() => loadTournamentBoard(round.tournamentId)}>
                  {boardLoading ? "Refreshing..." : "Refresh leaderboard"}
                </button>
              </div>
              {boardErr && <div style={{ color: "#C1440E", fontSize: 12, marginBottom: 8 }}>{boardErr}</div>}
              {board && board.tournament && board.tournament.id === round.tournamentId ? (
                board.strokesRanked.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#6b6b63" }}>No foursomes have joined yet.</div>
                ) : (
                  board.strokesRanked.map((row, idx) => (
                    <div
                      key={row.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #eee6cf",
                        background: row.id === round.id ? "#F0EEE3" : undefined,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {idx + 1}. {row.name} {row.id === round.id && <span className="gsc-chip gsc-lead">YOU</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b6b63" }}>{row.error ? `Couldn't load (${row.error})` : `Thru ${row.strokeHoles} holes`}</div>
                      </div>
                      <div className="gsc-mono" style={{ fontWeight: 700, fontSize: 14 }}>{row.error ? "-" : row.totalStrokes}</div>
                    </div>
                  ))
                )
              ) : (
                !boardLoading && <div style={{ fontSize: 13, color: "#6b6b63" }}>Tap "Refresh leaderboard" to load standings.</div>
              )}
            </div>
          ) : (
          <div className="gsc-card">
            <div className="gsc-label" style={{ marginBottom: 8 }}>Standings</div>
            {ranks.map((p, idx) => (
              <div key={p.idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #eee6cf", fontSize: 13 }}>
                <div style={{ fontWeight: 700 }}>
                  {p.avatar && <span style={{ marginRight: 4 }}>{p.avatar}</span>}
                  {p.name}
                  {g.totalScoring && holeIdx === 17 && hr.complete && idx === 0 && <span className="gsc-chip gsc-lead">WINNER</span>}
                  {!g.singleTeam && !g.totalScoring && holeIdx === 17 && hr.complete && idx < Math.floor(ranks.length / 2) && <span className="gsc-chip gsc-lead">WIN</span>}
                  {!g.singleTeam && !g.totalScoring && holeIdx === 17 && hr.complete && idx >= Math.ceil(ranks.length / 2) && <span className="gsc-chip gsc-loss">LOSS</span>}
                </div>
                <div className="gsc-mono" style={{ fontWeight: 700 }}>
                  {!g.singleTeam && !g.totalScoring && <>{p.points} pts </>}
                  {g.rankByPutts ? (
                    <span style={{ fontWeight: 700, fontSize: 17, whiteSpace: "nowrap" }}>{p.putts}putt/{p.score}str/{formatRelPar(p.relPar)}</span>
                  ) : g.totalScoring ? (
                    <span style={{ fontWeight: 700, fontSize: 17, whiteSpace: "nowrap" }}>{p.score}str/{p.putts}putt/{formatRelPar(p.relPar)}</span>
                  ) : (
                    <span style={{ fontWeight: 700, color: "#6b6b63", whiteSpace: "nowrap" }}>({p.score}str/{p.putts}putt/{formatRelPar(p.relPar)})</span>
                  )}
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
          )}

          <button className="gsc-link" onClick={() => setShowGrid((s) => !s)}>{showGrid ? "Hide" : "Show"} full 18-hole grid</button>
          {showGrid && (() => {
            const hasYardageCol = round.yardage && round.yardage.some((y) => y != null);
            const hasStrokeIndexCol = round.strokeIndex && round.strokeIndex.some((s) => s != null);
            const labelColSpan = 2 + (hasYardageCol ? 1 : 0) + (hasStrokeIndexCol ? 1 : 0);
            return (
            <div className="gsc-card" style={{ overflowX: "auto", marginTop: 10 }}>
              <table className="gsc-grid">
                <thead>
                  <tr>
                    <th>Hole</th>
                    <th>Par</th>
                    {hasYardageCol && <th>Yds</th>}
                    {hasStrokeIndexCol && <th>HCP</th>}
                    {round.players.map((p, i) => (
                      <th key={i} style={{ minWidth: 56 }}>
                        {p.avatar && <span style={{ fontSize: 14 }}>{p.avatar}</span>}
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "none", opacity: 0.9, marginTop: 1, whiteSpace: "normal", lineHeight: 1.2 }}>
                          {(p.name || "").trim()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 18 }).map((_, h) => (
                    <React.Fragment key={h}>
                      <tr onClick={() => setHoleIdx(h)} style={{ cursor: "pointer", background: h === holeIdx ? "#F0EEE3" : undefined }}>
                        <td>{h + 1}</td>
                        <td>{round.par[h]}</td>
                        {hasYardageCol && <td>{round.yardage[h] != null ? round.yardage[h] : "-"}</td>}
                        {hasStrokeIndexCol && <td>{round.strokeIndex[h] != null ? round.strokeIndex[h] : "-"}</td>}
                        {round.players.map((_, i) => {
                          const e = (round.scores[h] || {})[i] || {};
                          return (
                            <td key={i}>
                              {g.hasScore ? (e.strokes === "" || e.strokes == null ? "-" : e.strokes) : ""}
                              {g.hasScore && g.hasPutts ? "/" : ""}
                              {g.hasPutts ? (e.putts === "" || e.putts == null ? "-" : e.putts) : ""}
                            </td>
                          );
                        })}
                      </tr>
                      {h === 8 && (
                        <tr style={{ fontWeight: 700, background: "#EFEAD9" }}>
                          <td colSpan={labelColSpan}>OUT</td>
                          {round.players.map((_, i) => {
                            const t = frontNineTotals[i];
                            return (
                              <td key={i}>
                                {g.hasScore ? (t.sCount ? t.sSum : "-") : ""}
                                {g.hasScore && g.hasPutts ? "/" : ""}
                                {g.hasPutts ? (t.pCount ? t.pSum : "-") : ""}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                      {h === 17 && (
                        <tr style={{ fontWeight: 700, background: "#EFEAD9" }}>
                          <td colSpan={labelColSpan}>IN</td>
                          {round.players.map((_, i) => {
                            const t = backNineTotals[i];
                            return (
                              <td key={i}>
                                {g.hasScore ? (t.sCount ? t.sSum : "-") : ""}
                                {g.hasScore && g.hasPutts ? "/" : ""}
                                {g.hasPutts ? (t.pCount ? t.pSum : "-") : ""}
                              </td>
                            );
                          })}
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2 + round.players.length} style={{ padding: 0, height: 10, background: "#fff", border: "none" }}></td>
                  </tr>
                  <tr style={{ fontWeight: 700, background: "#F0EEE3" }}>
                    <td colSpan={labelColSpan}>Total</td>
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
                      <td colSpan={labelColSpan}>+/- Par</td>
                      {round.players.map((_, i) => {
                        const t = gridTotals[i];
                        return <td key={i}>{t.sCount ? formatRelPar(t.relPar) : "-"}</td>;
                      })}
                    </tr>
                  )}
                  {!g.totalScoring && (
                    <tr style={{ fontWeight: 700, background: "#EBF0EC" }}>
                      <td colSpan={labelColSpan}>Points</td>
                      {round.players.map((_, i) => (
                        <td key={i}>{computed.playerPoints[i]}</td>
                      ))}
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2 + round.players.length} style={{ padding: 0, height: 10, background: "#fff", border: "none" }}></td>
                  </tr>
                  <tr style={{ fontWeight: 700, background: "#F0EEE3" }}>
                    <td colSpan={labelColSpan}>Handicap</td>
                    {round.players.map((p, i) => (
                      <td key={i}>{p.hcp !== "" && p.hcp != null ? p.hcp : "-"}</td>
                    ))}
                  </tr>
                  <tr style={{ fontWeight: 700, background: "#F8F1E4" }}>
                    <td colSpan={labelColSpan}>Net Strokes</td>
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
            );
          })()}

          <div style={{ fontSize: 12, color: "#8a8a80", textAlign: "center", marginTop: 16 }}>
            Share code <b className="gsc-mono">{round.id}</b> with your group so everyone can enter or view scores.
          </div>
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
                {round && round.tournamentId
                  ? "Your scores are saved, and you can pick up right where you left off by opening this foursome from the Leaderboard. Are you sure you want to leave?"
                  : "Your scores are saved, and you can pick up right where you left off from \"Continue round\" on the home screen. Are you sure you want to leave?"}
              </div>
              <div className="gsc-modal-row">
                <button className="gsc-btn gsc-btn-outline" onClick={cancelLeaveRound}>No, stay</button>
                <button className="gsc-btn gsc-btn-primary" onClick={confirmLeaveRound}>Yes, leave</button>
              </div>
            </div>
          </div>
        )}
        {RulesModal()}
        {EditFoursomeModal()}
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
