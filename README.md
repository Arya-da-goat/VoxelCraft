# Optional texture atlas

VoxelCraft generates an original pixel-art-inspired fallback atlas automatically, so no texture file is required.

To use a texture pack you have the legal right to use, add `voxelcraft-atlas.png` in this folder. It must be a square 3×3 atlas: nine equally sized tiles, ordered left-to-right and top-to-bottom to match the hotbar:

1. Grass
2. Dirt
3. Stone
4. Sand
5. Wood
6. Leaves
7. Planks
8. Brick
9. Bedrock

The atlas should be a power-of-two image with nearest-neighbor pixel art (for example, 48×48 with 16×16 tiles, or 96×96 with 32×32 tiles). The game will use it for world blocks and the held block. Use only assets you are authorized to use. Minecraft's official textures are copyrighted; they are not included in this repository, and you should check the applicable license/terms before redistributing them.
