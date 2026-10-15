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
