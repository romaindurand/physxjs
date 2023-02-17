import { drawCircle, drawDisc, drawStats } from './draw'
import { Vec2 } from './vec2'
import {
  Solver,
  VerletObject,
  constraint_position,
  constraint_radius,
} from './verlet'

let shooting = true
const useRAF = true

window.setTimeout(main, 100)

function main() {
  let slowFrames = 0
  const shootButton = document.getElementById('shoot') as HTMLButtonElement
  shootButton.addEventListener('click', () => {
    shooting = !shooting
  })
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  const objects = []

  const solver = new Solver(
    objects,
    true,
    new Vec2(canvas.width, canvas.height),
  )

  window.setInterval(() => {
    if (!shooting) return
    const direction = Math.random()
    solver.addObject(
      new VerletObject(
        constraint_position.moveY(-constraint_radius + 50),
        new Vec2((direction - 0.5) * 2, 0.5),
        Math.random() * 10 + 8,
        `hsl(${Math.round(direction * 320) + 20}, 100%, 55%)`,
      ),
    )
  }, 80)

  let lastTime = performance.now()
  function loop() {
    const now = performance.now()
    const dt = now - lastTime
    lastTime = now

    solver.update(dt)
    const endCompute = performance.now()

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCircle(ctx, constraint_position, constraint_radius, 'white')
    for (const object of solver.objects) {
      const { position_current, radius, color } = object
      drawDisc(ctx, position_current, radius, color, 'black')
    }

    const endDraw = performance.now()
    const endFrame = drawStats(ctx, solver, endCompute, now, endDraw)

    if (endFrame - now >= 15.9) {
      slowFrames++
      if (slowFrames > 5) shooting = false
    } else {
      slowFrames = 0
    }

    if (useRAF) requestAnimationFrame(loop)
    else window.setTimeout(loop, 16)
  }

  if (useRAF) requestAnimationFrame(loop)
  else loop()
}
