import {
  EXTRA_TYPES,
  EXTRA_NAMES,
  extraPuzzle,
  checkExtra,
  normaliseMods,
  initialFieldwork,
  normaliseFieldwork,
  fieldworkAction,
} from "./expeditions.js?v=10";
/* SIDE QUEST's persistent world rules. No network or view dependencies. */
export const REGIONS = [
  {
    id: "moss",
    name: "The Moss Library",
    short: "Moss Library",
    symbol: "✳",
    x: 23,
    y: 37,
    need: 0,
    tone: "#b2be91",
    line: "Books grow here. So do good ideas.",
    keeper: "fern",
    type: "cipher",
  },
  {
    id: "cloud",
    name: "Cloud Market",
    short: "Cloud Market",
    symbol: "☁",
    x: 49,
    y: 25,
    need: 0,
    tone: "#e5be91",
    line: "Slightly impractical goods. Surprisingly useful plans.",
    keeper: "pip",
    type: "balance",
  },
  {
    id: "moon",
    name: "The Moon Arcade",
    short: "Moon Arcade",
    symbol: "☾",
    x: 75,
    y: 35,
    need: 0,
    tone: "#c4b7d8",
    line: "One more go, under a borrowed moon.",
    keeper: "io",
    type: "memory",
  },
  {
    id: "neon",
    name: "Neon Alley",
    short: "Neon Alley",
    symbol: "ϟ",
    x: 62,
    y: 57,
    need: 2,
    tone: "#c4cb88",
    line: "Follow the signal. Ignore the suspicious pigeon.",
    keeper: "io",
    type: "pattern",
  },
  {
    id: "pocket",
    name: "The Pocket Kingdom",
    short: "Pocket Kingdom",
    symbol: "♜",
    x: 34,
    y: 65,
    need: 2,
    tone: "#c2c9ad",
    line: "A small kingdom with an enormous lost-and-found.",
    keeper: "pip",
    type: "observe",
  },
  {
    id: "velvet",
    name: "The Velvet Dungeon",
    short: "Velvet Dungeon",
    symbol: "♜",
    x: 15,
    y: 73,
    need: 4,
    tone: "#ba94aa",
    line: "The door is dramatic. The puzzles are reasonable.",
    keeper: "vesper",
    type: "maze",
  },
  {
    id: "glitch",
    name: "The Glitchlands",
    short: "Glitchlands",
    symbol: "⌘",
    x: 83,
    y: 71,
    need: 6,
    tone: "#8dbcb4",
    line: "A place where the wrong turn might be right.",
    keeper: "vesper",
    type: "pattern",
  },
  {
    id: "folder",
    name: "The Forbidden Folder",
    short: "Forbidden Folder",
    symbol: "◇",
    x: 51,
    y: 84,
    need: 8,
    tone: "#b09ac8",
    line: "Definitely do not open. Except, perhaps, politely.",
    keeper: "fern",
    type: "cipher",
  },
];
export const REALMS = [
  "Haunted supermarket",
  "Moon hotel",
  "Goblin post office",
  "Floating library",
  "Underwater laundromat",
  "Dream courtroom",
  "Infinite elevator",
  "Witch café",
  "Robot village",
  "Lost arcade",
  "Cloud railway",
  "Abandoned carnival",
  "Memory museum",
  "Monster suburb",
  "Midnight school",
  "Desert radio tower",
  "Forest internet café",
  "Ghost train station",
  "Alien convenience store",
  "Clockwork city",
  "Upside-down castle",
  "Tiny planet",
  "Sentient office",
  "Forgotten amusement park",
  "Mushroom district",
  "Underground market",
  "Endless motel",
  "Library between worlds",
  "Neon swamp",
  "Impossible shopping mall",
];
export const CLASSES = [
  "Curiosity cartographer",
  "Pocket alchemist",
  "Gentle chaos goblin",
  "Night-shift detective",
  "Cloudkeeper",
  "Practical magician",
];
export const MOODS = [
  "Cozy",
  "Curious",
  "Mysterious",
  "Electric",
  "Dreamy",
  "Ridiculous",
];
export const MINI_TYPES = [
  "cipher",
  "balance",
  "memory",
  "pattern",
  "observe",
  "maze",
  ...EXTRA_TYPES,
];
export const MINI_NAMES = {
  ...EXTRA_NAMES,
  cipher: "The misplaced message",
  balance: "The merchant’s scales",
  memory: "Lantern recollection",
  pattern: "The next small signal",
  observe: "One thing out of place",
  maze: "The corridor that moved",
};
export const ITEMS = {
  paper: {
    name: "Map scrap",
    symbol: "▧",
    kind: "Material",
    lore: "A corner of somewhere you have not been yet.",
  },
  dust: {
    name: "Moon dust",
    symbol: "✧",
    kind: "Material",
    lore: "Please do not sneeze over the inventory.",
  },
  gear: {
    name: "Brass cog",
    symbol: "⚙",
    kind: "Material",
    lore: "A useful little circle with ambitions.",
  },
  ink: {
    name: "Bottled ink",
    symbol: "◈",
    kind: "Material",
    lore: "Remembers the shape of every unfinished sentence.",
  },
  biscuit: {
    name: "Cloud biscuit",
    symbol: "◌",
    kind: "Consumable",
    lore: "For companions. Also for very polite monsters.",
  },
  egg: {
    name: "Curious egg",
    symbol: "◉",
    kind: "Creature egg",
    lore: "Something inside is doing a very small crossword.",
  },
  key: {
    name: "Between-worlds key",
    symbol: "⚿",
    kind: "Relic",
    lore: "Opens the postcard portal. No doors are harmed.",
  },
  charm: {
    name: "Second-thought charm",
    symbol: "❋",
    kind: "Relic",
    lore: "Use it to refill three quest-machine rerolls.",
  },
  lamp: {
    name: "Firefly lamp",
    symbol: "♧",
    kind: "Furniture",
    lore: "The fireflies run a very reasonable night shift.",
  },
  plant: {
    name: "Pocket forest",
    symbol: "♣",
    kind: "Furniture",
    lore: "A whole forest, quietly minding its own business.",
  },
  telescope: {
    name: "Moon telescope",
    symbol: "♧",
    kind: "Furniture",
    lore: "For checking whether the moon is looking back.",
  },
  rug: {
    name: "Portal rug",
    symbol: "▱",
    kind: "Furniture",
    lore: "Decorative. Mostly.",
  },
  shelf: {
    name: "Tiny trophy shelf",
    symbol: "▤",
    kind: "Furniture",
    lore: "Room for small victories and one enormous spoon.",
  },
  spoon: {
    name: "Completely useless golden spoon",
    symbol: "♩",
    kind: "Relic",
    lore: "Certifiably useless. In excellent condition.",
  },
  postcard: {
    name: "Lost postcard",
    symbol: "✉",
    kind: "Lore",
    lore: "“When the map goes quiet, knock three times.”",
  },
  rune: {
    name: "Door rune",
    symbol: "⟡",
    kind: "Secret key",
    lore: "The inscription reads: OPEN SESAME. Very traditional.",
  },
  cassette: {
    name: "Midnight cassette",
    symbol: "▣",
    kind: "Lore",
    lore: "The broadcast was never lost. Someone kept turning the radio down.",
  },
  crown: {
    name: "The unreasonably small crown",
    symbol: "♛",
    kind: "Boss trophy",
    lore: "Awarded for defeating the Bureaucrat of Impossible Errands.",
  },
};
export const RECIPES = [
  {
    id: "biscuit",
    name: "Cloud biscuits ×3",
    cost: { paper: 1, dust: 1 },
    out: { biscuit: 3 },
    coins: 2,
  },
  {
    id: "lamp",
    name: "Firefly lamp",
    cost: { gear: 1, dust: 2 },
    out: { lamp: 1 },
    coins: 6,
  },
  {
    id: "plant",
    name: "Pocket forest",
    cost: { paper: 2, ink: 1 },
    out: { plant: 1 },
    coins: 5,
  },
  {
    id: "telescope",
    name: "Moon telescope",
    cost: { gear: 3, dust: 2 },
    out: { telescope: 1 },
    coins: 10,
  },
  {
    id: "rug",
    name: "Portal rug",
    cost: { paper: 3, ink: 2 },
    out: { rug: 1 },
    coins: 8,
  },
  {
    id: "shelf",
    name: "Tiny trophy shelf",
    cost: { paper: 2, gear: 2 },
    out: { shelf: 1 },
    coins: 7,
  },
  {
    id: "key",
    name: "Between-worlds key",
    cost: { gear: 2, ink: 1, dust: 2 },
    out: { key: 1 },
    coins: 12,
  },
  {
    id: "charm",
    name: "Second-thought charm",
    cost: { ink: 1, dust: 1 },
    out: { charm: 1 },
    coins: 4,
  },
];
export const CREATURES = [
  {
    id: "moth",
    name: "Lumen moth",
    kind: "Lantern tender",
    color: "#d8c590",
    habitat: "Moon shelf",
  },
  {
    id: "mossling",
    name: "Mossling",
    kind: "Small forest citizen",
    color: "#a8c08d",
    habitat: "Pocket forest",
  },
  {
    id: "cloudlet",
    name: "Cloudlet",
    kind: "Weather apprentice",
    color: "#b6c9d3",
    habitat: "Window cushion",
  },
  {
    id: "inkling",
    name: "Inkling",
    kind: "Unfinished thought",
    color: "#b5a2cc",
    habitat: "Writing desk",
  },
  {
    id: "coglet",
    name: "Coglet",
    kind: "Helpful little mechanic",
    color: "#d2aa79",
    habitat: "Workbench",
  },
  {
    id: "sprout",
    name: "Teacup sprout",
    kind: "Optimistic houseplant",
    color: "#8fb1a0",
    habitat: "Kitchen shelf",
  },
  {
    id: "wisp",
    name: "Velvet wisp",
    kind: "Polite haunting",
    color: "#c095ae",
    habitat: "Curtain corner",
  },
  {
    id: "glimmer",
    name: "Glimmer fox",
    kind: "Collector of wrong turns",
    color: "#d4ad8a",
    habitat: "Map drawer",
  },
];
export const NPCS = [
  {
    id: "fern",
    name: "Fern, the archivist",
    symbol: "✳",
    role: "Keeps the Moss Library and absolutely all the receipts.",
    line: "“A good question is a door with better manners.”",
    task: "Visit three different districts.",
    gift: "postcard",
  },
  {
    id: "pip",
    name: "Pip, provisionally mayor",
    symbol: "♜",
    role: "Runs the market. The election was complicated.",
    line: "“I have a very small problem and a very large hat.”",
    task: "Complete one resource or supply-pack puzzle.",
    gift: "egg",
  },
  {
    id: "io",
    name: "Io, keeper of lost signals",
    symbol: "☾",
    role: "Listens for things everyone else has stopped hearing.",
    line: "“Try listening to the silence between the lanterns.”",
    task: "Complete a lantern-memory or signal-pattern puzzle.",
    gift: "cassette",
  },
  {
    id: "vesper",
    name: "Vesper, reluctant gatekeeper",
    symbol: "◇",
    role: "Would rather be gardening than guarding anything.",
    line: "“The secret phrase? It is written on the key. Management was very clear.”",
    task: "Craft your first object in the workshop.",
    gift: "rune",
  },
];
export function hash(text) {
  let h = 2166136261;
  for (const c of String(text)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function rng(seed) {
  let x = hash(seed) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const clone = (x) => structuredClone(x);
const finite = (x, d = 0, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  typeof x === "number" && Number.isFinite(x)
    ? Math.min(max, Math.max(min, x))
    : d;
const safeText = (x, n = 100) => (typeof x === "string" ? x.slice(0, n) : "");
export function initialUniverse(seed = Date.now()) {
  return {
    version: 1,
    seed: 1 + (hash(seed) % 999999999),
    updated: 0,
    persona: {
      name: "Curious traveller",
      class: CLASSES[0],
      title: "Collector of detours",
      mood: "Curious",
      chaos: 1,
      minutes: 5,
      level: 0,
      skin: "brass",
    },
    visits: {},
    completed: {},
    inventory: { paper: 3, dust: 2, gear: 1, ink: 1, biscuit: 3 },
    coins: 30,
    companions: { moth: { name: "Lumen", bond: 0, habitat: "Moon shelf" } },
    equipped: "moth",
    favourites: [],
    npc: {},
    claimed: {},
    notes: [],
    crafts: 0,
    journeys: 0,
    story: {},
    home: {
      slots: ["lamp", null, null, null, null, null],
      theme: "observatory",
      light: "moon",
    },
    machine: {
      rolls: 0,
      day: "",
      rerolls: 3,
      ticket: null,
      type: "any",
      mods: normaliseMods(),
      realm: 0,
    },
    fieldwork: initialFieldwork(),
    secret: false,
    night: false,
    active: null,
  };
}
export function normaliseUniverse(input) {
  const d = initialUniverse();
  if (!input || input.version !== 1) return d;
  d.seed = finite(input.seed, 1, 1, 999999999);
  d.updated = finite(input.updated);
  const p = input.persona || {};
  d.persona = {
    name: safeText(p.name, 40) || d.persona.name,
    class: CLASSES.includes(p.class) ? p.class : d.persona.class,
    title: safeText(p.title, 60) || d.persona.title,
    mood: MOODS.includes(p.mood) ? p.mood : "Curious",
    chaos: finite(p.chaos, 1, 0, 3),
    minutes: [2, 5, 10, 20].includes(p.minutes) ? p.minutes : 5,
    level: Math.floor(finite(p.level, 0, 0, 3)),
    skin: ["brass", "moss", "midnight"].includes(p.skin) ? p.skin : "brass",
  };
  for (const r of REGIONS)
    if (finite(input.visits?.[r.id]))
      d.visits[r.id] = finite(input.visits[r.id]);
  for (const k of Object.keys(ITEMS))
    d.inventory[k] = Math.floor(finite(input.inventory?.[k], 0, 0, 9999));
  for (const [id, c] of Object.entries(input.completed || {}).slice(-10000)) {
    if (
      id !== "__proto__" &&
      id !== "constructor" &&
      id.length < 100 &&
      c &&
      typeof c === "object" &&
      typeof c.type === "string"
    )
      d.completed[id] = {
        type: safeText(c.type, 20),
        region: REGIONS.some((r) => r.id === c.region) ? c.region : "moss",
        level: Math.floor(finite(c.level, 0, 0, 3)),
        at: finite(c.at),
        title: safeText(c.title, 120),
        seconds: finite(c.seconds),
        assisted: !!c.assisted,
      };
  }
  d.coins = Math.floor(finite(input.coins, 30, 0, 1e9));
  d.crafts = Math.floor(finite(input.crafts));
  d.journeys = Math.floor(finite(input.journeys, 0, 0, 100));
  d.companions = {};
  for (const c of CREATURES)
    if (input.companions?.[c.id]) {
      const pet = input.companions[c.id];
      d.companions[c.id] = {
        name: safeText(pet.name, 30) || c.name,
        bond: Math.floor(finite(pet.bond, 0, 0, 99)),
        habitat: [
          "Moon shelf",
          "Pocket forest",
          "Window cushion",
          "Writing desk",
          "Workbench",
          "Kitchen shelf",
          "Curtain corner",
          "Map drawer",
        ].includes(pet.habitat)
          ? pet.habitat
          : c.habitat,
      };
    }
  if (!Object.keys(d.companions).length)
    d.companions.moth = { name: "Lumen", bond: 0, habitat: "Moon shelf" };
  d.equipped = d.companions[input.equipped]
    ? input.equipped
    : Object.keys(d.companions)[0];
  d.favourites = (Array.isArray(input.favourites) ? input.favourites : [])
    .filter((k) => ITEMS[k])
    .slice(0, 20);
  for (const n of NPCS) {
    const v = input.npc?.[n.id];
    if (v)
      d.npc[n.id] = {
        choice: ["listen", "help", "question"].includes(v.choice)
          ? v.choice
          : "listen",
        visits: finite(v.visits, 0, 0, 9999),
        at: finite(v.at),
      };
  }
  for (const [k, v] of Object.entries(input.claimed || {}).slice(-100))
    if (k !== "__proto__" && k !== "constructor" && k.length < 70 && v === true)
      d.claimed[k] = true;
  d.notes = (Array.isArray(input.notes) ? input.notes : [])
    .filter((n) => n && typeof n.text === "string")
    .slice(-100)
    .map((n) => ({
      id: safeText(n.id, 70),
      text: safeText(n.text, 1200),
      at: finite(n.at),
      region: REGIONS.some((r) => r.id === n.region) ? n.region : "moss",
    }));
  d.home = {
    slots: Array.from({ length: 6 }, (_, i) => {
      const id = input.home?.slots?.[i];
      return ITEMS[id]?.kind === "Furniture" ? id : null;
    }),
    theme: ["observatory", "cottage", "arcade"].includes(input.home?.theme)
      ? input.home.theme
      : "observatory",
    light: ["moon", "amber", "dusk"].includes(input.home?.light)
      ? input.home.light
      : "moon",
  };
  const m = input.machine || {};
  d.machine = {
    rolls: Math.floor(finite(m.rolls)),
    day: safeText(m.day, 10),
    rerolls: Math.floor(finite(m.rerolls, 3, 0, 3)),
    ticket: validTicket(m.ticket) ? clone(m.ticket) : null,
    type: ["any", "community", ...MINI_TYPES].includes(m.type) ? m.type : "any",
    realm: Math.floor(finite(m.realm, 0, 0, 29)),
  };
  d.fieldwork = normaliseFieldwork(input.fieldwork);
  d.machine.mods = normaliseMods(m.mods);
  d.secret = !!input.secret;
  d.night = !!input.night;
  d.story = {
    node: [
      "start",
      "bridge",
      "market",
      "letter",
      "home",
      "garden",
      "ending",
    ].includes(input.story?.node)
      ? input.story.node
      : "start",
    choices: (Array.isArray(input.story?.choices) ? input.story.choices : [])
      .filter((x) => typeof x === "string")
      .slice(-12),
  };
  // Attempts are reconstructed from trusted ticket parameters; transient answers never carry rewards.
  if (validTicket(input.active?.ticket)) {
    const a = input.active,
      puzzle =
        a.ticket.type === "community"
          ? null
          : makePuzzle(a.ticket, a.round || 0);
    if (puzzle) {
      let answer = "";
      if (
        ["balance", "memory", "locks", "pairs", "sequence", "circuit"].includes(
          puzzle.type,
        )
      )
        answer = (Array.isArray(a.answer) ? a.answer : [])
          .slice(0, 30)
          .map((x) =>
            Math.floor(
              finite(
                x,
                0,
                0,
                puzzle.type === "memory"
                  ? 3
                  : ["pairs", "sequence"].includes(puzzle.type)
                    ? 30
                    : 9,
              ),
            ),
          );
      else if (puzzle.type === "observe")
        answer = Math.floor(finite(a.answer, 0, 0, 40));
      else answer = safeText(String(a.answer ?? ""), 80);
      d.active = {
        ticket: { ...clone(a.ticket), mods: normaliseMods(a.ticket.mods) },
        pairOpen: (Array.isArray(a.pairOpen) ? a.pairOpen : [])
          .filter(
            (x) =>
              Number.isInteger(x) && x >= 0 && x < (puzzle.cells?.length || 0),
          )
          .slice(0, 2),
        moves: Math.floor(finite(a.moves)),
        failed: !!a.failed,
        answer,
        phase: a.phase === "recall" ? "recall" : "preview",
        position: Math.floor(
          finite(a.position, 0, 0, Math.max(0, (puzzle.size || 1) ** 2 - 1)),
        ),
        round: Math.floor(finite(a.round, 0, 0, 2)),
        boss: !!a.boss,
        mistakes: Math.floor(finite(a.mistakes)),
        hinted: !!a.hinted,
        hint: safeText(a.hint, 500),
        feedback: safeText(a.feedback, 250),
        started: finite(a.started, Date.now()),
        finished: !!a.finished,
      };
    }
  }
  return d;
}
export function mergeUniverse(a, b) {
  const aa = normaliseUniverse(a),
    bb = normaliseUniverse(b);
  return bb.updated > aa.updated ? bb : aa;
}
export function stats(s) {
  const wins = Object.values(s.completed),
    xp = wins.reduce((n, c) => n + 30 + c.level * 20, 0);
  return {
    wins: wins.length,
    xp,
    level: 1 + Math.floor(xp / 150),
    explored: Object.keys(s.visits).length,
    discoveries: Object.keys(s.claimed).length,
    creatures: Object.keys(s.companions).length,
    town:
      wins.length >= 12
        ? "A town with its lights back on"
        : wins.length >= 6
          ? "The market is opening"
          : wins.length >= 3
            ? "The bridge is repaired"
            : "A quiet beginning",
  };
}
export function regionOpen(s, id) {
  const r = REGIONS.find((r) => r.id === id);
  return !!r && (stats(s).wins >= r.need || (id === "folder" && s.secret));
}
export function validTicket(t) {
  return (
    !!t &&
    ["community", ...MINI_TYPES].includes(t.type) &&
    Number.isInteger(t.seed) &&
    t.seed >= 1 &&
    t.seed <= 1e9 &&
    Number.isInteger(t.level) &&
    t.level >= 0 &&
    t.level <= 3 &&
    REGIONS.some((r) => r.id === t.region) &&
    typeof t.id === "string" &&
    new RegExp(
      "^(" + [...MINI_TYPES, "community"].join("|") + ")-[0-3]-[0-9]+$",
    ).test(t.id) &&
    Number.isInteger(t.realm) &&
    t.realm >= 0 &&
    t.realm < 30 &&
    ["Common", "Unusual", "Rare", "Legendary"].includes(t.rarity) &&
    typeof t.title === "string" &&
    t.title.length <= 120 &&
    ["shifts", "deliveries", "packs"].includes(t.kind)
  );
}
export function ticketFor(s, { type, region, seed, level } = {}) {
  const r = rng(`${s.seed}/${s.machine.rolls}/${stats(s).wins}`);
  const open = REGIONS.filter((x) => regionOpen(s, x.id));
  const selectedRegion = region || open[Math.floor(r() * open.length)].id;
  const moodTypes = {
    Cozy: ["balance", "observe"],
    Curious: ["cipher", "pattern", "detective", "sequence"],
    Mysterious: ["cipher", "maze", "locks", "riddle"],
    Electric: ["pattern", "memory", "circuit"],
    Dreamy: ["memory", "observe", "pairs"],
    Ridiculous: ["balance", "cipher"],
  };
  let candidates =
    s.persona.chaos === 3
      ? [...MINI_TYPES, "community"]
      : moodTypes[s.persona.mood] || MINI_TYPES;
  if (s.persona.minutes === 2) candidates = ["observe", "pattern"];
  if (s.persona.minutes === 20 && s.persona.chaos < 3)
    candidates = ["maze", "cipher", "community"];
  const selectedType =
    type && type !== "any"
      ? type
      : candidates[Math.floor(r() * candidates.length)];
  const n = seed || 1 + Math.floor(r() * 999999);
  const lev = level ?? s.persona.level;
  const kind = ["shifts", "deliveries", "packs"][Math.floor(r() * 3)];
  const rare = hash(n) % 100;
  return {
    id: `${selectedType}-${lev}-${n}`,
    seed: n,
    type: selectedType,
    kind,
    level: lev,
    region: selectedRegion,
    mods: normaliseMods(s.machine.mods),
    rarity:
      rare < 3
        ? "Legendary"
        : rare < 15
          ? "Rare"
          : rare < 40
            ? "Unusual"
            : "Common",
    realm: s.machine.realm,
    title:
      selectedType === "community"
        ? [
            "The guild needs a plan",
            "Provisions, with complications",
            "A small packing predicament",
          ][["shifts", "deliveries", "packs"].indexOf(kind)]
        : MINI_NAMES[selectedType],
  };
}
function touch(s, now) {
  s.updated = now;
  return s;
}
export function reward(s, key, data, now = Date.now()) {
  if (s.completed[key]) return { state: s, fresh: false, loot: null };
  const n = clone(s);
  n.completed[key] = { ...data, at: now };
  n.coins += 8 + (data.level || 0) * 3;
  const material = ["paper", "dust", "gear", "ink"][hash(key) % 4];
  n.inventory[material] = (n.inventory[material] || 0) + 2;
  const count = Object.keys(n.completed).length;
  if (count % 3 === 0) n.inventory.egg = (n.inventory.egg || 0) + 1;
  if (count === 1) n.inventory.postcard = 1;
  if (count === 3) n.inventory.spoon = 1;
  if (n.equipped && n.companions[n.equipped])
    n.companions[n.equipped].bond = Math.min(
      99,
      n.companions[n.equipped].bond + 1,
    );
  return {
    state: touch(n, now),
    fresh: true,
    loot: { material, coins: 8 + (data.level || 0) * 3, egg: count % 3 === 0 },
  };
}
export function npcReady(s, id) {
  if (id === "fern") return Object.keys(s.visits).length >= 3;
  if (id === "pip")
    return Object.values(s.completed).some((c) =>
      ["packs", "balance"].includes(c.type),
    );
  if (id === "io")
    return Object.values(s.completed).some((c) =>
      ["memory", "pattern"].includes(c.type),
    );
  if (id === "vesper") return s.crafts > 0;
  return false;
}
export function achievements(s) {
  const n = stats(s);
  return [
    ["first", "First small detour", n.wins >= 1, "Complete a quest."],
    [
      "three",
      "The lights come back",
      n.wins >= 3,
      "Complete three different quests.",
    ],
    ["six", "The market opens", n.wins >= 6, "Complete six different quests."],
    [
      "twelve",
      "A place worth returning to",
      n.wins >= 12,
      "Complete twelve quests.",
    ],
    ["wander", "Properly lost", n.explored >= 5, "Visit five districts."],
    ["pet", "Good company", n.creatures >= 3, "Meet three companion species."],
    [
      "craft",
      "Made of small things",
      s.crafts >= 1,
      "Craft your first object.",
    ],
    ["maker", "Pocket engineer", s.crafts >= 8, "Craft eight objects."],
    [
      "expert",
      "Goblin with a plan",
      Object.values(s.completed).some((c) => c.level === 3),
      "Complete an expert quest.",
    ],
    [
      "types",
      "Many kinds of curious",
      new Set(Object.values(s.completed).map((c) => c.type)).size >= 6,
      "Complete six different puzzle types.",
    ],
    ["secret", "That door was not there", s.secret, "Open the hidden door."],
    [
      "story",
      "The letter arrives",
      s.claimed["story-ending"],
      "Finish the lost-letter story.",
    ],
    [
      "boss",
      "The paperwork is defeated",
      !!s.inventory.crown,
      "Complete the three-stage boss.",
    ],
    [
      "home",
      "Room for possibility",
      s.home.slots.filter(Boolean).length >= 4,
      "Place four furnishings.",
    ],
    [
      "trust",
      "Someone remembers",
      NPCS.every((n) => s.claimed["npc-" + n.id]),
      "Help all four residents.",
    ],
    [
      "journey",
      "The end was a beginning",
      s.journeys > 0,
      "Begin a new atlas chapter.",
    ],
  ].map(([id, name, done, description]) => ({
    id,
    name,
    done: !!done,
    description,
  }));
}
export function transition(state, action, now = Date.now()) {
  const s = clone(state);
  const p = action.payload || {};
  if (
    [
      "map-pin",
      "pin-archive",
      "pin-layer",
      "clue-add",
      "clue-solved",
      "clue-archive",
      "clue-link",
      "link-archive",
      "recipe-save",
      "recipe-remove",
    ].includes(action.type)
  ) {
    s.fieldwork = fieldworkAction(s.fieldwork, action, now);
    return touch(s, now);
  }
  switch (action.type) {
    case "persona":
      s.persona = normaliseUniverse({
        ...s,
        persona: { ...s.persona, ...p },
      }).persona;
      break;
    case "visit": {
      if (!regionOpen(s, p.id))
        throw Error("A few more discoveries will open this path.");
      s.visits[p.id] = now;
      break;
    }
    case "recipe-apply": {
      const recipe = s.fieldwork.recipes.find((r) => r.id === p.id);
      if (!recipe) throw Error("That recipe is not in this wallet.");
      s.persona.level = recipe.level;
      s.machine.type = recipe.type;
      s.machine.mods = normaliseMods(recipe.mods);
      break;
    }
    case "night":
      s.night = !s.night;
      break;
    case "machine": {
      if (!["any", "community", ...MINI_TYPES].includes(p.type))
        throw Error("Choose a quest kind.");
      s.machine.type = p.type;
      s.machine.mods = normaliseMods(p.mods);
      s.machine.realm = Math.floor(finite(+p.realm, 0, 0, 29));
      break;
    }
    case "roll": {
      const day = new Date(now).toISOString().slice(0, 10);
      if (s.machine.day !== day) {
        s.machine.day = day;
        s.machine.rerolls = 3;
      }
      if (p.reroll) {
        if (!s.machine.ticket || s.machine.rerolls < 1)
          throw Error(
            "Rerolls recharge tomorrow. You can always play a new quest for free.",
          );
        s.machine.rerolls--;
      }
      s.machine.rolls++;
      s.machine.ticket = ticketFor(s, { type: s.machine.type });
      break;
    }
    case "craft": {
      const r = RECIPES.find((r) => r.id === p.id);
      if (!r) throw Error("That recipe is not in the book.");
      if (
        s.coins < r.coins ||
        Object.entries(r.cost).some(([id, n]) => (s.inventory[id] || 0) < n)
      )
        throw Error("Gather a few more materials first.");
      for (const [id, n] of Object.entries(r.cost)) s.inventory[id] -= n;
      s.coins -= r.coins;
      for (const [id, n] of Object.entries(r.out))
        s.inventory[id] = (s.inventory[id] || 0) + n;
      s.crafts++;
      break;
    }
    case "favourite":
      if (!ITEMS[p.id]) throw Error("Unknown object.");
      s.favourites = s.favourites.includes(p.id)
        ? s.favourites.filter((x) => x !== p.id)
        : [...s.favourites, p.id];
      break;
    case "use":
      if (!(s.inventory[p.id] > 0)) throw Error("That pocket is empty.");
      if (p.id === "egg") {
        const unseen = CREATURES.filter((c) => !s.companions[c.id]);
        if (!unseen.length)
          throw Error(
            "You have met every species. Keep this egg as a souvenir.",
          );
        const c =
          unseen[
            hash(s.seed + "/" + Object.keys(s.companions).length) %
              unseen.length
          ];
        s.companions[c.id] = { name: c.name, bond: 0, habitat: c.habitat };
        s.equipped = c.id;
        s.inventory.egg--;
      } else if (p.id === "charm") {
        s.machine.rerolls = 3;
        s.machine.day = new Date(now).toISOString().slice(0, 10);
        s.inventory.charm--;
      } else throw Error("Keep this object, or place furniture in your room.");
      break;
    case "equip":
      if (!s.companions[p.id]) throw Error("Meet this companion first.");
      s.equipped = p.id;
      break;
    case "pet":
      if (!s.companions[p.id])
        throw Error("That companion has not arrived yet.");
      s.companions[p.id].bond = Math.min(99, s.companions[p.id].bond + 1);
      break;
    case "feed":
      if (!s.companions[p.id] || !(s.inventory.biscuit > 0))
        throw Error("You need a cloud biscuit and a companion.");
      s.inventory.biscuit--;
      s.companions[p.id].bond = Math.min(99, s.companions[p.id].bond + 4);
      break;
    case "rename":
      if (!s.companions[p.id]) throw Error("Unknown companion.");
      s.companions[p.id].name =
        safeText(p.name, 30).trim() ||
        CREATURES.find((c) => c.id === p.id).name;
      break;
    case "habitat":
      if (
        !s.companions[p.id] ||
        !CREATURES.some((c) => c.habitat === p.habitat)
      )
        throw Error("Choose a known habitat.");
      s.companions[p.id].habitat = p.habitat;
      break;
    case "home": {
      const idx = Math.floor(+p.slot);
      if (idx < 0 || idx > 5 || !Number.isFinite(idx))
        throw Error("Choose a room position.");
      if (p.id && ITEMS[p.id]?.kind !== "Furniture")
        throw Error("Choose a furnishing.");
      const old = s.home.slots[idx];
      if (p.id && !(s.inventory[p.id] > 0))
        throw Error("Craft this furnishing first.");
      if (old) s.inventory[old] = (s.inventory[old] || 0) + 1;
      if (p.id) s.inventory[p.id]--;
      s.home.slots[idx] = p.id || null;
      break;
    }
    case "room":
      if (
        !["observatory", "cottage", "arcade"].includes(p.theme) ||
        !["moon", "amber", "dusk"].includes(p.light)
      )
        throw Error("Choose a room theme and light.");
      s.home.theme = p.theme;
      s.home.light = p.light;
      break;
    case "note":
      if (!safeText(p.text, 1200).trim())
        throw Error("Write a thought to keep.");
      s.notes.push({
        id: "note-" + now + "-" + hash(p.text),
        text: safeText(p.text, 1200),
        at: now,
        region: REGIONS.some((r) => r.id === p.region) ? p.region : "moss",
      });
      s.notes = s.notes.slice(-100);
      break;
    case "talk": {
      if (
        !NPCS.some((n) => n.id === p.id) ||
        !["listen", "help", "question"].includes(p.choice)
      )
        throw Error("Choose a conversation.");
      const old = s.npc[p.id];
      s.npc[p.id] = {
        choice: p.choice,
        visits: (old?.visits || 0) + 1,
        at: now,
      };
      break;
    }
    case "npc-claim": {
      const n = NPCS.find((n) => n.id === p.id);
      if (!n || !npcReady(s, p.id))
        throw Error("Finish this resident’s small errand first.");
      if (s.claimed["npc-" + p.id])
        throw Error("You already have this keepsake.");
      s.claimed["npc-" + p.id] = true;
      s.inventory[n.gift] = (s.inventory[n.gift] || 0) + 1;
      s.coins += 10;
      break;
    }
    case "door":
      if (String(p.phrase).trim().toLowerCase() !== "open sesame")
        throw Error(
          "The door hums, but stays closed. Ask Vesper about the inscription.",
        );
      if (!s.inventory.rune)
        throw Error("A door rune belongs in this lock. Vesper may have one.");
      s.secret = true;
      s.visits.folder = now;
      break;
    case "portal":
      if (!s.inventory.key)
        throw Error("Craft a between-worlds key in the workshop.");
      s.machine.realm = Math.floor(finite(+p.realm, 0, 0, 29));
      s.claimed["realm-" + s.machine.realm] = true;
      s.machine.rolls++;
      s.machine.ticket = ticketFor(s);
      break;
    case "story": {
      const next = STORY[s.story?.node || "start"]?.choices.find(
        (c) => c.id === p.id,
      );
      if (!next) throw Error("That story choice is not available.");
      s.story = {
        node: next.to,
        choices: [...(s.story?.choices || []), p.id].slice(-12),
      };
      if (next.to === "ending" && !s.claimed["story-ending"]) {
        s.claimed["story-ending"] = true;
        s.inventory.postcard = (s.inventory.postcard || 0) + 1;
        s.coins += 12;
      }
      break;
    }
    case "story-rewind":
      s.story = { node: "start", choices: [] };
      break;
    case "journey":
      if (stats(s).wins < 12 * (s.journeys + 1))
        throw Error("Twelve new completed quests open each next chapter.");
      s.journeys++;
      s.visits = {};
      break;
    default:
      throw Error("This world has not learned that move.");
  }
  return touch(s, now);
}
export const STORY = {
  start: {
    title: "A letter addressed to “somewhere better”",
    text: "Pip gives you an envelope. No street. No name. Just those two words, in green ink. The letter is warm.",
    choices: [
      { id: "bridge", label: "Follow the repaired bridge", to: "bridge" },
      { id: "market", label: "Ask around Cloud Market", to: "market" },
    ],
  },
  bridge: {
    title: "Someone kept the light on",
    text: "At the bridge sits a small lantern, beside a bench worn smooth by waiting. A note says, “If you are carrying something heavy, sit a while.”",
    choices: [
      { id: "rest", label: "Sit, and read the envelope", to: "letter" },
      {
        id: "garden",
        label: "Follow the fireflies into the garden",
        to: "garden",
      },
    ],
  },
  market: {
    title: "The queue for impossible things",
    text: "A vendor offers to exchange the letter for a map that always points home. Behind you, a child asks whether letters can get lonely.",
    choices: [
      {
        id: "keep",
        label: "Keep the letter; ask who is waiting",
        to: "letter",
      },
      { id: "home", label: "Trade for the map, and follow it", to: "home" },
    ],
  },
  letter: {
    title: "The words inside",
    text: "“Dear future neighbour. I do not know where you are yet. I hope there is a chair, and someone who will make room.” You realise this is an invitation, not a delivery.",
    choices: [
      {
        id: "invite",
        label: "Leave the door open and put the kettle on",
        to: "ending",
      },
      {
        id: "invite-garden",
        label: "Plant the invitation in the community garden",
        to: "garden",
      },
    ],
  },
  garden: {
    title: "A very small beginning",
    text: "The paper becomes a leaf. Then two. In its shade, a space appears large enough for a second chair. The address was never a place. It was something you could make.",
    choices: [
      { id: "garden-end", label: "Pull up another chair", to: "ending" },
    ],
  },
  home: {
    title: "The map points back",
    text: "You expected a grand destination. The map leads to your own doorstep. A spare mug is already on the table. Perhaps somewhere better begins with making room.",
    choices: [
      { id: "home-end", label: "Invite the next traveller in", to: "ending" },
    ],
  },
  ending: {
    title: "Delivered, in a manner of speaking",
    text: "You keep a postcard from the journey. Somewhere on the atlas, a window comes on. There is room for one more.",
    choices: [],
  },
};
// Every mini-game is deterministic and solvable. Its seed travels with the ticket.
export function makePuzzle(ticket, round = 0) {
  if (!validTicket(ticket) || ticket.type === "community")
    throw Error("Choose a playable wonder ticket.");
  const level = ticket.level,
    r = rng(ticket.seed + "/" + round),
    pick = (n) => Math.floor(r() * n),
    type = ticket.type;
  if (EXTRA_TYPES.includes(type)) return extraPuzzle(ticket, r);
  if (type === "cipher") {
    const words = [
      "LANTERN",
      "GARDEN",
      "WONDER",
      "LETTER",
      "POCKET",
      "FOREST",
      "MUSEUM",
      "SECRET",
    ];
    const answer = words[pick(words.length)],
      shift = 1 + pick(3 + level * 3);
    return {
      type,
      answer,
      shift,
      cipher: [...answer]
        .map((c) =>
          String.fromCharCode(65 + ((c.charCodeAt(0) - 65 + shift) % 26)),
        )
        .join(""),
    };
  }
  if (type === "balance") {
    const values = Array.from({ length: 3 + level }, () => 1 + pick(9)),
      counts = values.map(() => pick(3));
    if (!counts.some(Boolean)) counts[0] = 1;
    return {
      type,
      values,
      target: values.reduce((n, x, i) => n + x * counts[i], 0),
      solution: counts,
    };
  }
  if (type === "memory")
    return {
      type,
      sequence: Array.from({ length: 3 + level * 2 }, () => pick(4)),
      symbols: ["☾", "✳", "◇", "ϟ"],
    };
  if (type === "pattern") {
    const start = 1 + pick(10),
      step = 2 + pick(6),
      style = level > 1 ? pick(2) : 0;
    const arr = Array.from({ length: 6 }, (_, i) =>
      style ? start + (step * i * (i + 1)) / 2 : start + step * i,
    );
    return {
      type,
      values: arr.slice(0, 5),
      answer: arr[5],
      rule: style
        ? "The gap grows by the same amount each time."
        : "The gap stays the same each time.",
    };
  }
  if (type === "observe") {
    const symbols = ["✧", "✦", "☾", "◈", "♧", "♣"];
    const base = pick(symbols.length),
      size = 12 + level * 4,
      index = pick(size);
    return {
      type,
      index,
      cells: Array.from({ length: size }, (_, i) =>
        i === index ? symbols[(base + 1) % symbols.length] : symbols[base],
      ),
    };
  }
  const size = 5 + level;
  const walls = []; // A guaranteed route follows the top and right edges; interior shortcuts vary.
  for (let y = 1; y < size; y++)
    for (let x = 0; x < size - 1; x++) if (r() < 0.38) walls.push(y * size + x);
  return { type, size, walls, start: 0, end: size * size - 1 };
}
export function checkPuzzle(puzzle, answer) {
  if (EXTRA_TYPES.includes(puzzle.type)) return checkExtra(puzzle, answer);
  if (puzzle.type === "cipher")
    return String(answer).trim().toUpperCase() === puzzle.answer;
  if (puzzle.type === "balance")
    return (
      Array.isArray(answer) &&
      answer.length === puzzle.values.length &&
      answer.every((n) => Number.isInteger(n) && n >= 0 && n <= 9) &&
      answer.reduce((n, x, i) => n + x * puzzle.values[i], 0) === puzzle.target
    );
  if (puzzle.type === "memory")
    return (
      Array.isArray(answer) && answer.join(",") === puzzle.sequence.join(",")
    );
  if (puzzle.type === "pattern")
    return String(answer).trim() !== "" && Number(answer) === puzzle.answer;
  if (puzzle.type === "observe") return +answer === puzzle.index;
  return +answer === puzzle.end;
}
export function mazeMove(p, position, direction) {
  const dx = { left: -1, right: 1, up: 0, down: 0 }[direction],
    dy = { up: -1, down: 1, left: 0, right: 0 }[direction];
  if (dx === undefined) return position;
  const x = (position % p.size) + dx,
    y = Math.floor(position / p.size) + dy;
  if (
    x < 0 ||
    y < 0 ||
    x >= p.size ||
    y >= p.size ||
    p.walls.includes(y * p.size + x)
  )
    return position;
  return y * p.size + x;
}
