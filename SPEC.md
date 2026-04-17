# Vibe Coding Game Jam — Build Spec

Paste this entire file into your coding agent (Claude Code, Cursor, etc.) as the starting prompt. Your agent should build a browser-based game that conforms to the rules below so it slots into the shared jam portal network.

---

## The rules

1. **Browser only.** The game must run in a modern desktop browser with zero install. Static hosting (GitHub Pages, Vercel, Netlify, itch.io HTML5) is fine. No backend required.
2. **One entry point.** `index.html` at the root of whatever URL you submit.
3. **Join the network.** Every game must implement the shared Portal Protocol below — players leave through a portal to another jam game, and arrive from others. A game that doesn't portal isn't in the jam.
4. **Build in public.** Your game repo must be public from the first commit. Half the point of the jam is watching each other's games take shape — push early, push often, don't hide work-in-progress.
5. **Pick a stack you like.** Three.js, Phaser, plain canvas, Babylon, PlayCanvas, Pixi, raw WebGL — whatever. Keep the bundle reasonable (<20MB ideally).
6. **Submit by PR.** Add your entry to `jam1.json` in the jam repo and open a pull request. (The `games.json` file is the trial-run archive — a separate portal network, closed to new submissions.)

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
const REGISTRY_URL = 'https://callumhyoung.github.io/gamejam/jam1.json';

async function pickPortalTarget() {
  const reg = await fetch(REGISTRY_URL).then(r => r.json());
  const others = reg.games.filter(g => !window.location.href.startsWith(g.url));
  return others[Math.floor(Math.random() * others.length)];
}
```

> **Two registries:** `jam1.json` is the real jam. `games.json` is the archived trial-run network and is not used by real-jam games.

You can also hardcode a fallback list in case the registry is down.

### Return portal

If `ref` is present in the incoming URL, spawn a second portal that sends the player back to `ref`. This makes the network feel connected instead of one-way.

---

## 3D game requirements

If your game is 3D, the portal is a **physical object in the world** — a ring, door, glowing archway, whatever fits your aesthetic. When the player's bounding box intersects it, trigger the redirect.

Minimum:
- Portal is clearly visible and labeled with the destination game's title (fetched from `jam1.json`).
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
- A pause-menu list of all jam games (pulled live from `jam1.json`).

Whatever it is, make it discoverable within the first minute of play.

---

## Incoming spawn behavior

When `?portal=true` is in the URL:
- Skip the title screen / menu.
- Spawn the player near a clearly-marked **return portal** pointing back to `ref` (if 3D) or show a "Back to <game>" button (if 2D).
- Apply `username` and `color` if your game supports customization.

---

## Multiplayer (optional)

**You do NOT need a backend for multiplayer.** GitHub Pages (or any static host) serves the HTML/JS, and your game talks directly from the browser to a third-party realtime service over WebSockets or WebRTC. No server to run, no accounts to manage.

The portal protocol already gives you a lightweight form of continuity: `username` and `color` ride along in the URL, so players' identities persist across hops even in single-player games. Full realtime multiplayer is a bonus.

### Recommended: PlayroomKit

Purpose-built for browser games, ~5 lines to get a shared room with synced player state. Free tier covers small jams.

```html
<script src="https://unpkg.com/playroomkit/multiplayer.umd.js"></script>
```

```js
import { insertCoin, myPlayer, onPlayerJoin } from 'playroomkit';

await insertCoin({ skipLobby: true }); // auto-join a room

onPlayerJoin(player => {
  // spawn a remote avatar for this player
  const avatar = spawnAvatar(player.id);
  player.onQuit(() => avatar.destroy());
  // read shared state
  player.onState('x', x => avatar.x = x);
  player.onState('y', y => avatar.y = y);
});

// in your update loop, publish your own state:
myPlayer().setState('x', player.x);
myPlayer().setState('y', player.y);
```

Read the incoming `username` / `color` from the URL params and pass them via `myPlayer().setState('name', ...)` so other players see them.

### Alternatives

| Service         | Good for                                    | Trade-off                                  |
| --------------- | ------------------------------------------- | ------------------------------------------ |
| **PlayroomKit** | Quick jam games, synced state, lobbies      | Vendor lock-in to their API                |
| **Trystero**    | Zero-cost P2P, no accounts at all           | WebRTC NAT quirks, no authoritative server |
| **PartyKit**    | Small stateful rooms, Cloudflare edge       | A bit more boilerplate, needs a deploy     |
| **Firebase**    | Persistence + realtime + auth in one        | Bigger SDK, Google account needed          |
| **Supabase**    | Postgres + realtime, open-source friendly   | Same as Firebase — project + keys          |

### Portal handoff for multiplayer games

When a player leaves your multiplayer game through a portal, just let them go — don't try to drag them between rooms. The next game spawns them fresh via URL params. If you want the *look* of continuity, fade them out of your scene before the redirect fires.

### Cross-game shared presence (stretch goal, not required)

If you and another jam participant want players in Game A to *see* players currently inside Game B, both games need to connect to the same realtime service with the same room/project credentials. That's a coordination you arrange directly — feel free to pick a service, share a room key in Discord/chat, and wire both games to it. Don't hold up your submission on this; treat it as a fun add-on between specific games.

---

## Submission checklist

- [ ] Game runs from a single public URL with no install.
- [ ] Reads `portal`, `username`, `color`, `ref` from URL params.
- [ ] Has at least one outgoing portal that calls `sendPlayerThroughPortal`.
- [ ] If `ref` is set, shows a return portal / return button.
- [ ] Entry added to `jam1.json` via PR with: `id`, `title`, `author`, `description`, `url`, `thumbnail`, `type` (`2d` or `3d`), `tags`.
- [ ] 256×256 (or larger) thumbnail image committed to `thumbnails/<id>.png`.
- [ ] (Optional) If multiplayer, add `"multiplayer": true` to your `jam1.json` entry so the showcase site can badge it.

---

## Agent instructions (copy this part verbatim into your agent)

> You are building a game for the Vibe Coding Game Jam. Read the spec above. Your deliverables:
> 1. A working browser game in `index.html` + supporting files, deployable as a static site.
> 2. Implements the Portal Protocol exactly as specified (incoming params, outgoing redirect, return portal when `ref` is set).
> 3. Fetches the jam registry at load to pick portal destinations; falls back to a hardcoded list if fetch fails.
> 4. Pick a stack and theme, then build something small but fun — favor one polished mechanic over sprawl.
> 5. Multiplayer is optional and must use a static-hosting-compatible service (PlayroomKit, Trystero, PartyKit, Firebase, Supabase) — no custom backend. Do not add multiplayer unless you have time after the portal loop works.
> 6. Test the portal in/out flow with two fake registry entries before declaring done.
> 7. When finished, write the `jam1.json` entry and a short README with the deploy URL.
>
> Do not skip the portal protocol. It is the whole point of the jam.
