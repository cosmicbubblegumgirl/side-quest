import test from "node:test";
import assert from "node:assert/strict";
import {
  EXTRA_TYPES,
  circuitPress,
  normaliseFieldwork,
  moveBudget,
} from "../docs/expeditions.js";
import {
  initialUniverse,
  normaliseUniverse,
  transition,
  ticketFor,
  makePuzzle,
  checkPuzzle,
  validTicket,
} from "../docs/universe.js";
import { universePage, universeHome, wonderPage } from "../docs/universe-ui.js";
const now = 1793710000000;
test("4,800 additional puzzle boards are deterministic, solvable and uniquely deducible where required", () => {
  const s = initialUniverse(42);
  let tested = 0;
  for (const type of EXTRA_TYPES)
    for (let level = 0; level < 4; level++)
      for (let seed = 1; seed <= 200; seed++) {
        const t = ticketFor(s, { type, level, seed }),
          p = makePuzzle(t);
        assert.ok(validTicket(t));
        assert.deepEqual(p, makePuzzle(t));
        let answer;
        if (type === "detective") {
          answer = p.answer;
          const candidates = p.people
            .map((_, i) => i)
            .filter((i) =>
              p.clues.every((c) =>
                c.op === "gt"
                  ? p.people[i][c.key] > c.value
                  : c.op === "lt"
                    ? p.people[i][c.key] < c.value
                    : p.people[i][c.key] !== c.value,
              ),
            );
          assert.deepEqual(candidates, [p.answer]);
          assert.equal(checkPuzzle(p, null), false);
        } else if (type === "locks") answer = p.digits;
        else if (type === "pairs") answer = p.cells.map((_, i) => i);
        else if (type === "sequence") answer = p.order;
        else if (type === "circuit") {
          answer = [...p.cells];
          for (const i of p.solution) answer = circuitPress(answer, p.size, i);
          assert.ok(p.cells.some(Boolean));
          assert.ok(p.solution.length <= moveBudget(p));
          assert.ok(answer.every((x) => x === 0));
        } else answer = p.answers[0];
        assert.ok(checkPuzzle(p, answer), JSON.stringify(t));
        tested++;
      }
  assert.equal(tested, 4800);
});
test("old worlds migrate without losing inventory, progress, attempts or timestamps", () => {
  const old = initialUniverse(42);
  delete old.fieldwork;
  delete old.machine.mods;
  old.updated = now;
  old.coins = 77;
  old.completed["cipher-0-5"] = {
    type: "cipher",
    level: 0,
    region: "moss",
    title: "An earlier discovery",
    at: now,
  };
  const s = normaliseUniverse(old);
  assert.equal(s.coins, 77);
  assert.equal(s.completed["cipher-0-5"].at, now);
  assert.deepEqual(s.fieldwork.pins, []);
  assert.ok(Object.values(s.machine.mods).every((x) => x === false));
  const t = ticketFor(s, { type: "pairs", seed: 16 });
  s.active = {
    ticket: t,
    phase: "recall",
    answer: [0, 1],
    pairOpen: [2],
    moves: 5,
    failed: false,
    started: now,
  };
  const saved = normaliseUniverse(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(saved.active.answer, [0, 1]);
  assert.deepEqual(saved.active.pairOpen, [2]);
  assert.equal(saved.active.moves, 5);
  assert.equal(saved.active.started, now);
});
test("pins and clues archive reversibly and connections require two real active clues", () => {
  let s = initialUniverse(9);
  const before = structuredClone(s);
  s = transition(
    s,
    {
      type: "map-pin",
      payload: {
        title: "The odd door",
        x: 999,
        y: -20,
        note: "Bring the rune",
        kind: "secret",
      },
    },
    now,
  );
  assert.deepEqual(before.fieldwork.pins, []);
  assert.equal(s.fieldwork.pins[0].x, 92);
  assert.equal(s.fieldwork.pins[0].y, 22);
  const pin = s.fieldwork.pins[0].id;
  s = transition(s, { type: "pin-archive", payload: { id: pin } }, now);
  assert.equal(s.fieldwork.pins[0].archived, true);
  s = transition(s, { type: "pin-archive", payload: { id: pin } }, now);
  assert.equal(s.fieldwork.pins[0].archived, false);
  for (const title of ["Envelope", "Tower"])
    s = transition(
      s,
      {
        type: "clue-add",
        payload: { title, text: "A fictional observation.", kind: "place" },
      },
      now,
    );
  const [from, to] = s.fieldwork.clues.map((c) => c.id);
  assert.throws(() =>
    transition(s, { type: "clue-link", payload: { from, to: from } }, now),
  );
  assert.throws(() =>
    transition(s, { type: "clue-link", payload: { from, to: "missing" } }, now),
  );
  s = transition(
    s,
    { type: "clue-link", payload: { from, to, label: "may have come from" } },
    now,
  );
  assert.equal(s.fieldwork.links.length, 1);
  assert.throws(() =>
    transition(s, { type: "clue-link", payload: { from, to } }, now),
  );
  s = transition(s, { type: "clue-solved", payload: { id: from } }, now);
  assert.equal(s.fieldwork.clues[0].solved, true);
  s = transition(s, { type: "clue-archive", payload: { id: to } }, now);
  assert.equal(s.fieldwork.clues[1].archived, true);
  assert.equal(s.fieldwork.links[0].to, to);
});
test("challenge recipes preserve exact options and appear on valid tickets", () => {
  let s = initialUniverse(42);
  s = transition(
    s,
    {
      type: "recipe-save",
      payload: {
        name: "A determined goblin",
        type: "circuit",
        level: 3,
        mods: { mirror: true, limitedMoves: true, noHints: true },
      },
    },
    now,
  );
  const id = s.fieldwork.recipes[0].id;
  s = transition(s, { type: "recipe-apply", payload: { id } }, now + 1);
  assert.equal(s.machine.type, "circuit");
  assert.equal(s.persona.level, 3);
  s = transition(s, { type: "roll" }, now + 2);
  assert.equal(s.machine.ticket.type, "circuit");
  assert.equal(s.machine.ticket.mods.mirror, true);
  assert.equal(s.machine.ticket.mods.limitedMoves, true);
  assert.equal(s.machine.ticket.mods.noHints, true);
  assert.ok(validTicket(s.machine.ticket));
  const restored = normaliseUniverse(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.fieldwork.recipes[0].name, "A determined goblin");
  assert.equal(restored.machine.ticket.mods.mirror, true);
});
test("notes and markers are escaped, and dangling imported evidence links are discarded", () => {
  let s = initialUniverse(7);
  s = transition(
    s,
    {
      type: "clue-add",
      payload: {
        title: "<img src=x onerror=alert(1)>",
        text: "<script>bad()</script>",
        kind: "theory",
      },
    },
    now,
  );
  s = transition(
    s,
    { type: "map-pin", payload: { title: "<svg onload=bad()>", x: 30, y: 40 } },
    now,
  );
  const html = universePage(s, ["casebook"]) + universeHome(s);
  assert.equal(html.includes("<img src=x"), false);
  assert.equal(html.includes("<script>bad()"), false);
  assert.ok(html.includes("&lt;script&gt;"));
  const clean = normaliseFieldwork({
    clues: s.fieldwork.clues,
    links: [{ id: "link-a", from: s.fieldwork.clues[0].id, to: "missing" }],
    pins: [{ id: 'bad\" onclick=', title: "x" }],
  });
  assert.equal(clean.links.length, 0);
  assert.equal(clean.pins.length, 0);
});
test("every new game renders and no-hint recipes remove the hint control", () => {
  const s = initialUniverse(14);
  for (const type of EXTRA_TYPES) {
    const t = ticketFor(s, { type, seed: 123, level: 3 });
    t.mods = { noHints: true };
    const p = makePuzzle(t);
    s.active = {
      ticket: t,
      answer:
        type === "circuit" ? p.cells : type === "sequence" ? p.initial : [],
      phase: "preview",
      round: 0,
      pairOpen: [],
      moves: 0,
    };
    const html = wonderPage(s);
    assert.ok(html.includes(t.title));
    assert.equal(html.includes('data-u-action="hint"'), false);
  }
});
