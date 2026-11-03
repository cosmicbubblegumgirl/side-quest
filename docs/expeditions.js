/* Additional wonder games and the explorer's personal casebook. */
export const EXTRA_TYPES = [
  "detective",
  "locks",
  "pairs",
  "sequence",
  "circuit",
  "riddle",
];
export const EXTRA_NAMES = {
  detective: "The peculiar parcel case",
  locks: "The room with too many locks",
  pairs: "The cabinet of familiar things",
  sequence: "The timetable of impossible errands",
  circuit: "The lantern that lit the others",
  riddle: "A question from the door",
};
export const MODIFIERS = [
  {
    id: "noHints",
    name: "No hints",
    description: "Put the hint button away for this ticket.",
  },
  {
    id: "oneTry",
    name: "One check per attempt",
    description: "A wrong answer asks you to restart the same puzzle.",
  },
  {
    id: "limitedMoves",
    name: "A pocketful of moves",
    description: "Grid and ordering puzzles receive a finite move budget.",
  },
  {
    id: "mirror",
    name: "Looking-glass board",
    description:
      "Mirror spatial boards. Direction buttons still follow what you see.",
  },
  {
    id: "fog",
    name: "Lantern fog",
    description: "Only nearby maze tiles are visible.",
  },
];
export const normaliseMods = (m) =>
  Object.fromEntries(MODIFIERS.map((x) => [x.id, !!m?.[x.id]]));
const text = (x, n = 120) => (typeof x === "string" ? x.slice(0, n) : "");
const safeId = (x) => typeof x === "string" && /^[a-z0-9-]{1,80}$/i.test(x);
const num = (x, min, max, fallback = min) =>
  typeof x === "number" && Number.isFinite(x)
    ? Math.max(min, Math.min(max, x))
    : fallback;
const list = (x) => (Array.isArray(x) ? x : []);
export function initialFieldwork() {
  return { pins: [], clues: [], links: [], recipes: [], showPins: true };
}
export function normaliseFieldwork(x) {
  const d = initialFieldwork();
  if (!x || typeof x !== "object") return d;
  d.pins = list(x.pins)
    .filter((p) => p && safeId(p.id))
    .slice(-60)
    .map((p) => ({
      id: p.id,
      title: text(p.title, 60),
      note: text(p.note, 500),
      kind: ["clue", "cozy", "return", "secret"].includes(p.kind)
        ? p.kind
        : "clue",
      x: num(p.x, 8, 92, 50),
      y: num(p.y, 22, 86, 50),
      archived: !!p.archived,
      at: num(p.at, 0, 9e15),
    }));
  d.clues = list(x.clues)
    .filter((c) => c && safeId(c.id))
    .slice(-100)
    .map((c) => ({
      id: c.id,
      title: text(c.title, 80),
      text: text(c.text, 1200),
      kind: ["person", "place", "object", "theory"].includes(c.kind)
        ? c.kind
        : "theory",
      solved: !!c.solved,
      archived: !!c.archived,
      at: num(c.at, 0, 9e15),
    }));
  const ids = new Set(d.clues.map((c) => c.id));
  d.links = list(x.links)
    .filter(
      (l) =>
        l &&
        safeId(l.id) &&
        ids.has(l.from) &&
        ids.has(l.to) &&
        l.from !== l.to,
    )
    .slice(-200)
    .map((l) => ({
      id: l.id,
      from: l.from,
      to: l.to,
      label: text(l.label, 120) || "might be connected",
      archived: !!l.archived,
    }));
  d.recipes = list(x.recipes)
    .filter((r) => r && safeId(r.id))
    .slice(-12)
    .map((r) => ({
      id: r.id,
      name: text(r.name, 50) || "A peculiar recipe",
      level: Math.floor(num(r.level, 0, 3)),
      type: [
        "any",
        "community",
        ...EXTRA_TYPES,
        "cipher",
        "balance",
        "memory",
        "pattern",
        "observe",
        "maze",
      ].includes(r.type)
        ? r.type
        : "any",
      mods: normaliseMods(r.mods),
    }));
  d.showPins = x.showPins !== false;
  return d;
}
export function fieldworkAction(field, action, now) {
  const f = structuredClone(field || initialFieldwork()),
    p = action.payload || {},
    id = () => `${now.toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  if (action.type === "map-pin") {
    if (f.pins.length >= 60)
      throw Error(
        "This atlas holds sixty annotations. Your existing marks can still be restored and inspected.",
      );
    if (!text(p.title, 60).trim())
      throw Error("Give this marker a little name.");
    f.pins.push({
      id: "pin-" + id(),
      title: text(p.title, 60).trim(),
      note: text(p.note, 500),
      kind: ["clue", "cozy", "return", "secret"].includes(p.kind)
        ? p.kind
        : "clue",
      x: num(+p.x, 8, 92, 50),
      y: num(+p.y, 22, 86, 50),
      at: now,
      archived: false,
    });
  } else if (action.type === "pin-archive") {
    const pin = f.pins.find((x) => x.id === p.id);
    if (!pin) throw Error("That marker is off this map.");
    pin.archived = !pin.archived;
  } else if (action.type === "pin-layer") f.showPins = !f.showPins;
  else if (action.type === "clue-add") {
    if (f.clues.length >= 100)
      throw Error("This casebook has room for one hundred clues.");
    if (!text(p.title, 80).trim() || !text(p.text, 1200).trim())
      throw Error("A clue needs a title and something you noticed.");
    f.clues.push({
      id: "clue-" + id(),
      title: text(p.title, 80).trim(),
      text: text(p.text, 1200).trim(),
      kind: ["person", "place", "object", "theory"].includes(p.kind)
        ? p.kind
        : "theory",
      solved: false,
      archived: false,
      at: now,
    });
  } else if (action.type === "clue-solved" || action.type === "clue-archive") {
    const c = f.clues.find((c) => c.id === p.id);
    if (!c) throw Error("That clue is not in this casebook.");
    const key = action.type === "clue-solved" ? "solved" : "archived";
    c[key] = !c[key];
  } else if (action.type === "clue-link") {
    if (f.links.length >= 200)
      throw Error("This casebook holds two hundred connections.");
    if (
      p.from === p.to ||
      ![p.from, p.to].every((id) =>
        f.clues.some((c) => c.id === id && !c.archived),
      )
    )
      throw Error("Connect two different active clues.");
    if (f.links.some((l) => !l.archived && l.from === p.from && l.to === p.to))
      throw Error("That connection is already on the board.");
    f.links.push({
      id: "link-" + id(),
      from: p.from,
      to: p.to,
      label: text(p.label, 120).trim() || "might be connected",
      archived: false,
    });
  } else if (action.type === "link-archive") {
    const l = f.links.find((l) => l.id === p.id);
    if (l) l.archived = !l.archived;
  } else if (action.type === "recipe-save") {
    if (f.recipes.length >= 12)
      throw Error("Your recipe wallet holds twelve challenge recipes.");
    if (!text(p.name, 50).trim()) throw Error("Name this challenge recipe.");
    f.recipes.push({
      id: "recipe-" + id(),
      name: text(p.name, 50).trim(),
      level: Math.floor(num(+p.level, 0, 3)),
      type: p.type,
      mods: normaliseMods(p.mods),
    });
  } else if (action.type === "recipe-remove")
    f.recipes = f.recipes.filter((r) => r.id !== p.id);
  else throw Error("This page has not learned that move.");
  return normaliseFieldwork(f);
}
function shuffle(values, r) {
  const a = [...values];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function circuitPress(cells, size, index) {
  if (!Number.isInteger(index) || index < 0 || index >= cells.length)
    return [...cells];
  const a = [...cells],
    x = index % size,
    y = Math.floor(index / size);
  for (const [dx, dy] of [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx,
      ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < size && ny < size)
      a[ny * size + nx] = a[ny * size + nx] ? 0 : 1;
  }
  return a;
}
export function extraPuzzle(ticket, r) {
  const { type, level } = ticket,
    pick = (n) => Math.floor(r() * n);
  if (type === "detective") {
    const n = 3 + level,
      names = shuffle(
        ["Fern", "Io", "Pip", "Vesper", "Clover", "Aster"],
        r,
      ).slice(0, n),
      hours = shuffle(
        Array.from({ length: n }, (_, i) => 9 + i),
        r,
      ),
      weights = shuffle(
        Array.from({ length: n }, (_, i) => i + 1),
        r,
      ),
      floors = shuffle(
        Array.from({ length: n }, (_, i) => i + 1),
        r,
      ),
      people = names.map((name, i) => ({
        name,
        hour: hours[i],
        weight: weights[i],
        floor: floors[i],
      })),
      target = pick(n),
      possibilities = [];
    for (const [key, label] of [
      ["hour", "arrival hour"],
      ["weight", "parcel weight"],
      ["floor", "destination floor"],
    ]) {
      const v = people[target][key];
      if (people.some((p) => p[key] < v))
        possibilities.push({
          text: `Their ${label} was greater than ${v - 1}.`,
          key,
          op: "gt",
          value: v - 1,
        });
      if (people.some((p) => p[key] > v))
        possibilities.push({
          text: `Their ${label} was less than ${v + 1}.`,
          key,
          op: "lt",
          value: v + 1,
        });
      for (const other of people.filter((_, i) => i !== target))
        possibilities.push({
          text: `Their ${label} was not ${other[key]}.`,
          key,
          op: "ne",
          value: other[key],
        });
    }
    const matches = (p, c) =>
      c.op === "gt"
        ? p[c.key] > c.value
        : c.op === "lt"
          ? p[c.key] < c.value
          : p[c.key] !== c.value;
    let remaining = people.map((_, i) => i);
    const clues = [];
    for (const c of shuffle(possibilities, r)) {
      const kept = remaining.filter((i) => matches(people[i], c));
      if (kept.length < remaining.length) {
        clues.push(c);
        remaining = kept;
      }
      if (remaining.length === 1) break;
    }
    return { type, people, clues, answer: target };
  }
  if (type === "locks") {
    const count = 3 + Math.floor(level / 2),
      digits = Array.from({ length: count }, () => 1 + pick(9)),
      clues = [`The first wheel is ${digits[0] + 2} minus 2.`];
    for (let i = 1; i < count; i++) {
      const delta = digits[i] - digits[i - 1];
      clues.push(
        delta === 0
          ? `Wheel ${i + 1} matches wheel ${i}.`
          : `Wheel ${i + 1} is ${Math.abs(delta)} ${delta > 0 ? "more" : "less"} than wheel ${i}.`,
      );
    }
    return { type, digits, clues };
  }
  if (type === "pairs") {
    const pairs = 4 + level * 2,
      symbols = ["☾", "✳", "◇", "ϟ", "♧", "♜", "◈", "✉", "☀", "⌘"].slice(
        0,
        pairs,
      );
    return { type, cells: shuffle([...symbols, ...symbols], r) };
  }
  if (type === "sequence") {
    const n = 4 + level,
      labels = shuffle(
        [
          "Collect the moon milk",
          "Wake the polite dragon",
          "Stamp the invitation",
          "Polish the borrowed star",
          "Visit the west tower",
          "Pack the cloud biscuits",
          "Open the tiny gate",
        ],
        r,
      ).slice(0, n),
      order = shuffle(
        Array.from({ length: n }, (_, i) => i),
        r,
      ),
      clues = shuffle(
        order
          .slice(0, -1)
          .map((id, i) =>
            r() < 0.5
              ? `${labels[id]} happens before ${labels[order[i + 1]]}.`
              : `${labels[order[i + 1]]} happens after ${labels[id]}.`,
          ),
        r,
      );
    let initial = shuffle(order, r);
    if (initial.join() === order.join())
      initial = initial.slice(1).concat(initial[0]);
    return { type, labels, order, initial, clues };
  }
  if (type === "circuit") {
    const size = level < 2 ? 3 : 4;
    let cells = Array(size * size).fill(0);
    const solution = shuffle(
      Array.from({ length: cells.length }, (_, i) => i),
      r,
    ).slice(0, 2 + level * 2);
    for (const i of solution) cells = circuitPress(cells, size, i);
    if (!cells.some(Boolean)) {
      solution.push(0);
      cells = circuitPress(cells, size, 0);
    }
    return { type, size, cells, solution };
  }
  if (type === "riddle") {
    const riddles = [
      [
        "I give a locked door permission to change its mind. What am I?",
        ["key"],
        "Small enough for a pocket. Made for a lock.",
      ],
      [
        "I keep the rain off your tea while the clouds have their say. What am I?",
        ["umbrella"],
        "You carry it above your head.",
      ],
      [
        "I carry your message but never read it. Lick a stamp and I can leave. What am I?",
        ["envelope"],
        "The letter lives inside me.",
      ],
      [
        "I have hands that go round, but I cannot hold a biscuit. What am I?",
        ["clock"],
        "The answer is a matter of time.",
      ],
      [
        "I repeat what you say, but never start a conversation. What am I?",
        ["echo"],
        "Try speaking in an empty hall.",
      ],
      [
        "I show you a whole town without giving you one place to stand. What am I?",
        ["map", "a map"],
        "Fold me, and the whole journey fits in your pocket.",
      ],
      [
        "The more you remove from me, the more room I have inside. What am I?",
        ["hole", "a hole"],
        "A spade can make one.",
      ],
      [
        "I follow your feet in sunlight and disappear when the light does. What am I?",
        ["shadow", "a shadow"],
        "I am made by blocked light.",
      ],
      [
        "I am a promise of sound, broken the instant you name me aloud. What am I?",
        ["silence"],
        "The answer is quiet.",
      ],
      [
        "I travel everywhere a letter goes, without leaving its corner. What am I?",
        ["stamp", "postage stamp"],
        "The post office sells me.",
      ],
      [
        "I have a spine and leaves, but neither bones nor roots. What am I?",
        ["book", "a book"],
        "Fern keeps thousands of me.",
      ],
      [
        "You can keep me after giving me to someone. What am I?",
        ["word", "your word", "a promise", "promise"],
        "The door trusts people who keep this.",
      ],
      [
        "I make a room larger by taking up its wall. Yet step towards me and you meet yourself. What am I?",
        ["mirror", "a mirror"],
        "The looking-glass district is rather fond of me.",
      ],
      [
        "I belong to you, but other people say me more often than you do. What am I?",
        ["name", "your name"],
        "Your passport begins with this.",
      ],
      [
        "I have many keys and no locks; a space and no room. What am I?",
        ["keyboard", "a keyboard"],
        "You might be using one right now.",
      ],
      [
        "I am always on my way and never here when I arrive, because my name changes. What am I?",
        ["tomorrow"],
        "The day after today.",
      ],
    ];
    const [question, answers, hint] = riddles[level * 4 + pick(4)];
    return { type, question, answers, hint };
  }
  return null;
}
export function checkExtra(p, a) {
  if (p.type === "detective")
    return (
      a !== null &&
      a !== undefined &&
      typeof a !== "boolean" &&
      Number(a) === p.answer &&
      String(a) !== ""
    );
  if (p.type === "locks")
    return (
      Array.isArray(a) &&
      a.length === p.digits.length &&
      a.every((v, i) => Number(v) === p.digits[i])
    );
  if (p.type === "pairs")
    return (
      Array.isArray(a) &&
      a.length === p.cells.length &&
      new Set(a).size === p.cells.length &&
      a.every((v) => Number.isInteger(v) && v >= 0 && v < p.cells.length)
    );
  if (p.type === "sequence")
    return Array.isArray(a) && a.join(",") === p.order.join(",");
  if (p.type === "circuit")
    return (
      Array.isArray(a) && a.length === p.cells.length && a.every((v) => v === 0)
    );
  if (p.type === "riddle")
    return p.answers.includes(
      String(a)
        .trim()
        .toLowerCase()
        .replace(/[.!?]$/, ""),
    );
  return null;
}
export function moveBudget(p) {
  if (p.type === "maze") return p.size * 4;
  if (p.type === "circuit") return p.cells.length * 3;
  if (p.type === "sequence")
    return (p.order.length * (p.order.length - 1)) / 2 + 6;
  if (p.type === "pairs") return p.cells.length * 4;
  return 0;
}
