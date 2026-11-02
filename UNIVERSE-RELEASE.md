# The connected universe release

SIDE QUEST now connects its original community-planning practice puzzles to a persistent fictional atlas. The eight districts have distinct illustrations. Every completion grants a one-time discovery; resources can be crafted into room decorations, a portal key or a reroll charm. All game currency is fictional and has no purchase flow.

## Working systems

- Eight atlas districts with progression gates, visit stamps, drifting islands, a day/night visit toggle, a repaired bridge and town progress.
- Quest persona: name, title, class, mood, chaos appetite, available time, default difficulty and machine finish. Mood, time and chaos affect the machine's automatic quest selection.
- Quest machine: six wonder engines or community-inspired planning, thirty fictional setting labels, four difficulties, serialised tickets, cosmetic rarity, three daily rerolls and a craftable reroll charm. There are no paid rolls.
- Six deterministic, independently playable puzzle engines: Caesar messages, weighted token balances, lantern memory, number patterns, odd-symbol observation and maze navigation. Every engine has four complexity levels, instructions, hints, retry and persistent attempts.
- Original 6,000 planning scenarios remain playable. Their feasible practice solutions earn universe rewards once, including earlier saved solutions.
- Backpack: material counts, earned coins, object descriptions, favourite pins, egg hatching and charm consumption.
- Eight crafting recipes with material and coin costs, balance checks and useful outputs.
- Eight companion species with collection discovery, travel selection, names, feeding, affection, bond progression and habitat choices. Companions do not suffer during absence.
- Home base with six furniture positions, furniture returns, three room characters and three lighting choices.
- Four residents with persistent conversation history, contextual dialogue, prerequisite-based errands and one-time keepsakes.
- Secret phrase and rune door, thirty postcard setting destinations, a branching letter story with persistent choices and replay without duplicate rewards.
- Sixteen earned achievement stamps, XP, level progression, statistics from actual local progress, a three-stage puzzle boss, crown trophy and new atlas chapters after twelve new completions per chapter.
- Region-pinned field notes, note search and a completed-quest archive.
- Browser database persistence, universe inclusion in notebook backup/import and private account sync. The universe is synced as one latest-modified snapshot so crafting and inventory transactions remain together. Simultaneous edits on different devices are not merged field by field; export a backup before switching devices.

## Verification

`npm test` checks the original 6,000 unique planning scenarios and 4,800 generated wonder boards (six engines × four levels × 200 seeds), plus reward idempotency, resource conservation, state validation, persistence, NPC rewards, doors, stories and snapshot sync.

`tests/universe-rls.sql` writes disposable universe snapshots inside a rolled-back transaction and verifies that a different user cannot read or overwrite them. No fixture users or worlds remain after the test.

## The 900-idea brief

The 900 supplied ideas are a product roadmap, not 900 released features. Settings, seeds and artwork variants are not counted as separate implemented systems. No placeholder multiplayer, fake global statistics, fabricated player activity or nonfunctional controls are advertised.

| Brief group | Released coverage | Remaining work |
| --- | --- | --- |
| 1–30 Quest machine | Dials, tickets, serials, rarity, rerolls, skins | Fusion, upgrades, repair events, secret mechanisms |
| 31–60 Quest types | Six new engines, branching story, original three planning engines | Remaining genre-specific mechanics |
| 61–90 Strange worlds | All thirty as fictional ticket settings | Dedicated world-specific maps and story campaigns |
| 91–120 NPCs | Four residents, memory, dialogue, errands and keepsakes | Relationships, schedules, factions, voice and multi-quest arcs |
| 121–150 Secrets | Phrase/rune door and collection-based routes | Calendar, audio, weather and meta-puzzle discoveries |
| 151–180 Modifiers | Hints, retry, four complexity levels, site accessibility | Modifier recipes and the remaining mechanical variants |
| 181–210 Difficulty | Four explicit levels, practice, hints, low-pressure play | Adaptive balancing and advanced challenge modes |
| 211–240 Profiles | Persona, title, class, preferences, history and XP | Public showcases, friend/rival activity and soundtracks |
| 241–270 Collectibles | Materials, coins, lore, eggs, relics, trophy and keepsakes | Seasonal collections, tapes as audio and remaining item families |
| 271–300 Creatures | Eight species, hatching, affection, feeding, naming, bonds, habitats | Breeding, fusion, jobs, expeditions and creature mini-games |
| 301–330 Inventory | Counts, inspect, pins, crafting consumption and use | Trading, gifting, quick wheel and advanced item rules |
| 331–360 Crafting | Eight recipes, costs, material checks and outputs | Stations, collaborative work, enchanting and crafting mini-games |
| 361–390 Atlas | Eight districts, gates, stamps, paths, motion and day/night | Custom map markers, transport and weather systems |
| 391–420 Evolution | Town milestones, bridge repair, unlocks and chapters | Full environmental simulation and reactive ecosystems |
| 421–450 Home | Six placements, furniture crafting, room themes and lighting | More room types, visitors, ambient music and house quests |
| 451–480 Journal | Manual notes, region pins, search and completion archive | Red-string boards, screenshots, advanced lore archives |
| 481–510 Social play | Existing organisation-reviewed community plans | Friend, party, spectator and real-time play infrastructure |
| 511–540 Creation | Existing local scenario editor and organisation publishing | World/story/NPC editors, moderation and creator analytics |
| 541–570 Stories | Persistent branching letter, replay and endings | Episodic campaigns and timeline systems |
| 571–600 Time | Daily reroll reset and on-demand night palette | Real calendar, season, weather and scheduled events |
| 601–630 Audio | Existing optional UI sounds | Soundtracks, stations, music library and audio puzzles |
| 631–660 Visuals | Bespoke atlas art, motion, room light, ticket and journal styling | Expanded visual modes and transition packs |
| 661–690 Bosses | Three-stage Bureaucrat encounter, rematch and crown | Other boss mechanics and community encounters |
| 691–720 Failure | Clear feedback, unlimited retry, retained progress and hints | Failure archives, replay ghosts and special failure routes |
| 721–750 Rewards | Coins, XP, achievements, objects, furniture, eggs and trophy | Advanced cosmetic, social, creator and event rewards |
| 751–780 Progression | XP, levels, gates, achievements, milestone chapters | Mastery trees, seasonal tracks and prestige paths |
| 781–810 Recommendations | Mood/time/chaos rules and explicit filters | History-informed, social and adaptive recommendations |
| 811–840 Experiments | Keyboard maze and symbol/cipher interactions | Other browser, physical and cross-device mechanics |
| 841–870 Delights | Companion art, animated islands, character dialogue, stamps | More reactive scenes and tiny interaction surprises |
| 871–900 Legendary | Persistent atlas, story choices, museum, chapter continuation | Connected campaigns, collective quests and advanced multiverse systems |

These remaining features need real implementation, playtesting and, for social systems, authenticated server rules and moderation. They are not exposed as working product controls.
