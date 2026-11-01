# SIDE QUEST ↗

**A little play. A lot of possibility.**

A community puzzle club by Simoné Govender, Quantum Cupcake Creations.

[Play SIDE QUEST](https://cosmicbubblegumgirl.github.io/side-quest/)

## The experience

- 6,000 distinct, deterministic and solvable practice boards: 3 engines × 4 difficulties × 500 editions.
- Six worlds: the neighbourhood, Moss & Magic, Moonlit Market, Floating Isles, Clockwork Quarter and Starlight Academy.
- Volunteer scheduling, food-delivery routing and fair school-supply packing.
- Editable community scenarios, public briefs, private submissions and an owner-controlled review desk.
- Personal themes, avatars, accessibility options, notebook, favourites, checkpoints, journal, backups and account sync.
- 24 planning tables covering budgets, donations, fuel, water, tutor ratios, risk, packing, capacity and more.
- Offline practice after the first successful visit; installable app manifest; responsive phone and desktop layouts.
- Original vector emblem, wordmark, interface illustrations, app icons and downloadable brand assets.

The capability catalogue lists table operations per planning tool. Puzzle editions and world skins are not counted as separate features. See [the capability list](docs/capabilities.json) for the audit trail.

## Run and verify

No package installation or frontend build is required. Serve `docs/` using a static HTTP server. Node 22+ runs the checks:

```sh
npm test
npm run check
```

The tests verify uniqueness and solvability of all 6,000 boards, invalid plans, CSV formula escaping and all 24 tool calculators. `tests/database-cases.sql` checks server/client rule parity. `tests/rls.sql` runs owner, author and unrelated-user checks inside a rolled-back transaction.

## Architecture

The frontend uses semantic HTML, CSS and browser ES modules, without runtime frontend dependencies. `docs/engine.js` contains deterministic generators, evaluators and bounded example solvers. `docs/kit.js` contains field-kit calculations. `docs/app.js` handles views and input. `docs/cloud.js` handles IndexedDB, Supabase Auth and the REST API.

Supabase Postgres holds `sq_quests`, `sq_submissions`, `sq_reviews` and `sq_state`. Row-level policies isolate accounts and reviews. Submissions are checked on the server against the published constraints and retain a configuration snapshot. Quest ownership and constraints cannot be changed after creation. Only the browser-safe publishable key is in the client.

`database/schema.sql` records the initial database setup. `database/hardening.sql` records additional validation checks. Existing applications in the database use separate tables and are not altered. A shared authentication service means accounts from the same project can also sign in here.

The publication workflow runs the checks, packages `docs/` and deploys it to GitHub Pages on every push to `main`. Deployments run one at a time. Hash navigation works under a repository subpath. The service worker scopes itself to this app and caches only same-origin app files. It never caches account API responses.

## Operational boundaries

Practice boards are labelled as practice. No fictional activity is presented as real impact. Organisation identities are self-reported. A feasible plan is a planning aid; an organisation reviews availability, real roads, food safety, accessibility and changing conditions before using it. Approval does not dispatch vehicles, reserve people or transfer resources.

Use anonymous roles and aggregate counts. Public briefs must not contain beneficiary information. The in-app data page explains device storage, sync, exports and deletion. Account email delivery and password-reset redirects are managed by the shared authentication provider configuration.

## Design

Warm paper, deep forest ink, electric lime, lavender and apricot. A deliberate mix of crisp utility, editorial typography and slightly crooked paper objects. The S/Q emblem is an interlocking forward move with a small star for possibility.

© 2026 Simoné Govender · Quantum Cupcake Creations. All rights reserved.
