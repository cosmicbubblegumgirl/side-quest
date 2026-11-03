import test from "node:test";
import assert from "node:assert/strict";
import {
  initialUniverse,
  normaliseUniverse,
  mergeUniverse,
  transition,
  reward,
  ticketFor,
  makePuzzle,
  checkPuzzle,
  mazeMove,
  regionOpen,
  stats,
  npcReady,
  validTicket,
  RECIPES,
  MINI_TYPES,
} from "../docs/universe.js";
const now = 1793610000000;
function win(s, id, type = "cipher") {
  return reward(
    s,
    id,
    {
      type,
      level: 0,
      region: "moss",
      title: "An actual test discovery",
      seconds: 12,
    },
    now + Object.keys(s.completed).length,
  ).state;
}
test("all six new engines generate deterministic solvable puzzles at every difficulty", () => {
  let tested = 0;
  const s = initialUniverse(100);
  for (const type of [
    "cipher",
    "balance",
    "memory",
    "pattern",
    "observe",
    "maze",
  ])
    for (let level = 0; level < 4; level++)
      for (let seed = 1; seed <= 200; seed++) {
        const t = ticketFor(s, { type, level, seed });
        assert.ok(validTicket(t));
        const p = makePuzzle(t);
        assert.deepEqual(p, makePuzzle(t));
        let answer;
        if (type === "cipher" || type === "pattern") answer = p.answer;
        if (type === "memory") answer = p.sequence;
        if (type === "balance") answer = p.solution;
        if (type === "observe") answer = p.index;
        if (type === "maze") {
          let pos = 0;
          for (let x = 1; x < p.size; x++) pos = mazeMove(p, pos, "right");
          for (let y = 1; y < p.size; y++) pos = mazeMove(p, pos, "down");
          answer = pos;
          assert.equal(mazeMove(p, 0, "left"), 0);
        }
        assert.equal(checkPuzzle(p, answer), true, JSON.stringify(t));
        tested++;
      }
  assert.equal(tested, 4800);
});
test("rewards are idempotent, immutable and open actual district gates", () => {
  const s = initialUniverse(42),
    a = reward(
      s,
      "cipher-0-1",
      { type: "cipher", level: 0, region: "moss", title: "First" },
      now,
    );
  assert.equal(Object.keys(s.completed).length, 0);
  assert.equal(a.fresh, true);
  assert.equal(a.state.coins, 38);
  assert.ok(a.state.inventory.postcard);
  const again = reward(
    a.state,
    "cipher-0-1",
    { type: "cipher", level: 3, region: "moss" },
    now + 1,
  );
  assert.equal(again.fresh, false);
  assert.equal(again.state.coins, 38);
  assert.equal(regionOpen(s, "neon"), false);
  const b = win(a.state, "balance-0-2", "balance");
  assert.equal(regionOpen(b, "neon"), true);
  assert.equal(npcReady(b, "pip"), true);
  const c = win(b, "memory-0-3", "memory");
  assert.equal(c.inventory.egg, 1);
  assert.equal(c.inventory.spoon, 1);
  assert.equal(stats(c).town, "The bridge is repaired");
});
test("crafting, furnishing and consumables conserve resources and cannot overspend", () => {
  const s = initialUniverse(1);
  assert.throws(() =>
    transition(s, { type: "craft", payload: { id: "telescope" } }, now),
  );
  const made = transition(s, { type: "craft", payload: { id: "lamp" } }, now);
  assert.equal(made.inventory.lamp, 1);
  assert.equal(made.inventory.gear, 0);
  assert.equal(made.inventory.dust, 0);
  assert.equal(made.coins, 24);
  const placed = transition(
    made,
    { type: "home", payload: { id: "lamp", slot: 1 } },
    now + 1,
  );
  assert.equal(placed.inventory.lamp, 0);
  const removed = transition(
    placed,
    { type: "home", payload: { id: "", slot: 1 } },
    now + 2,
  );
  assert.equal(removed.inventory.lamp, 1);
  assert.throws(() =>
    transition(
      removed,
      { type: "home", payload: { id: "lamp", slot: 22 } },
      now,
    ),
  );
  const fed = transition(s, { type: "feed", payload: { id: "moth" } }, now);
  assert.equal(fed.inventory.biscuit, 2);
  assert.equal(fed.companions.moth.bond, 4);
  assert.equal(s.companions.moth.bond, 0);
});
test("quest machine controls, daily rerolls and saved attempts survive round trips", () => {
  let s = initialUniverse(42);
  s = transition(
    s,
    { type: "persona", payload: { minutes: 2, chaos: 1 } },
    now,
  );
  const t = ticketFor(s);
  assert.ok(["observe", "pattern"].includes(t.type));
  s = transition(
    s,
    { type: "machine", payload: { type: "memory", realm: 12 } },
    now,
  );
  s = transition(s, { type: "roll" }, now);
  assert.equal(s.machine.ticket.type, "memory");
  for (let i = 0; i < 3; i++)
    s = transition(s, { type: "roll", payload: { reroll: true } }, now);
  assert.equal(s.machine.rerolls, 0);
  assert.throws(() =>
    transition(s, { type: "roll", payload: { reroll: true } }, now),
  );
  s = transition(
    s,
    { type: "roll", payload: { reroll: true } },
    now + 86400000,
  );
  assert.equal(s.machine.rerolls, 2);
  s.active = {
    ticket: s.machine.ticket,
    answer: [0, 1],
    phase: "recall",
    position: 0,
    round: 0,
    boss: false,
    started: now,
  };
  const restored = normaliseUniverse(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(restored.active.answer, [0, 1]);
  assert.equal(restored.active.phase, "recall");
  assert.equal(validTicket({ ...t, title: "x".repeat(500) }), false);
  assert.equal(validTicket({ ...t, id: '\" onclick=alert(1)' }), false);
});
test("NPC keepsakes, secret doors, companion hatches and story rewards are one-time discoveries", () => {
  let s = initialUniverse(13);
  s = transition(s, { type: "craft", payload: { id: "plant" } }, now);
  assert.equal(npcReady(s, "vesper"), true);
  s = transition(s, { type: "npc-claim", payload: { id: "vesper" } }, now);
  assert.equal(s.inventory.rune, 1);
  assert.throws(() =>
    transition(s, { type: "npc-claim", payload: { id: "vesper" } }, now),
  );
  assert.throws(() =>
    transition(s, { type: "door", payload: { phrase: "wrong" } }, now),
  );
  s = transition(s, { type: "door", payload: { phrase: "OPEN SESAME" } }, now);
  assert.equal(s.secret, true);
  assert.equal(regionOpen(s, "folder"), true);
  s.inventory.egg = 1;
  const hatch = transition(s, { type: "use", payload: { id: "egg" } }, now);
  assert.equal(Object.keys(hatch.companions).length, 2);
  assert.equal(hatch.inventory.egg, 0);
  s = transition(s, { type: "story", payload: { id: "bridge" } }, now);
  s = transition(s, { type: "story", payload: { id: "rest" } }, now);
  s = transition(s, { type: "story", payload: { id: "invite" } }, now);
  const coins = s.coins;
  s = transition(s, { type: "story-rewind" }, now);
  s = transition(s, { type: "story", payload: { id: "market" } }, now);
  s = transition(s, { type: "story", payload: { id: "home" } }, now);
  s = transition(s, { type: "story", payload: { id: "home-end" } }, now);
  assert.equal(s.coins, coins);
});
test("snapshot sync keeps inventory transactions together and preserves the newer world", () => {
  let a = initialUniverse(42),
    b = initialUniverse(42);
  a = transition(
    a,
    { type: "note", payload: { text: "Remember the door." } },
    100,
  );
  b = transition(b, { type: "persona", payload: { name: "Fern" } }, 200);
  const merged = mergeUniverse(a, b);
  assert.equal(merged.persona.name, "Fern");
  assert.equal(merged.updated, 200);
  assert.deepEqual(merged.inventory, normaliseUniverse(b).inventory);
  const unsafe = normaliseUniverse({
    version: 1,
    coins: Infinity,
    persona: { level: 90, chaos: -1, name: "x".repeat(100) },
    inventory: { dust: -10 },
    notes: [{ text: "safe", at: 100 }],
    machine: { ticket: { type: "evil" } },
  });
  assert.equal(unsafe.coins, 30);
  assert.equal(unsafe.persona.level, 3);
  assert.equal(unsafe.persona.name.length, 40);
  assert.equal(unsafe.inventory.dust, 0);
  assert.equal(unsafe.machine.ticket, null);
});

test("real-world timestamps survive saves and newer snapshots remain newer", () => {
  let s = initialUniverse(42);
  s = transition(s, { type: "visit", payload: { id: "moss" } }, now);
  s = win(s, "real-timestamp");
  const restored = normaliseUniverse(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.updated, now);
  assert.equal(restored.visits.moss, now);
  assert.equal(restored.completed["real-timestamp"].at, now);
  const newer = transition(
    restored,
    { type: "note", payload: { text: "Later discovery" } },
    now + 10000,
  );
  assert.equal(mergeUniverse(restored, newer).updated, now + 10000);
});
