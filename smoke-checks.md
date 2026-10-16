# Manual smoke-test checklist

- [ ] Open through a static HTTP server and confirm WebGL canvas renders.
- [ ] Start a world with a fixed seed twice and compare terrain.
- [ ] Walk into a wall and verify collision; jump and land; hit underside of an overhang.
- [ ] Break and place blocks at chunk boundaries and verify adjacent faces rebuild.
- [ ] Test 1–9 and mouse-wheel hotbar selection.
- [ ] Save, refresh, and confirm edited blocks/player position restore.
- [ ] Walk several chunks away and verify distant chunk count remains bounded.
- [ ] On physical Android, hold joystick while dragging look area with a second finger.
- [ ] On physical Android, press action buttons and hotbar without rotating the camera.
- [ ] Test portrait and landscape layouts, pause/resume, and touch-control visibility.


## Block outlines, collision and ghost placement upgrade

- [ ] Confirm each visible block type has subtle dark edge lines, including leaves and bedrock.
- [ ] Walk against a leaf block, jump onto it, and verify it supports the player.
- [ ] Break a leaf and verify the opening is immediately traversable; place a leaf and verify it blocks movement.
- [ ] Dig down beside and beneath the player; verify natural falling without sinking through intact neighboring terrain.
- [ ] Aim at each face of a block and verify the green 25%-opacity preview snaps to the adjacent voxel.
- [ ] Aim into open sky and verify the preview disappears.
- [ ] Aim at a placement cell intersecting the player's feet, body, or head and verify preview and placement are rejected.
- [ ] Place a block and verify it immediately becomes solid, outlined, targetable and inventory-counted.
- [ ] Verify the old white placement outline is absent.
- [ ] Repeat on desktop and a physical Android device; test two-finger movement/look simultaneously.
