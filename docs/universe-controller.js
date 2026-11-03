import {
  circuitPress,
  moveBudget,
  normaliseMods,
  MODIFIERS,
} from "./expeditions.js?v=10";
import { fieldworkActions } from "./expeditions-controller.js?v=10";
import {
  REGIONS,
  REALMS,
  CREATURES,
  ITEMS,
  NPCS,
  MINI_NAMES,
  initialUniverse,
  normaliseUniverse,
  transition,
  reward,
  stats,
  ticketFor,
  makePuzzle,
  checkPuzzle,
  mazeMove,
  regionOpen,
  validTicket,
} from "./universe.js?v=10";
const e = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function connectUniverse(ctx) {
  const $ = (s) => document.querySelector(s);
  let busy = false;
  const store = async (s, redraw = true) => {
    await ctx.setState(s);
    if (redraw) await ctx.render();
  };
  const send = async (type, payload = {}, redraw = true) =>
    store(transition(ctx.getState(), { type, payload }), redraw);
  const go = (hash) => {
    if (ctx.modal.open) ctx.modal.close();
    location.hash = hash;
  };
  function attempt(ticket, boss = false) {
    const p = makePuzzle(ticket);
    let answer = "";
    if (p.type === "balance") answer = p.values.map(() => 0);
    if (["memory", "pairs"].includes(p.type)) answer = [];
    if (p.type === "locks") answer = p.digits.map(() => 0);
    if (p.type === "sequence") answer = [...p.initial];
    if (p.type === "circuit") answer = [...p.cells];
    return {
      ticket: { ...ticket, mods: normaliseMods(ticket.mods) },
      answer,
      pairOpen: [],
      phase: "preview",
      position: 0,
      round: 0,
      boss,
      mistakes: 0,
      moves: 0,
      failed: false,
      hinted: false,
      hint: "",
      feedback: "",
      started: Date.now(),
    };
  }
  function requireAttempt(a) {
    if (!a) throw Error("Choose a ticket first.");
    if (a.failed)
      throw Error("Start a fresh attempt to try this puzzle again.");
    if (a.finished)
      throw Error(
        "This discovery is already in your notebook. Print a new ticket for another.",
      );
  }
  function usedMove(s) {
    const a = s.active,
      p = makePuzzle(a.ticket, a.round || 0);
    a.moves = (a.moves || 0) + 1;
    const limit = a.ticket.mods?.limitedMoves ? moveBudget(p) : 0;
    if (
      limit &&
      a.moves >= limit &&
      !checkPuzzle(p, p.type === "maze" ? a.position : a.answer)
    ) {
      a.failed = true;
      a.feedback =
        "The pocket is out of moves. The same puzzle is waiting whenever you want to restart.";
    }
  }
  async function begin(ticket, boss = false) {
    if (!validTicket(ticket) || ticket.type === "community")
      throw Error("This ticket belongs on the planning board.");
    const s = structuredClone(ctx.getState());
    s.active = attempt(ticket, boss);
    s.updated = Date.now();
    await store(s, false);
    go("wonder/" + ticket.id);
  }
  function readAnswer(a, p) {
    if (p.type === "maze") return a.position || 0;
    if (["memory", "pairs", "sequence", "circuit"].includes(p.type))
      return a.answer || [];
    if (p.type === "locks")
      return [...document.querySelectorAll("[data-u-dial]")].map(
        (el) => +el.value,
      );
    if (p.type === "balance")
      return [...document.querySelectorAll("[data-u-weight]")].map(
        (el) => +el.value,
      );
    if (p.type === "observe") return a.answer;
    return $("#u-answer")?.value ?? a.answer;
  }
  async function check() {
    const s = structuredClone(ctx.getState()),
      a = s.active;
    requireAttempt(a);
    const p = makePuzzle(a.ticket, a.round || 0);
    const answer = readAnswer(a, p);
    a.answer = answer;
    if (!checkPuzzle(p, answer)) {
      a.mistakes++;
      if (a.ticket.mods?.oneTry) a.failed = true;
      a.feedback =
        p.type === "balance"
          ? "The scale is not balanced yet. Try another combination."
          : p.type === "maze"
            ? "The exit is still a little further along."
            : "Not quite this time. A clean page and another look are always allowed.";
      s.updated = Date.now();
      await store(s);
      return;
    }
    if (a.boss && (a.round || 0) < 2) {
      a.round = (a.round || 0) + 1;
      a.ticket.type = ["cipher", "balance", "pattern"][a.round];
      a.ticket.title = [
        "The misplaced message",
        "The merchant’s scales",
        "The next small signal",
      ][a.round];
      a.answer =
        a.ticket.type === "balance"
          ? makePuzzle(a.ticket, a.round).values.map(() => 0)
          : "";
      a.feedback = "Filed correctly. The Bureaucrat has found another form.";
      a.hint = "";
      a.phase = "preview";
      s.updated = Date.now();
      await store(s);
      return;
    }
    const data = {
      type: a.boss ? "boss" : a.ticket.type,
      region: a.ticket.region,
      level: a.ticket.level,
      title: a.boss ? "The Bureaucrat of Impossible Errands" : a.ticket.title,
      seconds: Math.floor((Date.now() - a.started) / 1000),
      assisted: !!a.hinted,
    };
    const key = a.boss
      ? `boss-${a.ticket.seed}-${a.ticket.level}`
      : a.ticket.id;
    const result = reward(s, key, data);
    const final = result.state;
    if (a.boss && result.fresh)
      final.inventory.crown = (final.inventory.crown || 0) + 1;
    final.active.feedback = result.fresh
      ? "A discovery, properly kept."
      : "You have already kept this discovery. Try another ticket for a new reward.";
    final.active.finished = true;
    await store(final);
    ctx.celebrate();
    ctx.showModal(
      result.fresh
        ? "A small discovery. A larger possibility."
        : "An old friend of a discovery.",
      `<p>${result.fresh ? "Your atlas remembers this one." : "This ticket was already completed. Its rewards stay safely in your backpack."}</p>${result.fresh ? `<div class="u-result-loot"><span>◈ ${result.loot.coins} coins</span><span>${ITEMS[result.loot.material].symbol} 2 ${ITEMS[result.loot.material].name.toLowerCase()}s</span>${result.loot.egg ? "<span>◉ A curious egg</span>" : ""}</div>` : ""}<p>${e(stats(final).town)}. ${a.boss ? "The Bureaucrat hands you a very small crown." : ""}</p><div class="u-result-next"><button class="u-button" data-u-action="go" data-id="home">Back to the atlas ↗</button><button class="u-button" data-u-action="go" data-id="universe/inventory">Open my backpack</button><button class="u-button" data-u-action="go" data-id="universe/machine">Another small adventure</button></div>`,
    );
  }
  const actions = {
    ...fieldworkActions(ctx, { send, store, go, machineSettings }),
    go: async (b) => go(b.dataset.id),
    "persona-save": async () => {
      await send("persona", {
        name: $("#u-name").value,
        title: $("#u-title").value,
        class: $("#u-class").value,
        mood: $("#u-mood").value,
        chaos: +$("#u-chaos").value,
        minutes: +$("#u-minutes").value,
        level: +$("#u-level").value,
        skin: $("#u-skin").value,
      });
      ctx.toast("Passport stamped. Curiosity remains unrestricted.");
    },
    night: () => send("night"),
    visit: async (b) => {
      await send("visit", { id: b.dataset.id });
      ctx.toast("Charted. The atlas remembers this corner.");
    },
    "region-play": async (b) => {
      const id = b.dataset.id;
      if (!regionOpen(ctx.getState(), id))
        throw Error("This route has not opened yet.");
      await send("visit", { id }, false);
      const s = ctx.getState(),
        r = REGIONS.find((r) => r.id === id),
        seed =
          1 +
          ((s.seed +
            s.machine.rolls * 3571 +
            stats(s).wins * 7919 +
            REGIONS.indexOf(r) * 101) %
            999999);
      const t = ticketFor(s, { region: id, type: r.type, seed });
      await begin(t);
    },
    roll: async () => {
      await machineSettings();
      await send("roll");
    },
    reroll: async () => {
      await machineSettings();
      await send("roll", { reroll: true });
    },
    accept: async () => {
      const s = ctx.getState(),
        t = s.machine.ticket;
      if (!t) return;
      if (t.type === "community") {
        go("play/" + t.kind + "-" + t.level + "-" + ((t.seed % 500) + 1));
        return;
      }
      await begin(t);
    },
    craft: async (b) => {
      await send("craft", { id: b.dataset.id });
      ctx.toast("A little less scrap. A little more possibility.");
    },
    favourite: async (b) => send("favourite", { id: b.dataset.id }),
    inspect: async (b) => {
      const id = b.dataset.id,
        it = ITEMS[id];
      if (!it) return;
      ctx.showModal(
        it.name,
        `<div class="u-ink-glyph">${it.symbol}</div><p>${e(it.lore)}</p><p class="u-mini-toast">${e(it.kind)} · ${ctx.getState().inventory[id] || 0} in your backpack</p><button class="u-button" data-u-action="close">Keep it safe</button>`,
      );
    },
    close: async () => ctx.modal.close(),
    use: async (b) => {
      await send("use", { id: b.dataset.id });
      ctx.toast(
        b.dataset.id === "egg"
          ? "Someone new has arrived. Visit your companions."
          : "The machine is ready for another second thought.",
      );
    },
    equip: async (b) => send("equip", { id: b.dataset.id }),
    pet: async (b) => {
      await send("pet", { id: b.dataset.id });
      ctx.toast("A small kindness. Fondly remembered.");
    },
    feed: async (b) => {
      await send("feed", { id: b.dataset.id });
      ctx.toast("A biscuit shared. A friendship improved.");
    },
    "pet-details": async (b) => {
      const id = b.dataset.id,
        pet = ctx.getState().companions[id];
      if (!pet) return;
      ctx.showModal(
        "A name that fits.",
        `<label>Companion name<input id="u-pet-name" maxlength="30" value="${e(pet.name)}"></label><label>Favourite habitat<select id="u-pet-habitat">${CREATURES.map((c) => `<option ${c.habitat === pet.habitat ? "selected" : ""}>${c.habitat}</option>`).join("")}</select></label><button class="u-button" data-u-action="pet-save" data-id="${id}" style="margin-top:20px">Keep these little details</button>`,
      );
    },
    "pet-save": async (b) => {
      const name = $("#u-pet-name").value,
        habitat = $("#u-pet-habitat").value;
      await send("rename", { id: b.dataset.id, name }, false);
      await send("habitat", { id: b.dataset.id, habitat });
      ctx.modal.close();
    },
    furnish: async (b) => {
      const slot = +b.dataset.id,
        s = ctx.getState();
      ctx.showModal(
        "A little room for something.",
        `<p>Choose an object for position ${slot + 1}. Removing furniture puts it back in your backpack.</p><label>Furnishing<select id="u-furniture"><option value="">Leave this position empty</option>${Object.entries(
          ITEMS,
        )
          .filter(
            ([id, it]) =>
              it.kind === "Furniture" &&
              (s.inventory[id] > 0 || s.home.slots[slot] === id),
          )
          .map(
            ([id, it]) =>
              `<option value="${id}" ${s.home.slots[slot] === id ? "selected" : ""}>${it.name} (${(s.inventory[id] || 0) + (s.home.slots[slot] === id ? 1 : 0)} available)</option>`,
          )
          .join(
            "",
          )}</select></label><button class="u-button" data-u-action="place" data-id="${slot}" style="margin-top:20px">Put it here ↗</button>`,
      );
    },
    place: async (b) => {
      const slot = +b.dataset.id,
        id = $("#u-furniture").value;
      if (ctx.getState().home.slots[slot] === id) {
        ctx.modal.close();
        return;
      }
      await send("home", { slot, id });
      ctx.modal.close();
    },
    "room-save": async () => {
      await send("room", {
        theme: $("#u-room-theme").value,
        light: $("#u-room-light").value,
      });
      ctx.toast("There is no place quite like this one.");
    },
    note: async () => {
      await send("note", {
        text: $("#u-note").value,
        region: $("#u-note-region").value,
      });
      ctx.toast("Kept between the pages.");
    },
    talk: async (b) => {
      const [id, choice] = b.dataset.id.split("|");
      await send("talk", { id, choice });
      const lines = {
        listen: "“Thank you. Most people hurry past the quiet bits.”",
        help: "“That would be lovely. The errand is written just below.”",
        question:
          id === "vesper"
            ? "“Open sesame. Traditional, I know. Bring my rune.”"
            : "“There is a letter addressed to somewhere better. I suspect you should deliver it.”",
      };
      ctx.toast(lines[choice]);
    },
    "npc-claim": async (b) => {
      await send("npc-claim", { id: b.dataset.id });
      ctx.toast("A keepsake, and a person who remembers.");
    },
    door: async () => {
      await send("door", { phrase: $("#u-secret-phrase").value });
      ctx.toast("The door opens. A corner of the atlas turns gold.");
    },
    portal: async (b) => {
      await send("portal", { realm: +b.dataset.id }, false);
      go("universe/machine");
    },
    story: async (b) => send("story", { id: b.dataset.id }),
    "story-rewind": () => send("story-rewind"),
    journey: async () => {
      await send("journey");
      go("home");
      ctx.toast("A fresh map. All your old possibilities, safely kept.");
    },
    boss: async () => {
      const s = ctx.getState();
      if (stats(s).wins < 3) throw Error("Three discoveries open this door.");
      const t = ticketFor(s, {
        type: "cipher",
        region: "velvet",
        seed: 1 + ((s.seed + s.journeys * 7919) % 999999),
        level: s.persona.level,
      });
      t.title = "The Bureaucrat of Impossible Errands";
      await begin(t, true);
    },
    recall: async () => {
      const s = structuredClone(ctx.getState());
      if (!s.active) return;
      s.active.phase = "recall";
      s.active.answer = [];
      s.updated = Date.now();
      await store(s);
    },
    lantern: async (b) => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      if (!a) return;
      const p = makePuzzle(a.ticket, a.round || 0);
      a.answer = Array.isArray(a.answer) ? a.answer : [];
      if (a.answer.length >= p.sequence.length) return;
      a.answer.push(+b.dataset.id);
      s.updated = Date.now();
      await store(s);
    },
    "memory-reset": async () => {
      const s = structuredClone(ctx.getState());
      if (!s.active) return;
      s.active.answer = [];
      s.updated = Date.now();
      await store(s);
    },
    observe: async (b) => {
      const s = structuredClone(ctx.getState());
      if (!s.active) return;
      s.active.answer = +b.dataset.id;
      await store(s, false);
      await check();
    },
    move: async (b) => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      if (!a) return;
      const p = makePuzzle(a.ticket, a.round || 0);
      requireAttempt(a);
      const direction = a.ticket.mods?.mirror
        ? { left: "right", right: "left" }[b.dataset.id] || b.dataset.id
        : b.dataset.id;
      const previous = a.position || 0;
      a.position = mazeMove(p, previous, direction);
      if (a.position !== previous) usedMove(s);
      s.updated = Date.now();
      await store(s);
    },
    "pairs-ready": async () => {
      const s = structuredClone(ctx.getState());
      requireAttempt(s.active);
      s.active.phase = "recall";
      s.active.answer = [];
      s.active.pairOpen = [];
      s.updated = Date.now();
      await store(s);
    },
    pair: async (b) => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      requireAttempt(a);
      if (a.phase !== "recall") return;
      const p = makePuzzle(a.ticket, a.round || 0),
        index = +b.dataset.id;
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= p.cells.length ||
        a.answer.includes(index) ||
        (a.pairOpen || []).includes(index) ||
        (a.pairOpen || []).length >= 2
      )
        return;
      a.pairOpen = [...(a.pairOpen || []), index];
      if (
        a.pairOpen.length === 2 &&
        p.cells[a.pairOpen[0]] === p.cells[a.pairOpen[1]]
      ) {
        a.answer.push(...a.pairOpen);
        a.pairOpen = [];
      }
      usedMove(s);
      s.updated = Date.now();
      await store(s);
      if (checkPuzzle(p, a.answer)) await check();
    },
    "pair-clear": async () => {
      const s = structuredClone(ctx.getState());
      requireAttempt(s.active);
      s.active.pairOpen = [];
      s.updated = Date.now();
      await store(s);
    },
    circuit: async (b) => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      requireAttempt(a);
      const p = makePuzzle(a.ticket, a.round || 0);
      a.answer = circuitPress(a.answer, p.size, +b.dataset.id);
      usedMove(s);
      s.updated = Date.now();
      await store(s);
      if (checkPuzzle(p, a.answer)) await check();
    },
    sort: async (b) => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      requireAttempt(a);
      const [index, delta] = b.dataset.id.split("|").map(Number),
        j = index + delta;
      if (
        !Number.isInteger(index) ||
        ![-1, 1].includes(delta) ||
        j < 0 ||
        j >= a.answer.length
      )
        return;
      [a.answer[index], a.answer[j]] = [a.answer[j], a.answer[index]];
      usedMove(s);
      s.updated = Date.now();
      await store(s);
    },
    "check-wonder": check,
    "restart-wonder": async () => {
      const s = structuredClone(ctx.getState()),
        old = s.active;
      if (!old) return;
      s.active = attempt(old.ticket, old.boss);
      s.active.round = old.round || 0;
      s.active.hinted = old.hinted;
      s.active.started = old.started;
      s.active.mistakes = old.mistakes;
      s.updated = Date.now();
      await store(s);
    },
    hint: async () => {
      const s = structuredClone(ctx.getState()),
        a = s.active;
      if (!a) return;
      requireAttempt(a);
      if (a.ticket.mods?.noHints)
        throw Error(
          "This ticket uses the no-hints recipe. Restart or print another ticket to change the rules.",
        );
      const p = makePuzzle(a.ticket, a.round || 0);
      const hints = {
        cipher: `Read the alphabet backwards by ${p.shift} positions. The first decoded letter is ${p.answer?.[0]}.`,
        pattern: p.rule,
        balance: `One possible set of token counts is ${p.solution?.join(", ")} in displayed order.`,
        memory:
          "You can restart the card to study the order again. No time limit, and no penalty.",
        observe: `The different symbol is in row ${Math.floor((p.index || 0) / 4) + 1}.`,
        maze: "The top edge and the right edge form a guaranteed route. Interior passages may be shorter.",
      };
      const extra = {
        detective: `The clerk’s notes all describe ${p.people?.[p.answer]?.name}. Compare that visitor’s row against each note.`,
        locks: `One working code is ${p.digits?.join(" · ")}. Check the relationship between each wheel.`,
        pairs:
          "Use the drawer positions as landmarks. Clear an incorrect pair before trying two new drawers.",
        sequence: p.order
          ? `One correct order is ${p.order.map((id) => p.labels[id]).join(" → ")}.`
          : "",
        circuit: p.solution
          ? `From a clean page, press lanterns ${p.solution.map((i) => i + 1).join(", ")} once each. The order does not matter.`
          : "",
        riddle: p.hint,
      };
      a.hint = hints[p.type] || extra[p.type];
      a.hinted = true;
      s.updated = Date.now();
      await store(s);
    },
  };
  async function machineSettings() {
    const p = {
      level: +$("#u-machine-level").value,
      mood: $("#u-machine-mood").value,
    };
    await send("persona", p, false);
    await send(
      "machine",
      {
        type: $("#u-machine-type").value,
        realm: +$("#u-machine-realm").value,
        mods:
          $("#u-machine-type").value === "community"
            ? normaliseMods()
            : Object.fromEntries(
                [...document.querySelectorAll("[data-u-mod]")].map((el) => [
                  el.dataset.uMod,
                  el.checked,
                ]),
              ),
      },
      false,
    );
  }
  document.addEventListener("click", async (event) => {
    const b = event.target.closest("[data-u-action]");
    if (!b || b.disabled || busy) return;
    const fn = actions[b.dataset.uAction];
    if (!fn) return;
    event.preventDefault();
    busy = true;
    try {
      await fn(b);
    } catch (error) {
      ctx.toast(
        error.message || "The map needs a moment. Your notebook is safe.",
      );
    } finally {
      busy = false;
    }
  });
  document.addEventListener("change", (event) => {
    if (event.target.id === "u-machine-type" && $("#u-modifiers"))
      $("#u-modifiers").disabled = event.target.value === "community";
  });
  document.addEventListener("input", (event) => {
    const el = event.target;
    if (el.id === "u-note-search") {
      const q = el.value.toLowerCase();
      document
        .querySelectorAll("[data-note-text]")
        .forEach((n) => (n.hidden = !n.dataset.noteText.includes(q)));
      return;
    }
    if (
      el.id === "u-answer" ||
      el.dataset.uWeight !== undefined ||
      el.dataset.uDial !== undefined
    ) {
      const s = structuredClone(ctx.getState());
      if (!s.active || s.active.failed) return;
      if (el.dataset.uDial !== undefined) {
        s.active.answer = Array.isArray(s.active.answer)
          ? s.active.answer
          : makePuzzle(s.active.ticket).digits.map(() => 0);
        s.active.answer[+el.dataset.uDial] = +el.value;
      } else if (el.id === "u-answer") s.active.answer = el.value;
      else {
        const p = makePuzzle(s.active.ticket, s.active.round || 0);
        s.active.answer = Array.isArray(s.active.answer)
          ? s.active.answer
          : p.values.map(() => 0);
        s.active.answer[+el.dataset.uWeight] = +el.value;
        const scale = $(".u-scale>span");
        if (scale)
          scale.textContent = p.values.reduce(
            (n, v, i) => n + v * (s.active.answer[i] || 0),
            0,
          );
      }
      s.updated = Date.now();
      ctx
        .setState(s)
        .catch(() =>
          ctx.toast("Could not save this attempt. Keep this page open."),
        );
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      !location.hash.startsWith("#wonder/") ||
      ctx.modal.open ||
      /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)
    )
      return;
    const a = ctx.getState().active;
    if (!a || a.ticket.type !== "maze") return;
    const d = {
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowDown: "down",
      ArrowRight: "right",
    }[event.key];
    if (d) {
      event.preventDefault();
      if (!busy) actions.move({ dataset: { id: d } });
    }
  });
  return { begin, check };
}
