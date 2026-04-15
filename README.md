# Ordinary Game Jam #1

A browser game jam where every entry is stitched together by portals. Players travel from one game to the next without leaving their browser.

- **Live showcase:** https://callumhyoung.github.io/gamejam/
- **Starter template:** https://github.com/CallumHYoung/gamejam-starter

This repo is the **registry, build spec, and showcase website**. It is not where games live — each participant hosts their own game in their own repo created from the starter template, and submits a PR here adding themselves to `games.json`.

## Participating

→ **Start here: [`GETTING_STARTED.md`](GETTING_STARTED.md)** — the full template-to-PR walkthrough.

The short version:

1. Go to the [starter template](https://github.com/CallumHYoung/gamejam-starter) and click **"Use this template"** to create your own game repo.
2. Clone your new repo, feed [`SPEC.md`](SPEC.md) into your coding agent, build your game.
3. Push — the included workflow auto-deploys to `https://<you>.github.io/<your-game>/`.
4. Edit [`games.json`](games.json) in the GitHub web UI (GitHub auto-forks on save), add your entry, open a PR.
5. Iterating on your game afterwards is push-only — no new PR needed unless your `games.json` entry or thumbnail changes.

## Running the showcase site locally

It's a static site. Any static server works:

```bash
cd gamejam
python -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html`, `style.css`, `app.js`, `fx.js` — the showcase site
- `games.json` — the registry every game fetches to pick portal destinations
- `SPEC.md` — the build spec and portal protocol (the thing friends paste into their agent)
- `GETTING_STARTED.md` — fork-to-PR walkthrough for participants
- `thumbnails/` — game card images
- `games/` — each participant's game lives under `games/<id>/` on their own fork
