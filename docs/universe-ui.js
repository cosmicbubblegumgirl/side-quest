import {
  REGIONS,
  REALMS,
  CLASSES,
  MOODS,
  MINI_TYPES,
  MINI_NAMES,
  ITEMS,
  RECIPES,
  CREATURES,
  NPCS,
  STORY,
  stats,
  regionOpen,
  achievements,
  npcReady,
  makePuzzle,
} from "./universe.js?v=9";
const e = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const btn = (action, text, id = "", cls = "") =>
  `<button type="button" class="u-button ${cls}" data-u-action="${action}" data-id="${e(id)}">${text}</button>`;
const tag = (text) => `<span class="u-label">${text}</span>`;
const option = (values, current) =>
  values
    .map(
      (v) =>
        `<option value="${e(v)}" ${v === current ? "selected" : ""}>${e(v)}</option>`,
    )
    .join("");
const count = (s) => Object.keys(s.completed).length;
const levelNames = ["Cozy", "Curious", "Spicy", "Goblin mode"];
export function creatureArt(id = "moth", bond = 0) {
  const c = CREATURES.find((c) => c.id === id) || CREATURES[0];
  const details = {
    moth: `<path d="M74 83C7 102 11 25 56 35l24 32 24-32c45-10 49 67-18 48" fill="${c.color}"/><path d="M60 44q-30 6-13 33m53-33q30 6 13 33" opacity=".5"/><path d="M62 55q-12-16-3-24m39 24q12-16 3-24"/>`,
    mossling: `<path d="M58 57Q25 53 34 25q30 0 36 26m17 2q4-35 32-31 11 28-20 39" fill="${c.color}"/><path d="m38 31 27 23m48-25L93 56" stroke="#63896b"/>`,
    cloudlet: `<path d="M51 78C21 72 31 45 47 47c-7-30 32-37 40-16 20-19 44 1 35 18 25 1 30 32 4 37" fill="${c.color}"/><path d="m47 98-5 9m73-6 5 9" stroke="#799caa"/>`,
    inkling: `<path d="M57 62q7-38 30-50-5 35 20 48m-52 39q-24 27-31 4 9 8 26-17" fill="${c.color}"/><path d="M103 35q4 8 0 12-8-2 0-12" fill="#6f5c94"/>`,
    coglet: `<path d="m47 61-9-7 7-13 10 3 8-8-2-11 15-4 5 10h10l6-9 13 7-4 10 8 8 12-2 4 15-11 4" fill="${c.color}"/><path d="M46 91H29v-9m86 9h17v-9"/>`,
    sprout: `<path d="M80 60V24m0 15Q51 39 48 19q25-4 32 16 9-28 33-24 2 27-32 28" fill="${c.color}"/><path d="m48 91 9 28h45l10-28" fill="#bb8b6e"/>`,
    wisp: `<path d="M55 91q-4 23 9 24l9-9 10 10 8-10 15 7q1-19-3-28" fill="${c.color}"/><path d="M59 52q-2-26 23-36-10 22 10 28" fill="${c.color}"/>`,
    glimmer: `<path d="m54 63-9-39 30 26m30 12 10-39-30 25m19 43q45-32 35 1-9 20-38 10" fill="${c.color}"/><path d="m49 34 7 21 11-6m39-15-5 19-10-5" fill="#edcfad"/>`,
  };
  return `<svg class="u-creature" viewBox="0 0 160 130" fill="none" aria-hidden="true"><ellipse cx="80" cy="120" rx="38" ry="5" fill="#102c30" opacity=".16"/><g stroke="#263b36" stroke-width="2" stroke-linejoin="round">${details[c.id]}<path d="M55 71c0-35 50-35 50 0v17c0 33-50 33-50 0Z" fill="${c.color}"/><path d="M66 75v6m28-6v6" stroke-width="4" stroke-linecap="round"/><path d="M74 88q6 7 12 0"/><path d="m65 105-4 8m34-8 4 8"/>${bond >= 12 ? '<path d="m65 53 1-17 14 9 14-9 1 17Z" fill="#edc479"/>' : ""}</g><g fill="#f4d389"><path d="m24 22 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"/><circle cx="127" cy="19" r="3"/></g></svg>`;
}
function landmarkArt(i, color) {
  const structures = [
    `<path d="M47 55h87v42H47Z" fill="#ddd0ad"/><path d="m39 55 51-29 51 29Z" fill="#8b7295"/><path d="M81 101V74a10 10 0 0 1 20 0v27" fill="#567775"/><path d="M57 65v20m7-20v20m7-20v20m42-20v20m7-20v20m7-20v20" stroke="#a58a68" stroke-width="4"/><path d="M87 28V14h7v14"/><path d="m91 14 18 5-18 5" fill="#e9bf7c"/>`,
    `<path d="M40 59h100v37H40Z" fill="#e7cf9f"/><path d="m33 59 19-22h77l18 22Z" fill="#d6a16c"/><path d="M39 59v16h102V59" fill="#e5be7f"/><path d="M48 59v16m18-16v16m18-16v16m18-16v16m18-16v16m15-16v16" stroke="#a56353" stroke-width="10"/><path d="M47 86h29m34 0h24"/><path d="M84 95V79h15v16" fill="#527777"/><path d="M48 35q-12-11 0-17 6-18 20-7 19-7 23 10 14 10-2 16" fill="#c9d8ca" stroke="#7c9b8b"/>`,
    `<path d="M52 60a38 38 0 0 1 76 0v38H52Z" fill="#c9bfd0"/><path d="M47 61a43 43 0 0 1 86 0Z" fill="#7a819e"/><path d="M80 100V70h21v30" fill="#3a525e"/><path d="M64 75h8v10h-8m37-10h8v10h-8" fill="#efd29a"/><path d="M93 9a11 11 0 0 0 0 21 11 11 0 1 1 0-21" fill="#efd29a"/>`,
    `<path d="M50 40h30v58H50Z" fill="#718e92"/><path d="M102 23h30v75h-30Z" fill="#91a48e"/><path d="M68 61h51v36H68Z" fill="#baa9b7"/><path d="M78 81h29v17H78Z" fill="#425967"/><path d="M57 48h16m-16 12h16m-16 12h16m37-40h15m-15 12h15m-15 12h15" stroke="#efd298" stroke-width="4"/><path d="M89 51V18h10v33Z" fill="#d4b578"/><path d="m94 19-3 10h6l-4 12" stroke="#5c7066"/>`,
    `<path d="M40 54h24v45H40Zm76 0h24v45h-24ZM64 65h52v34H64Z" fill="#d0c4a3"/><path d="M37 54h30l-15-22Zm76 0h30l-15-22Z" fill="#899c83"/><path d="M77 100V81a13 13 0 0 1 26 0v19" fill="#4f7069"/><path d="M78 61V39l12 7 12-7v22Z" fill="#c5a469"/><path d="M45 65h13m64 0h13" stroke="#5d8170" stroke-width="5"/>`,
    `<path d="M40 97V44l20-16 17 19v50m26 0V47l17-19 20 16v53" fill="#73596b"/><path d="M67 99V68a23 23 0 0 1 46 0v31Z" fill="#a3899d"/><path d="M78 99V72a12 12 0 0 1 24 0v27" fill="#243e47"/><path d="M83 71v28m8-30v30m8-28v28" stroke="#d1ae7b"/><path d="M66 104h49m-53 6h58" stroke="#bfa58a" stroke-width="4"/><path d="M48 54h9m67 0h9" stroke="#ddba84" stroke-width="4"/>`,
    `<path d="M47 39h32v33H47Z" fill="#95b1ac"/><path d="M101 21h29v37h-29Z" fill="#b2a4bc"/><path d="M79 70h43v28H79Z" fill="#c5b98d"/><path d="m48 39 17-9 29 6-15 7m22-22 14-8 29 5-14 7m-51 45 17-10 43 5-17 10" fill="#5e8c8a"/><path d="m31 76 27 0m55-10h29m-63-9h19" stroke="#e1cc8c" stroke-dasharray="3 3"/><path d="M89 81h23v11H89Z" fill="#31535b"/>`,
    `<path d="M38 40h49l12 14h45v44H38Z" fill="#a28caf"/><path d="M38 54h106l-12 45H47Z" fill="#d8c69b"/><path d="M62 72h51v25H62Z" fill="#718e87"/><path d="M83 97V83a5 5 0 0 1 10 0v14" fill="#203e46"/><path d="M86 44v-9a5 5 0 0 1 10 0v9" stroke="#ead7a8" stroke-width="3"/><path d="M78 44h26v19H78Z" fill="#d7ad6d"/>`,
  ];
  return `<svg viewBox="0 0 180 130" fill="none" aria-hidden="true"><path d="m12 91 76-27 80 28-78 27Z" fill="${color}" stroke="#294946"/><path d="m12 91 10 15 68 22 68-24 10-12-78 27Z" fill="#172f34" stroke="#668278"/><g stroke="#294946" stroke-width="1.8" stroke-linejoin="round">${structures[i % 8]}</g><path d="M28 119q13 5 27 0m68-1q13 5 27 0" stroke="#78938e" opacity=".5"/></svg>`;
}
export function universeNav(s, active) {
  const n = stats(s),
    pet = s.companions[s.equipped];
  return `<div class="u-passport"><a href="#universe/persona" class="u-passport-name"><span class="u-tiny-star">✧</span><span>${e(s.persona.name)}<small>${e(s.persona.class)}</small></span></a><div class="u-rank"><span>CHAPTER ${String(s.journeys + 1).padStart(2, "0")} · LEVEL ${n.level}</span><div class="u-xp" aria-label="${n.xp % 150} of 150 experience to next level"><i style="width:${(n.xp % 150) / 1.5}%"></i></div></div><span class="u-currency">◈ ${s.coins}<small>quest coins</small></span><a class="u-pet-link" href="#universe/creatures">${e(pet?.name || "Your companion")} is coming along ↗</a></div><nav class="u-tabs" aria-label="Your universe">${[
    ["home", "The atlas"],
    ["machine", "Quest machine"],
    ["inventory", "Backpack"],
    ["workshop", "Workshop"],
    ["creatures", "Companions"],
    ["room", "Your room"],
    ["journal", "Field journal"],
    ["residents", "Residents"],
    ["portal", "Postcard portal"],
    ["museum", "Museum"],
    ["persona", "Quest persona"],
  ]
    .map(
      ([id, name]) =>
        `<a href="#${id === "home" ? "home" : "universe/" + id}" ${active === id ? 'aria-current="page"' : ""}>${name}</a>`,
    )
    .join("")}</nav>`;
}
export function universeHome(s) {
  const n = stats(s);
  return `<main id="main" class="u-shell u-home ${s.night ? "u-night" : ""}">${universeNav(s, "home")}<div class="u-atlas-layout"><aside class="u-atlas-margin"><div class="u-edition">AN ATLAS OF<br>UNLIKELY POSSIBILITIES<br><span>EST. IN A MOMENT OF CURIOSITY</span></div><a class="u-machine-door" href="#universe/machine"><span class="u-machine-small">✦<i>?</i>✦</span><small>IT HAS A QUEST FOR YOU</small><strong>The slightly<br>unreliable machine.</strong><span>Turn the handle ↗</span></a><a class="u-return" href="#universe/journal"><span>${n.wins ? `${n.wins} adventures kept` : "A blank page is a good start."}</span>Your field journal ↗</a><div class="u-town-note"><span>THE WORLD REMEMBERS</span><b>${e(n.town)}</b><p>${n.wins < 3 ? `${3 - n.wins} more quests will repair the old bridge.` : n.wins < 6 ? `${6 - n.wins} more quests will reopen the market.` : n.wins < 12 ? `${12 - n.wins} more quests will light the town.` : "You helped this little universe find its feet."}</p></div></aside><section class="u-world-map" aria-label="Explore the SIDE QUEST universe"><div class="u-map-heading"><span>YOU HAVE TAKEN A WRONG TURN.<br>EXCELLENT.</span><h1>Here be<br> possibilities.</h1></div><div class="u-map-moon" aria-hidden="true">☾</div><div class="u-map-coordinate">SQ / ${String(s.seed % 9999).padStart(4, "0")}<br>CHARTED ${n.explored} OF 8</div><svg class="u-trails" viewBox="0 0 1000 780" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="constellations" width="100" height="110" patternUnits="userSpaceOnUse"><circle cx="25" cy="31" r="1" fill="#bac1ac"/><circle cx="72" cy="89" r=".7" fill="#bac1ac"/></pattern></defs><path fill="url(#constellations)" d="M0 0h1000v780H0z"/><g fill="none" stroke="#8da398" stroke-width="1" stroke-dasharray="4 8" opacity=".5"><path d="M230 289Q330 120 490 195T750 273 620 445 340 507 150 569M620 445Q800 400 830 554T510 655 340 507"/></g><path d="M200 690q80-30 150 0m-130 17q55-17 110 0" stroke="#89a79a" opacity=".3"/><path d="M175 554Q270 490 340 507" stroke="${n.wins >= 3 ? "#edc379" : "#62756c"}" stroke-width="${n.wins >= 3 ? 4 : 1}"/></svg>${REGIONS.map(
    (r, i) => {
      const open = regionOpen(s, r.id),
        seen = !!s.visits[r.id];
      return `<a href="#universe/region/${r.id}" class="u-island ${open ? "" : "locked"} ${seen ? "visited" : ""}" style="--x:${r.x}%;--y:${r.y}%;--land:${r.tone};--drift:${i % 4}s" aria-label="${e(r.name)}${open ? "" : `, opens after ${r.need} completed quests`}">${landmarkArt(i, r.tone)}<span class="u-island-label"><small>${open ? (seen ? "CHARTED ✓" : "UNCHARTED") : `${r.need} QUESTS TO OPEN`}</small><strong>${e(r.short)}</strong><b>${open ? "↗" : "◇"}</b></span></a>`;
    },
  ).join(
    "",
  )}<div class="u-map-footer"><span>✣ YOUR NEXT TURN IS YOURS.</span>${btn("night", s.night ? "Visit daylight ☀" : "Visit after dark ☾")}</div><a href="#universe/creatures" class="u-map-companion" aria-label="Visit your companion">${creatureArt(s.equipped, s.companions[s.equipped]?.bond)}</a></section></div><section class="u-paper-strip"><div><span>FIELD NOTE NO. 001</span><h2>Little puzzles.<br>Longer stories.</h2></div><p>A puzzle can become a map scrap. A map scrap can become a key. A key can open somewhere you did not know you were looking for.</p><a href="#universe/story">A letter needs delivering. Start there. ↗</a></section><section class="u-real-work"><div><span class="u-label">THE GOOD AT THE HEART OF IT</span><h2>Some quests leave the map.</h2><p>Alongside this fictional universe, solve volunteer schedules, food routes and school-pack puzzles. Published community briefs go to the organisation for human review.</p></div><div><a class="u-button" href="#library">Explore 6,000 planning puzzles ↗</a><a class="u-text-link" href="#organise">Bring a community brief</a><small>Practice play is never counted as real-world impact.</small></div></section></main>`;
}
function page(s, title, subtitle, content, tab = "") {
  return `<main id="main" class="u-shell u-subpage">${universeNav(s, tab)}<div class="u-page-content"><a href="#home" class="u-back">← BACK TO YOUR ATLAS</a><div class="u-page-head"><span class="u-label">SIDE QUEST / CHAPTER ${String(s.journeys + 1).padStart(2, "0")}</span><h1>${title}</h1><p>${subtitle}</p></div>${content}</div></main>`;
}
function inventory(s) {
  return `<div class="u-pocket-meta">${Object.values(s.inventory).reduce((a, b) => a + b, 0)} objects · ${s.coins} coins · Nothing here costs real money.</div><div class="u-inventory-grid">${Object.entries(
    ITEMS,
  )
    .filter(([id]) => s.inventory[id] > 0)
    .sort(
      ([a], [b]) =>
        Number(s.favourites.includes(b)) - Number(s.favourites.includes(a)),
    )
    .map(
      ([id, it]) =>
        `<article class="u-object"><button class="u-object-inspect" data-u-action="inspect" data-id="${id}"><span>${it.symbol}</span><small>${it.kind}</small><h3>${e(it.name)}</h3><b>× ${s.inventory[id]}</b></button>${btn("favourite", s.favourites.includes(id) ? "Pinned ✓" : "Pin object", id, "u-quiet")}${["egg", "charm"].includes(id) ? btn("use", id === "egg" ? "Meet who is inside ↗" : "Refill rerolls", id) : ""}</article>`,
    )
    .join("")}</div>`;
}
function recipeBook(s) {
  return `<div class="u-workshop-intro"><span class="u-ink-glyph">⚙</span><p>Nothing here is wasted. Well, almost nothing. The golden spoon is proudly exempt.<br>Materials come from completed puzzles. The machine never asks for money.</p></div><div class="u-recipes">${RECIPES.map(
    (r) => {
      const ok =
        s.coins >= r.coins &&
        Object.entries(r.cost).every(([id, n]) => (s.inventory[id] || 0) >= n);
      return `<article class="u-recipe"><span>${ITEMS[r.id].symbol}</span><div><small>RECIPE / ${r.id.toUpperCase()}</small><h3>${r.name}</h3><p>${Object.entries(
        r.cost,
      )
        .map(
          ([id, n]) =>
            `<span class="${(s.inventory[id] || 0) >= n ? "u-have" : ""}">${n} ${ITEMS[id].name.toLowerCase()} (${s.inventory[id] || 0} held)</span>`,
        )
        .join(
          " · ",
        )} · ${r.coins} coins</p></div><button class="u-button" data-u-action="craft" data-id="${r.id}" ${ok ? "" : "disabled"}>${ok ? "Make it ↗" : "Gather materials"}</button></article>`;
    },
  ).join("")}</div>`;
}
function creatureHouse(s) {
  return `<div class="u-creature-grid">${CREATURES.map((c) => {
    const pet = s.companions[c.id];
    return `<article class="u-pet-card ${pet ? "" : "undiscovered"}">${creatureArt(c.id, pet?.bond)}<small>${pet ? c.kind.toUpperCase() : "AN UNMET POSSIBILITY"}</small><h2>${pet ? e(pet.name) : "Someone, somewhere."}</h2><p>${pet ? `${e(c.name)} · ${e(pet.habitat)}` : "Curious eggs arrive after every three new quest completions."}</p>${pet ? `<div class="u-bond">${pet.bond >= 12 ? "✦ Radiant companion" : pet.bond >= 5 ? "✧ Trusted friend" : "A new acquaintance"} · ${pet.bond} bond</div><div class="u-pet-actions">${btn("equip", s.equipped === c.id ? "Coming along ✓" : "Travel together", c.id)}${btn("pet", "A little affection", c.id)}${btn("feed", `Share a biscuit (${s.inventory.biscuit || 0})`, c.id)}${btn("pet-details", "Name & habitat", c.id, "u-quiet")}</div>` : ""}</article>`;
  }).join("")}</div>`;
}
function room(s) {
  return `<div class="u-room" data-room="${s.home.theme}" data-light="${s.home.light}"><div class="u-room-window"><span>☾</span></div><div class="u-room-shelf">${s.home.slots.map((id, i) => `<button data-u-action="furnish" data-id="${i}" class="u-room-position"><span>${id ? ITEMS[id].symbol : "＋"}</span><small>${id ? e(ITEMS[id].name) : `An empty possibility / ${i + 1}`}</small></button>`).join("")}</div><div class="u-room-pet">${creatureArt(s.equipped, s.companions[s.equipped]?.bond)}</div></div><div class="u-room-controls"><label>Room character<select id="u-room-theme">${option(["observatory", "cottage", "arcade"], s.home.theme)}</select></label><label>Lighting<select id="u-room-light">${option(["moon", "amber", "dusk"], s.home.light)}</select></label>${btn("room-save", "Settle in ↗")}<a class="u-text-link" href="#universe/workshop">Make something for this room ↗</a></div>`;
}
function persona(s) {
  const p = s.persona;
  return `<div class="u-persona-layout"><div class="u-persona-seal">✧<span>LICENCE TO<br>TAKE A DETOUR</span><small>SQ / ${String(s.seed % 999999).padStart(6, "0")}</small></div><div class="u-form"><label>Your travelling name<input id="u-name" maxlength="40" value="${e(p.name)}"></label><label>Personal title<input id="u-title" maxlength="60" value="${e(p.title)}"></label><label>Explorer class<select id="u-class">${option(CLASSES, p.class)}</select></label><label>Current mood<select id="u-mood">${option(MOODS, p.mood)}</select></label><label>Chaos appetite<select id="u-chaos">${[0, 1, 2, 3].map((x) => `<option value="${x}" ${x === p.chaos ? "selected" : ""}>${["A quiet cup of tea", "A harmless detour", "Slightly suspicious", "Let the goblin drive"][x]}</option>`).join("")}</select></label><label>Time in your pocket<select id="u-minutes">${[2, 5, 10, 20].map((x) => `<option value="${x}" ${x === p.minutes ? "selected" : ""}>${x} minutes</option>`).join("")}</select></label><label>Default difficulty<select id="u-level">${levelNames.map((x, i) => `<option value="${i}" ${i === p.level ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>Machine finish<select id="u-skin">${option(["brass", "moss", "midnight"], p.skin)}</select></label><div class="u-full">${btn("persona-save", "Stamp my passport ↗")}<a href="#settings" class="u-text-link">Reading size, reduced motion & site colours ↗</a></div></div></div>`;
}
function ticket(t) {
  return `<div class="u-ticket" data-rarity="${t.rarity}"><div class="u-ticket-stub"><span>SIDE<br>QUEST</span><small>${t.rarity.toUpperCase()} PRINT</small></div><div><span>${e(REALMS[t.realm || 0])} / ${levelNames[t.level]}</span><h2>${e(t.title)}</h2><p>${e(REGIONS.find((r) => r.id === t.region)?.name)} · ${t.type === "community" ? "Community-inspired practice" : e(t.type) + " puzzle"}</p><small class="u-ticket-serial">SQ-${String(t.seed).padStart(8, "0")} / ONE SMALL POSSIBILITY</small></div></div>`;
}
function machine(s) {
  const m = s.machine,
    t = m.ticket;
  return `<div class="u-machine-layout"><section class="u-machine" data-skin="${s.persona.skin}"><div class="u-machine-label">THE DEPARTMENT OF<br><b>UNEXPECTED DETOURS</b></div><div class="u-machine-window"><span>✦</span><p>${m.rolls ? "“I have considered your request.<br>I have added a small complication.”" : "“Ah. A curious person.<br>I was hoping one would turn up.”"}</p><span>✦</span></div><div class="u-machine-controls"><label>Quest kind<select id="u-machine-type">${[["any", "Let the machine decide"], ["community", "Useful community planning"], ...MINI_TYPES.map((t) => [t, MINI_NAMES[t]])].map(([id, name]) => `<option value="${id}" ${m.type === id ? "selected" : ""}>${name}</option>`).join("")}</select></label><label>World setting<select id="u-machine-realm">${REALMS.map((w, i) => `<option value="${i}" ${m.realm === i ? "selected" : ""}>${e(w)}</option>`).join("")}</select></label><label>Difficulty crank<select id="u-machine-level">${levelNames.map((x, i) => `<option value="${i}" ${s.persona.level === i ? "selected" : ""}>${x}</option>`).join("")}</select></label><label>Mood dial<select id="u-machine-mood">${option(MOODS, s.persona.mood)}</select></label></div><div class="u-machine-handle">${btn("roll", `Turn the handle <span>↻</span>`)}${t ? btn("reroll", `Reroll this ticket · ${m.rerolls} left`, "", "u-quiet") : ""}</div><div class="u-machine-slot"></div><small>NO PAYMENT REQUIRED. SOME WONDER MAY OCCUR.</small></section><section class="u-output" aria-live="polite">${t ? `${ticket(t)}${btn("accept", "Take this side quest ↗")}<p class="u-output-note">A ticket’s rarity changes its appearance, never its price or your chance of winning.</p>` : `<div class="u-output-empty"><span>⌁</span><h2>A small space<br>for the unexpected.</h2><p>Choose your dials. Or leave them alone.<br>The machine has opinions either way.</p></div>`}<div class="u-machine-footnote"><span>YOUR CURRENT APPETITE</span><p>${e(s.persona.mood)} · ${s.persona.minutes} minutes · ${levelNames[s.persona.level]}<br><a href="#universe/persona">Change your explorer persona ↗</a></p></div></section></div>`;
}
function region(s, id) {
  const r = REGIONS.find((r) => r.id === id);
  if (!r) return "<p>This district is still off the edge of the paper.</p>";
  const open = regionOpen(s, id);
  return `<section class="u-district" style="--land:${r.tone}"><div class="u-district-art">${landmarkArt(REGIONS.indexOf(r), r.tone)}<span>REGION ${String(REGIONS.indexOf(r) + 1).padStart(2, "0")}</span></div><div><span class="u-label">${s.visits[id] ? "A FAMILIAR WRONG TURN" : "SOMEWHERE YOU HAVE NOT BEEN YET"}</span><h2>${e(r.name)}</h2><p>${e(r.line)}</p>${open ? `${btn("visit", s.visits[id] ? "Charted ✓" : "Chart this district", id)}${btn("region-play", "Try the local puzzle ↗", id)}<a href="#universe/resident/${r.keeper}" class="u-text-link">Meet ${e(NPCS.find((n) => n.id === r.keeper).name)} ↗</a>` : `<div class="u-lock-note">This route opens after ${r.need} different completed quests. You have ${count(s)}.</div><a class="u-button" href="#universe/machine">Find a quest for the journey ↗</a>`}</div></section>${id === "folder" ? `<section class="u-secret-door"><span>THE DOOR THAT WAS NOT THERE YESTERDAY</span><p>${s.secret ? "The door recognises you. It is trying not to look pleased." : "A small inscription waits for a rune and a phrase. Vesper may know more."}</p><label>Say something to the door<input id="u-secret-phrase" maxlength="60" placeholder="A very traditional password…"></label>${btn("door", "Knock politely ↗")}</section>` : ""}`;
}
function resident(s, id) {
  const n = NPCS.find((n) => n.id === id);
  if (!n) return "<p>This resident is out walking.</p>";
  const history = s.npc[id];
  return `<div class="u-resident"><div class="u-npc-portrait">${n.symbol}<small>${e(n.name.split(",")[0].toUpperCase())}</small></div><div><span class="u-label">${history ? `YOU HAVE SPOKEN ${history.visits} TIMES` : "A FIRST MEETING"}</span><h2>${e(n.name)}</h2><p>${e(n.role)}</p><blockquote>${history ? `“${s.persona.name}, ${count(s) ? `I hear you have ${count(s)} discoveries to your name.` : "the map has been waiting for you."} ${history.choice === "help" ? "I remember that you offered to help." : history.choice === "question" ? "Still asking excellent questions, I hope." : "Thank you for listening last time."}”` : n.line}</blockquote><div class="u-dialogue-choices">${btn("talk", "Sit and listen", id + "|listen")}${btn("talk", "Offer a hand", id + "|help")}${btn("talk", "Ask what is strange around here", id + "|question")}</div><div class="u-npc-errand"><small>A SMALL PERSONAL QUEST</small><h3>${n.task}</h3><p>Thank-you keepsake: ${ITEMS[n.gift].name} and 10 quest coins.</p>${s.claimed["npc-" + id] ? "<strong>Kept in your story ✓</strong>" : `<button class="u-button" data-u-action="npc-claim" data-id="${id}" ${npcReady(s, id) ? "" : "disabled"}>${npcReady(s, id) ? "Collect the keepsake ↗" : "The errand is still unfolding"}</button>`}</div></div></div>`;
}
function journal(s) {
  const done = Object.entries(s.completed).sort((a, b) => b[1].at - a[1].at);
  return `<section class="u-journal-write"><div><h2>What were you thinking?</h2><p>Keep a clue, a map note, or a thought worth returning to.</p></div><label class="u-sr-only" for="u-note">A thought to keep</label><textarea id="u-note" maxlength="1200" placeholder="The door beside the library was not there yesterday…"></textarea><label>Pin to a district<select id="u-note-region">${REGIONS.map((r) => `<option value="${r.id}">${r.name}</option>`).join("")}</select></label>${btn("note", "Keep this thought ↗")}</section><div class="u-journal-ledger"><section><div class="u-between"><h2>Handwritten, more or less.</h2><input id="u-note-search" type="search" placeholder="Find a note…" aria-label="Search field notes"></div>${
    s.notes.length
      ? s.notes
          .slice()
          .reverse()
          .map(
            (n) =>
              `<article class="u-journal-entry" data-note-text="${e(n.text.toLowerCase())}"><small>${new Date(n.at).toLocaleDateString("en-ZA")} / ${REGIONS.find((r) => r.id === n.region)?.short}</small><p>${e(n.text)}</p></article>`,
          )
          .join("")
      : "<p>The first page is yours.</p>"
  }</section><section><h2>The archive of little victories.</h2>${
    done.length
      ? done
          .slice(0, 100)
          .map(
            ([id, c]) =>
              `<article class="u-journal-entry"><small>${new Date(c.at).toLocaleDateString("en-ZA")} / ${e(c.type)} / ${levelNames[c.level]}</small><h3>${e(c.title || "A useful plan")}</h3><p>${REGIONS.find((r) => r.id === c.region)?.name} · ${c.assisted ? "An assisted discovery" : "A discovery of your own"}</p></article>`,
          )
          .join("")
      : "<p>Complete a puzzle to leave a mark on the map.</p>"
  }</section></div>`;
}
function portal(s) {
  return `<div class="u-portal-intro"><span>◉</span><h2>Thirty places<br>you almost remember.</h2><p>Different fictional settings for the six wonder-puzzle engines. Your between-worlds key opens every postcard; it is never consumed.</p>${s.inventory.key ? "<b>Key in your backpack ✓</b>" : '<a class="u-button" href="#universe/workshop">Make a between-worlds key ↗</a>'}</div><div class="u-postcards">${REALMS.map((w, i) => `<button class="u-postcard" data-u-action="portal" data-id="${i}" ${s.inventory.key ? "" : "disabled"}><small>POSTCARD / ${String(i + 1).padStart(2, "0")}</small><span>${["☾", "✧", "♜", "♧", "◇"][i % 5]}</span><strong>${e(w)}</strong><b>${s.claimed["realm-" + i] ? "VISITED ✓" : "A POSSIBLE DETOUR ↗"}</b></button>`).join("")}</div>`;
}
function museum(s) {
  const n = stats(s);
  return `<div class="u-museum-summary"><div><strong>${n.xp}</strong><span>experience, earned here</span></div><div><strong>${n.wins}</strong><span>different completed quests</span></div><div><strong>${n.explored}/8</strong><span>districts charted this chapter</span></div><div><strong>${n.creatures}/8</strong><span>companion species met</span></div></div><div class="u-achievements">${achievements(
    s,
  )
    .map(
      (a) =>
        `<article class="${a.done ? "earned" : ""}"><span>${a.done ? "✦" : "◇"}</span><div><small>${a.done ? "STAMPED" : "STILL A POSSIBILITY"}</small><h3>${a.name}</h3><p>${a.description}</p></div></article>`,
    )
    .join(
      "",
    )}</div><section class="u-boss-invitation"><span>AN INVITATION FROM THE DEPARTMENT</span><h2>The Bureaucrat of<br>Impossible Errands.</h2><p>Three connected puzzles. A missing message, an unbalanced budget, and a signal nobody filed correctly. One unreasonably small crown.</p><button class="u-button" data-u-action="boss" ${n.wins >= 3 ? "" : "disabled"}>${n.wins >= 3 ? "Accept the three-stage challenge ↗" : "Three completed quests open this encounter"}</button></section><section class="u-next-chapter"><h2>The end is a very flexible concept.</h2><p>After twelve new quests, begin another atlas chapter. Your objects, completed quests, companions and stories stay with you; the district stamps start a new page.</p><button class="u-button" data-u-action="journey" ${n.wins >= 12 * (s.journeys + 1) ? "" : "disabled"}>Begin chapter ${s.journeys + 2} ↗</button></section>`;
}
function story(s) {
  const node = STORY[s.story?.node || "start"];
  return `<section class="u-story-letter"><span class="u-label">THE LETTER ADDRESSED TO SOMEWHERE BETTER</span><h2>${node.title}</h2><p>${node.text}</p><div class="u-story-choices">${node.choices.map((c) => btn("story", e(c.label) + " →", c.id)).join("")}${!node.choices.length ? `${tag("AN ENDING. NOT THE ONLY ROUTE THERE.")}${btn("story-rewind", "Follow another version of the letter ↶")}` : ""}</div><small>${s.story?.choices?.length || 0} choices kept in this version of the story. Replaying never duplicates its reward.</small></section>`;
}
export function universePage(s, parts) {
  const [tab, id] = parts;
  const pages = {
    machine: [
      "The machine has opinions.",
      "A few dials. A little paper. A thoroughly unnecessary amount of possibility.",
      () => machine(s),
    ],
    inventory: [
      "The things you brought back.",
      "A backpack full of small reasons to take another turn.",
      () => inventory(s),
    ],
    workshop: [
      "Make something unlikely.",
      "One useful thing from several apparently useless ones.",
      () => recipeBook(s),
    ],
    creatures: [
      "Nobody travels alone.",
      "Companions grow through play and affection. They never suffer when you are away.",
      () => creatureHouse(s),
    ],
    room: [
      "A little place between quests.",
      "Arrange the objects you made. Leave the light however you like it.",
      () => room(s),
    ],
    persona: [
      "Your licence to get curious.",
      "A persona for the sort of adventure you feel like having.",
      () => persona(s),
    ],
    region: [
      "A different corner of the map.",
      "Follow the path. Say hello. See what is waiting.",
      () => region(s, id),
    ],
    resident: [
      "Someone remembers you.",
      "Small conversations are part of the scenery.",
      () => resident(s, id),
    ],
    residents: [
      "The people between the puzzles.",
      "Four residents, four small errands, and a few stories worth keeping.",
      () =>
        `<div class="u-resident-index">${NPCS.map((n) => `<a href="#universe/resident/${n.id}"><span>${n.symbol}</span><div><h2>${n.name}</h2><p>${n.role}</p><small>${s.claimed["npc-" + n.id] ? "A familiar friend ✓" : s.npc[n.id] ? "Continue the conversation ↗" : "Make an introduction ↗"}</small></div></a>`).join("")}</div>`,
    ],
    journal: [
      "The atlas remembers. So can you.",
      "Clues, completed quests, and the thoughts you nearly forgot.",
      () => journal(s),
    ],
    portal: [
      "A postcard from elsewhere.",
      "The portal does not ask where you are going. It asks what you are curious about.",
      () => portal(s),
    ],
    museum: [
      "A museum of your own making.",
      "No borrowed statistics. These are the discoveries in your notebook.",
      () => museum(s),
    ],
    story: [
      "Somewhere better.",
      "An interactive letter in a few small chapters. Your choices stay with your universe.",
      () => story(s),
    ],
  };
  const p = pages[tab];
  return p
    ? page(s, p[0], p[1], p[2](), tab)
    : page(
        s,
        "This corner is still off the map.",
        "The atlas is a better place to start.",
        '<a href="#home" class="u-button">Return to the atlas ↗</a>',
      );
}
export function wonderPage(s) {
  const a = s.active;
  if (!a)
    return page(
      s,
      "The ticket has wandered off.",
      "Choose another from the quest machine.",
      '<a class="u-button" href="#universe/machine">Turn the handle ↗</a>',
      "machine",
    );
  const t = a.ticket,
    p = makePuzzle(t, a.round || 0);
  let body = "";
  if (p.type === "cipher")
    body = `<p>Each letter was moved <b>${p.shift} places forward</b> through the alphabet. Move it back to read the message.</p><div class="u-cipher">${p.cipher
      .split("")
      .map((x) => `<span>${x}</span>`)
      .join(
        "",
      )}</div><label>The message<input id="u-answer" autocomplete="off" spellcheck="false" maxlength="40" value="${e(a.answer || "")}" placeholder="What does the message say?"></label><div class="u-alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>`;
  if (p.type === "pattern")
    body = `<p>The signal is repeating a rule. Which number comes next?</p><div class="u-pattern">${p.values.map((x) => `<span>${x}</span>`).join("")}<span>?</span></div><label>The next signal<input id="u-answer" inputmode="numeric" type="number" value="${e(a.answer ?? "")}" placeholder="Next number"></label>`;
  if (p.type === "balance") {
    const answer = Array.isArray(a.answer) ? a.answer : p.values.map(() => 0);
    const total = p.values.reduce((n, v, i) => n + v * (answer[i] || 0), 0);
    body = `<p>The market scale needs exactly <b>${p.target} units</b>. Each token has a different weight. Use up to nine of each.</p><div class="u-scale" aria-live="polite"><span>${total}</span><b> / ${p.target}</b><small>UNITS ON YOUR SIDE</small></div><div class="u-weight-row">${p.values.map((v, i) => `<label><span>◈ ${v} units</span><input type="number" inputmode="numeric" min="0" max="9" data-u-weight="${i}" value="${answer[i] || 0}" aria-label="Number of ${v}-unit tokens in slot ${i + 1}"></label>`).join("")}</div>`;
  }
  if (p.type === "memory") {
    const preview = a.phase !== "recall";
    body = `<p>${preview ? "Study the lantern order for as long as you like. Then turn the card over and recreate it." : "Choose the lanterns in the same order. Nothing is timed."}</p>${preview ? `<div class="u-memory-sequence">${p.sequence.map((x, i) => `<span><small>${i + 1}</small>${p.symbols[x]}</span>`).join("")}</div>${btn("recall", "I have it. Turn the card over ↗")}` : `<div class="u-lanterns">${p.symbols.map((x, i) => btn("lantern", `<span>${x}</span><small>${["Moon", "Sprout", "Diamond", "Bolt"][i]}</small>`, i)).join("")}</div><div class="u-memory-answer" aria-live="polite">${(Array.isArray(a.answer) ? a.answer : []).map((x) => p.symbols[x]).join(" · ") || "Your lanterns will appear here."}</div><small>${a.answer?.length || 0} / ${p.sequence.length} lanterns</small>${btn("memory-reset", "Clear the lanterns", "", "u-quiet")}`}`;
  }
  if (p.type === "observe")
    body = `<p>One symbol is different. Find it. There is no timer, and a wrong guess is just another look.</p><div class="u-observation">${p.cells.map((x, i) => btn("observe", `<span aria-hidden="true">${x}</span><small class="u-sr-only">Symbol ${i + 1}: ${x}</small>`, i)).join("")}</div>`;
  if (p.type === "maze") {
    const position = a.position || 0;
    body = `<p>Find the lit exit. Walls stay put, even when the corridor insists otherwise. Use the buttons or your keyboard’s arrow keys.</p><div class="u-maze" style="--size:${p.size}" aria-label="${p.size} by ${p.size} corridor puzzle">${Array.from({ length: p.size * p.size }, (_, i) => `<span class="${p.walls.includes(i) ? "wall" : ""} ${i === position ? "player" : ""} ${i === p.end ? "exit" : ""}" aria-label="${i === position ? "Your position" : i === p.end ? "Exit" : p.walls.includes(i) ? "Wall" : "Open floor"}">${i === position ? "✦" : i === p.end ? "☀" : ""}</span>`).join("")}</div><div class="u-maze-controls">${["up", "left", "down", "right"].map((d, i) => btn("move", `<span aria-hidden="true">${["↑", "←", "↓", "→"][i]}</span><small class="u-sr-only">Move ${d}</small>`, d)).join("")}</div><small>At row ${Math.floor(position / p.size) + 1}, column ${(position % p.size) + 1}.</small>`;
  }
  return page(
    s,
    e(t.title),
    `${e(REALMS[t.realm || 0])} · ${levelNames[t.level]} · ${a.boss ? `BOSS STAGE ${(a.round || 0) + 1} OF 3` : "A SMALL, COMPLETE ADVENTURE"}`,
    `<div class="u-wonder-layout"><section class="u-wonder-board"><div class="u-wonder-top"><span>SQ-${t.seed} / ${p.type.toUpperCase()}</span><span>${a.boss ? "THE BUREAUCRAT IS WAITING" : "ONE SMALL POSSIBILITY"}</span></div><div class="u-wonder-body">${body}<div class="u-wonder-feedback ${a.feedback ? "shown" : ""}" role="status">${e(a.feedback || "")}</div><div class="u-wonder-actions">${!(p.type === "memory" && a.phase !== "recall") && p.type !== "observe" ? btn("check-wonder", a.boss ? "File this stage ↗" : "Check my discovery ↗") : ""}${btn("hint", "A little nudge", "", "u-quiet")}${btn("restart-wonder", "Try a clean page", "", "u-quiet")}</div>${a.hint ? `<div class="u-hint">${e(a.hint)}</div>` : ""}</div></section><aside class="u-wonder-aside">${creatureArt(s.equipped, s.companions[s.equipped]?.bond)}<h3>${e(s.companions[s.equipped]?.name || "Your companion")} believes in you.</h3><p>There is no streak to lose. No life to run out of. Your discoveries wait while you take a break.</p><a href="#universe/journal">Keep a field note ↗</a><a href="#universe/machine">Take a different ticket ↗</a><span>${a.mistakes || 0} attempts that taught you something.</span></aside></div>`,
    "machine",
  );
}
export function ticketMarkup(t) {
  return ticket(t);
}
