# Getting Started — Jam Participants

Welcome to the **Ordinary Game Jam #1**. This guide takes you from zero to a live game in the showcase. If you already know your way around forks and PRs, you can skim.

---

## The model in one picture

```
              your fork                              main repo
   github.com/<you>/gamejam  ──── PR (games.json) ──▶ github.com/CallumHYoung/gamejam
              │                                              │
              ▼                                              ▼
  <you>.github.io/gamejam/                    callumhyoung.github.io/gamejam/
  (hosts YOUR game)                           (the showcase, links to yours)
```

- **You host your own game** on your fork's GitHub Pages.
- **You submit a registry entry** (one PR to `games.json`) to the main repo.
- **Updates to your game** just require pushing to your fork — no new PR needed.
- **The showcase site** fetches live status from your fork via the GitHub API and shows it on your card.

---

## 1. Fork the repository

Click **Fork** on https://github.com/CallumHYoung/gamejam. You'll get your own copy at `https://github.com/<your-username>/gamejam`.

## 2. Clone your fork locally

```bash
git clone https://github.com/<your-username>/gamejam.git
cd gamejam
```

Add the main repo as `upstream` so you can pull in spec updates:

```bash
git remote add upstream https://github.com/CallumHYoung/gamejam.git
git remote -v
# origin    https://github.com/<you>/gamejam.git (fetch/push)
# upstream  https://github.com/CallumHYoung/gamejam.git (fetch/push)
```

Pull new spec changes anytime:

```bash
git fetch upstream
git merge upstream/main
```

## 3. Create your game folder

Pick a short kebab-case id (e.g. `rocket-racer`) and make a folder:

```bash
mkdir -p games/rocket-racer
cd games/rocket-racer
```

Everything for your game lives inside that folder — `index.html`, assets, scripts. It must be a fully-static site (no backend).

## 4. Build your game

Feed [`SPEC.md`](SPEC.md) from the repo root into your coding agent. The portal protocol is non-negotiable; the rest is your call.

**Minimum requirements recap:**
- Reads URL params `portal`, `username`, `color`, `ref` on load
- At least one outgoing portal that redirects to another jam game
- A return portal / back button when `ref` is set
- Fetches `https://callumhyoung.github.io/gamejam/games.json` for destinations

Test it locally from the repo root:

```bash
cd /path/to/gamejam
python -m http.server 8000
# open http://localhost:8000/games/rocket-racer/
```

## 5. Enable GitHub Pages on your fork

Push your work:

```bash
git add games/rocket-racer
git commit -m "Add rocket-racer"
git push
```

Then on GitHub:

1. Go to **Settings → Pages** on your fork (`github.com/<you>/gamejam/settings/pages`).
2. **Source**: GitHub Actions.
3. Go to **Actions** tab. If the "Deploy to GitHub Pages" workflow hasn't run yet, click it → **Run workflow** → main.

After ~1 minute your game is live at:

```
https://<your-username>.github.io/gamejam/games/rocket-racer/
```

Open it. If you hit a 404, double-check:
- Pages source is set to "GitHub Actions" (not "Deploy from a branch")
- The workflow run succeeded (green check in Actions tab)
- You're browsing with a trailing slash on the folder

## 6. Register your game in the main repo

Sync with upstream first to avoid `games.json` conflicts:

```bash
git fetch upstream
git merge upstream/main
```

Add your entry to `games.json`:

```json
{
  "id": "rocket-racer",
  "title": "Rocket Racer",
  "author": "Your Name",
  "description": "One-line pitch people will remember.",
  "url": "https://<your-username>.github.io/gamejam/games/rocket-racer/",
  "repo": "<your-username>/gamejam",
  "thumbnail": "thumbnails/rocket-racer.png",
  "type": "3d",
  "tags": ["platformer", "three.js"],
  "status": "wip",
  "multiplayer": false
}
```

Also drop a 256×256+ screenshot at `thumbnails/rocket-racer.png`.

Commit, push, and open a PR against `CallumHYoung/gamejam`:

```bash
git checkout -b add-rocket-racer
git add games.json thumbnails/rocket-racer.png
git commit -m "Register rocket-racer"
git push -u origin add-rocket-racer
# then click the PR link GitHub prints, or go to your fork and click "Compare & pull request"
```

**Field reference:**

| Field         | Required | Notes                                                                       |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `id`          | yes      | kebab-case, unique across the jam                                           |
| `title`       | yes      | Display name                                                                |
| `author`      | yes      | Your name or handle                                                         |
| `description` | yes      | One-line pitch                                                              |
| `url`         | yes      | Absolute URL to your game's `index.html`                                    |
| `repo`        | no       | `owner/name` — **enables live status on the showcase card**                 |
| `thumbnail`   | yes      | Path relative to main repo, e.g. `thumbnails/<id>.png`                      |
| `type`        | yes      | `"2d"` or `"3d"`                                                            |
| `tags`        | no       | Array of short strings                                                      |
| `status`      | no       | `"wip"` (yellow badge) or `"ready"` (green badge)                           |
| `multiplayer` | no       | `true` adds a green MULTIPLAYER badge                                       |

## 7. Iterating on your game

Every push to your fork's `main` branch redeploys your Pages site automatically. **You do not need to open a new PR to the main repo** to update your game — your URL is stable, your showcase card just picks up the new deploy.

You only need a new PR to the main repo when:
- You change your `games.json` entry (e.g. flip `status` from `wip` to `ready`)
- You want a new thumbnail

## 8. What the showcase shows about your game

On `callumhyoung.github.io/gamejam/`, your card displays:

- **Thumbnail + title + description + tags** — from `games.json`
- **Type badge** (2D/3D) — top-right
- **Status badge** (WIP/READY) — top-left (if you set `status`)
- **Multiplayer badge** — bottom-right (if you set `multiplayer: true`)
- **Last-updated time** (e.g. "updated 4m ago") — pulled live from GitHub API via `repo`
- **Deploy status** (deployed / deploying… / deploy failed) — pulled live from your fork's Pages workflow, links to the run

Clicking the card opens your game in a new tab. Clicking the deploy badge opens the workflow run so you can debug failures.

## Troubleshooting

**My game 404s on `<me>.github.io/gamejam/games/<id>/`**
Pages source must be "GitHub Actions", and the workflow must have run at least once successfully. Check the Actions tab.

**`games.json` merge conflicts**
Run `git fetch upstream && git merge upstream/main` on your PR branch, resolve the conflict (usually just re-add your entry at the end of the array), commit, push.

**Portal to another friend's game doesn't work**
Their entry has to be in the main `games.json` on `main`. Until merged, hardcode a fallback list in your game pointing at URLs you know.

**GitHub API rate limits hit (status says "status unavailable")**
The showcase uses the unauthenticated API (60 req/hour per IP). Results are cached for 5 minutes in your browser. Hit **Refresh status** sparingly.
