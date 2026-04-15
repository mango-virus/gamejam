# Vibe Coding Game Jam — Build Spec

Paste this entire file into your coding agent (Claude Code, Cursor, etc.) as the starting prompt. Your agent should build a browser-based game that conforms to the rules below so it slots into the shared jam portal network.

---

## The rules

1. **Browser only.** The game must run in a modern desktop browser with zero install. Static hosting (GitHub Pages, Vercel, Netlify, itch.io HTML5) is fine. No backend required.
2. **One entry point.** `index.html` at the root of whatever URL you submit.
3. **Portals to other games.** Every game must let the player leave and arrive from another jam game using the shared Portal Protocol below.
4. **Pick a stack you like.** Three.js, Phaser, plain canvas, Babylon, PlayCanvas, Pixi, raw WebGL — whatever. Keep the bundle reasonable (<20MB ideally).
5. **Submit by PR.** Add your entry to `games.json` in the jam repo and open a pull request.

---

## The Portal Protocol

This is the *only* thing every game must agree on. Everything else is your call.

### Incoming players (reading params)

When your game loads, check `window.location.search` for these query params:

| Param      | Type    | Meaning                                                |
| ---------- | ------- | ------------------------------------------------------ |
| `portal`   | `true`  | Player arrived via a portal. Skip menus, spawn them in.|
| `username` | string  | Display name. Default: random.                         |
| `color`    | hex     | Player color, e.g. `ff00aa`. Default: random.          |
| `speed`    | number  | Movement speed they were moving at. Optional.          |
| `ref`      | URL     | URL of the game they came *from*. Use for a return portal. |

Example incoming URL:
```
https://mygame.example.com/?portal=true&username=callum&color=ff8800&ref=https%3A%2F%2Ffriendsgame.example.com%2F
```

### Outgoing players (writing params)

When a player enters a portal in your game, redirect them to the target game's URL with the same params, preserving state:

```js
function sendPlayerThroughPortal(targetUrl, player) {
  const params = new URLSearchParams({
    portal: 'true',
    username: player.name,
    color: player.color.replace('#', ''),
    speed: String(player.speed ?? 5),
    ref: window.location.href.split('?')[0],
  });
  window.location.href = `${targetUrl}?${params.toString()}`;
}
```

### Picking a target

Fetch the shared registry and pick a destination that isn't you:

```js
const REGISTRY_URL = 'https://callumhyoung.github.io/gamejam/games.json';

async function pickPortalTarget() {
  const reg = await fetch(REGISTRY_URL).then(r => r.json());
  const others = reg.games.filter(g => !window.location.href.startsWith(g.url));
  return others[Math.floor(Math.random() * others.length)];
}
```

You can also hardcode a fallback list in case the registry is down.

### Return portal

If `ref` is present in the incoming URL, spawn a second portal that sends the player back to `ref`. This makes the network feel connected instead of one-way.

---

## 3D game requirements

If your game is 3D, the portal is a **physical object in the world** — a ring, door, glowing archway, whatever fits your aesthetic. When the player's bounding box intersects it, trigger the redirect.

Minimum:
- Portal is clearly visible and labeled with the destination game's title (fetched from `games.json`).
- Small "preloader" effect is nice: start fetching the target URL when the player gets close.
- If `ref` is set, also render a return portal near the spawn point.

Three.js sketch:
```js
const portalGeom = new THREE.TorusGeometry(2, 0.3, 16, 64);
const portalMat  = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const portal     = new THREE.Mesh(portalGeom, portalMat);
scene.add(portal);

// in your update loop:
if (player.position.distanceTo(portal.position) < 2) {
  sendPlayerThroughPortal(targetGame.url, player);
}
```

## 2D game requirements

If your game is 2D, you have more flexibility. Pick one:
- A door/warp tile the player walks onto.
- A button/menu item labeled "Travel to another world".
- A pause-menu list of all jam games (pulled live from `games.json`).

Whatever it is, make it discoverable within the first minute of play.

---

## Incoming spawn behavior

When `?portal=true` is in the URL:
- Skip the title screen / menu.
- Spawn the player near a clearly-marked **return portal** pointing back to `ref` (if 3D) or show a "Back to <game>" button (if 2D).
- Apply `username` and `color` if your game supports customization.

---

## Submission checklist

- [ ] Game runs from a single public URL with no install.
- [ ] Reads `portal`, `username`, `color`, `ref` from URL params.
- [ ] Has at least one outgoing portal that calls `sendPlayerThroughPortal`.
- [ ] If `ref` is set, shows a return portal / return button.
- [ ] Entry added to `games.json` via PR with: `id`, `title`, `author`, `description`, `url`, `thumbnail`, `type` (`2d` or `3d`), `tags`.
- [ ] 256×256 (or larger) thumbnail image committed to `thumbnails/<id>.png`.

---

## Agent instructions (copy this part verbatim into your agent)

> You are building a game for the Vibe Coding Game Jam. Read the spec above. Your deliverables:
> 1. A working browser game in `index.html` + supporting files, deployable as a static site.
> 2. Implements the Portal Protocol exactly as specified (incoming params, outgoing redirect, return portal when `ref` is set).
> 3. Fetches the jam registry at load to pick portal destinations; falls back to a hardcoded list if fetch fails.
> 4. Pick a stack and theme, then build something small but fun — favor one polished mechanic over sprawl.
> 5. Test the portal in/out flow with two fake registry entries before declaring done.
> 6. When finished, write the `games.json` entry and a short README with the deploy URL.
>
> Do not skip the portal protocol. It is the whole point of the jam.
