import { ITEMS, REGIONS, MINI_NAMES } from "./universe.js?v=10";
import { normaliseMods, MODIFIERS } from "./expeditions.js?v=10";
const e = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function fieldworkActions(ctx, { send, store, go, machineSettings }) {
  const $ = (s) => document.querySelector(s),
    close = () => ctx.modal.close();
  return {
    "pin-dialog": async () =>
      ctx.showModal(
        "Leave a little marginalia.",
        `<label>A name for this spot<input id="x-pin-title" maxlength="60" placeholder="The door with the odd inscription"></label><label>A note<textarea id="x-pin-note" maxlength="500" placeholder="Come back when I have the rune…"></textarea></label><div class="form-grid"><label>Kind<select id="x-pin-kind">${["clue", "cozy", "return", "secret"].map((x) => `<option>${x}</option>`).join("")}</select></label><label>East, across the map (%)<input id="x-pin-x" type="number" min="8" max="92" value="50"></label><label>South, down the map (%)<input id="x-pin-y" type="number" min="22" max="86" value="50"></label></div><p class="tiny muted">Keep your annotations fictional. Every marker can be put away and restored.</p><button class="u-button" data-u-action="pin-save">Pin it to the atlas ↗</button>`,
      ),
    "pin-save": async () => {
      await send("map-pin", {
        title: $("#x-pin-title").value,
        note: $("#x-pin-note").value,
        kind: $("#x-pin-kind").value,
        x: +$("#x-pin-x").value,
        y: +$("#x-pin-y").value,
      });
      close();
      ctx.toast("A small mark, safely kept.");
    },
    "pin-archive": async (b) => send("pin-archive", { id: b.dataset.id }),
    "pin-layer": () => send("pin-layer"),
    "pin-inspect": async (b) => {
      const p = ctx
        .getState()
        .fieldwork.pins.find((p) => p.id === b.dataset.id);
      if (!p) return;
      ctx.showModal(
        p.title,
        `<span class="u-label">${e(p.kind.toUpperCase())} / ${p.x}% EAST · ${p.y}% SOUTH</span><p style="white-space:pre-wrap">${e(p.note || "A spot worth remembering.")}</p><button class="u-button" data-u-action="pin-put-away" data-id="${p.id}">${p.archived ? "Restore to atlas" : "Put this marker away"}</button>`,
      );
    },
    "pin-put-away": async (b) => {
      await send("pin-archive", { id: b.dataset.id });
      close();
    },
    "clue-dialog": async () =>
      ctx.showModal(
        "Something worth a second look.",
        `<label>Clue title<input id="x-clue-title" maxlength="80" placeholder="The envelope with no address"></label><label>What you noticed<textarea id="x-clue-text" maxlength="1200" placeholder="The ink looks familiar…"></textarea></label><label>Kind<select id="x-clue-kind">${["person", "place", "object", "theory"].map((x) => `<option>${x}</option>`).join("")}</select></label><p class="tiny muted">This is your fictional casebook. Your theories do not change a puzzle’s rules.</p><button class="u-button" data-u-action="clue-save">Pin it to the board ↗</button>`,
      ),
    "clue-save": async () => {
      await send("clue-add", {
        title: $("#x-clue-title").value,
        text: $("#x-clue-text").value,
        kind: $("#x-clue-kind").value,
      });
      close();
    },
    "clue-solved": async (b) => send("clue-solved", { id: b.dataset.id }),
    "clue-archive": async (b) => send("clue-archive", { id: b.dataset.id }),
    "link-dialog": async () => {
      const clues = ctx.getState().fieldwork.clues.filter((c) => !c.archived);
      if (clues.length < 2)
        throw Error("Pin two clues before tying a thread between them.");
      const opts = clues
        .map((c) => `<option value="${c.id}">${e(c.title)}</option>`)
        .join("");
      ctx.showModal(
        "A thread between two things.",
        `<label>From this clue<select id="x-link-from">${opts}</select></label><label>Your reason<input id="x-link-label" maxlength="120" placeholder="might explain why"></label><label>To this clue<select id="x-link-to">${opts}</select></label><p class="tiny muted">The connection is saved in words as well as on the board.</p><button class="u-button" data-u-action="link-save">Tie the thread ↗</button>`,
      );
    },
    "link-save": async () => {
      await send("clue-link", {
        from: $("#x-link-from").value,
        to: $("#x-link-to").value,
        label: $("#x-link-label").value,
      });
      close();
    },
    "link-archive": async (b) => send("link-archive", { id: b.dataset.id }),
    "postcard-clue": async () => {
      const s = ctx.getState();
      if (!s.inventory.postcard)
        throw Error(
          "Find a lost postcard by completing your first quest or helping Fern.",
        );
      if (s.fieldwork.clues.some((c) => c.title === "The lost postcard"))
        throw Error(
          "The postcard is already in your casebook. Restore it from the archive if needed.",
        );
      await send("clue-add", {
        title: "The lost postcard",
        text: ITEMS.postcard.lore,
        kind: "object",
      });
    },
    recap: async () => {
      const s = ctx.getState(),
        last = Object.values(s.completed).sort((a, b) => b.at - a.at)[0],
        next = REGIONS.find((r) => r.need > Object.keys(s.completed).length);
      ctx.showModal(
        "Here is where you left the thread.",
        `<p>${s.active && !s.active.finished ? `Your unfinished ticket is <b>${e(s.active.ticket.title)}</b>.` : "There is no unfinished wonder ticket waiting."}</p><p>${last ? `Your most recent discovery was <b>${e(last.title)}</b>.` : "Your first discovery is still ahead."}</p><p>${next ? `${e(next.name)} opens after ${next.need} completed quests.` : "Every main district is now within reach."}</p><div class="actions">${s.active && !s.active.finished ? `<button class="u-button" data-u-action="go" data-id="wonder/${s.active.ticket.id}">Resume my ticket ↗</button>` : ""}<button class="u-button" data-u-action="go" data-id="universe/machine">Find the next thread ↗</button></div>`,
      );
    },
    "recipe-dialog": async () => {
      await machineSettings();
      const s = ctx.getState();
      ctx.showModal(
        "A recipe for a particular sort of afternoon.",
        `<label>Recipe name<input id="x-recipe-name" maxlength="50" placeholder="A very determined goblin"></label><p>${e(MINI_NAMES[s.machine.type] || s.machine.type)} · difficulty ${s.persona.level + 1}</p><p>${
          MODIFIERS.filter((m) => s.machine.mods[m.id])
            .map((m) => m.name)
            .join(" · ") || "Original rules. A perfectly good recipe."
        }</p><button class="u-button" data-u-action="recipe-save">Keep in my wallet ↗</button>`,
      );
    },
    "recipe-save": async () => {
      const s = ctx.getState();
      await send("recipe-save", {
        name: $("#x-recipe-name").value,
        type: s.machine.type,
        level: s.persona.level,
        mods: s.machine.mods,
      });
      close();
      ctx.toast("A good combination, kept for another day.");
    },
    "recipe-remove": async (b) => send("recipe-remove", { id: b.dataset.id }),
    "recipe-apply": async (b) => {
      await send("recipe-apply", { id: b.dataset.id }, false);
      go("universe/machine");
      ctx.toast("Dials set. Turn the handle whenever you are ready.");
    },
    preset: async (b) => {
      const p = {
        cozy: { type: "pairs", level: 0, mods: {} },
        mirror: {
          type: "circuit",
          level: 1,
          mods: { mirror: true, limitedMoves: true },
        },
        goblin: {
          type: "detective",
          level: 3,
          mods: { noHints: true, oneTry: true },
        },
      }[b.dataset.id];
      if (!p) return;
      await send("persona", { level: p.level }, false);
      await send(
        "machine",
        {
          type: p.type,
          realm: ctx.getState().machine.realm,
          mods: normaliseMods(p.mods),
        },
        false,
      );
      go("universe/machine");
    },
  };
}
