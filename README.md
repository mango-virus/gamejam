# Ordinary Game Jam #1

A browser game jam where every entry is stitched together by portals. Players travel from one game to the next without leaving their browser.

- **Live showcase:** https://callumhyoung.github.io/gamejam/
- **Starter template:** https://github.com/CallumHYoung/gamejam-starter

This repo is the **registry, build spec, and showcase website**. It is not where games live — each participant hosts their own game in their own repo created from the starter template, and submits a PR here adding themselves to `jam1.json` (the real-jam registry). The older `games.json` is an archived trial-run network — a standalone portal graph closed to new submissions.

## Schedule

**Trial run — now → Friday, Apr 17 @ 12 PM.** Warm-up only. **Do not build your real game yet.** Use this time to get the starter template working, get comfortable building with Claude, mess around, and have fun. Submit something silly. Trial entries live in `games.json` and form a separate portal network (see `trial.html`).

**The real jam — Friday, Apr 17 @ 12 PM → Saturday, May 23.** Five weeks. The **theme** and **mechanic** are sealed behind the gate on the showcase and reveal exactly when the jam starts. Plan your approach after you see them. Submit via `jam1.json`.

**Competitors (trial run):** Adam · Cal · Jason · Joel · Prez · RJ · *and you!*

## Participating

→ **Start here: [`GETTING_STARTED.md`](GETTING_STARTED.md)** — the full template-to-PR walkthrough.

The short version:

1. Go to the [starter template](https://github.com/CallumHYoung/gamejam-starter) and click **"Use this template"** to create your own game repo.
2. Clone your new repo, feed [`SPEC.md`](SPEC.md) into your coding agent, build your game.
3. Push — the included workflow auto-deploys to `https://<you>.github.io/<your-game>/`.
4. Edit [`jam1.json`](jam1.json) in the GitHub web UI (GitHub auto-forks on save), add your entry, open a PR.
5. Iterating on your game afterwards is push-only — no new PR needed unless your `jam1.json` entry or thumbnail changes.

## Running the showcase site locally

It's a static site. Any static server works:

```bash
cd gamejam
python -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html`, `style.css`, `app.js`, `fx.js` — the showcase site
- `jam1.json` — the real-jam registry every jam game fetches to pick portal destinations
- `games.json` — the archived trial-run network (standalone, not used by real-jam games)
- `trial.html` — separate showcase page for the trial-run archive
- `SPEC.md` — the build spec and portal protocol (the thing friends paste into their agent)
- `GETTING_STARTED.md` — fork-to-PR walkthrough for participants
- `thumbnails/` — game card images
- `games/` — each participant's game lives under `games/<id>/` on their own fork
