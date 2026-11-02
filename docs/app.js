import {
  TYPES,
  LEVELS,
  TYPE_INFO,
  descriptor,
  parseId,
  generate,
  emptyPlan,
  evaluate,
  solve,
  validateConfig,
  routeStats,
  csv,
  clock,
} from "./engine.js?v=4";
import * as cloud from "./cloud.js?v=4";
import { TOOLS, sample, calculate } from "./kit.js?v=4";
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  back: "m14 6-6 6 6 6",
  spark: "m12 2 2.8 6.2L22 11l-6.5 3 1 7-4.5-4-5 4 1-7L2 11l7-2.8L12 2Z",
  calendar: "M5 5h14v15H5zM8 2v6m8-6v6M5 10h14m-10 4h2m3 0h2m-7 3h2",
  truck:
    "M2 5h12v12H2zM14 9h4l4 4v4h-8M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  box: "m3 7 9-4 9 4-9 4-9-4Zm0 0v11l9 4 9-4V7M12 11v11M7 5l10 4",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  bookmark: "M6 3h12v19l-6-4-6 4V3Z",
  check: "m5 12 4 4L20 5",
  close: "m6 6 12 12M6 18 18 6",
  search: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 6 6",
  sliders: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0",
  undo: "M4 10h9a7 7 0 0 1 0 14M4 10l5-5M4 10l5 5",
  redo: "M20 10h-9a7 7 0 0 0 0 14M20 10l-5-5m5 5-5 5",
  refresh: "M20 8a9 9 0 1 0 1 9M20 3v6h-6",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  upload: "M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4",
  print: "M6 8V3h12v5M6 17H3V9h18v8h-3M6 13h12v8H6z",
  share:
    "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3-4 7-5M8 13l7 5",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  focus: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M12 8v8M8 12h8",
  note: "M4 3h16v18H4zM8 7h8M8 11h8m-8 4h5",
  play: "m8 4 13 8-13 8V4Z",
  pause: "M7 4v16M17 4v16",
  plus: "M12 4v16M4 12h16",
  minus: "M4 12h16",
  up: "m6 14 6-6 6 6",
  down: "m6 10 6 6 6-6",
  menu: "M4 6h16M4 12h16M4 18h16",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M8 5h13M8 12h13M8 19h13M3 5h1m-1 7h1m-1 7h1",
  globe:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2c-6 7-6 13 0 20 6-7 6-13 0-20Z",
  leaf: "M20 3C2 2 0 19 9 20c9 1 11-8 11-17ZM5 21 17 7",
  moon: "M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z",
  copy: "M9 9h12v12H9zM15 9V3H3v12h6",
  trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7m4-7v7",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 4h.01",
  bolt: "m13 2-9 12h7l-1 8 10-13h-8l1-7Z",
  flag: "M4 22V3h15l-4 5 4 5H4",
  shield: "m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Zm-5 10 3 3 7-7",
  sound: "M3 9h4l5-5v16l-5-5H3V9Zm13-2a7 7 0 0 1 0 10m3-13a11 11 0 0 1 0 16",
  shuffle:
    "M3 5h3c5 0 7 14 12 14h3m-4-4 4 4-4 4M3 19h3c2 0 4-3 6-7m3-6c1-1 2-1 3-1h3m-4-4 4 4-4 4",
  pin: "m8 3 8 0-1 6 4 5H5l4-5-1-6ZM12 14v8",
  cloud: "M7 19h11a5 5 0 0 0 1-10A7 7 0 0 0 5 8a6 6 0 0 0 2 11Z",
  trophy:
    "M7 3h10v8a5 5 0 0 1-10 0V3Zm0 2H3v4a4 4 0 0 0 4 4m10-8h4v4a4 4 0 0 1-4 4m-5 3v5m-5 0h10",
};
function icon(name, cls = "") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
}
const WORLDS = [
  {
    id: "local",
    name: "The neighbourhood",
    short: "Neighbourhood",
    emoji: "☀",
    line: "Good things start close to home.",
    names: ["Shift happens", "The good route", "Pack a possibility"],
    people: "Volunteer crew",
    story: "A practice brief inspired by everyday community organising.",
  },
  {
    id: "woodland",
    name: "Moss & magic",
    short: "Moss & magic",
    emoji: "🍄",
    line: "Small spells. Remarkable things.",
    names: ["The woodland guild", "Moonfruit express", "Apprentice satchels"],
    people: "Forest guild",
    story: "The woodland council needs your knack for putting things together.",
  },
  {
    id: "moon",
    name: "Moonlit market",
    short: "Moonlit market",
    emoji: "☾",
    line: "A little wonder after dark.",
    names: [
      "The night-watch roster",
      "Midnight provisions",
      "Stardust bundles",
    ],
    people: "Night-market crew",
    story:
      "Under the lanterns, a moonlit market is preparing for its busiest night.",
  },
  {
    id: "sky",
    name: "The floating isles",
    short: "Floating isles",
    emoji: "☁",
    line: "A good idea deserves a little altitude.",
    names: ["The cloudkeepers", "Skyship provisions", "Cloud-school satchels"],
    people: "Cloudkeeper crew",
    story:
      "The islands are drifting, and the skyport needs a plan before sunrise.",
  },
  {
    id: "clockwork",
    name: "Clockwork quarter",
    short: "Clockwork",
    emoji: "⚙",
    line: "Every little cog has a part to play.",
    names: [
      "The tinkerer rota",
      "Brass-cart dispatch",
      "Inventor starter kits",
    ],
    people: "Tinkerer guild",
    story:
      "The quarter runs on kindness, brass, and a very well-organised rota.",
  },
  {
    id: "academy",
    name: "Starlight academy",
    short: "Starlight academy",
    emoji: "✧",
    line: "Practical magic for curious minds.",
    names: [
      "The mentor constellation",
      "Comet-courier routes",
      "First-year spell kits",
    ],
    people: "Academy mentors",
    story:
      "A new class arrives with big questions and a few very practical needs.",
  },
];
let prefs = await cloud.get("preferences", {
  theme: "paper",
  world: "local",
  avatar: "✦",
  alias: "Curious neighbour",
  motion: "on",
  large: false,
  spacing: false,
  sound: false,
  autoCheck: true,
  timer: true,
  focusMinutes: 20,
});
prefs = {
  theme: "paper",
  world: "local",
  avatar: "✦",
  alias: "Curious neighbour",
  motion: "on",
  large: false,
  spacing: false,
  sound: false,
  autoCheck: true,
  timer: true,
  focusMinutes: 20,
  ...prefs,
};
let records = await cloud.get("plans", {}),
  bookmarks = await cloud.get("bookmarks", []),
  journal = await cloud.get("journal", []),
  custom = await cloud.get("custom", []),
  kits = await cloud.get("kits", {}),
  community = [],
  backendStatus = "connecting",
  g = null,
  route = "",
  renderSeq = 0,
  lib = {
    type: "all",
    level: "all",
    source: "all",
    search: "",
    sort: "seed",
    page: 0,
    view: "grid",
  },
  kitFilter = "",
  kitSort = "",
  kitReverse = false,
  paused = false,
  focus = false;
let cloudProfile = null,
  remoteSubmissions = [],
  ownQuests = [],
  reviews = [],
  remoteReviews = [];
const app = $("#app"),
  modal = $("#modal");
function world() {
  return WORLDS.find((w) => w.id === prefs.world) || WORLDS[0];
}
function narrTitle(type, seed) {
  return `${world().names[TYPES.indexOf(type)]}${seed ? ` #${String(seed).padStart(3, "0")}` : ""}`;
}
function applyPrefs() {
  document.body.dataset.theme = prefs.theme;
  document.body.dataset.large = prefs.large;
  document.body.dataset.spacing = prefs.spacing;
  document.body.dataset.motion = prefs.motion;
  document.documentElement.style.setProperty(
    "color-scheme",
    prefs.theme === "night" ? "dark" : "light",
  );
}
applyPrefs();
async function persist(key, value) {
  try {
    await cloud.put(key, value);
  } catch {
    toast(
      "Site storage is unavailable. Export your work before closing this page.",
    );
  }
}
async function savePrefs() {
  prefs.updated = Date.now();
  applyPrefs();
  await persist("preferences", prefs);
}
let toastTimer;
function toast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
}
function download(name, data, type = "application/json") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob(
      [typeof data === "string" ? data : JSON.stringify(data, null, 2)],
      { type },
    ),
  );
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function showModal(title, body) {
  modal.innerHTML = `<button class="icon-btn modal-close" data-action="close" aria-label="Close dialog">${icon("close")}</button><h2 class="modal-title" id="modal-title">${esc(title)}</h2><div class="modal-body">${body}</div>`;
  if (!modal.open) modal.showModal();
}
function confirmAction(title, message, action) {
  showModal(
    title,
    `<p>${esc(message)}</p><div class="actions"><button class="btn primary" data-action="${action}">Yes, continue</button><button class="btn outline" data-action="close">Keep things as they are</button></div>`,
  );
}
function header(active) {
  return `<header class="topbar"><a href="#home" class="brand" aria-label="SIDE QUEST home"><img src="./icon.svg" alt=""><div class="wordmark"><span>SIDE</span><span>QUEST<small>↗</small></span></div></a><nav class="nav" aria-label="Main navigation">${[
    ["library", "The quest board"],
    ["dashboard", "Your notebook"],
    ["kit", "Field kit"],
    ["organise", "For organisations"],
  ]
    .map(
      ([id, label]) =>
        `<a href="#${id}" class="${active === id ? "active" : ""}">${label}</a>`,
    )
    .join(
      "",
    )}</nav><div class="top-actions"><button class="icon-btn" data-action="settings" aria-label="Personalise SIDE QUEST">${icon("sliders")}</button><button class="btn outline small" data-action="auth">${cloud.user() ? `<span class="avatar">${esc(prefs.avatar)}</span> Your account` : "Join the good side " + icon("arrow")}</button><button class="icon-btn menu-toggle" data-action="menu" aria-label="Open navigation" aria-expanded="false">${icon("menu")}</button></div><nav class="mobile-nav" aria-label="Mobile navigation">${[
    ["library", "Quest board"],
    ["dashboard", "Notebook"],
    ["kit", "Field kit"],
    ["organise", "Organisations"],
    ["settings", "Personalise"],
  ]
    .map(([id, label]) => `<a href="#${id}">${label}</a>`)
    .join(
      "",
    )}<button class="chip" data-action="auth">${cloud.user() ? "Account" : "Sign in / join"}</button></nav></header>`;
}
function footer() {
  return `<footer class="footer"><a class="brand" href="#home"><img src="./icon.svg" alt="" style="width:25px;height:25px"><b>SIDE QUEST</b></a><span>Small moves. Real possibilities.</span><div class="actions"><a href="#about">The idea</a><a href="#capabilities">What’s inside</a><a href="#privacy">Your data</a><a href="https://github.com/cosmicbubblegumgirl/side-quest" target="_blank" rel="noopener">Source ↗</a></div><span>A Quantum Cupcake Creation · Simoné Govender</span></footer>`;
}
function scene(type) {
  if (type === "shifts")
    return `<svg viewBox="0 0 260 150" fill="none" aria-hidden="true"><rect x="55" y="21" width="150" height="110" rx="8" fill="#fffdf5" stroke="#293b31" stroke-width="1.5" transform="rotate(-5 130 75)"/><path d="M54 51l148-13" stroke="#293b31"/><g fill="#293b31"><circle cx="85" cy="24" r="3"/><circle cx="170" cy="17" r="3"/></g><g fill="#ded6f4" stroke="#293b31"><rect x="73" y="62" width="33" height="24" rx="4" transform="rotate(-5 73 62)"/><rect x="118" y="58" width="33" height="24" rx="4" transform="rotate(-5 118 58)"/></g><rect x="115" y="92" width="33" height="24" rx="4" fill="#d4fb51" stroke="#293b31" transform="rotate(-5 115 92)"/><path d="m124 103 5 4 8-10" stroke="#293b31" stroke-width="2"/><path d="M36 82c-8 5-14 17-10 27m190-62 11-9m-9 21 17-1M47 37l-9-7" stroke="#293b31" stroke-width="1.5"/><rect x="170" y="78" width="51" height="31" rx="5" fill="#ffcfb1" stroke="#293b31" transform="rotate(13 170 78)"/><circle cx="187" cy="92" r="5" stroke="#293b31"/><path d="M177 105q8-12 16-1" stroke="#293b31"/></svg>`;
  if (type === "deliveries")
    return `<svg viewBox="0 0 260 150" fill="none" aria-hidden="true"><path d="M18 124c16-52 65 18 103-29s84-67 123-40" stroke="#293b31" stroke-dasharray="4 5"/><path d="M69 54h93v53H69z" fill="#fffdf5" stroke="#293b31" stroke-width="1.5"/><path d="M162 68h25l21 24v15h-46z" fill="#ded6f4" stroke="#293b31" stroke-width="1.5"/><path d="M175 74h10l13 15h-23z" fill="#fffdf5" stroke="#293b31"/><circle cx="94" cy="109" r="13" fill="#293b31"/><circle cx="94" cy="109" r="6" fill="#fffdf5"/><circle cx="184" cy="109" r="13" fill="#293b31"/><circle cx="184" cy="109" r="6" fill="#fffdf5"/><path d="m108 73 10-9 10 9-10 9-10-9Zm10 9v13" stroke="#293b31"/><path d="m48 43 4-10 4 10 10 4-10 4-4 10-4-10-10-4 10-4Z" fill="#d4fb51" stroke="#293b31"/><path d="M206 25a10 10 0 0 1 20 0c0 9-10 18-10 18s-10-9-10-18Z" fill="#d4fb51" stroke="#293b31"/><circle cx="216" cy="25" r="3" stroke="#293b31"/></svg>`;
  return `<svg viewBox="0 0 260 150" fill="none" aria-hidden="true"><path d="m64 69 67-24 65 25-65 27-67-28Z" fill="#fffdf5" stroke="#293b31" stroke-width="1.5"/><path d="m64 69 67 28v49l-67-29V69Z" fill="#ded6f4" stroke="#293b31" stroke-width="1.5"/><path d="m131 97 65-27v48l-65 28V97Z" fill="#b3d744" stroke="#293b31" stroke-width="1.5"/><path d="m64 69-21 18 65 30 23-20m65-27 20 17-62 29-23-19" fill="#fffdf5" stroke="#293b31" stroke-width="1.5"/><rect x="96" y="23" width="36" height="50" rx="2" fill="#ffcfb1" stroke="#293b31" transform="rotate(-14 96 23)"/><path d="m104 38 18-4m-16 12 18-4" stroke="#293b31"/><path d="m151 18 9 1-7 51-9-1 7-51Z" fill="#fffdf5" stroke="#293b31"/><path d="m151 18 6-12 3 13m-16 50 3 9 6-8" stroke="#293b31"/><path d="m52 31 4-11 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill="#293b31"/><path d="M206 43v12m-6-6h12" stroke="#293b31" stroke-width="1.5"/></svg>`;
}
function card(d, index = 0) {
  const info = TYPE_INFO[d.type];
  const id = d.id;
  const saved = bookmarks.includes(id);
  const record = records[id];
  const title = d.community ? d.title : narrTitle(d.type, d.seed);
  return `<article class="mission-card"><div class="card-art ${info.color}" data-world="${prefs.world}">${prefs.world !== "local" ? `<span class="world-motif" aria-hidden="true">${world().emoji}</span>` : ""}<span class="number">QUEST / ${String(index + 1).padStart(2, "0")}</span>${scene(d.type)}<button class="icon-btn bookmark" data-action="bookmark" data-id="${esc(id)}" aria-label="${saved ? "Unsave" : "Save"} ${esc(title)}" aria-pressed="${saved}">${icon(saved ? "heart" : "bookmark")}</button></div><div class="card-body"><div class="between"><span class="badge">${d.community ? "Community brief" : "Practice quest"}</span><span class="tiny muted">${LEVELS[d.level || 0]} · ${5 + (d.level || 0) * 5} min</span></div><h3>${esc(title)}</h3><p>${esc(d.community ? d.brief : info.description)}</p><div class="card-bottom"><span>${record?.completed ? "✓ Feasible plan found" : `${icon(info.icon)} ${esc(info.label)}`}</span><button data-action="play" data-id="${esc(id)}" aria-label="Play ${esc(title)}">${icon("arrow")}</button></div></div></article>`;
}
function home() {
  const daily = (Math.floor(Date.now() / 86400000) % 500) + 1;
  const places = [
    ["shifts", "The guild hall", "Match volunteers to tutoring sessions."],
    ["deliveries", "Provisions market", "Find a food route that works."],
    ["packs", "The supply house", "Turn uneven donations into school packs."],
  ];
  return `${header("home")}<main id="main"><section class="atlas" data-realm="${prefs.world}"><div class="atlas-topline"><span>THE SIDE QUEST EXPLORER’S ATLAS</span><span>VOL. 001 / OPEN TO THE CURIOUS</span></div><div class="atlas-stage"><img class="atlas-art" src="./atlas.svg" alt="An illustrated island with a guild hall, provisions market and supply house connected by winding paths."><div class="atlas-intro"><div class="eyebrow">A PUZZLE GAME WITH A PURPOSE</div><h1>Take the<br>scenic route.</h1><p>Some detours lead somewhere good.<br>Solve a little puzzle. Make a useful plan.</p><a href="#library" class="atlas-cta">Find your next quest <span>↗</span></a><button class="atlas-how" data-action="how">First time here? Unfold the guide →</button></div><div class="map-caption"><span>✣</span><div>${esc(world().name)}<small>${esc(world().line)}</small></div></div>${places.map(([type, name, desc], i) => `<a class="map-pin pin-${i}" href="#play/${type}-0-${daily}" aria-label="Play ${esc(name)}: ${esc(desc)}"><span class="pin-marker">0${i + 1}</span><span class="pin-label">${esc(name)} <b>↗</b><small>${esc(TYPE_INFO[type].label)} · Easy</small></span></a>`).join("")}<div class="map-key">● SELECT A LANDMARK TO PLAY <span>— — — A POSSIBLE PATH</span></div></div><div class="realm-bar"><div class="realm-title"><small>CHANGE THE SCENERY</small><strong>Choose your world.</strong></div><div class="realm-choices">${WORLDS.map((w, i) => `<button data-action="world" data-id="${w.id}" class="${prefs.world === w.id ? "selected" : ""}" aria-pressed="${prefs.world === w.id}"><small>0${i + 1}</small><span>${w.emoji}</span>${esc(w.short)}</button>`).join("")}</div></div></section><section class="expedition container"><div class="expedition-title"><div class="eyebrow">YOUR NEXT SMALL ADVENTURE</div><h2>Good things<br>need a plan.</h2><p>6,000 practice puzzles. Four levels of difficulty. A notebook for the ideas you want to keep.</p><button class="text-link" data-action="surprise">Take the unexpected path ↗</button></div><div class="quest-index">${places.map(([type, name, desc], i) => `<a href="#play/${type}-0-${daily}" class="quest-entry"><span class="entry-number">0${i + 1} /</span><div><small>${esc(TYPE_INFO[type].label).toUpperCase()}</small><h3>${esc(narrTitle(type, daily))}</h3><p>${esc(desc)}</p></div><span class="entry-sketch">${scene(type)}</span><span class="entry-arrow">↗</span></a>`).join("")}</div></section><section class="dispatch container"><div class="dispatch-seal" aria-hidden="true">SQ<span>FIELD NOTES</span></div><div><div class="eyebrow">FROM GAME BOARD TO COMMUNITY</div><h2>The last move belongs<br>to a person.</h2><p>Practice here first. When an organisation publishes a real brief, your feasible plan goes to its team for review before anyone uses it. Thoughtful play. Human judgement.</p><a class="text-link" href="#organise">Bring your organisation’s challenge ↗</a></div><aside><span>PACKED FOR THE JOURNEY</span><a href="#kit"><strong>24 practical tools</strong>Budgets, supplies, schedules & more ↗</a><a href="#settings"><strong>Make yourself at home</strong>Your colours, avatar & pace ↗</a><a href="#dashboard"><strong>Your field notebook</strong>Saved quests & useful discoveries ↗</a></aside></section><div class="atlas-footnote container">A NOTE ON THE MAP — These 6,000 generated scenarios are practice. Community briefs appear when organisations publish them. Practice activity is never presented as real-world impact.</div></main>${footer()}`;
}
function library() {
  let pool = Array.from({ length: 6000 }, (_, i) => descriptor(i));
  if (lib.source === "community")
    pool = community.map((q) => ({
      ...q,
      id: "q." + q.id,
      community: true,
      level: q.difficulty || 0,
    }));
  if (lib.source === "all")
    pool = [
      ...community.map((q) => ({
        ...q,
        id: "q." + q.id,
        community: true,
        level: q.difficulty || 0,
      })),
      ...pool,
    ];
  if (lib.source === "saved")
    pool = [
      ...community.map((q) => ({
        ...q,
        id: "q." + q.id,
        community: true,
        level: q.difficulty || 0,
      })),
      ...pool,
    ].filter((d) => bookmarks.includes(d.id));
  if (lib.type !== "all") pool = pool.filter((d) => d.type === lib.type);
  if (lib.level !== "all") pool = pool.filter((d) => d.level === +lib.level);
  if (lib.search) {
    const q = lib.search.toLowerCase();
    pool = pool.filter((d) =>
      `${d.title} ${TYPE_INFO[d.type].label} ${narrTitle(d.type, d.seed)} ${d.id} ${LEVELS[d.level]}`
        .toLowerCase()
        .includes(q),
    );
  }
  if (lib.sort === "hard") pool.sort((a, b) => b.level - a.level);
  if (lib.sort === "easy") pool.sort((a, b) => a.level - b.level);
  if (lib.sort === "reverse") pool.reverse();
  if (lib.sort === "played")
    pool.sort(
      (a, b) => (records[b.id]?.updated || 0) - (records[a.id]?.updated || 0),
    );
  const count = pool.length;
  lib.page = Math.min(lib.page, Math.max(0, Math.ceil(count / 9) - 1));
  const shown = pool.slice(lib.page * 9, lib.page * 9 + 9);
  return `${header("library")}<main class="container page ${lib.view === "list" ? "list-view" : ""}" id="main"><div class="between"><div class="eyebrow">THE QUEST BOARD <span class="pill-counter">6,000 + COMMUNITY</span></div><button class="btn outline small" data-action="surprise">${icon("shuffle")} Surprise me</button></div><h1 class="page-title">What good will you<br>get up to today?</h1><p class="subtext">A quiet five minutes or a proper brain stretch. There’s a side quest for that.</p><div class="toolbar"><div class="search">${icon("search")}<input id="quest-search" type="search" aria-label="Search quests" placeholder="Try ‘packs’, ‘expert’, or a quest number…" value="${esc(lib.search)}"></div><select id="difficulty-filter" aria-label="Filter difficulty"><option value="all">All difficulties</option>${LEVELS.map((l, i) => `<option value="${i}" ${lib.level === String(i) ? "selected" : ""}>${l}</option>`).join("")}</select><select id="source-filter" aria-label="Quest source">${[
    ["all", "All quests"],
    ["practice", "Practice puzzles"],
    ["community", "Community briefs"],
    ["saved", "Saved quests"],
  ]
    .map(
      ([v, l]) =>
        `<option value="${v}" ${lib.source === v ? "selected" : ""}>${l}</option>`,
    )
    .join(
      "",
    )}</select><button class="icon-btn" data-action="library-reset" aria-label="Reset filters">${icon("refresh")}</button></div><div class="chips">${[["all", "All good things"], ...TYPES.map((t) => [t, TYPE_INFO[t].label])].map(([t, l]) => `<button class="chip ${lib.type === t ? "selected" : ""}" data-action="filter-type" data-id="${t}" aria-pressed="${lib.type === t}">${esc(l)}</button>`).join("")}<select id="library-world" aria-label="Puzzle world">${WORLDS.map((w) => `<option value="${w.id}" ${prefs.world === w.id ? "selected" : ""}>${w.emoji} ${w.name}</option>`).join("")}</select></div><div class="result-line"><span>${count.toLocaleString()} quests · ${esc(world().name)}${count ? ` · showing ${lib.page * 9 + 1}–${Math.min(lib.page * 9 + 9, count)}` : ""}</span><div class="actions"><select id="quest-sort" aria-label="Sort quests">${[
    ["seed", "Quest number"],
    ["easy", "Easy first"],
    ["hard", "Expert first"],
    ["reverse", "Latest number first"],
    ["played", "Recently played"],
  ]
    .map(
      ([v, l]) =>
        `<option value="${v}" ${lib.sort === v ? "selected" : ""}>${l}</option>`,
    )
    .join(
      "",
    )}</select><div class="view-switch"><button class="icon-btn" data-action="view-grid" aria-label="Card view">${icon("grid")}</button><button class="icon-btn" data-action="view-list" aria-label="List view">${icon("list")}</button></div></div></div>${shown.length ? `<div class="mission-grid">${shown.map(card).join("")}</div><div class="pager"><button class="btn outline small" data-action="prev" ${lib.page === 0 ? "disabled" : ""}>${icon("back")} Previous</button><span class="tiny">${lib.page + 1} / ${Math.ceil(count / 9)}</span><button class="btn outline small" data-action="next" ${(lib.page + 1) * 9 >= count ? "disabled" : ""}>Next ${icon("arrow")}</button></div>` : `<div class="empty">${icon("search")}<h3>A little quiet in here.</h3><p>${lib.source === "community" ? "No matching community briefs yet. Organisations can publish the first one." : "Try a different search or save a few quests to come back to."}</p><button class="btn primary" data-action="library-reset">Explore the practice library</button></div>`}</main>${footer()}`;
}
function gameRecord() {
  return {
    config: g.config,
    plan: g.plan,
    title: g.title,
    quest: g.quest,
    notes: g.notes,
    snapshots: g.snapshots,
    seconds: g.seconds,
    moves: g.moves,
    completed: g.completed,
    updated: Date.now(),
    world: prefs.world,
  };
}
async function saveGame() {
  if (!g) return;
  records[g.id] = gameRecord();
  await persist("plans", records);
}
async function openGame(id) {
  await saveGame();
  let config,
    title,
    quest = null;
  const d = parseId(id);
  if (d) {
    config = generate(d.type, d.level, d.seed);
    title = narrTitle(d.type, d.seed);
  } else if (id.startsWith("q.")) {
    quest =
      community.find((q) => q.id === id.slice(2)) ||
      ownQuests.find((q) => q.id === id.slice(2));
    if (!quest) {
      try {
        quest = (
          await cloud.request("sq_quests", {
            query: "id=eq." + encodeURIComponent(id.slice(2)) + "&select=*",
          })
        )[0];
      } catch (e) {
        toast(e.message);
        return;
      }
    }
    if (!quest) {
      toast("This quest is no longer available.");
      return;
    }
    config = quest.config;
    title = quest.title;
  } else {
    const c = custom.find((c) => c.id === id);
    if (!c) {
      toast("That local scenario is not on this device.");
      return;
    }
    config = c.config;
    title = c.title;
  }
  if (!validateConfig(config)) {
    toast("This quest has invalid constraints. Please contact its organiser.");
    return;
  }
  const r = records[id];
  g = {
    id,
    config,
    plan: r?.plan || emptyPlan(config),
    title,
    quest,
    notes: r?.notes || "",
    snapshots: r?.snapshots || [],
    seconds: r?.seconds || 0,
    moves: r?.moves || 0,
    completed: r?.completed || false,
    tab: "board",
    history: [],
    cursor: 0,
    checked: false,
  };
  g.history = [structuredClone(g.plan)];
  paused = false;
  location.hash = "play/" + id;
  if (route === location.hash.slice(1)) render();
}
function commit(plan) {
  g.plan = structuredClone(plan);
  g.completed = !!(g.completed && evaluate(g.config, g.plan).valid);
  g.history = g.history.slice(0, g.cursor + 1);
  g.history.push(structuredClone(plan));
  if (g.history.length > 100) g.history.shift();
  g.cursor = g.history.length - 1;
  g.moves++;
  g.checked = prefs.autoCheck;
  saveGame();
  drawGame();
  sound(390);
}
function sound(freq) {
  if (!prefs.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(),
      v = ctx.createGain();
    o.connect(v);
    v.connect(ctx.destination);
    o.frequency.value = freq;
    v.gain.setValueAtTime(0.035, ctx.currentTime);
    v.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.start();
    o.stop(ctx.currentTime + 0.12);
    o.onended = () => ctx.close();
  } catch {}
}
function displayName(name, i = 0) {
  if (prefs.world === "local" || g?.quest || !parseId(g?.id)) return name;
  return `${["Fern", "Moss", "Pip", "Luna", "Wren", "Clover", "Aster", "Ember", "Bramble", "Nova"][i % 10]} ${world().id === "clockwork" ? "Cogsworth" : world().id === "academy" ? "Starling" : "of the " + ["Glen", "Lantern", "Willow", "Cloud", "Meadow"][i % 5]}`;
}
function gameBody() {
  const c = g.config,
    p = g.plan;
  const e = evaluate(c, p);
  if (g.tab === "brief")
    return `<div class="board-work"><h3>${esc(g.quest ? g.quest.organization : world().name)}</h3><p>${esc(g.quest?.brief || world().story)}</p><div class="notice"><b>Your task</b><p>${c.type === "shifts" ? "Cover every session with a qualified, available volunteer. Respect each person’s limit and avoid simultaneous bookings." : c.type === "deliveries" ? "Assign every stop to a vehicle. Respect capacity, cooling, opening times, service time, and return deadlines. Distances are illustrative straight-line planning units." : "Give every learner pack its minimum supplies. Keep within donated stock, the weight limit, and the fairness rule."}</p></div>${constraints(c)}<h4>Assumptions to check</h4><ul class="tiny muted"><li>Confirm the latest availability and counts before using a plan.</li><li>${c.type === "deliveries" ? "Check real roads, vehicle condition and food-safe temperatures." : "Confirm access needs and the people responsible for delivery."}</li><li>Use role labels. Keep personal and beneficiary information out of public briefs.</li></ul><button class="btn primary" data-action="game-tab" data-id="board">Make your first move ${icon("arrow")}</button></div>`;
  if (g.tab === "notes")
    return `<div class="board-work"><h3>A little room to think.</h3><label>Plan notes<textarea id="game-notes" class="note-pad" placeholder="What have you noticed? What needs checking?">${esc(g.notes)}</textarea></label><p class="tiny muted">Notes save on this device. Include practical assumptions when submitting a community plan.</p><div class="actions"><button class="btn outline small" data-action="snapshot">${icon("copy")} Save a checkpoint</button><button class="btn outline small" data-action="journal-game">${icon("note")} Add to journal</button></div><h4>Checkpoints</h4>${g.snapshots.length ? g.snapshots.map((s, i) => `<div class="saved-row"><div><b>${esc(s.name)}</b><p>${new Date(s.at).toLocaleString("en-ZA")} · ${s.score}% covered</p></div><div class="actions"><button class="btn outline small" data-action="restore-snapshot" data-id="${i}">Restore</button><button class="icon-btn" data-action="delete-snapshot" data-id="${i}" aria-label="Remove checkpoint">${icon("trash")}</button></div></div>`).join("") : '<p class="tiny muted">Try a different plan without losing the one you have.</p>'}</div>`;
  if (g.tab === "plan")
    return `<div class="board-work"><div class="between"><h3>Your handover plan</h3><span class="badge ${e.valid ? "lime" : ""}">${e.valid ? "Feasible under stated rules" : "Work in progress"}</span></div><p class="tiny muted">${g.quest ? "Organisation review is required before this plan is used." : "Practice scenario. This plan has not been sent to a real organisation."}</p>${table(e.rows)}<div class="actions" style="margin-top:20px"><button class="btn primary small" data-action="export-csv">${icon("download")} Download CSV</button><button class="btn outline small" data-action="export-game">Plan JSON</button><button class="btn outline small" data-action="print">${icon("print")} Print</button></div>${e.warnings.map((w) => `<div class="notice">${esc(w)}</div>`).join("")}</div>`;
  if (c.type === "shifts")
    return `<div class="board-work"><div class="between"><h3>${esc(world().people)}</h3><span class="tiny muted">Drag a person, or use a dropdown.</span></div><div class="volunteer-tray">${c.people.map((v, i) => `<div class="person" draggable="true" data-person="${v.id}" title="Available: ${v.available.map((id) => c.slots.find((s) => s.id === id)?.name).join(", ")}"><strong>${esc(displayName(v.name, i))}</strong><span>${esc([...new Set(v.skills)].join(" / "))} · max ${v.max}</span></div>`).join("")}</div><div class="slot-grid">${c.slots
      .map((s) => {
        const v = c.people.find((v) => v.id === p.assignments[s.id]);
        const good =
          v && v.skills.includes(s.subject) && v.available.includes(s.id);
        return `<div class="slot ${v ? (good ? "good" : "bad") : ""}" data-drop-slot="${s.id}"><strong>${esc(s.name)}</strong><small>${esc(prefs.world === "local" || g.quest || !parseId(g.id) ? s.subject : ["Potion maths", "Natural magic", "Rune reading"][["Maths", "Science", "Reading"].indexOf(s.subject)] || s.subject)} · ${s.learners || 0} ${prefs.world === "local" ? "learners" : "apprentices"}</small><label class="screen-reader" for="slot-${s.id}">Volunteer for ${esc(s.name)}</label><select id="slot-${s.id}" data-slot="${s.id}"><option value="">Choose a person…</option>${c.people.map((v, i) => `<option value="${v.id}" ${p.assignments[s.id] === v.id ? "selected" : ""}>${esc(displayName(v.name, i))}${!v.skills.includes(s.subject) ? " · skill mismatch" : !v.available.includes(s.id) ? " · unavailable" : ""}</option>`).join("")}</select></div>`;
      })
      .join("")}</div></div>`;
  if (c.type === "deliveries")
    return `<div class="board-work">${deliveryMap(c, p)}<div class="tiny muted" style="margin-bottom:15px">${icon("flag")} Depot starts at 08:00 · 1 map unit = 2 minutes · return by ${clock(c.returnBy)}</div><h3>Give every delivery a ride.</h3>${c.stops.map((s, i) => `<div class="route-assign"><div><b>${i + 1}. ${esc(stopName(s))}</b><br><span class="tiny muted">${s.qty} crates ${s.cold ? "· ❄ cool storage" : ""} · ${clock(s.open)}–${clock(s.close)}</span></div><label class="screen-reader" for="stop-${s.id}">Vehicle for ${esc(s.name)}</label><select id="stop-${s.id}" data-stop="${s.id}"><option value="">Choose a vehicle…</option>${c.vehicles.map((v) => `<option value="${v.id}" ${(p.routes[v.id] || []).includes(s.id) ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></div>`).join("")}<h3 style="margin-top:25px">The route, in order.</h3>${c.vehicles
      .map((v) => {
        const r = routeStats(c, v, p.routes[v.id] || []);
        return `<div class="route-box"><div class="between"><b>${esc(v.name)}</b><span class="badge">${r.load}/${v.capacity} crates</span></div><p class="tiny muted">${v.cold ? "❄ Cool storage" : "Ambient only"} · ${r.distance} map units · return ${clock(r.minutes)}</p>${(p.routes[v.id] || []).map((id, i) => `<div class="route-item"><span>${i + 1}. ${esc(stopName(c.stops.find((s) => s.id === id)))}</span><div class="actions"><button class="icon-btn" data-action="route-up" data-id="${v.id}|${i}" aria-label="Move stop up" ${i === 0 ? "disabled" : ""}>${icon("up")}</button><button class="icon-btn" data-action="route-down" data-id="${v.id}|${i}" aria-label="Move stop down" ${i === p.routes[v.id].length - 1 ? "disabled" : ""}>${icon("down")}</button></div></div>`).join("") || '<p class="tiny muted">No stops assigned yet.</p>'}</div>`;
      })
      .join("")}</div>`;
  return `<div class="board-work"><div class="between"><h3>${prefs.world === "local" ? "What’s in the donation box?" : "What’s in the enchanted stores?"}</h3>${icon("box")}</div><div class="inventory">${c.items
    .map((i) => {
      const used = c.kits.reduce((n, k) => n + (p.packs[k.id]?.[i.id] || 0), 0);
      return `<div><span>${esc(i.name)}</span><strong>${i.stock - used}<small style="font-size:10px;font-weight:400"> left</small></strong><span>${i.stock} donated · min ${i.min}/pack</span></div>`;
    })
    .join(
      "",
    )}</div><div class="table-scroll"><table><thead><tr><th>Learner pack</th>${c.items.map((i) => `<th>${esc(i.name)}</th>`).join("")}<th>Weight</th></tr></thead><tbody>${c.kits.map((k) => `<tr><td><b>${esc(k.name)}</b></td>${c.items.map((i) => `<td><div class="pack-count"><button data-action="pack-minus" data-id="${k.id}|${i.id}" aria-label="Remove ${esc(i.name)} from ${esc(k.name)}">−</button><input type="number" min="0" max="${i.stock}" value="${p.packs[k.id]?.[i.id] || 0}" data-pack="${k.id}|${i.id}" aria-label="${esc(i.name)} in ${esc(k.name)}"><button data-action="pack-plus" data-id="${k.id}|${i.id}" aria-label="Add ${esc(i.name)} to ${esc(k.name)}">+</button></div></td>`).join("")}<td>${c.items.reduce((a, i) => a + (p.packs[k.id]?.[i.id] || 0) * i.weight, 0)} g</td></tr>`).join("")}</tbody></table></div><p class="tiny muted">Keep each pack below ${c.maxWeight} g. The difference between packs may be at most ${c.fairness} of each item.</p><div class="actions"><button class="btn outline small" data-action="pack-baseline">Fill minimum quantities</button><button class="btn outline small" data-action="pack-extras">Distribute spare supplies fairly</button></div></div>`;
}
function stopName(s) {
  if (!s) return "Unknown";
  if (prefs.world === "local" || g?.quest || !parseId(g?.id)) return s.name;
  const i = g.config.stops.findIndex((x) => x.id === s.id);
  return (
    ([
      "Moonfruit orchard",
      "Lantern kitchen",
      "Apprentice hall",
      "Willow pantry",
      "Starling lodge",
      "Cloudstop six",
    ][i] || s.name) +
    " · " +
    s.name
  );
}
function deliveryMap(c, p) {
  const maxX = Math.max(20, ...c.stops.map((s) => s.x)) + 3,
    maxY = Math.max(15, ...c.stops.map((s) => s.y)) + 3;
  const point = (s) => `${25 + (s.x / maxX) * 450},${225 - (s.y / maxY) * 200}`;
  return `<div class="map"><svg viewBox="0 0 500 260" role="img" aria-label="Illustrative delivery map with numbered stops"><g>${c.vehicles
    .map(
      (v, i) =>
        `<polyline points="25,225 ${(p.routes[v.id] || [])
          .map((id) => c.stops.find((s) => s.id === id))
          .filter(Boolean)
          .map(point)
          .join(
            " ",
          )} 25,225" stroke="${i ? "#a16b9b" : "#738b36"}" fill="none" stroke-width="3" stroke-dasharray="6 4"/>`,
    )
    .join(
      "",
    )}</g><rect x="12" y="212" width="26" height="26" rx="5" fill="#192923"/><text x="25" y="230" fill="white" text-anchor="middle" font-size="14">D</text>${c.stops.map((s, i) => `<g transform="translate(${point(s).replace(",", " ")})"><circle r="14" fill="${s.cold ? "#ded6f4" : "#d4fb51"}" stroke="#192923"/><text y="5" fill="#192923" text-anchor="middle" font-size="13" font-weight="bold">${i + 1}</text></g>`).join("")}</svg></div>`;
}
function table(rows) {
  if (!rows.length)
    return '<p class="tiny muted">Your moves will appear here as a readable plan.</p>';
  const keys = [...new Set(rows.flatMap(Object.keys))];
  return `<div class="table-scroll"><table><thead><tr>${keys.map((k) => `<th>${esc(k.replaceAll("_", " "))}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${keys.map((k) => `<td>${esc(k === "arrival" && r.minutes_from_0800 !== undefined ? clock(r.minutes_from_0800) : r[k])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function constraints(c) {
  return `<ul class="rule-list">${(c.type === "shifts" ? [`${c.slots.length} sessions to cover`, "Subject skills must match", "Availability must match", "No double bookings", "Personal session limits apply"] : c.type === "deliveries" ? [`${c.stops.length} stops, ${c.vehicles.length} vehicles`, "Vehicle capacities apply", "Cold goods need cool storage", "Opening and closing windows apply", `Return before ${clock(c.returnBy)}`] : [`${c.kits.length} learner packs`, "Each item has a minimum per pack", "Use only the donated stock", `Maximum pack weight: ${c.maxWeight} g`, `Fairness difference: ≤ ${c.fairness}`]).map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul>`;
}
function game() {
  if (!g)
    return `${header("library")}<main id="main" class="container page"><div class="loading">Opening your quest…</div></main>`;
  const e = evaluate(g.config, g.plan);
  return `${header("library")}<main class="container page" id="main"><a href="#library" class="back-link">${icon("back")} Back to the quest board</a><div class="game-top"><div><div class="eyebrow" style="margin-top:20px">${esc(world().name)} <span class="badge">${g.quest ? "Community brief" : "Practice quest"}</span></div><h1>${esc(g.title)}</h1><div class="tiny muted">${g.quest ? esc(g.quest.organization) : esc(world().line)} · <span id="move-count">${g.moves}</span> moves · <span id="game-clock">${formatTime(g.seconds)}</span></div></div><div class="actions"><select id="game-world" aria-label="Change puzzle world">${WORLDS.map((w) => `<option value="${w.id}" ${prefs.world === w.id ? "selected" : ""}>${w.emoji} ${w.short}</option>`).join("")}</select>${!g.quest && parseId(g.id) ? `<select id="game-difficulty" aria-label="Change difficulty">${LEVELS.map((l, i) => `<option value="${i}" ${g.config.level === i ? "selected" : ""}>${l}</option>`).join("")}</select>` : `<span class="badge">${LEVELS[g.quest?.difficulty || g.config.level || 0]}</span>`}<button class="icon-btn" data-action="bookmark" data-id="${esc(g.id)}" aria-label="Save quest" aria-pressed="${bookmarks.includes(g.id)}">${icon(bookmarks.includes(g.id) ? "heart" : "bookmark")}</button></div></div><div class="game-layout"><section class="game-board world-bg" data-world="${prefs.world}"><div class="board-banner ${TYPE_INFO[g.config.type].color}"><span>${TYPE_INFO[g.config.type].label.toUpperCase()} / ${esc(g.config.seed || "CUSTOM")}</span><span>${world().emoji} PIECE BY PIECE.</span></div><div class="game-tools"><button class="tool-btn" data-action="undo" ${g.cursor === 0 ? "disabled" : ""}>${icon("undo")} Undo</button><button class="tool-btn" data-action="redo" ${g.cursor >= g.history.length - 1 ? "disabled" : ""}>${icon("redo")} Redo</button><button class="tool-btn" data-action="hint">${icon("bolt")} Nudge</button><button class="tool-btn" data-action="reset">${icon("refresh")} Reset</button><button class="tool-btn" data-action="focus">${icon("focus")} ${focus ? "Leave focus" : "Focus"}</button><button class="tool-btn" data-action="pause">${icon(paused ? "play" : "pause")} ${paused ? "Resume" : "Pause"}</button><button class="tool-btn" data-action="share-game">${icon("share")} Share</button><button class="tool-btn" data-action="game-menu">${icon("menu")} More</button></div><div class="tabs" style="margin:0;padding:0 22px" role="tablist" aria-label="Quest panels">${[
    ["board", "The puzzle"],
    ["brief", "The brief"],
    ["notes", "Notes & checkpoints"],
    ["plan", "The plan"],
  ]
    .map(
      ([id, l]) =>
        `<button role="tab" aria-selected="${g.tab === id}" class="${g.tab === id ? "active" : ""}" data-action="game-tab" data-id="${id}">${l}</button>`,
    )
    .join(
      "",
    )}</div><div id="board-content">${paused ? `<div class="empty"><h3>A little breather.</h3><p>Your plan is safe. Come back when you’re ready.</p><button class="btn primary" data-action="pause">Resume your quest</button></div>` : gameBody()}</div></section><aside class="game-aside"><div class="aside-stack"><div class="panel"><div class="eyebrow">YOUR PLAN, TAKING SHAPE</div><div class="score-number">${e.percent}<small>% covered</small></div><div class="progress-track" role="progressbar" aria-label="Puzzle coverage" aria-valuenow="${e.percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${e.percent}%"></span></div><p class="tiny muted">${e.done} of ${e.total} pieces in place · ${g.config.type === "packs" ? "Minimums, then fairness." : "Coverage comes before feasibility."}</p><button class="btn primary" data-action="check">Check my plan ${icon("check")}</button>${
    (g.checked || prefs.autoCheck) && !paused
      ? `<div aria-live="polite">${
          e.valid
            ? `<p class="tiny success">✓ All stated constraints satisfied.</p>`
            : `<ul class="error-list">${e.errors
                .slice(0, 8)
                .map((x) => `<li>${esc(x)}</li>`)
                .join(
                  "",
                )}${e.errors.length > 8 ? `<li>And ${e.errors.length - 8} more — open the plan check.</li>` : ""}</ul>`
        }</div>`
      : ""
  }<button class="btn lime" data-action="finish" style="margin-top:12px">${g.quest ? "Submit for review" : "Save my solution"} ${icon("arrow")}</button><p class="disabled-note">${g.quest ? "Your organiser makes the final decision." : "Practice plans stay in your notebook."}</p></div><div class="panel"><h3>The few ground rules.</h3>${constraints(g.config)}<button class="text-link" data-action="how">First time here? A quick guide.</button></div><div class="panel"><div class="eyebrow">KEEP THIS THOUGHT</div><p class="world-heading">“A good plan leaves room for people.”</p><p class="tiny muted">${g.quest ? "Check assumptions with the organiser." : "A practice win is a little more confidence for the real thing."}</p><div class="actions"><button class="btn outline small" data-action="snapshot">${icon("copy")} Checkpoint</button><button class="btn outline small" data-action="export-csv">${icon("download")} CSV</button></div></div></div></aside></div></main>${footer()}`;
}
function drawGame() {
  if (route.startsWith("play/")) {
    app.innerHTML = game();
    document.body.classList.toggle("focus-mode", focus);
  }
}
function formatTime(n) {
  return prefs.timer
    ? `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`
    : "Timer hidden";
}
function dashboard() {
  const saved = Object.entries(records).sort(
    (a, b) => b[1].updated - a[1].updated,
  );
  const completed = saved.filter(([, r]) => r.completed);
  const minutes = Math.floor(
    saved.reduce((a, [, r]) => a + (r.seconds || 0), 0) / 60,
  );
  return `${header("dashboard")}<main class="container page" id="main"><div class="profile-header"><div class="avatar">${esc(prefs.avatar)}</div><div><div class="eyebrow">YOUR NOTEBOOK</div><h1 class="page-title">Hey, ${esc(prefs.alias)}.</h1><p class="tiny muted">Every good idea deserves somewhere to land.</p></div></div><div class="actions"><button class="btn outline small" data-action="settings">${icon("sliders")} Make it yours</button><button class="btn outline small" data-action="sync">${icon("cloud")} Sync account</button><button class="btn outline small" data-action="backup">${icon("download")} Export notebook</button><button class="btn outline small" data-action="restore">${icon("upload")} Import backup</button></div><div class="stats"><div><strong>${completed.length}</strong><span>practice solutions found</span></div><div><strong>${remoteSubmissions.length}</strong><span>community submissions</span></div><div><strong>${minutes}</strong><span>minutes of curious thinking</span></div></div><div class="grid-2"><section class="panel"><div class="between"><h3>Pick up where you left off.</h3><a class="text-link" href="#library">Find a quest ↗</a></div>${
    saved.length
      ? saved
          .slice(0, 12)
          .map(
            ([id, r]) =>
              `<div class="saved-row"><div><h4>${esc(r.title)}</h4><p>${r.completed ? "✓ Feasible plan saved" : "Plan in progress"} · ${new Date(r.updated).toLocaleDateString("en-ZA")} · ${r.moves || 0} moves</p></div><div class="actions"><button class="btn outline small" data-action="play" data-id="${esc(id)}">Resume</button><button class="icon-btn" data-action="delete-plan" data-id="${esc(id)}" aria-label="Remove saved plan">${icon("trash")}</button></div></div>`,
          )
          .join("")
      : `<div class="empty"><h3>A fresh page.</h3><p>Your first puzzle is a good place to begin.</p><a class="btn primary" href="#library">Find a little possibility</a></div>`
  }</section><div class="aside-stack"><section class="panel"><h3>Your little milestones.</h3>${[
    ["First piece", saved.length > 0, "Start a puzzle."],
    ["A good fit", completed.length > 0, "Find one feasible solution."],
    [
      "Curious all-rounder",
      new Set(completed.map(([, r]) => r.config.type)).size === 3,
      "Solve all three puzzle types.",
    ],
    [
      "A bigger stretch",
      completed.some(([, r]) => r.config.level === 3),
      "Finish an Expert puzzle.",
    ],
    ["Plan collector", completed.length >= 10, "Keep ten feasible plans."],
    [
      "Community thinker",
      remoteSubmissions.length > 0,
      "Submit a community plan.",
    ],
  ]
    .map(
      ([title, yes, desc]) =>
        `<div class="activity">${icon(yes ? "trophy" : "pin")}<div><b>${title}</b><div class="tiny muted">${yes ? "Unlocked · " : ""}${desc}</div></div><span class="badge">${yes ? "✓" : "Soon"}</span></div>`,
    )
    .join(
      "",
    )}</section><section class="panel"><h3>A thought worth keeping.</h3><label>Journal note<textarea id="journal-note" placeholder="A useful pattern, a surprising solution, a small win…" maxlength="3000"></textarea></label><button class="btn primary small" data-action="journal-add" style="margin-top:12px">${icon("plus")} Keep this thought</button>${journal
    .slice()
    .reverse()
    .slice(0, 5)
    .map(
      (j, i) =>
        `<div class="journal-entry"><span class="tiny muted">${new Date(j.at).toLocaleDateString("en-ZA")}</span><p>${esc(j.text)}</p><button class="text-link" data-action="journal-delete" data-id="${j.id}">Remove note</button></div>`,
    )
    .join(
      "",
    )}</section></div></div><section class="panel" style="margin-top:24px"><h3>Community plans & decisions</h3>${
    remoteSubmissions.length
      ? remoteSubmissions
          .map(
            (s) =>
              `<div class="saved-row"><div><b>Submission ${s.id.slice(0, 8)}</b><p>${new Date(s.created_at).toLocaleString("en-ZA")} · ${esc(s.notes)}</p>${remoteReviews
                .filter((r) => r.submission_id === s.id)
                .map((r) => `<p><b>${esc(r.decision)}</b> · ${esc(r.note)}</p>`)
                .join(
                  "",
                )}</div><div class="actions"><span class="badge">${esc(remoteReviews.find((r) => r.submission_id === s.id)?.decision || "Awaiting review")}</span><button class="btn outline small" data-action="submission-detail" data-id="${s.id}">View</button></div></div>`,
          )
          .join("")
      : `<p class="tiny muted">${cloud.user() ? "No community submissions yet." : "Sign in to submit and track community plans."}</p>`
  }</section></main>${footer()}`;
}
function kitPage(id = "food") {
  const tool = TOOLS.find((t) => t.id === id) || TOOLS[0];
  const rows = kits[tool.id] || [];
  let indices = rows
    .map((_, i) => i)
    .filter(
      (i) =>
        !kitFilter ||
        Object.values(rows[i])
          .join(" ")
          .toLowerCase()
          .includes(kitFilter.toLowerCase()),
    );
  if (kitSort)
    indices.sort((a, b) => {
      const av = rows[a][kitSort],
        bv = rows[b][kitSort];
      return (
        (typeof av === "number"
          ? av - bv
          : String(av).localeCompare(String(bv))) * (kitReverse ? -1 : 1)
      );
    });
  const result = calculate(tool, rows);
  return `${header("kit")}<main class="container page" id="main"><div class="eyebrow">THE FIELD KIT / 24 PRACTICAL TOOLS</div><h1 class="page-title">A little less guesswork.<br>A little more getting there.</h1><p class="subtext">Working tables for the bits around the puzzle. Start with your own figures, keep the useful calculations, take the plan with you.</p><div class="kit-layout" style="margin-top:30px"><nav class="kit-menu" aria-label="Planning tools">${TOOLS.map((t, i) => `<button data-action="kit-select" data-id="${t.id}" class="${tool.id === t.id ? "active" : ""}">${String(i + 1).padStart(2, "0")} / ${t.name}</button>`).join("")}</nav><section class="panel"><div class="between"><div><h3>${tool.name}</h3><p class="tiny muted">${tool.description}</p></div>${icon("note")}</div><div class="toolbar"><button class="btn primary small" data-action="kit-add" data-id="${tool.id}">${icon("plus")} Add entry</button><button class="btn outline small" data-action="kit-example" data-id="${tool.id}">Try an example</button><button class="btn outline small" data-action="kit-import" data-id="${tool.id}">${icon("upload")} Import JSON</button></div><div class="toolbar"><input id="kit-search" type="search" placeholder="Filter entries…" aria-label="Filter tool entries" value="${esc(kitFilter)}"><select id="kit-sort" aria-label="Sort tool entries"><option value="">Entry order</option>${tool.fields.map((f) => `<option value="${f.key}" ${kitSort === f.key ? "selected" : ""}>${f.label}</option>`).join("")}</select><button class="icon-btn" data-action="kit-reverse" aria-label="Reverse sort order">${icon("down")}</button></div>${
    rows.length
      ? `<div class="table-scroll"><table class="kit-table"><thead><tr>${tool.fields.map((f) => `<th>${f.label}</th>`).join("")}<th>Calculated</th><th>Entry actions</th></tr></thead><tbody>${indices
          .map(
            (i) =>
              `<tr>${tool.fields.map((f) => `<td><input aria-label="${f.label}, entry ${i + 1}" type="${f.type}" ${f.type === "number" ? 'min="0" max="100000000" step="any"' : 'maxlength="200"'} value="${esc(rows[i][f.key])}" data-kit-cell="${tool.id}|${i}|${f.key}"></td>`).join("")}<td>${Object.entries(
                tool.calc(rows[i]),
              )
                .map(
                  ([k, v]) =>
                    `<div class="calculated">${esc(k.replaceAll("_", " "))}: <b>${esc(typeof v === "number" ? Math.round(v * 100) / 100 : v)}</b></div>`,
                )
                .join(
                  "",
                )}</td><td><div class="actions"><button class="icon-btn" data-action="kit-duplicate" data-id="${tool.id}|${i}" aria-label="Duplicate entry ${i + 1}">${icon("copy")}</button><button class="icon-btn" data-action="kit-delete" data-id="${tool.id}|${i}" aria-label="Remove entry ${i + 1}">${icon("trash")}</button></div></td></tr>`,
          )
          .join("")}</tbody></table></div>`
      : `<div class="empty"><h3>Put your numbers on the table.</h3><p>Add an entry to begin, or explore a labelled example. Your figures save on this device.</p></div>`
  }<div class="kit-result" aria-live="polite">${result.summary.map(([l, v]) => `<div><span>${l}</span><strong>${esc(typeof v === "number" ? Math.round(v * 100) / 100 : v)}</strong></div>`).join("")}</div><div class="actions"><button class="btn outline small" data-action="kit-csv" data-id="${tool.id}">${icon("download")} Export CSV</button><button class="btn outline small" data-action="kit-json" data-id="${tool.id}">Export JSON</button><button class="btn outline small" data-action="print">${icon("print")} Print</button><button class="btn outline small" data-action="kit-clear" data-id="${tool.id}">Clear table</button></div><div class="notice">Planning estimates only. Check live costs, safety limits, capacity rules and local conditions before committing resources. Enter role labels rather than private personal details.</div></section></div></main>${footer()}`;
}
function settingsPage() {
  return `${header("settings")}<main id="main" class="container page"><div class="eyebrow">YOUR OWN LITTLE CORNER</div><h1 class="page-title">Make yourself<br>right at home.</h1><p class="subtext">A different world. A quieter pace. A colour that feels like you.</p><div class="grid-2" style="margin-top:30px"><section class="panel"><h3>Put your name on it.</h3><label>Your display name<input id="pref-alias" maxlength="40" value="${esc(prefs.alias)}" autocomplete="nickname"></label><p class="tiny muted">This is a private notebook name, not a public leaderboard entry.</p><h4>Pick a little signature.</h4><div class="choice-grid avatars">${["✦", "🍄", "☾", "🌱", "🦊", "🐝", "☁", "🪐", "🐸", "🦉", "🌻", "⚙", "🧩", "🪁", "🐌"].map((a) => `<button data-action="avatar" data-id="${a}" class="${prefs.avatar === a ? "selected" : ""}" aria-label="Avatar ${a}" aria-pressed="${prefs.avatar === a}">${a}</button>`).join("")}</div><h4>Set the mood.</h4><div class="choice-grid">${[
    ["paper", "Warm paper"],
    ["night", "After dark"],
    ["rose", "Rose garden"],
    ["ocean", "Sea glass"],
    ["contrast", "High contrast"],
  ]
    .map(
      ([id, l]) =>
        `<button data-action="theme" data-id="${id}" class="${prefs.theme === id ? "selected" : ""}" aria-pressed="${prefs.theme === id}">${l}</button>`,
    )
    .join(
      "",
    )}</div></section><section class="panel"><h3>Choose your world.</h3><div class="world-picks">${WORLDS.map((w) => `<button data-action="world" data-id="${w.id}" class="${prefs.world === w.id ? "selected" : ""}" aria-pressed="${prefs.world === w.id}"><span>${w.emoji}</span>${w.short}</button>`).join("")}</div><p class="tiny muted">Fantasy worlds change the story and artwork. All practice constraints stay visible, so the logic is always yours to solve.</p><h3 style="margin-top:27px">Choose your kind of calm.</h3><div class="aside-stack">${[
    ["large", "Larger text"],
    ["spacing", "Extra breathing room between words"],
    ["reduce", "Reduce animation"],
    ["sound", "Quiet move sounds"],
    ["autoCheck", "Show checks as I play"],
    ["timer", "Show the puzzle timer"],
  ]
    .map(
      ([id, l]) =>
        `<label class="check-label"><input type="checkbox" data-pref="${id}" ${(id === "reduce" ? prefs.motion === "off" : prefs[id]) ? "checked" : ""}>${l}</label>`,
    )
    .join(
      "",
    )}<label>Gentle break reminder<select id="pref-break">${[0, 10, 15, 20, 30, 45, 60].map((n) => `<option value="${n}" ${prefs.focusMinutes === n ? "selected" : ""}>${n ? n + " minutes" : "No reminder"}</option>`).join("")}</select></label></div></section></div><div class="actions" style="margin-top:24px"><button class="btn primary" data-action="save-alias">Save my name ${icon("check")}</button><button class="btn outline" data-action="prefs-reset">Reset preferences</button><button class="btn outline" data-action="sync">${icon("cloud")} Sync to my account</button></div><p class="tiny muted">Display settings save instantly on this device. Sign in and sync to carry your notebook between devices.</p></main>${footer()}`;
}
function organiser() {
  return `${header("organise")}<main id="main" class="container page"><div class="eyebrow">FOR THE PEOPLE MAKING THINGS HAPPEN</div><h1 class="page-title">Your everyday tangle.<br>Someone’s next side quest.</h1><p class="subtext">Turn a practical problem into a playable brief. Keep the final call with your team.</p><div class="actions" style="margin:25px 0"><button class="btn primary" data-action="create-quest">Create a community quest ${icon("plus")}</button><button class="btn outline" data-action="scenario-editor">${icon("sliders")} Build a practice scenario</button><button class="btn outline" data-action="refresh-org">${icon("refresh")} Refresh workspace</button></div><div class="notice"><b>Keep the brief safe to share.</b> Use role labels, approximate locations and aggregate counts. Published briefs are public. Do not add beneficiary names, phone numbers, exact home addresses or other sensitive details. Plans remain private to their author and the quest owner.</div><div class="grid-2" style="margin-top:25px"><section class="panel"><h3>Your organisation workspace</h3>${!cloud.user() ? `<p class="tiny muted">Sign in to publish briefs and review plans. You can build local practice scenarios now.</p><button class="btn primary small" data-action="auth">Sign in to get started</button>` : ownQuests.length ? ownQuests.map((q) => `<div class="saved-row"><div><h4>${esc(q.title)}</h4><p>${esc(q.organization)} · ${q.published ? "Published" : "Draft"} · ${LEVELS[q.difficulty || 0]}</p></div><div class="actions"><button class="btn outline small" data-action="play" data-id="q.${q.id}">Open</button><button class="btn outline small" data-action="toggle-quest" data-id="${q.id}">${q.published ? "Pause" : "Publish"}</button><button class="icon-btn" data-action="edit-quest" data-id="${q.id}" aria-label="Edit quest details">${icon("note")}</button></div></div>`).join("") : '<p class="tiny muted">Your first published brief can start here.</p>'}</section><section class="panel"><h3>The review desk</h3><p class="tiny muted">Review the complete plan and its assumptions. Approval records a decision; it does not dispatch vehicles or book people.</p>${
    reviews.length
      ? reviews
          .map((s) => {
            const q = ownQuests.find((q) => q.id === s.quest_id);
            const r = remoteReviews.find((r) => r.submission_id === s.id);
            return `<div class="saved-row"><div><h4>${esc(q?.title || "Community plan")}</h4><p>${new Date(s.created_at).toLocaleDateString("en-ZA")} · ${esc(r?.decision || "Waiting for review")}</p></div><button class="btn primary small" data-action="review" data-id="${s.id}">Review plan</button></div>`;
          })
          .join("")
      : '<p class="tiny muted">Plans submitted to your quests will appear here after you refresh.</p>'
  }</section></div><section class="panel" style="margin-top:24px"><div class="between"><h3>Your custom practice scenarios</h3><button class="btn outline small" data-action="scenario-editor">${icon("plus")} New scenario</button></div>${custom.length ? custom.map((c) => `<div class="saved-row"><div><h4>${esc(c.title)}</h4><p>${TYPE_INFO[c.config.type].label} · Saved on this device</p></div><div class="actions"><button class="btn primary small" data-action="play" data-id="${c.id}">Play</button><button class="btn outline small" data-action="scenario-edit" data-id="${c.id}">Edit</button><button class="icon-btn" data-action="scenario-export" data-id="${c.id}" aria-label="Export scenario">${icon("download")}</button><button class="icon-btn" data-action="scenario-delete" data-id="${c.id}" aria-label="Remove local scenario">${icon("trash")}</button></div></div>`).join("") : '<p class="tiny muted">Use the scenario editor to change availability, capacity, windows, supplies and fairness rules.</p>'}</section><div class="how-grid"><div><small>01 / BE SPECIFIC</small><h3>Give the puzzle its edges.</h3><p>State the goal, the quantities and the constraints. Good inputs make a useful plan possible.</p></div><div><small>02 / LET PEOPLE TRY</small><h3>More than one way forward.</h3><p>Players test arrangements and submit plans that pass the stated rules.</p></div><div><small>03 / REVIEW THE REALITY</small><h3>People make the final call.</h3><p>Confirm availability, travel, safeguarding and changing conditions before using anything.</p></div></div></main>${footer()}`;
}
function aboutPage() {
  return `${header("about")}<main id="main" class="container page"><div class="eyebrow">THE IDEA BEHIND THE GOOD DISTRACTION</div><div class="logo-lockup"><img src="./icon.svg" alt="SIDE QUEST emblem"><strong>SIDE<br>QUEST↗</strong></div><h1 class="page-title">What if your puzzle habit<br>had a useful little side effect?</h1><p class="subtext">SIDE QUEST explores a simple idea: turn community logistics into something people can play, understand and help untangle.</p><div class="grid-2" style="margin-top:30px"><section class="panel"><h3>Play is a way of thinking.</h3><p>Volunteer rotas, food routes and supply packs all involve the same satisfying question: how can these pieces work together?</p><p class="tiny muted">The practice library contains 6,000 deterministic puzzles: three types, four difficulty levels, and 500 editions per level. Six story worlds put a different coat of paint on the same transparent rules.</p><p class="tiny muted">Citizen-science projects show how people can contribute to shared work. Here, the focus is on everyday logistics, with an organisation checking every submitted plan before use.</p></section><section class="panel"><h3>Useful, with an honest boundary.</h3><p>Solving a practice puzzle does not mean a delivery happened or a learner received supplies.</p><p class="tiny muted">Community briefs are published by account holders. SIDE QUEST does not verify an organisation’s identity or guarantee its claims. A feasible plan is a starting point for human review, not an operational instruction.</p><p class="tiny muted">Built by Simoné Govender · Bachelor of Education · Quantum Cupcake Creations.</p><a class="text-link" href="https://cosmicbubblegumgirl.github.io/simone-cosmic-portfolio/" target="_blank" rel="noopener">More of Simoné’s work ↗</a></section></div><section class="panel" style="margin-top:24px"><h3>The mark</h3><p class="tiny muted">An interlocking S and Q, a forward step, and a small star for possibility. The same mark follows you from the tab icon to your pocket.</p><div class="actions"><button class="btn outline small" data-action="download-logo">${icon("download")} Logo SVG</button><button class="btn outline small" data-action="download-icon">App icon SVG</button><a class="btn primary small" href="#library">Try a quest ${icon("arrow")}</a></div></section></main>${footer()}`;
}
function privacy() {
  return `${header("privacy")}<main id="main" class="container page"><div class="eyebrow">A NOTE ON YOUR DATA</div><h1 class="page-title">A notebook.<br>Not a data grab.</h1><div class="grid-2" style="margin-top:30px"><section class="panel"><h3>On this device</h3><p class="tiny muted">Puzzle progress, checkpoints, preferences, journal notes, custom practice scenarios and field-kit tables are stored in your browser’s local database. Clearing site data can remove them. Export a backup if you want a copy.</p><h3>With an account</h3><p class="tiny muted">Email and encrypted authentication credentials are managed by Supabase Auth. An active sign-in session is kept in your browser. Explicit sync saves your notebook to your account. Sign out on shared devices.</p><h3>Public and private</h3><p class="tiny muted">Published community quest titles, organisation labels, briefs and constraints are public. Submissions and reviews are accessible only to the plan author and quest owner. Unpublished briefs belong to their owner. Organisation names are self-reported.</p></section><section class="panel"><h3>Keep people’s details out</h3><p class="tiny muted">Use anonymous role labels and approximate locations. Do not enter beneficiary details, identity numbers, home addresses, personal phone numbers or sensitive health information.</p><h3>No advertising trackers</h3><p class="tiny muted">SIDE QUEST does not add advertising, analytics or third-party fonts. Hosting and database providers may keep operational logs. See <a class="text-link" href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener">GitHub privacy</a> and <a class="text-link" href="https://supabase.com/privacy" target="_blank" rel="noopener">Supabase privacy</a>.</p><div class="actions"><button class="btn primary small" data-action="backup">Export my local data</button><button class="btn outline small" data-action="delete-cloud">Delete cloud notebook</button><button class="btn danger small" data-action="clear-local">Clear local notebook</button></div><p class="tiny muted">Deleting the cloud notebook removes the synced copy only. Submitted plans and review records are retained in the community workflow. You can withdraw your own submission from its detail view.</p></section></div></main>${footer()}`;
}
const KIT_ACTIONS = [
  "add an entry",
  "edit entry values",
  "duplicate an entry",
  "remove an entry",
  "filter entries",
  "sort by any input",
  "reverse the sort",
  "load an example",
  "calculate row results",
  "calculate totals",
  "export CSV",
  "export JSON",
  "import JSON",
  "print the table",
  "save across visits",
  "clear the table",
];
const CORE_CAPS = [
  ["library", "6,000 seeded puzzles"],
  ["library", "Three puzzle engines"],
  ["library", "Four difficulty levels"],
  ["library", "Search by title or number"],
  ["library", "Filter by game type"],
  ["library", "Filter by difficulty"],
  ["library", "Filter community briefs"],
  ["library", "Filter saved quests"],
  ["library", "Sort by difficulty"],
  ["library", "Sort by edition number"],
  ["library", "Sort by recent play"],
  ["library", "Card and list layouts"],
  ["library", "Paginated quest library"],
  ["library", "Random quest choice"],
  ["library", "Save favourite quests"],
  ["home", "Daily rotating starter quests"],
  ["settings", "Six story worlds"],
  ["settings", "Five colour themes"],
  ["settings", "Fifteen personal avatars"],
  ["settings", "Personal notebook name"],
  ["settings", "Larger type"],
  ["settings", "Wider text spacing"],
  ["settings", "Reduced animation"],
  ["settings", "Optional move sounds"],
  ["settings", "Hide the timer"],
  ["settings", "Live-check preference"],
  ["settings", "Gentle break reminders"],
  ["settings", "Reset preferences"],
  ["dashboard", "Resume saved plans"],
  ["dashboard", "Solution milestones"],
  ["dashboard", "Time spent thinking"],
  ["dashboard", "Personal journal"],
  ["dashboard", "Delete journal entries"],
  ["dashboard", "Export notebook backup"],
  ["dashboard", "Restore notebook backup"],
  ["dashboard", "Merge cloud notebook"],
  ["dashboard", "Private review decisions"],
  ["organise", "Custom scenario editor"],
  ["organise", "Edit local scenarios"],
  ["organise", "Export local scenarios"],
  ["organise", "Remove local scenarios"],
  ["organise", "Publish community briefs"],
  ["organise", "Pause community briefs"],
  ["organise", "Edit brief details"],
  ["organise", "Private review workspace"],
  ["organise", "Approve a plan"],
  ["organise", "Request revisions"],
  ["organise", "Decline a plan"],
  ["organise", "Record plan use"],
  ["organise", "Download submitted plans"],
  ["about", "Vector logo download"],
  ["about", "App icon download"],
  ["privacy", "Export personal records"],
  ["privacy", "Delete synced notebook"],
  ["privacy", "Clear device notebook"],
];
function capabilities() {
  const q =
    new URLSearchParams(location.hash.split("?")[1] || "").get("q") || "";
  const caps = [
    ...CORE_CAPS.map(([route, name]) => ({ route, name })),
    ...TOOLS.flatMap((t) =>
      KIT_ACTIONS.map((a) => ({
        route: "kit/" + t.id,
        name: t.name + " · " + a,
      })),
    ),
  ];
  const filtered = caps.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase()),
  );
  return `${header("capabilities")}<main id="main" class="container page"><div class="eyebrow">A LOOK INSIDE THE TOOLBOX</div><h1 class="page-title">Small actions.<br>Quite a lot of them.</h1><p class="subtext">${caps.length} usable capabilities across the library, personal notebook, organisation workspace and 24 planning tools. Table actions are listed per tool so you can see exactly what is included.</p><div class="toolbar"><div class="search">${icon("search")}<input id="cap-search" type="search" aria-label="Find a capability" placeholder="Find a capability…" value="${esc(q)}"></div><button class="btn outline" data-action="export-capabilities">Export list</button></div><p class="tiny muted">${filtered.length} matching capabilities · puzzle variants are counted separately from features.</p><div class="capabilities-grid">${filtered.map((c) => `<a class="capability" href="#${c.route}">${icon("check")} ${esc(c.name)} ${icon("arrow")}</a>`).join("")}</div></main>${footer()}`;
}
async function render() {
  const seq = ++renderSeq;
  route = location.hash.slice(1) || "home";
  const base = route.split("/")[0].split("?")[0];
  if (base !== "play") {
    focus = false;
    document.body.classList.remove("focus-mode");
    await saveGame();
    g = null;
  }
  if (base === "play" && (!g || g.id !== route.slice(5))) {
    await openGame(route.slice(5));
    return;
  }
  if (seq !== renderSeq) return;
  app.innerHTML =
    base === "home"
      ? home()
      : base === "library"
        ? library()
        : base === "play"
          ? game()
          : base === "dashboard"
            ? dashboard()
            : base === "kit"
              ? kitPage(route.split("/")[1])
              : base === "settings"
                ? settingsPage()
                : base === "organise"
                  ? organiser()
                  : base === "about"
                    ? aboutPage()
                    : base === "privacy"
                      ? privacy()
                      : base === "capabilities"
                        ? capabilities()
                        : `${header("")}<main class="container page" id="main"><div class="empty"><h1>This path took a little detour.</h1><a class="btn primary" href="#home">Back home</a></div></main>${footer()}`;
  document.title =
    (base === "play" && g
      ? g.title
      : {
          library: "The quest board",
          dashboard: "Your notebook",
          kit: "Field kit",
          organise: "For organisations",
          settings: "Make it yours",
        }[base] || "Play something useful") + " · SIDE QUEST";
  document.body.classList.toggle("focus-mode", focus);
}
function redrawLibrary() {
  const input = $("#quest-search");
  const start = input?.selectionStart;
  app.innerHTML = library();
  if (input) {
    const i = $("#quest-search");
    i.focus();
    i.setSelectionRange(start, start);
  }
}
function how() {
  showModal(
    "Your brain. A few pieces. A good plan.",
    `<p>Choose a practice quest or a published community brief. Read the rules, move the pieces and check your plan.</p><div class="how-grid" style="margin:15px 0;gap:15px"><div><small>SHIFTS</small><p>Choose a person for each session. Match skills and availability.</p></div><div><small>DELIVERIES</small><p>Choose vehicles, then reorder stops to meet time and load limits.</p></div><div><small>SUPPLY PACKS</small><p>Add supplies to packs. Respect stock, minimums, weight and fairness.</p></div></div><div class="notice"><b>All input methods count.</b> Use dropdowns, buttons or the keyboard. Dragging is optional. Undo is always a perfectly good move.</div><p><span class="kbd">Ctrl/Cmd + Z</span> Undo · <span class="kbd">Ctrl/Cmd + Shift + Z</span> Redo · <span class="kbd">Esc</span> Close a dialog</p><p>Practice solutions stay in your notebook. Community plans must pass the constraints and then be reviewed by the quest owner.</p><button class="btn primary" data-action="close">Let’s have a go ${icon("arrow")}</button>`,
  );
}
let authMode = "signin";
function authModal(mode = "signin") {
  if (cloud.user() && mode === "signin") {
    showModal(
      "Your account",
      `<p>Signed in as <b>${esc(cloud.user().email)}</b>.</p><p>Carry your notebook between devices by syncing. Your local work remains available when you sign out.</p><div class="actions"><button class="btn primary" data-action="sync">Sync notebook</button><button class="btn outline" data-action="signout">Sign out</button></div>`,
    );
    return;
  }
  authMode = mode;
  showModal(
    mode === "signup"
      ? "Join the good side."
      : mode === "recover"
        ? "Find your way back."
        : mode === "verify"
          ? "Confirm your email."
          : "Good to see you.",
    `<p>${mode === "signup" ? "Keep your notebook across devices and submit plans to community briefs." : mode === "recover" ? "We’ll request a reset email from the account provider." : mode === "verify" ? "If your confirmation email contains a code, enter it here. Otherwise follow its link, then return and sign in." : "Sign in to sync your notebook or open your organisation workspace."}</p><form id="auth-form"><div class="form-grid">${mode === "signup" ? '<label class="full">Display name<input name="name" required maxlength="40" autocomplete="nickname"></label>' : ""}<label class="full">Email<input name="email" type="email" required autocomplete="email"></label>${mode === "verify" ? '<label class="full">Confirmation code<input name="code" required inputmode="numeric" autocomplete="one-time-code"></label>' : mode !== "recover" ? `<label class="full">Password<input name="password" type="password" required minlength="8" autocomplete="${mode === "signup" ? "new-password" : "current-password"}"></label>` : ""}</div><div class="feedback" id="auth-feedback" role="status"></div><button class="btn primary" type="submit">${mode === "signup" ? "Create account" : mode === "recover" ? "Request reset email" : mode === "verify" ? "Confirm email" : "Sign in"} ${icon("arrow")}</button></form><div class="actions" style="margin-top:18px"><button class="text-link" data-action="auth-mode" data-id="${mode === "signup" ? "signin" : "signup"}">${mode === "signup" ? "Already joined? Sign in" : "New here? Create an account"}</button>${mode === "signin" ? '<button class="text-link" data-action="auth-mode" data-id="recover">Forgot password?</button><button class="text-link" data-action="auth-mode" data-id="verify">Confirm email</button>' : ""}</div><p class="tiny muted">Accounts share the Quantum Cupcake Creations authentication service. Existing accounts on this service can sign in here. Do not use a shared password on unrelated sites.</p>`,
  );
}
async function loadRemote() {
  try {
    community = await cloud.request("sq_quests", {
      query: "published=eq.true&select=*&order=created_at.desc&limit=200",
    });
    backendStatus = "online";
    if (cloud.user()) {
      const uid = cloud.user().id;
      const rs = await Promise.allSettled([
        cloud.request("sq_quests", {
          query: `owner_id=eq.${uid}&select=*&order=created_at.desc`,
        }),
        cloud.request("sq_submissions", {
          query: `author_id=eq.${uid}&select=*&order=created_at.desc`,
        }),
        cloud.request("sq_reviews", {
          query: "select=*&order=created_at.desc",
        }),
      ]);
      ownQuests = rs[0].status === "fulfilled" ? rs[0].value : [];
      remoteSubmissions = rs[1].status === "fulfilled" ? rs[1].value : [];
      remoteReviews = rs[2].status === "fulfilled" ? rs[2].value : [];
      if (ownQuests.length)
        reviews = await cloud.request("sq_submissions", {
          query:
            "quest_id=in.(" +
            ownQuests.map((q) => q.id).join(",") +
            ")&select=*&order=created_at.desc",
        });
      else reviews = [];
      const failed = rs.find((r) => r.status === "rejected");
      if (failed) throw failed.reason;
    }
  } catch (e) {
    backendStatus = "offline";
    throw e;
  }
}
async function sync() {
  if (!cloud.user()) {
    authModal();
    return;
  }
  toast("Bringing your notebook together…");
  const uid = cloud.user().id;
  const data =
    (
      await cloud.request("sq_state", {
        query: "user_id=eq." + uid + "&select=*",
      })
    )[0]?.data || {};
  const remoteRecords = data.records || {};
  for (const [id, r] of Object.entries(remoteRecords))
    if (
      validateConfig(r.config) &&
      planShape(r.config, r.plan) &&
      (!records[id] || r.updated > records[id].updated)
    )
      records[id] = r;
  bookmarks = [...new Set([...bookmarks, ...(data.bookmarks || [])])];
  const entries = new Map(
    [...(data.journal || []), ...journal].map((j) => [j.id, j]),
  );
  journal = [...entries.values()].sort((a, b) => a.at - b.at);
  const scenarios = new Map(
    [...(data.custom || []), ...custom].map((c) => [c.id, c]),
  );
  custom = [...scenarios.values()].filter((c) => validateConfig(c.config));
  if (data.prefs && (data.prefs.updated || 0) > (prefs.updated || 0)) {
    prefs = { ...prefs, ...data.prefs };
    applyPrefs();
  }
  if (data.kits)
    for (const t of TOOLS)
      if (!(kits[t.id] || []).length && validRows(t, data.kits[t.id]))
        kits[t.id] = data.kits[t.id];
  await cloud.request("sq_state", {
    method: "POST",
    upsert: true,
    body: {
      user_id: uid,
      data: { records, bookmarks, journal, custom, prefs, kits },
      updated_at: new Date().toISOString(),
    },
  });
  await Promise.all([
    persist("plans", records),
    persist("bookmarks", bookmarks),
    persist("journal", journal),
    persist("custom", custom),
    persist("preferences", prefs),
    persist("kits", kits),
  ]);
  await loadRemote();
  if (modal.open) modal.close();
  render();
  toast(
    "Notebook synced. Newer appearance settings and missing field-kit tables were brought together.",
  );
}
async function finish() {
  const e = evaluate(g.config, g.plan);
  if (!e.valid) {
    g.checked = true;
    drawGame();
    checkModal(e);
    return;
  }
  if (g.quest) {
    if (!cloud.user()) {
      authModal();
      return;
    }
    showModal(
      "A useful plan deserves a careful handover.",
      `<p>Your plan passes the stated rules. The quest owner still needs to confirm it works in the real world.</p><label>Assumptions and handover notes<textarea id="submission-notes" maxlength="3000">${esc(g.notes)}</textarea></label><label class="check-label" style="margin:15px 0"><input id="submission-consent" type="checkbox">I’ve kept private personal information out of this plan.</label><button class="btn primary" data-action="submit-plan">Send to the review desk ${icon("arrow")}</button><div class="feedback" id="submit-feedback" role="status"></div>`,
    );
    return;
  }
  g.completed = true;
  await saveGame();
  celebrate();
  showModal(
    "That’s a good fit.",
    `<span class="badge lime">ALL STATED CONSTRAINTS SATISFIED</span><p>You’ve turned a collection of pieces into a feasible practice plan. Keep it, try a different route, or give your brain a bigger stretch.</p><div class="stats"><div><strong>${g.moves}</strong><span>moves</span></div><div><strong>${formatTime(g.seconds)}</strong><span>thinking time</span></div><div><strong>${e.impact}</strong><span>${g.config.type === "shifts" ? "learners covered" : g.config.type === "deliveries" ? "crates routed" : "packs prepared"} in your practice plan</span></div></div><div class="notice">This is a practice scenario. No real-world delivery, booking or donation has taken place.</div><div class="actions"><button class="btn primary" data-action="close">Keep exploring</button><button class="btn outline" data-action="export-csv">Download my plan</button>${parseId(g.id) && g.config.level < 3 ? '<button class="btn lime" data-action="harder">Turn up the challenge ↗</button>' : '<button class="btn lime" data-action="next-edition">Another edition ↗</button>'}</div>`,
  );
  drawGame();
}
function checkModal(e) {
  showModal(
    e.valid ? "The pieces fit." : "A few pieces still need you.",
    `<p>${e.valid ? "Your plan meets all of the stated constraints. Check the assumptions before using it." : `${e.errors.length} rule checks need another look.`}</p>${e.errors.length ? `<ul class="error-list" style="max-height:45vh">${e.errors.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}${e.warnings.map((w) => `<div class="notice">${esc(w)}</div>`).join("")}<div class="actions"><button class="btn primary" data-action="close">Back to the puzzle</button>${e.valid ? '<button class="btn outline" data-action="finish">Save / submit plan</button>' : ""}</div>`,
  );
}
function celebrate() {
  sound(620);
  if (
    prefs.motion === "off" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const conf = document.createElement("div");
  conf.className = "confetti";
  conf.innerHTML = Array.from(
    { length: 35 },
    (_, i) =>
      `<i style="left:${i * 2.9}%;background:${["#d4fb51", "#ded6f4", "#ffcfb1"][i % 3]};animation-delay:${(i % 7) * 0.07}s"></i>`,
  ).join("");
  document.body.append(conf);
  setTimeout(() => conf.remove(), 2700);
}
let editor = null,
  editingLocal = null;
function editorTable(c) {
  const field = (obj, collection, i, key, type = "text") =>
    `<input aria-label="${esc(key)} ${i + 1}" data-editor-cell="${collection}|${i}|${key}" type="${type}" ${type === "number" ? 'min="0" max="100000"' : ""} value="${esc(obj[key])}">`;
  if (c.type === "shifts")
    return `<h4>Sessions</h4><div class="table-scroll"><table class="kit-table"><thead><tr><th>Session</th><th>Subject</th><th>Time group</th><th>Learners</th></tr></thead><tbody>${c.slots.map((s, i) => `<tr><td>${field(s, "slots", i, "name")}</td><td>${field(s, "slots", i, "subject")}</td><td>${field(s, "slots", i, "time", "number")}</td><td>${field(s, "slots", i, "learners", "number")}</td></tr>`).join("")}</tbody></table></div><p class="tiny muted">Sessions with the same time-group number overlap.</p><h4>People & availability</h4>${c.people.map((p, i) => `<div class="panel" style="padding:14px;margin:10px 0"><div class="form-grid"><label>Role label${field(p, "people", i, "name")}</label><label>Skills (comma separated)<input aria-label="Skills person ${i + 1}" data-editor-skills="${i}" value="${esc([...new Set(p.skills)].join(", "))}"></label><label>Maximum sessions${field(p, "people", i, "max", "number")}</label></div><div class="chips" style="margin-top:10px">${c.slots.map((s) => `<label class="check-label tiny"><input type="checkbox" data-editor-available="${i}|${s.id}" ${p.available.includes(s.id) ? "checked" : ""}>${esc(s.name)}</label>`).join("")}</div></div>`).join("")}`;
  if (c.type === "deliveries")
    return `<h4>Delivery stops</h4><div class="table-scroll"><table class="kit-table"><thead><tr>${["Stop", "Crates", "X coordinate", "Y coordinate", "Opens (min after 08:00)", "Closes (min after 08:00)", "Service minutes", "Needs cool storage"].map((t) => `<th>${t}</th>`).join("")}</tr></thead><tbody>${c.stops.map((s, i) => `<tr>${["name", "qty", "x", "y", "open", "close", "service"].map((k) => `<td>${field(s, "stops", i, k, k === "name" ? "text" : "number")}</td>`).join("")}<td><input type="checkbox" aria-label="Cool storage stop ${i + 1}" data-editor-bool="stops|${i}|cold" ${s.cold ? "checked" : ""}></td></tr>`).join("")}</tbody></table></div><h4>Vehicles</h4><div class="table-scroll"><table class="kit-table"><thead><tr><th>Vehicle</th><th>Capacity (crates)</th><th>Cool storage</th></tr></thead><tbody>${c.vehicles.map((v, i) => `<tr><td>${field(v, "vehicles", i, "name")}</td><td>${field(v, "vehicles", i, "capacity", "number")}</td><td><input type="checkbox" aria-label="Cool storage vehicle ${i + 1}" data-editor-bool="vehicles|${i}|cold" ${v.cold ? "checked" : ""}></td></tr>`).join("")}</tbody></table></div><label style="margin-top:15px">Return deadline (minutes after 08:00)<input type="number" id="editor-return" min="0" max="1440" value="${c.returnBy}"></label>`;
  return `<div class="form-grid"><label>Number of packs<input id="editor-kits" type="number" min="1" max="20" value="${c.kits.length}"></label><label>Maximum weight per pack (g)<input id="editor-weight" type="number" min="1" max="100000" value="${c.maxWeight}"></label><label>Maximum difference of each item between packs<input id="editor-fairness" type="number" min="0" max="100" value="${c.fairness}"></label></div><h4>Donated supplies</h4><div class="table-scroll"><table class="kit-table"><thead><tr><th>Item</th><th>Minimum per pack</th><th>Available stock</th><th>Unit weight (g)</th></tr></thead><tbody>${c.items.map((s, i) => `<tr>${["name", "min", "stock", "weight"].map((k) => `<td>${field(s, "items", i, k, k === "name" ? "text" : "number")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function scenarioEditor(id) {
  const local = custom.find((c) => c.id === id);
  editingLocal = local?.id || null;
  editor = structuredClone(local?.config || generate("shifts", 0, 1));
  drawEditor(local?.title || "My community practice quest");
}
function drawEditor(title) {
  showModal(
    "Build your own little tangle.",
    `<p>Use anonymous role labels. Edit the numbers, check that a solution is possible, then save a local scenario.</p><label>Scenario title<input id="editor-title" maxlength="100" value="${esc(title)}"></label><div class="form-grid" style="margin:15px 0"><label>Game type<select id="editor-type">${TYPES.map((t) => `<option value="${t}" ${editor.type === t ? "selected" : ""}>${TYPE_INFO[t].label}</option>`).join("")}</select></label><label>Starting complexity<select id="editor-level">${LEVELS.map((l, i) => `<option value="${i}" ${editor.level === i ? "selected" : ""}>${l}</option>`).join("")}</select></label></div><div id="editor-fields">${editorTable(editor)}</div><div class="feedback" id="editor-feedback" role="status"></div><div class="actions"><button class="btn primary" data-action="scenario-save">Save scenario</button><button class="btn outline" data-action="scenario-check">Check feasibility</button><button class="btn outline" data-action="scenario-import">Import scenario JSON</button><button class="btn outline" data-action="editor-add">Add ${editor.type === "shifts" ? "session" : editor.type === "deliveries" ? "stop" : "item"}</button></div>`,
  );
}
function createQuest() {
  if (!cloud.user()) {
    authModal();
    return;
  }
  showModal(
    "Put a real challenge on the board.",
    `<p>Publish a clear brief using a practice scenario you’ve prepared. Your account will own the review desk.</p><form id="quest-form"><div class="form-grid"><label class="full">Quest title<input name="title" required maxlength="100" placeholder="Help cover our Saturday tutoring sessions"></label><label class="full">Organisation name<input name="organization" required maxlength="100" placeholder="Your organisation’s name"></label><label class="full">The brief<textarea name="brief" required maxlength="3000" placeholder="What needs to happen? What would a useful plan look like?"></textarea></label><label>Scenario to publish<select name="scenario" required>${custom.length ? custom.map((c) => `<option value="${c.id}">${esc(c.title)}</option>`).join("") : '<option value="">Create a practice scenario first</option>'}</select></label><label>Difficulty<select name="difficulty">${LEVELS.map((l, i) => `<option value="${i}">${l}</option>`).join("")}</select></label><label class="check-label full"><input name="safe" type="checkbox" required>I have authority to post this brief and have removed private personal details.</label><label class="check-label full"><input name="publish" type="checkbox">Publish now (otherwise save as a draft)</label></div><div class="feedback" id="quest-feedback" role="status"></div><div class="actions"><button class="btn primary" type="submit" ${!custom.length ? "disabled" : ""}>Save community quest ${icon("arrow")}</button><button type="button" class="btn outline" data-action="scenario-editor">Create a scenario first</button></div></form>`,
  );
}
function reviewModal(id) {
  const s = reviews.find((s) => s.id === id);
  if (!s) return;
  const q = ownQuests.find((q) => q.id === s.quest_id);
  const e = evaluate(s.config_snapshot || q.config, s.plan);
  const existing = remoteReviews.find((r) => r.submission_id === id);
  showModal(
    "The review desk",
    `<span class="badge">${esc(q?.title || "Community quest")}</span><p>${e.valid ? "The submitted plan passes the stated constraints." : "The submitted plan needs another check."} Confirm current conditions before approving.</p>${table(e.rows)}<h4>Player’s handover</h4><p style="white-space:pre-wrap">${esc(s.notes || "No additional notes.")}</p><label>Decision<select id="review-decision">${[
      ["approved", "Approved for planning"],
      ["revision", "Needs revision"],
      ["declined", "Declined"],
      ["used", "Used by organisation"],
    ]
      .map(
        ([v, l]) =>
          `<option value="${v}" ${existing?.decision === v ? "selected" : ""}>${l}</option>`,
      )
      .join(
        "",
      )}</select></label><label style="margin-top:15px">Review note<textarea id="review-note" maxlength="3000">${esc(existing?.note || "")}</textarea></label><div class="feedback" id="review-feedback" role="status"></div><div class="actions"><button class="btn primary" data-action="save-review" data-id="${id}">Record decision</button><button class="btn outline" data-action="review-export" data-id="${id}">Download plan CSV</button></div>`,
  );
}
function readFile(accept = ".json") {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.addEventListener("change", () => resolve(input.files?.[0] || null), {
      once: true,
    });
    input.addEventListener("cancel", () => resolve(null), { once: true });
    input.click();
  });
}
async function importJSON() {
  const file = await readFile();
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024)
    throw Error("Please choose a JSON file smaller than 5 MB.");
  return JSON.parse(await file.text());
}
async function backup() {
  await saveGame();
  download("side-quest-notebook.json", {
    version: 1,
    exported: new Date().toISOString(),
    preferences: prefs,
    plans: records,
    bookmarks,
    journal,
    custom,
    kits,
  });
}
function validRows(tool, rows) {
  return (
    Array.isArray(rows) &&
    rows.length <= 1000 &&
    rows.every(
      (r) =>
        r &&
        typeof r === "object" &&
        tool.fields.every((f) =>
          f.type === "number"
            ? typeof r[f.key] === "number" &&
              Number.isFinite(r[f.key]) &&
              r[f.key] >= 0 &&
              r[f.key] <= 1e8
            : typeof r[f.key] === "string" && r[f.key].length <= 200,
        ),
    )
  );
}
async function changeWorld(id) {
  if (!WORLDS.some((w) => w.id === id)) return;
  prefs.world = id;
  await savePrefs();
  if (g && !g.quest && parseId(g.id))
    g.title = narrTitle(g.config.type, g.config.seed);
  if (modal.open && $("#settings-shortcut", modal)) {
    modal.close();
  }
  render();
  toast(world().line);
}
async function changeDifficulty(level) {
  const d = parseId(g?.id);
  if (!d) return;
  if (modal.open) modal.close();
  await openGame(`${d.type}-${level}-${d.seed}`);
  toast(`${LEVELS[level]} · Your previous plan is saved in your notebook.`);
}
function submissionDetail(id) {
  const s = remoteSubmissions.find((s) => s.id === id);
  if (!s) return;
  showModal(
    "Your community plan",
    `<span class="badge">${esc(remoteReviews.find((r) => r.submission_id === s.id)?.decision || "Awaiting review")}</span><p>${esc(s.notes || "No handover notes.")}</p>${table(evaluate(s.config_snapshot, s.plan).rows)}<div class="actions"><button class="btn outline" data-action="submission-export" data-id="${s.id}">Download CSV</button><button class="btn danger" data-action="submission-withdraw" data-id="${s.id}">Withdraw submission</button></div><p class="tiny muted">Withdrawing removes the shared plan and its review from this app. It cannot retract a copy the organisation has already downloaded.</p>`,
  );
}
const actions = {
  "submission-detail": (b) => submissionDetail(b.dataset.id),
  "submission-export": (b) => {
    const s = remoteSubmissions.find((s) => s.id === b.dataset.id);
    download(
      "side-quest-community-plan.csv",
      csv(evaluate(s.config_snapshot, s.plan).rows),
      "text/csv;charset=utf-8",
    );
  },
  "submission-withdraw": (b) =>
    showModal(
      "Withdraw this community plan?",
      `<p>This removes the submission and review from the shared workspace. Keep a downloaded copy first if you need it.</p><button class="btn danger" data-action="submission-withdraw-confirm" data-id="${b.dataset.id}">Withdraw this plan</button>`,
    ),
  "submission-withdraw-confirm": async (b) => {
    await cloud.request("sq_submissions", {
      method: "DELETE",
      query: "id=eq." + b.dataset.id,
    });
    await loadRemote();
    modal.close();
    render();
    toast("Submission withdrawn.");
  },

  close: () => modal.close(),
  menu: (b) => {
    const nav = $(".mobile-nav");
    nav.classList.toggle("open");
    b.setAttribute("aria-expanded", nav.classList.contains("open"));
  },
  settings: () => {
    if (modal.open) modal.close();
    location.hash = "settings";
  },
  how,
  auth: () => authModal(),
  "auth-mode": (b) => authModal(b.dataset.id),
  async signout() {
    await cloud.signout().catch(() => {});
    remoteSubmissions = [];
    ownQuests = [];
    reviews = [];
    remoteReviews = [];
    modal.close();
    render();
    toast("Signed out. Your local notebook is still here.");
  },
  world: (b) => changeWorld(b.dataset.id),
  theme: async (b) => {
    prefs.theme = b.dataset.id;
    await savePrefs();
    render();
  },
  avatar: async (b) => {
    prefs.avatar = b.dataset.id;
    await savePrefs();
    render();
  },
  "save-alias": async () => {
    prefs.alias = $("#pref-alias").value.trim() || "Curious neighbour";
    await savePrefs();
    toast("Your corner, your name.");
    render();
  },
  "prefs-reset": () =>
    confirmAction(
      "A fresh coat of paint?",
      "Reset your appearance and play preferences. Your saved plans stay in your notebook.",
      "prefs-reset-confirm",
    ),
  "prefs-reset-confirm": async () => {
    prefs = {
      theme: "paper",
      world: "local",
      avatar: "✦",
      alias: "Curious neighbour",
      motion: "on",
      large: false,
      spacing: false,
      sound: false,
      autoCheck: true,
      timer: true,
      focusMinutes: 20,
    };
    await savePrefs();
    modal.close();
    render();
  },
  play: (b) => openGame(b.dataset.id),
  "filter-type": (b) => {
    lib.type = b.dataset.id;
    lib.page = 0;
    redrawLibrary();
  },
  "library-reset": () => {
    lib = {
      type: "all",
      level: "all",
      source: "all",
      search: "",
      sort: "seed",
      page: 0,
      view: "grid",
    };
    render();
  },
  prev: () => {
    lib.page = Math.max(0, lib.page - 1);
    render();
    window.scrollTo({ top: 250 });
  },
  next: () => {
    lib.page++;
    render();
    window.scrollTo({ top: 250 });
  },
  "view-grid": () => {
    lib.view = "grid";
    render();
  },
  "view-list": () => {
    lib.view = "list";
    render();
  },
  surprise: () => {
    const type =
      lib.type === "all" ? TYPES[Math.floor(Math.random() * 3)] : lib.type;
    openGame(
      `${type}-${lib.level === "all" ? Math.floor(Math.random() * 4) : lib.level}-${Math.floor(Math.random() * 500) + 1}`,
    );
  },
  async bookmark(b) {
    const id = b.dataset.id;
    bookmarks = bookmarks.includes(id)
      ? bookmarks.filter((x) => x !== id)
      : [...bookmarks, id];
    await persist("bookmarks", bookmarks);
    if (g) drawGame();
    else render();
    toast(
      bookmarks.includes(id)
        ? "Saved for a curious moment."
        : "Quest removed from favourites.",
    );
  },
  "game-tab": (b) => {
    g.tab = b.dataset.id;
    drawGame();
  },
  undo: () => {
    if (g.cursor > 0) {
      g.plan = structuredClone(g.history[--g.cursor]);
      saveGame();
      drawGame();
    }
  },
  redo: () => {
    if (g.cursor < g.history.length - 1) {
      g.plan = structuredClone(g.history[++g.cursor]);
      saveGame();
      drawGame();
    }
  },
  reset: () =>
    confirmAction(
      "A clean board?",
      "Reset this attempt. A checkpoint will keep your current arrangement.",
      "reset-confirm",
    ),
  "reset-confirm": () => {
    g.snapshots.push({
      name: "Before reset",
      at: Date.now(),
      plan: structuredClone(g.plan),
      score: evaluate(g.config, g.plan).percent,
    });
    commit(emptyPlan(g.config));
    modal.close();
  },
  focus: () => {
    focus = !focus;
    drawGame();
  },
  pause: () => {
    paused = !paused;
    drawGame();
  },
  check: () => {
    g.checked = true;
    drawGame();
    checkModal(evaluate(g.config, g.plan));
  },
  finish,
  hint: () => {
    const suggestion = solve(g.config);
    if (!suggestion) {
      toast(
        "No simple feasible arrangement found. Recheck the scenario’s limits.",
      );
      return;
    }
    let text = "";
    if (g.config.type === "shifts") {
      const s = g.config.slots.find(
        (s) => g.plan.assignments[s.id] !== suggestion.assignments[s.id],
      );
      text = s
        ? `Try ${g.config.people.find((v) => v.id === suggestion.assignments[s.id]).name} for ${s.name}. Check their skills and availability.`
        : "Your current assignments already match one feasible arrangement.";
    } else if (g.config.type === "deliveries") {
      const v = g.config.vehicles.find(
        (v) =>
          JSON.stringify(g.plan.routes[v.id]) !==
          JSON.stringify(suggestion.routes[v.id]),
      );
      text = v
        ? `One workable option for ${v.name}: ${suggestion.routes[v.id].map((id) => g.config.stops.find((s) => s.id === id).name).join(" → ") || "keep it in reserve"}.`
        : "Your routes match one feasible arrangement.";
    } else {
      text = `Start with ${g.config.items.map((i) => i.min + " " + i.name.toLowerCase()).join(", ")} in every pack. Then check remaining stock and fairness.`;
    }
    showModal(
      "Just a little nudge.",
      `<p>${esc(text)}</p><p class="tiny muted">This is one possibility. Your own arrangement may work just as well.</p><button class="btn primary" data-action="close">I’ll try it</button>`,
    );
  },
  "game-menu": () =>
    showModal(
      "A few more useful moves.",
      `<div class="actions"><button class="btn outline" data-action="snapshot">Save checkpoint</button><button class="btn outline" data-action="export-game">Export complete plan</button><button class="btn outline" data-action="import-game">Import plan</button><button class="btn outline" data-action="print">Print this view</button><button class="btn outline" data-action="apply-example">Explore one solution</button><button class="btn outline" data-action="settings" id="settings-shortcut">Personalise</button><button class="btn outline" data-action="next-edition">Next edition</button>${parseId(g.id) && g.config.level < 3 ? '<button class="btn lime" data-action="harder">Increase difficulty</button>' : ""}</div><p class="tiny muted">Exploring a solution marks it as assisted in your handover notes.</p>`,
    ),
  "apply-example": () => {
    const p = solve(g.config);
    if (p) {
      g.notes += "\nExplored an assisted example solution.";
      commit(p);
      modal.close();
      toast(
        "An example to explore. Try changing a piece and see what happens.",
      );
    } else toast("No feasible example found within the search limit.");
  },
  snapshot: async () => {
    g.snapshots.push({
      name: "Checkpoint " + (g.snapshots.length + 1),
      at: Date.now(),
      plan: structuredClone(g.plan),
      score: evaluate(g.config, g.plan).percent,
    });
    g.snapshots = g.snapshots.slice(-12);
    await saveGame();
    if (modal.open) modal.close();
    drawGame();
    toast("A checkpoint for your next what-if.");
  },
  "restore-snapshot": (b) => {
    const s = g.snapshots[+b.dataset.id];
    if (s) commit(s.plan);
  },
  "delete-snapshot": (b) => {
    g.snapshots.splice(+b.dataset.id, 1);
    saveGame();
    drawGame();
  },
  "pack-plus": (b) => packAdjust(b.dataset.id, 1),
  "pack-minus": (b) => packAdjust(b.dataset.id, -1),
  "pack-baseline": () => {
    const p = structuredClone(g.plan);
    for (const k of g.config.kits)
      for (const i of g.config.items) p.packs[k.id][i.id] = i.min;
    commit(p);
  },
  "pack-extras": () => {
    const c = g.config,
      p = structuredClone(g.plan);
    for (const i of c.items) {
      let left =
          i.stock - c.kits.reduce((n, k) => n + (p.packs[k.id][i.id] || 0), 0),
        safe = 0;
      while (left > 0 && safe++ < 10000) {
        const ks = [...c.kits].sort(
          (a, b) => p.packs[a.id][i.id] - p.packs[b.id][i.id],
        );
        let changed = false;
        for (const k of ks) {
          const counts = c.kits.map((k) => p.packs[k.id][i.id]);
          const w = c.items.reduce(
            (n, it) => n + p.packs[k.id][it.id] * it.weight,
            0,
          );
          if (
            p.packs[k.id][i.id] + 1 - Math.min(...counts) <= c.fairness &&
            w + i.weight <= c.maxWeight
          ) {
            p.packs[k.id][i.id]++;
            left--;
            changed = true;
            break;
          }
        }
        if (!changed) break;
      }
    }
    commit(p);
  },
  "route-up": (b) => moveRoute(b.dataset.id, -1),
  "route-down": (b) => moveRoute(b.dataset.id, 1),
  "export-csv": () =>
    download(
      "side-quest-plan.csv",
      csv(evaluate(g.config, g.plan).rows),
      "text/csv;charset=utf-8",
    ),
  "export-game": () =>
    download("side-quest-plan.json", { version: 1, id: g.id, ...gameRecord() }),
  "import-game": async () => {
    const d = await importJSON();
    if (!d) return;
    if (!d.plan || JSON.stringify(d.config) !== JSON.stringify(g.config))
      throw Error("Choose a plan exported from this exact scenario.");
    const p = d.plan;
    if (!planShape(g.config, p))
      throw Error("This plan has an unexpected structure.");
    commit(p);
    if (modal.open) modal.close();
    toast("Plan imported. Check the constraints before using it.");
  },
  print: () => window.print(),
  "share-game": async () => {
    if (!parseId(g.id) && !g.quest) {
      toast("Export this custom scenario to share it with someone.");
      return;
    }
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Quest link copied. Personal plans and notes are not included.");
    } catch {
      showModal(
        "Share the puzzle.",
        `<label>Quest link<input readonly value="${esc(url)}"></label><p>Your notes and arrangement are private to your notebook.</p>`,
      );
    }
  },
  harder: () => changeDifficulty(Math.min(3, g.config.level + 1)),
  "next-edition": () => {
    const d = parseId(g?.id);
    if (d) {
      if (modal.open) modal.close();
      return openGame(`${d.type}-${d.level}-${(d.seed % 500) + 1}`);
    }
    toast("Choose another quest from the board.");
  },
  "journal-game": async () => {
    journal.push({
      id: crypto.randomUUID(),
      at: Date.now(),
      text: g.title + "\n" + g.notes,
    });
    await persist("journal", journal);
    toast("Kept in your notebook journal.");
  },
  "journal-add": async () => {
    const text = $("#journal-note").value.trim();
    if (!text) return toast("Write a little thought first.");
    journal.push({ id: crypto.randomUUID(), at: Date.now(), text });
    await persist("journal", journal);
    render();
  },
  "journal-delete": async (b) => {
    journal = journal.filter((j) => j.id !== b.dataset.id);
    await persist("journal", journal);
    render();
  },
  "delete-plan": (b) => {
    showModal(
      "Remove this saved attempt?",
      `<p>This removes this device’s saved plan. An exported or synced copy is separate.</p><div class="actions"><button class="btn danger" data-action="delete-plan-confirm" data-id="${esc(b.dataset.id)}">Remove local attempt</button><button class="btn outline" data-action="close">Keep it</button></div>`,
    );
  },
  "delete-plan-confirm": async (b) => {
    delete records[b.dataset.id];
    await persist("plans", records);
    modal.close();
    render();
  },
  backup,
  restore: async () => {
    const data = await importJSON();
    if (!data) return;
    if (data.version !== 1 || !data.plans || typeof data.plans !== "object")
      throw Error("Choose a SIDE QUEST notebook backup.");
    for (const [id, r] of Object.entries(data.plans)) {
      if (
        !validateConfig(r.config) ||
        !planShape(r.config, r.plan) ||
        !Number.isFinite(r.updated)
      )
        throw Error("The backup contains an invalid plan.");
      if (!records[id] || records[id].updated < r.updated) records[id] = r;
    }
    if (Array.isArray(data.bookmarks))
      bookmarks = [
        ...new Set([
          ...bookmarks,
          ...data.bookmarks.filter((x) => typeof x === "string"),
        ]),
      ];
    if (Array.isArray(data.journal))
      journal = [
        ...new Map(
          [
            ...journal,
            ...data.journal.filter(
              (j) => typeof j.text === "string" && j.text.length <= 5000,
            ),
          ].map((j) => [j.id, j]),
        ).values(),
      ];
    if (Array.isArray(data.custom))
      custom = [
        ...new Map(
          [
            ...custom,
            ...data.custom.filter((c) => validateConfig(c.config)),
          ].map((c) => [c.id, c]),
        ).values(),
      ];
    if (data.kits)
      for (const tool of TOOLS)
        if (validRows(tool, data.kits[tool.id]))
          kits[tool.id] = data.kits[tool.id];
    await Promise.all([
      persist("plans", records),
      persist("bookmarks", bookmarks),
      persist("journal", journal),
      persist("custom", custom),
      persist("kits", kits),
    ]);
    render();
    toast("Backup merged. Your appearance settings stayed as you chose them.");
  },
  sync,
  "kit-select": (b) => {
    kitFilter = "";
    kitSort = "";
    kitReverse = false;
    location.hash = "kit/" + b.dataset.id;
  },
  "kit-add": async (b) => {
    const t = TOOLS.find((t) => t.id === b.dataset.id);
    kits[t.id] ??= [];
    kits[t.id].push(
      Object.fromEntries(
        t.fields.map((f) => [f.key, f.type === "number" ? 0 : ""]),
      ),
    );
    await persist("kits", kits);
    render();
  },
  "kit-example": async (b) => {
    const t = TOOLS.find((t) => t.id === b.dataset.id);
    kits[t.id] ??= [];
    kits[t.id].push({ ...sample(t), name: "Example · " + sample(t).name });
    await persist("kits", kits);
    render();
  },
  "kit-duplicate": async (b) => {
    const [id, i] = b.dataset.id.split("|");
    kits[id].splice(+i + 1, 0, structuredClone(kits[id][i]));
    await persist("kits", kits);
    render();
  },
  "kit-delete": async (b) => {
    const [id, i] = b.dataset.id.split("|");
    kits[id].splice(+i, 1);
    await persist("kits", kits);
    render();
  },
  "kit-reverse": () => {
    kitReverse = !kitReverse;
    render();
  },
  "kit-csv": (b) => {
    const t = TOOLS.find((t) => t.id === b.dataset.id);
    download(
      "side-quest-" + t.id + ".csv",
      csv(calculate(t, kits[t.id] || []).rows),
      "text/csv;charset=utf-8",
    );
  },
  "kit-json": (b) =>
    download("side-quest-" + b.dataset.id + ".json", {
      tool: b.dataset.id,
      rows: kits[b.dataset.id] || [],
    }),
  "kit-import": async (b) => {
    const d = await importJSON();
    if (!d) return;
    const t = TOOLS.find((t) => t.id === b.dataset.id);
    if (d.tool !== t.id || !validRows(t, d.rows))
      throw Error("Choose a valid export for " + t.name + ".");
    kits[t.id] = [...(kits[t.id] || []), ...d.rows];
    await persist("kits", kits);
    render();
    toast("Entries imported.");
  },
  "kit-clear": (b) =>
    showModal(
      "Clear this planning table?",
      `<p>Export a copy first if you need these figures. This clears the local table.</p><button class="btn danger" data-action="kit-clear-confirm" data-id="${b.dataset.id}">Clear table</button>`,
    ),
  "kit-clear-confirm": async (b) => {
    kits[b.dataset.id] = [];
    await persist("kits", kits);
    modal.close();
    render();
  },
  "scenario-editor": () => scenarioEditor(),
  "scenario-edit": (b) => scenarioEditor(b.dataset.id),
  "scenario-export": (b) =>
    download(
      "side-quest-scenario.json",
      custom.find((c) => c.id === b.dataset.id),
    ),
  "scenario-delete": (b) =>
    showModal(
      "Remove this local scenario?",
      `<p>Your published community briefs will remain separate.</p><button class="btn danger" data-action="scenario-delete-confirm" data-id="${esc(b.dataset.id)}">Remove scenario</button>`,
    ),
  "scenario-delete-confirm": async (b) => {
    custom = custom.filter((c) => c.id !== b.dataset.id);
    await persist("custom", custom);
    modal.close();
    render();
  },
  "scenario-check": () => {
    const feedback = $("#editor-feedback");
    if (!validateConfig(editor)) {
      feedback.textContent =
        "Check the scenario values. Counts, capacities and limits must be valid.";
      return;
    }
    const p = solve(editor);
    feedback.textContent = p
      ? "✓ At least one feasible arrangement found."
      : "No feasible arrangement found within the search limit. Revisit the constraints.";
  },
  "scenario-save": async () => {
    const title = $("#editor-title").value.trim();
    if (!title || !validateConfig(editor))
      throw Error("Give the scenario a title and check every constraint.");
    const entry = {
      id: editingLocal || "local." + crypto.randomUUID(),
      title,
      config: structuredClone(editor),
      updated: Date.now(),
    };
    custom = custom.filter((c) => c.id !== entry.id);
    custom.push(entry);
    await persist("custom", custom);
    modal.close();
    location.hash = "organise";
    render();
    toast("Your practice scenario is ready to play.");
  },
  "scenario-import": async () => {
    const d = await importJSON();
    if (!d) return;
    const c = d.config || d;
    if (!validateConfig(c))
      throw Error("That scenario is missing valid constraints.");
    editor = c;
    drawEditor(d.title || "Imported practice quest");
  },
  "editor-add": () => {
    const id = crypto.randomUUID().slice(0, 8);
    if (editor.type === "shifts") {
      editor.slots.push({
        id: "s" + id,
        name: "New session",
        subject: "Maths",
        time: editor.slots.length,
        learners: 10,
      });
      editor.people.push({
        id: "v" + id,
        name: "New volunteer",
        skills: ["Maths"],
        available: ["s" + id],
        max: 1,
      });
    } else if (editor.type === "deliveries")
      editor.stops.push({
        id: "d" + id,
        name: "New stop",
        qty: 1,
        cold: false,
        x: 1,
        y: 1,
        open: 0,
        close: 180,
        service: 5,
      });
    else
      editor.items.push({
        id: "i" + id,
        name: "New item",
        min: 1,
        stock: editor.kits.length,
        weight: 10,
      });
    drawEditor($("#editor-title").value);
  },
  "create-quest": createQuest,
  "refresh-org": async () => {
    await loadRemote();
    render();
    toast("Workspace refreshed.");
  },
  "toggle-quest": async (b) => {
    const q = ownQuests.find((q) => q.id === b.dataset.id);
    await cloud.request("sq_quests", {
      method: "PATCH",
      query: "id=eq." + q.id,
      body: { published: !q.published },
    });
    await loadRemote();
    render();
    toast(
      q.published
        ? "Brief paused. Existing submissions remain available."
        : "Brief published to the community board.",
    );
  },
  "edit-quest": (b) => {
    const q = ownQuests.find((q) => q.id === b.dataset.id);
    showModal(
      "Keep the brief clear.",
      `<label>Title<input id="edit-quest-title" maxlength="100" value="${esc(q.title)}"></label><label style="margin-top:15px">Brief<textarea id="edit-quest-brief" maxlength="3000">${esc(q.brief)}</textarea></label><p class="tiny muted">Published constraints stay fixed so existing plans retain their meaning. Publish a new quest for changed constraints.</p><button class="btn primary" data-action="save-quest-edit" data-id="${q.id}">Save details</button>`,
    );
  },
  "save-quest-edit": async (b) => {
    const title = $("#edit-quest-title").value.trim(),
      brief = $("#edit-quest-brief").value.trim();
    if (!title || !brief) throw Error("A title and a brief are needed.");
    await cloud.request("sq_quests", {
      method: "PATCH",
      query: "id=eq." + b.dataset.id,
      body: { title, brief },
    });
    await loadRemote();
    modal.close();
    render();
  },
  "submit-plan": async () => {
    if (!$("#submission-consent").checked)
      throw Error(
        "Confirm that the plan excludes private personal information.",
      );
    const notes = $("#submission-notes").value.trim();
    const e = evaluate(g.config, g.plan);
    if (!e.valid) throw Error("The plan no longer passes the rules.");
    const button = $('[data-action="submit-plan"]');
    button.disabled = true;
    try {
      await cloud.request("sq_submissions", {
        method: "POST",
        body: {
          id: crypto.randomUUID(),
          quest_id: g.quest.id,
          author_id: cloud.user().id,
          plan: g.plan,
          notes,
        },
      });
      g.completed = true;
      g.notes = notes;
      await saveGame();
      await loadRemote();
      modal.close();
      celebrate();
      drawGame();
      toast("Plan submitted. The organisation’s review is the next step.");
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  },
  review: (b) => reviewModal(b.dataset.id),
  "save-review": async (b) => {
    const s = reviews.find((s) => s.id === b.dataset.id);
    const decision = $("#review-decision").value,
      note = $("#review-note").value.trim();
    if (!note)
      throw Error("Add a short reason for the person who submitted this plan.");
    await cloud.request("sq_reviews", {
      method: "POST",
      upsert: true,
      body: {
        submission_id: s.id,
        reviewer_id: cloud.user().id,
        decision,
        note,
      },
    });
    await loadRemote();
    modal.close();
    render();
    toast("Decision recorded. The plan author can see your note.");
  },
  "review-export": (b) => {
    const s = reviews.find((s) => s.id === b.dataset.id);
    download(
      "side-quest-reviewed-plan.csv",
      csv(evaluate(s.config_snapshot, s.plan).rows),
      "text/csv;charset=utf-8",
    );
  },
  "download-logo": async () =>
    download(
      "side-quest-logo.svg",
      await (await fetch("./logo.svg")).text(),
      "image/svg+xml",
    ),
  "download-icon": async () =>
    download(
      "side-quest-icon.svg",
      await (await fetch("./icon.svg")).text(),
      "image/svg+xml",
    ),
  "clear-local": () =>
    confirmAction(
      "Clear this device’s notebook?",
      "Export a backup first if you want to keep your plans, notes, custom scenarios and planning tables. Your account’s synced copy is separate.",
      "clear-local-confirm",
    ),
  "clear-local-confirm": async () => {
    records = {};
    bookmarks = [];
    journal = [];
    custom = [];
    kits = {};
    await Promise.all([
      persist("plans", records),
      persist("bookmarks", bookmarks),
      persist("journal", journal),
      persist("custom", custom),
      persist("kits", kits),
    ]);
    modal.close();
    render();
    toast("Local notebook cleared.");
  },
  "delete-cloud": () => {
    if (!cloud.user()) {
      authModal();
      return;
    }
    confirmAction(
      "Delete the synced notebook?",
      "This removes the account’s synced notebook. Local work and community submissions stay separate.",
      "delete-cloud-confirm",
    );
  },
  "delete-cloud-confirm": async () => {
    await cloud.request("sq_state", {
      method: "DELETE",
      query: "user_id=eq." + cloud.user().id,
    });
    modal.close();
    toast("Synced notebook deleted.");
  },
  "export-capabilities": () =>
    download(
      "side-quest-capabilities.csv",
      csv([
        ...CORE_CAPS.map(([route, name]) => ({
          surface: route,
          capability: name,
        })),
        ...TOOLS.flatMap((t) =>
          KIT_ACTIONS.map((a) => ({
            surface: "kit/" + t.id,
            capability: t.name + " · " + a,
          })),
        ),
      ]),
      "text/csv;charset=utf-8",
    ),
};
function packAdjust(id, delta) {
  const [k, i] = id.split("|"),
    p = structuredClone(g.plan);
  const item = g.config.items.find((x) => x.id === i);
  p.packs[k][i] = Math.max(
    0,
    Math.min(item.stock, (p.packs[k][i] || 0) + delta),
  );
  commit(p);
}
function moveRoute(id, delta) {
  const [v, index] = id.split("|"),
    i = +index,
    p = structuredClone(g.plan),
    arr = p.routes[v],
    j = i + delta;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  commit(p);
}
function planShape(c, p) {
  try {
    if (c.type === "shifts")
      return (
        p.assignments &&
        Object.values(p.assignments).every((x) => typeof x === "string")
      );
    if (c.type === "deliveries")
      return (
        p.routes &&
        c.vehicles.every(
          (v) =>
            Array.isArray(p.routes[v.id]) &&
            p.routes[v.id].length <= c.stops.length &&
            p.routes[v.id].every((id) => c.stops.some((s) => s.id === id)),
        )
      );
    return (
      p.packs &&
      c.kits.every(
        (k) =>
          p.packs[k.id] &&
          c.items.every(
            (i) =>
              Number.isInteger(p.packs[k.id][i.id]) &&
              p.packs[k.id][i.id] >= 0 &&
              p.packs[k.id][i.id] <= 100000,
          ),
      )
    );
  } catch {
    return false;
  }
}
document.addEventListener("click", async (event) => {
  const b = event.target.closest("[data-action]");
  if (!b || b.disabled) return;
  const fn = actions[b.dataset.action];
  if (!fn) return;
  event.preventDefault();
  try {
    await fn(b);
  } catch (e) {
    const feedback = $(".feedback", modal);
    if (feedback) {
      feedback.textContent = e.message;
      feedback.classList.add("error");
    } else
      toast(
        e.message ||
          "That action could not be completed. Your local work is safe.",
      );
  }
});
document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target,
    submit = $("button[type=submit]", form),
    feedback = $(".feedback", form);
  if (submit) submit.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form));
    if (form.id === "auth-form") {
      if (authMode === "signin") {
        await cloud.signin(data.email, data.password);
        await loadRemote();
        modal.close();
        render();
        toast("Welcome to the good side.");
      } else if (authMode === "signup") {
        const d = await cloud.signup(data.email, data.password, data.name);
        prefs.alias = data.name;
        await savePrefs();
        if (d.access_token) {
          await loadRemote();
          modal.close();
          render();
          toast("Your account is ready.");
        } else {
          feedback.textContent =
            "Check your email to confirm the account. Follow its link, then return here and sign in. If you already have an account, use Sign in.";
          feedback.className = "feedback success";
        }
      } else if (authMode === "verify") {
        await cloud.verify(data.email, data.code);
        await loadRemote();
        modal.close();
        render();
        toast("Email confirmed.");
      } else {
        await cloud.recover(data.email);
        feedback.textContent =
          "If this email has an account, a reset email will arrive. Follow the provider’s instructions, then return here to sign in.";
        feedback.className = "feedback success";
      }
    } else if (form.id === "quest-form") {
      const scenario = custom.find((c) => c.id === data.scenario);
      if (!scenario || !validateConfig(scenario.config))
        throw Error("Choose a valid practice scenario.");
      await cloud.request("sq_quests", {
        method: "POST",
        body: {
          id: crypto.randomUUID(),
          owner_id: cloud.user().id,
          title: data.title.trim(),
          organization: data.organization.trim(),
          brief: data.brief.trim(),
          type: scenario.config.type,
          difficulty: +data.difficulty,
          config: scenario.config,
          published: data.publish === "on",
        },
      });
      await loadRemote();
      modal.close();
      render();
      toast(
        data.publish === "on"
          ? "Your community quest is on the board."
          : "Draft saved to your workspace.",
      );
    }
  } catch (e) {
    if (feedback) {
      feedback.textContent = e.message;
      feedback.className = "feedback error";
    } else toast(e.message);
  } finally {
    if (submit?.isConnected) submit.disabled = false;
  }
});
let inputDelay;
document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.dataset.kitCell) {
    const [id, index, key] = el.dataset.kitCell.split("|"),
      tool = TOOLS.find((t) => t.id === id),
      field = tool.fields.find((f) => f.key === key);
    kits[id][index][key] =
      field.type === "number"
        ? Math.max(0, Math.min(1e8, +el.value || 0))
        : el.value.slice(0, 200);
    persist("kits", kits);
    const calc = el.closest("tr")?.children[tool.fields.length];
    if (calc)
      calc.innerHTML = Object.entries(tool.calc(kits[id][index]))
        .map(
          ([k, v]) =>
            `<div class="calculated">${esc(k.replaceAll("_", " "))}: <b>${esc(typeof v === "number" ? Math.round(v * 100) / 100 : v)}</b></div>`,
        )
        .join("");
    const summary = $(".kit-result");
    if (summary)
      summary.innerHTML = calculate(tool, kits[id])
        .summary.map(
          ([label, value]) =>
            `<div><span>${esc(label)}</span><strong>${esc(typeof value === "number" ? Math.round(value * 100) / 100 : value)}</strong></div>`,
        )
        .join("");
  }
  if (el.id === "quest-search") {
    lib.search = el.value;
    lib.page = 0;
    clearTimeout(inputDelay);
    inputDelay = setTimeout(redrawLibrary, 180);
  }
  if (el.id === "game-notes") {
    g.notes = el.value;
    saveGame();
  }
  if (el.id === "kit-search") {
    kitFilter = el.value;
    clearTimeout(inputDelay);
    inputDelay = setTimeout(() => {
      app.innerHTML = kitPage(route.split("/")[1]);
      const input = $("#kit-search");
      input.focus();
      input.setSelectionRange(kitFilter.length, kitFilter.length);
    }, 180);
  }
  if (el.id === "cap-search") {
    const q = el.value;
    clearTimeout(inputDelay);
    inputDelay = setTimeout(() => {
      history.replaceState(
        null,
        "",
        "#capabilities?q=" + encodeURIComponent(q),
      );
      app.innerHTML = capabilities();
      const input = $("#cap-search");
      input.focus();
      input.setSelectionRange(q.length, q.length);
    }, 180);
  }
});
document.addEventListener("change", async (event) => {
  const el = event.target;
  try {
    if (el.id === "difficulty-filter") {
      lib.level = el.value;
      lib.page = 0;
      redrawLibrary();
    }
    if (el.id === "source-filter") {
      lib.source = el.value;
      lib.page = 0;
      redrawLibrary();
    }
    if (el.id === "quest-sort") {
      lib.sort = el.value;
      lib.page = 0;
      redrawLibrary();
    }
    if (["library-world", "game-world"].includes(el.id))
      await changeWorld(el.value);
    if (el.id === "game-difficulty") await changeDifficulty(+el.value);
    if (el.dataset.slot) {
      const p = structuredClone(g.plan);
      p.assignments[el.dataset.slot] = el.value;
      commit(p);
    }
    if (el.dataset.stop) {
      const p = structuredClone(g.plan);
      for (const v of g.config.vehicles)
        p.routes[v.id] = p.routes[v.id].filter((id) => id !== el.dataset.stop);
      if (el.value) p.routes[el.value].push(el.dataset.stop);
      commit(p);
    }
    if (el.dataset.pack) {
      const [k, i] = el.dataset.pack.split("|"),
        p = structuredClone(g.plan);
      p.packs[k][i] = Math.max(0, Math.min(100000, Math.floor(+el.value) || 0));
      commit(p);
    }
    if (el.dataset.pref) {
      if (el.dataset.pref === "reduce")
        prefs.motion = el.checked ? "off" : "on";
      else prefs[el.dataset.pref] = el.checked;
      await savePrefs();
    }
    if (el.id === "pref-break") {
      prefs.focusMinutes = +el.value;
      await savePrefs();
    }
    if (el.id === "kit-sort") {
      kitSort = el.value;
      render();
    }
    if (el.dataset.kitCell) {
      const [id, index, key] = el.dataset.kitCell.split("|"),
        t = TOOLS.find((t) => t.id === id),
        f = t.fields.find((f) => f.key === key);
      kits[id][index][key] =
        f.type === "number"
          ? Math.max(0, Math.min(1e8, +el.value || 0))
          : el.value.slice(0, 200);
      await persist("kits", kits);
    }
    if (["editor-type", "editor-level"].includes(el.id)) {
      const title = $("#editor-title").value;
      editor = generate($("#editor-type").value, +$("#editor-level").value, 1);
      drawEditor(title);
    }
    if (el.dataset.editorCell) {
      const [col, index, key] = el.dataset.editorCell.split("|");
      editor[col][index][key] =
        el.type === "number" ? +el.value : el.value.slice(0, 100);
    }
    if (el.dataset.editorSkills)
      editor.people[+el.dataset.editorSkills].skills = el.value
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    if (el.dataset.editorAvailable) {
      const [index, id] = el.dataset.editorAvailable.split("|"),
        p = editor.people[index];
      p.available = el.checked
        ? [...new Set([...p.available, id])]
        : p.available.filter((x) => x !== id);
    }
    if (el.dataset.editorBool) {
      const [col, index, key] = el.dataset.editorBool.split("|");
      editor[col][index][key] = el.checked;
    }
    if (el.id === "editor-return") editor.returnBy = +el.value;
    if (el.id === "editor-kits") {
      const n = Math.max(1, Math.min(20, +el.value || 1));
      editor.kits = Array.from({ length: n }, (_, i) => ({
        id: "k" + i,
        name: "Learner pack " + (i + 1),
      }));
    }
    if (el.id === "editor-weight") editor.maxWeight = +el.value;
    if (el.id === "editor-fairness") editor.fairness = +el.value;
  } catch (e) {
    toast(e.message);
  }
});
document.addEventListener("dragstart", (event) => {
  const p = event.target.closest("[data-person]");
  if (p) event.dataTransfer.setData("text/plain", p.dataset.person);
});
document.addEventListener("dragover", (event) => {
  if (event.target.closest("[data-drop-slot]")) event.preventDefault();
});
document.addEventListener("drop", (event) => {
  const slot = event.target.closest("[data-drop-slot]");
  if (!slot || g?.config.type !== "shifts") return;
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  if (!g.config.people.some((p) => p.id === id)) return;
  const p = structuredClone(g.plan);
  p.assignments[slot.dataset.dropSlot] = id;
  commit(p);
});
document.addEventListener("keydown", (event) => {
  if (!g || modal.open || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))
    return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    actions[event.shiftKey ? "redo" : "undo"]();
  }
  if (event.key === "?" && !event.ctrlKey) how();
});
window.addEventListener("hashchange", () => {
  render();
  window.scrollTo({ top: 0 });
});
window.addEventListener("online", () => {
  loadRemote()
    .then(() => toast("Connection restored."))
    .catch(() => {});
});
window.addEventListener("pagehide", () => saveGame());
setInterval(() => {
  if (!g || paused || document.hidden || modal.open) return;
  g.seconds++;
  const clock = $("#game-clock");
  if (clock) clock.textContent = formatTime(g.seconds);
  if (g.seconds % 15 === 0) saveGame();
  if (prefs.focusMinutes && g.seconds % (prefs.focusMinutes * 60) === 0)
    toast(
      "A little stretch, a sip of water, a moment away. Your plan will keep.",
    );
}, 1000);
await render();
loadRemote()
  .then(() => {
    if (["organise", "library", "dashboard"].some((x) => route.startsWith(x)))
      render();
  })
  .catch(() => {
    toast(
      "The community connection is unavailable. Practice quests and your local notebook still work.",
    );
  });
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./sw.js").catch(() => {});
