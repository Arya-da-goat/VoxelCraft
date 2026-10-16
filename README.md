# VoxelCraft — browser voxel sandbox

A Minecraft-inspired, first-person voxel sandbox designed for static hosting such as GitHub Pages. This is an original project and is not affiliated with Mojang or Microsoft.

## Important platform note

The GitHub Pages edition is HTML/CSS/JavaScript, not Python/Ursina. Ursina is a desktop Python engine and does not run natively on GitHub Pages. This browser edition uses Three.js for WebGL rendering. The current `game.js` imports Three.js from jsDelivr, so an internet connection is needed to load that library; gameplay itself uses no game server, paid API, login, or backend. For fully offline distribution, vendor a compatible Three.js module locally and update the import.

## Run locally

For ES modules, use a local static server (opening `index.html` directly as `file://` may be blocked by browser module security).

Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Controls

### Desktop
- WASD / arrow keys: move
- Mouse: look (click the game to capture pointer)
- Space: jump
- Shift: sprint
- Left click: break targeted block
- Right click: place selected block
- 1–9 or mouse wheel: select hotbar slot
- Escape / pause button: pause

### Touchscreen
- Bottom-left joystick: movement
- Drag the right-side look area: camera
- JUMP, RUN, BREAK, PLACE: actions
- Tap a hotbar slot to select it
- Pause menu can hide touch controls

## Features in this version

- Procedural seeded terrain with hills, sand, grass, dirt and stone layers
- 16×16 horizontal chunks, combined face-culled meshes, render-distance loading/unloading
- Voxel-grid traversal targeting with reach limit and adjacent-face placement
- Thin, dark outlines batched per chunk across exposed voxel edges
- Reused 25%-opacity green ghost placement block, hidden for invalid/player-overlapping positions
- Axis-separated player collision using voxel-center-aligned occupancy checks, gravity, jump and fall respawn
- Leaves use the same solid-block collision rule as other voxel types
- Nine-slot hotbar, local save/load in browser `localStorage`, periodic save
- Responsive desktop/mobile HUD and simultaneous joystick + look pointer regions

## Source edition note

The uploaded `VoxelCraft-main.zip` contains only the browser edition (`index.html`, `style.css`, `game.js`) and does not contain a Python/Ursina source tree. This upgrade therefore changes and tests the browser edition only; a Python edition cannot be safely patched without its actual source files.

## Known limitations

- This is an initial playable browser edition, not a claim of production-perfect Minecraft parity. Verify collision and multitouch on the actual target devices.
- The current procedural world uses simplified deterministic value noise and does not yet implement flowing water, caves, ore distribution, a full inventory screen, crafting, sound, day/night, or advanced greedy meshing.
- Trees near chunk borders are simplified; cross-chunk foliage is not guaranteed to match a seamless tree canopy.
- Local saves belong to the current browser and device. Clearing site data removes them. Export/import and cloud sync are not implemented.
- Touch events depend on browser/device support. Desktop emulation is not proof of physical Android multitouch behavior.
- WebGL 2 support is required by the bundled Three.js release.
- Chunk mesh generation is synchronous and may briefly hitch at higher render distances on slower phones. Reduce render distance if needed.

## Publish on GitHub Pages

1. Create a repository named `VoxelCraft`.
2. Upload `index.html`, `style.css`, `game.js`, `README.md`, `LICENSE`, and `.nojekyll` to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Wait for deployment; the project URL will resemble `https://YOUR-USERNAME.github.io/VoxelCraft/`.

### Git commands

```bash
git init
git add index.html style.css game.js README.md LICENSE .nojekyll
git commit -m "Create VoxelCraft browser sandbox"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/VoxelCraft.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If the remote already exists, use `git remote set-url origin ...` instead of adding it again.

## Testing checklist

Automated syntax check (requires Node.js):

```bash
node --check game.js
```

Because `game.js` is an ES module, if Node treats `.js` as CommonJS, create a temporary `package.json` containing `{"type":"module"}` or rename a copy to `game.mjs` for the syntax check. Browser smoke tests must be performed by launching the site in a WebGL-capable browser. Physical Android tests are required for simultaneous multitouch, pointer capture, viewport clipping, performance, and save persistence.

## License

MIT. See `LICENSE`.
