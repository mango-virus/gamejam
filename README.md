# Vibe Coding Game Jam

A browser game jam where every entry is stitched together by portals. Players can travel from one game to the next without leaving their browser.

## Participating

1. Read [`SPEC.md`](SPEC.md) — the build spec and portal protocol.
2. Feed it to your favorite coding agent and build a game.
3. Deploy the game anywhere static (GitHub Pages, Vercel, Netlify, itch).
4. Add an entry to [`games.json`](games.json) and open a PR.
5. Drop a thumbnail in `thumbnails/<your-id>.png`.

## Running the showcase site locally

It's a static site. Any static server works:

```bash
cd gamejam
python -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html`, `style.css`, `app.js` — the showcase site
- `games.json` — the registry every game fetches to pick portal destinations
- `SPEC.md` — the build spec and portal protocol (the thing friends paste into their agent)
- `thumbnails/` — game card images
