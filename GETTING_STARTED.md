# Getting Started — Jam Participants

Welcome to the **Ordinary Game Jam #1**. This guide takes you from zero to a live game card on the showcase. Skim if you already know your way around GitHub templates and PRs.

---

## The model in one picture

```
        ┌───────────────────────────┐           ┌────────────────────────────────┐
        │  gamejam-starter (template)│          │  CallumHYoung/gamejam (main)   │
        │  build spec + portal.js    │          │  registry + showcase site      │
        └──────────────┬─────────────┘          └────────────────┬───────────────┘
          "Use this template"                                    │ PR jam1.json
                       │                                         │ (web UI, auto-forks)
                       ▼                                         ▼
        ┌───────────────────────────┐           ┌────────────────────────────────┐
        │  <you>/<your-game>        │   link →  │  callumhyoung.github.io/gamejam│
        │  your game, your repo     │  ◀─────── │  the showcase                  │
        │  <you>.github.io/<game>/  │           │                                │
        └───────────────────────────┘           └────────────────────────────────┘
```

**Two repos, two purposes:**
1. **Your game repo** — created from the starter template. Hosts your game at its own clean URL. You control it entirely.
2. **The showcase repo** (`CallumHYoung/gamejam`) — the registry (`jam1.json`), the build spec, the showcase website. You never need to clone this; just open a PR via the GitHub web UI when you're ready to submit. (Note: `games.json` also lives here — it's the archived trial-run network and isn't used for real-jam submissions.)

**Why a template and not a fork?** A fork of the main repo would make your GitHub Pages serve a stale mirror of the showcase instead of your game. The template gives you a clean, independent repo whose Pages deploy hosts *only* your game at `https://<you>.github.io/<your-game>/`.

---

## 1. Create your game repo from the template

Go to https://github.com/CallumHYoung/gamejam-starter and click the green **"Use this template"** button → **"Create a new repository"**.

- **Repository name:** whatever your game is called, kebab-case (e.g. `rocket-racer`).
- **Owner:** your account.
- **Visibility:** public (required for GitHub Pages on the free tier).

You now own `github.com/<you>/<your-game>` with the starter's code.

## 2. Clone it locally

```bash
git clone https://github.com/<you>/<your-game>.git
cd <your-game>
```

## 3. Run it locally

Any static file server works:

```bash
python -m http.server 8000
# open http://localhost:8000
```

You'll see a purple canvas with a moving square and a glowing exit portal. Walk into it — it'll redirect to a random game from the live jam registry. That's the protocol working end-to-end, before you've written a line of code.

## 4. Build your game

Feed [`SPEC.md`](SPEC.md) (from the main repo) into your coding agent. Replace `game.js`, `index.html`, and `style.css` with your actual game. **Keep `portal.js` and the `Portal.*` calls** — those are the jam's only hard contract.

Minimum behaviors your game must implement:
- Read URL params (`portal`, `username`, `color`, `ref`) on load.
- If `portal=true`, skip menus and spawn the player in.
- Have at least one outgoing portal that calls `Portal.sendPlayerThroughPortal`.
- If `ref` is set, draw a return portal / button pointing back to `ref`.
- Fetch `https://callumhyoung.github.io/gamejam/jam1.json` to pick destinations (the helper `Portal.pickPortalTarget()` already does this).

## 5. Deploy

Push to main:

```bash
git add .
git commit -m "Build my game"
git push
```

Then, the first time only:

1. Go to **Settings → Pages** on your game repo.
2. **Source:** GitHub Actions.
3. Go to the **Actions** tab. If the "Deploy to GitHub Pages" workflow hasn't run yet, click it → **Run workflow** → main.

After ~1 minute your game is live at:

```
https://<you>.github.io/<your-game>/
```

**Every subsequent push** redeploys automatically. No further button-clicking required.

## 6. Submit to the jam

You do **not** need to clone the main repo. GitHub lets you edit any file in-browser and it auto-forks on save.

1. Open https://github.com/CallumHYoung/gamejam/blob/main/jam1.json
2. Click the **pencil icon** (top-right of the file view). GitHub will prompt "Fork this repository" — accept it.
3. Add your entry to the `games` array, after the last existing entry:

```json
{
  "id": "rocket-racer",
  "title": "Rocket Racer",
  "author": "Your Name",
  "description": "One-line pitch people will remember.",
  "url": "https://<you>.github.io/rocket-racer/",
  "repo": "<you>/rocket-racer",
  "thumbnail": "thumbnails/rocket-racer.png",
  "type": "3d",
  "tags": ["platformer", "three.js"],
  "status": "wip",
  "multiplayer": false
}
```

4. Scroll to the bottom, pick **"Create a new branch for this commit and start a pull request"**, give the branch a name (e.g. `add-rocket-racer`), click **Propose changes**.
5. On the next screen, click **Create pull request**.

To add a thumbnail in the same PR, after step 4 switch to your new branch on your fork, navigate to `thumbnails/`, click **Add file → Upload files**, drop in `<your-id>.png` (256×256 or larger), and commit to the same branch. The PR will update automatically.

**Field reference:**

| Field         | Required | Notes                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `id`          | yes      | kebab-case, unique across the jam                                           |
| `title`       | yes      | Display name                                                                |
| `author`      | yes      | Your name or handle                                                         |
| `description` | yes      | One-line pitch                                                              |
| `url`         | yes      | Absolute URL to your game's `index.html`                                    |
| `repo`        | no       | `<owner>/<name>` of your **game repo** — enables live status on your card   |
| `thumbnail`   | yes      | Path relative to main repo, e.g. `thumbnails/<id>.png`                      |
| `type`        | yes      | `"2d"` or `"3d"`                                                            |
| `tags`        | no       | Array of short strings                                                      |
| `status`      | no       | `"wip"` (yellow badge) or `"ready"` (green badge)                           |
| `multiplayer` | no       | `true` adds a green MULTIPLAYER badge                                       |

## 7. Iterating on your game

Every push to your game repo's `main` branch redeploys your Pages site automatically. **You do not need a new PR to the main repo** to update your game — your URL is stable, and the showcase pulls live status from GitHub's API every time someone loads the page.

You only need a new PR to the main repo when:
- You change your `jam1.json` entry (e.g. flip `status` from `wip` to `ready`)
- You want a new thumbnail

## 8. What the showcase shows about your game

On https://callumhyoung.github.io/gamejam/, your card displays:

- **Thumbnail + title + description + tags** — from `jam1.json`
- **Type badge** (2D/3D) — top-right
- **Status badge** (WIP/READY) — top-left (if you set `status`)
- **Multiplayer badge** — bottom-right (if you set `"multiplayer": true`)
- **Last-updated time** (e.g. "updated 4m ago") — pulled live from the GitHub API via `repo`
- **Deploy status** (deployed / deploying… / deploy failed) — pulled live from your game repo's Pages workflow, links to the run

Clicking the card opens your game in a new tab. Clicking the deploy badge opens the workflow run so you can debug failures.

---

## Troubleshooting

**My game 404s on `<me>.github.io/<game>/`**
Pages source must be "GitHub Actions". Check the Actions tab — the workflow needs at least one successful green run. If you see a red X, click into it and read the logs.

**Deploy badge says "deploy failed" on the showcase**
Click the badge — it links straight to your failed workflow run. Most common cause: you deleted the workflow file or broke its YAML.

**Portal to another friend's game doesn't work**
Their entry has to be in the main repo's `jam1.json`. Until merged, edit `portal.js` in your game and add them to `FALLBACK_GAMES` — the helper will use that list when the registry is unreachable.

**GitHub API rate limits hit (showcase says "status unavailable")**
The showcase uses the unauthenticated GitHub API (60 req/hour per IP). Results are cached for 5 minutes in your browser. Hit **Refresh status** sparingly.

**I accidentally forked the main repo instead of using the template**
No harm done — just delete the fork and use the template link instead: https://github.com/CallumHYoung/gamejam-starter
