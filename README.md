# DigCraft

DigCraft is a lightweight Minecraft-style voxel sandbox with two editions:

- Desktop edition: Python + Ursina
- Web edition: HTML + Three.js

## Included files

- `minecraft_game.py` — desktop voxel sandbox prototype
- `web/index.html` — web demo entry point (desktop + mobile controls)
- `web/style.css` — web styling (desktop + mobile)
- `web/app.js` — Three.js voxel gameplay prototype with mobile controls
- `requirements.txt` — Python dependencies

## Run the desktop prototype

1. Install Python dependencies:
   `pip install -r requirements.txt`
2. Start the game:
   `python minecraft_game.py`

## Run the web prototype

Open `web/index.html` in a browser, or serve the folder with a static file server:

`python -m http.server 8000`

Then visit `http://localhost:8000/web/`.

### Mobile controls

The web prototype includes a touch-friendly control scheme:
- Left virtual joystick for movement (drag to move)
- Right-side touch-and-drag to look around (touch-look)
- Jump and Action buttons on the right for jump and place/break blocks
- Tap to lock pointer on supported devices; on mobile, pointer-lock is not required

## Features

- Procedural terrain generation
- Block placement and breaking
- First-person movement
- Simple survival-style sandbox loop

## Notes

- Desktop: click to lock pointer and use mouse + keyboard.
- Mobile: use on-screen joystick and touch-look; the UI adapts to small screens.
