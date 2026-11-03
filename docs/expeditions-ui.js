import { MODIFIERS, normaliseMods, moveBudget, EXTRA_NAMES } from "./expeditions.js?v=10";
const e = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const button = (action, label, id = "", cls = "") =>
  `<button class="u-button ${cls}" type="button" data-u-action="${action}" data-id="${e(id)}">${label}</button>`;
export function modifierControls(s) {
  const mods = normaliseMods(s.machine.mods);
  return `<fieldset class="x-modifiers" id="u-modifiers" ${s.machine.type === "community" ? "disabled" : ""}><legend>A little complication, if you like.</legend><p>Optional rules for wonder games. Community planning keeps its original constraints.</p>${MODIFIERS.map((m) => `<label><input type="checkbox" data-u-mod="${m.id}" ${mods[m.id] ? "checked" : ""}><span><b>${m.name}</b><small>${m.description}</small></span></label>`).join("")}</fieldset><div class="x-machine-extras"><a href="#universe/recipes">Your challenge-recipe wallet ↗</a>${button("recipe-dialog", "Save these dials as a recipe", "", "u-quiet")}</div>`;
}
export function activeRuleBadges(a, p) {
  const mods = normaliseMods(a.ticket.mods),
    budget = mods.limitedMoves ? moveBudget(p) : 0;
  return `<div class="x-active-rules">${MODIFIERS.filter(
    (m) =>
      mods[m.id] &&
      (m.id !== "fog" || p.type === "maze") &&
      (m.id !== "mirror" ||
        ["maze", "observe", "pairs", "circuit"].includes(p.type)) &&
      (m.id !== "limitedMoves" || budget),
  )
    .map((m) => `<span>${m.name}</span>`)
    .join(
      "",
    )}${budget ? `<b>${a.moves || 0} / ${budget} moves</b>` : ""}</div>${a.failed ? '<div class="x-failed" role="status">This attempt has reached its limit. A fresh attempt keeps the same puzzle. Nothing in your backpack is lost.</div>' : ""}`;
}
export function extraGameBody(p, a) {
  if (p.type === "detective")
    return `<p>A parcel arrived without a name. Only one of these visitors fits <em>all</em> the clerk’s notes. Who brought it?</p><div class="x-clues">${p.clues.map((c, i) => `<p><b>0${i + 1}</b> ${e(c.text)}</p>`).join("")}</div><div class="table-scroll"><table class="x-suspects"><thead><tr><th>Visitor</th><th>Arrival hour</th><th>Parcel kg</th><th>Floor</th></tr></thead><tbody>${p.people.map((person) => `<tr><td>${person.name}</td><td>${person.hour}:00</td><td>${person.weight}</td><td>${person.floor}</td></tr>`).join("")}</tbody></table></div><label>The visitor who fits every note<select id="u-answer"><option value="">Choose a visitor…</option>${p.people.map((person, i) => `<option value="${i}" ${String(a.answer) === String(i) ? "selected" : ""}>${person.name}</option>`).join("")}</select></label>`;
  if (p.type === "locks")
    return `<p>The door has ${p.digits.length} wheels and a very particular sense of humour. Set the digits so every inscription is true.</p><div class="x-lock-art" aria-hidden="true">⌑ <span>THE DEPARTMENT OF UNNECESSARY LOCKS</span> ⌑</div><div class="x-clues">${p.clues.map((c, i) => `<p><b>0${i + 1}</b> ${e(c)}</p>`).join("")}</div><div class="x-dials">${p.digits.map((_, i) => `<label>Wheel ${i + 1}<input type="number" inputmode="numeric" min="0" max="9" data-u-dial="${i}" value="${Array.isArray(a.answer) ? a.answer[i] || 0 : 0}"></label>`).join("")}</div>`;
  if (p.type === "pairs") {
    const preview = a.phase !== "recall",
      matched = Array.isArray(a.answer) ? a.answer : [],
      open = a.pairOpen || [];
    return `<p>${preview ? "Study the cabinet for as long as you like. Then close it and find the matching objects." : "Open two drawers at a time. Match the objects and keep the pair. An incorrect pair can be closed without rushing."}</p><div class="x-pairs ${a.ticket.mods?.mirror ? "x-mirror" : ""}">${p.cells
      .map((symbol, i) => {
        const shown = preview || matched.includes(i) || open.includes(i);
        return `<button type="button" data-u-action="pair" data-id="${i}" class="${matched.includes(i) ? "matched" : ""}" ${preview || matched.includes(i) || open.includes(i) ? "disabled" : ""} aria-label="Drawer ${i + 1}${shown ? ": " + e(symbol) : ", closed"}"><span>${shown ? symbol : "?"}</span></button>`;
      })
      .join(
        "",
      )}</div>${preview ? button("pairs-ready", "Close the cabinet. I am ready ↗") : `<div class="x-pair-status" aria-live="polite">${matched.length / 2} of ${p.cells.length / 2} pairs found.</div>${open.length === 2 ? button("pair-clear", "Close these drawers", "", "u-quiet") : ""}`}`;
  }
  if (p.type === "sequence") {
    const order =
      Array.isArray(a.answer) && a.answer.length === p.order.length
        ? a.answer
        : p.initial;
    return `<p>The errand office has shuffled its timetable. Put the cards in an order that satisfies every note.</p><details class="x-clue-fold" open><summary>The clerk’s notes</summary>${p.clues.map((c) => `<p>${e(c)}</p>`).join("")}</details><ol class="x-order">${order.map((id, i) => `<li><span><small>0${i + 1}</small>${e(p.labels[id])}</span><div><button class="u-button" data-u-action="sort" data-id="${i}|-1" ${i === 0 ? "disabled" : ""} aria-label="Move ${e(p.labels[id])} earlier">↑</button><button class="u-button" data-u-action="sort" data-id="${i}|1" ${i === order.length - 1 ? "disabled" : ""} aria-label="Move ${e(p.labels[id])} later">↓</button></div></li>`).join("")}</ol>`;
  }
  if (p.type === "circuit") {
    const cells =
      Array.isArray(a.answer) && a.answer.length === p.cells.length
        ? a.answer
        : p.cells;
    return `<p>Switch every lantern <b>off</b>. A switch changes itself and its immediate neighbours above, below, left and right. Corners have fewer neighbours.</p><div class="x-circuit ${a.ticket.mods?.mirror ? "x-mirror" : ""}" style="--size:${p.size}">${cells.map((on, i) => `<button type="button" class="${on ? "lit" : ""}" data-u-action="circuit" data-id="${i}" aria-label="Lantern ${i + 1}, ${on ? "lit" : "dark"}" aria-pressed="${!!on}"><span>${on ? "✦" : "·"}</span></button>`).join("")}</div><p class="x-circuit-status" aria-live="polite">${cells.filter(Boolean).length} lanterns still glowing.</p>`;
  }
  if (p.type === "riddle")
    return `<div class="x-riddle-door" aria-hidden="true">◇</div><blockquote class="x-riddle">${e(p.question)}</blockquote><label>Your answer to the door<input id="u-answer" autocomplete="off" maxlength="100" value="${e(a.answer || "")}" placeholder="A little thought goes a long way…"></label>`;
  return "";
}
export function mapAnnotations(s) {
  return `${
    s.fieldwork.showPins
      ? s.fieldwork.pins
          .filter((p) => !p.archived)
          .map(
            (p, i) =>
              `<button class="x-map-pin" data-u-action="pin-inspect" data-id="${p.id}" style="left:${p.x}%;top:${p.y}%" aria-label="Your marker: ${e(p.title)}"><span>${["clue", "cozy", "return", "secret"].indexOf(p.kind) + 1}</span><small>${e(p.title)}</small></button>`,
          )
          .join("")
      : ""
  }`;
}
function cartography(s) {
  const f = s.fieldwork;
  return `<div class="x-page-intro"><span>✣</span><div><h2>Your map. Your marginalia.</h2><p>Pin a clue, mark a cosy corner or leave a reminder to return. Positions are percentages of your atlas, so the annotations travel with the map.</p></div></div><div class="x-tools">${button("pin-dialog", "Leave a mark ↗")}${button("pin-layer", f.showPins ? "Hide my atlas annotations" : "Show my atlas annotations", "", "u-quiet")}</div><div class="x-pin-ledger">${f.pins.length ? f.pins.map((p) => `<article class="${p.archived ? "put-away" : ""}"><div><small>${e(p.kind.toUpperCase())} / ${p.x}% EAST · ${p.y}% SOUTH</small><h3>${e(p.title)}</h3><p>${e(p.note || "A place worth remembering.")}</p></div><div>${button("pin-inspect", "Read annotation", p.id, "u-quiet")}${button("pin-archive", p.archived ? "Restore to atlas" : "Put away", p.id, "u-quiet")}</div></article>`).join("") : '<p class="x-empty-note">The margin is waiting for your first mark.</p>'}</div>`;
}
function casebook(s) {
  const f = s.fieldwork,
    active = f.clues.filter((c) => !c.archived),
    links = f.links.filter(
      (l) =>
        !l.archived &&
        active.some((c) => c.id === l.from) &&
        active.some((c) => c.id === l.to),
    ),
    rows = Math.max(1, Math.ceil(active.length / 3));
  const point = (id) => {
    const i = active.findIndex((c) => c.id === id);
    return { x: 150 + (i % 3) * 300, y: 110 + Math.floor(i / 3) * 250 };
  };
  return `<div class="x-page-intro"><span>⌘</span><div><h2>The connections are yours to make.</h2><p>Keep fictional clues, people, places and theories here. Link two notes with a reason, then stamp a theory when you have resolved it.</p></div></div><div class="x-tools">${button("clue-dialog", "Pin a new clue ↗")}${button("link-dialog", "Tie two clues together", "", "u-quiet")}${button("postcard-clue", "Pin my lost postcard", "", "u-quiet")}${button("recap", "What was I doing?", "", "u-quiet")}</div>${
    active.length
      ? `<div class="x-caseboard" style="--board-height:${rows * 250}px"><svg viewBox="0 0 900 ${rows * 250}" preserveAspectRatio="none" aria-hidden="true">${links
          .map((l) => {
            const a = point(l.from),
              b = point(l.to);
            return `<path d="M${a.x} ${a.y} Q${(a.x + b.x) / 2 + 40} ${(a.y + b.y) / 2 - 60} ${b.x} ${b.y}"/>`;
          })
          .join(
            "",
          )}</svg>${active.map((c, i) => `<article class="x-evidence ${c.solved ? "resolved" : ""}" style="--col:${i % 3};--row:${Math.floor(i / 3)}"><span class="x-tack" aria-hidden="true"></span><small>${e(c.kind.toUpperCase())} / ${c.solved ? "RESOLVED ✓" : "A WORKING THEORY"}</small><h3>${e(c.title)}</h3><p>${e(c.text)}</p><div>${button("clue-solved", c.solved ? "Reopen" : "Stamp resolved", c.id, "u-quiet")}${button("clue-archive", "Put away", c.id, "u-quiet")}</div></article>`).join("")}</div>`
      : '<div class="x-case-empty">✉<h2>Every mystery starts<br>with something small.</h2><p>Pin your first observation. No conspiracy required.</p></div>'
  }<section class="x-connections"><h2>The thread between things.</h2>${links.length ? links.map((l) => `<article><p><b>${e(active.find((c) => c.id === l.from).title)}</b><span> ${e(l.label)} → </span><b>${e(active.find((c) => c.id === l.to).title)}</b></p>${button("link-archive", "Untie thread", l.id, "u-quiet")}</article>`).join("") : "<p>Connections appear here in words as well as on the board.</p>"}</section>${
    f.clues.some((c) => c.archived)
      ? `<details class="x-archive"><summary>Clues put away for later</summary>${f.clues
          .filter((c) => c.archived)
          .map(
            (c) =>
              `<div><span>${e(c.title)}</span>${button("clue-archive", "Restore clue", c.id, "u-quiet")}</div>`,
          )
          .join("")}</details>`
      : ""
  }`;
}
function recipes(s) {
  return `<section class="x-recipe-letter"><span>THE WALLET OF QUESTIONABLE IDEAS</span><h2>A challenge, mixed to taste.</h2><p>Keep up to twelve combinations of puzzle type, difficulty and optional rules. A recipe changes the next ticket; it does not edit a puzzle already in progress.</p><div class="x-tools">${button("preset", "A quiet pocket break", "cozy")}${button("preset", "Looking-glass lanterns", "mirror")}${button("preset", "Goblin paperwork", "goblin")}</div></section><div class="x-saved-recipes">${
    s.fieldwork.recipes.length
      ? s.fieldwork.recipes
          .map(
            (r) =>
              `<article><small>RECIPE / LEVEL ${r.level + 1}</small><h3>${e(r.name)}</h3><p>${e(EXTRA_NAMES[r.type] || r.type)} · ${
                MODIFIERS.filter((m) => r.mods[m.id])
                  .map((m) => m.name)
                  .join(" · ") || "Original rules"
              }</p>${button("recipe-apply", "Load the machine ↗", r.id)}${button("recipe-remove", "Remove recipe", r.id, "u-quiet")}</article>`,
          )
          .join("")
      : "<p>No recipes in your wallet yet. Set the machine’s dials, then save your combination.</p>"
  }</div><a href="#universe/machine" class="u-button">Back to the machine ↗</a>`;
}
export function fieldworkPage(s, tab) {
  return tab === "casebook"
    ? casebook(s)
    : tab === "cartography"
      ? cartography(s)
      : recipes(s);
}
