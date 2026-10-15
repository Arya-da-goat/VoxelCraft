from ursina import *
from ursina.prefabs.first_person_controller import FirstPersonController


class Block(Button):
    def __init__(self, position=(0, 0, 0), color=color.rgb(80, 180, 100)):
        super().__init__(
            parent=scene,
            position=position,
            model='cube',
            origin_y=0.5,
            texture='white_cube',
            color=color,
            highlight_color=color.lighter(),
            scale=1,
        )
        self.collider = BoxCollider(self)


class DigCraftGame:
    def __init__(self):
        self.app = Ursina()
        self.player = None
        self.world = []
        self.generation_seed = 7
        self.setup_scene()

    def setup_scene(self):
        window.title = 'DigCraft'
        window.borderless = False
        window.fps_counter.enabled = True
        window.exit_button.visible = False

        ambient = AmbientLight(color=color.rgba(255, 255, 255, 120))
        directional = DirectionalLight(y=2, z=1, rotation=(45, -45, 0), color=color.white)
        Sky(color=color.rgb(120, 180, 255))

        for x in range(-10, 11):
            for z in range(-10, 11):
                height = 0
                if (x * z) % 5 == 0:
                    height = 1
                if (x + z) % 7 == 0:
                    height += 1

                for y in range(height, -1, -1):
                    if y == height:
                        tile_color = color.rgb(110, 190, 90)
                    elif y == height - 1:
                        tile_color = color.rgb(100, 170, 80)
                    else:
                        tile_color = color.rgb(80, 120, 70)

                    block = Block(position=(x, y, z), color=tile_color)
                    self.world.append(block)

        for x in range(-3, 4):
            for z in range(-3, 4):
                if abs(x) < 2 and abs(z) < 2:
                    continue
                tree = Tree(position=(x, 1, z))
                tree.y = 1

        self.player = FirstPersonController(position=(0, 5, 0), speed=8)
        self.player.cursor.visible = False
        self.player.gravity = 1.0
        self.player.jump_height = 2.5

        camera.fov = 90
        camera.clip_plane_far = 200

        self.player.mouse_sensitivity = Vec2(120, 120)

        self.make_hud()

    def make_hud(self):
        crosshair = Entity(
            parent=camera.ui,
            model='quad',
            color=color.white,
            position=(0, 0),
            scale=(0.01, 0.01),
            rotation_z=45,
        )
        crosshair.rotation_z = 45
        crosshair.scale_x = 0.01
        crosshair.scale_y = 0.01

        info = Text(
            text='DigCraft | Left click: break | Right click: place | Space: jump',
            parent=camera.ui,
            position=(-0.8, 0.45),
            scale=1.0,
            origin=(0, 0),
            color=color.white,
            background=True,
        )
        info.background.color = color.rgba(0, 0, 0, 100)

    def input(self, key):
        if key == 'left mouse down':
            hit = raycast(camera.world_position, camera.forward, distance=6, ignore=[self.player])
            if hit.hit and hit.entity != self.player:
                destroy(hit.entity)

        if key == 'right mouse down':
            hit = raycast(camera.world_position, camera.forward, distance=6, ignore=[self.player])
            if hit.hit and hit.entity != self.player:
                block_position = hit.entity.position + hit.normal
                block_position = Vec3(round(block_position.x), round(block_position.y), round(block_position.z))
                if abs(block_position.x) < 15 and abs(block_position.z) < 15:
                    Block(position=block_position, color=color.rgb(150, 100, 60))


class Tree(Entity):
    def __init__(self, position=(0, 0, 0)):
        super().__init__(position=position)
        trunk = Entity(parent=self, position=(0, 1, 0), model='cube', color=color.rgb(100, 70, 40), scale=(0.6, 2, 0.6))
        leaves = Entity(parent=self, position=(0, 2.6, 0), model='cube', color=color.rgb(70, 150, 70), scale=(2, 2, 2))
        self.trunk = trunk
        self.leaves = leaves


def update():
    pass


def main():
    game = DigCraftGame()
    app = game.app
    app.run()


if __name__ == '__main__':
    main()
