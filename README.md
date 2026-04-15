# Ordinary Game Jam #1

A browser game jam where every entry is stitched together by portals. Players travel from one game to the next without leaving their browser.

**Live showcase:** https://callumhyoung.github.io/gamejam/

## Participating

→ **Start here: [`GETTING_STARTED.md`](GETTING_STARTED.md)** — the full fork-to-PR walkthrough.

The short version:

1. Fork this repo.
2. Build your game inside `games/<your-id>/` on your fork. Feed [`SPEC.md`](SPEC.md) to your coding agent for the build rules and portal protocol.
3. Enable GitHub Pages on your fork (Settings → Pages → Source: GitHub Actions). Your game goes live at `https://<you>.github.io/gamejam/games/<your-id>/`.
4. Open a PR against this repo adding your entry to [`games.json`](games.json) with your deployed URL and a thumbnail.
5. Updates to your game just require pushing to your fork — the showcase picks up the new deploy automatically.

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
