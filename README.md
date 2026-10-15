# DigCraft

DigCraft is a lightweight Minecraft-style voxel sandbox with two editions:

- Desktop edition: Python + Ursina
- Web edition: HTML + Three.js

## Included files

- `minecraft_game.py` — desktop voxel sandbox prototype
- `web/index.html` — web demo entry point
- `web/style.css` — web styling
- `web/app.js` — Three.js voxel gameplay prototype
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

## Features

- Procedural terrain generation
- Block placement and breaking
- First-person movement
- Simple survival-style sandbox loop
