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

  const solver = new Solver(objects, true, new Vec2(900, 900))

  window.setInterval(() => {
    if (!shooting) return
    const direction = Math.random()
    solver.addObject(
      new VerletObject(
        constraint_position.moveY(-constraint_radius + 50),
        new Vec2((direction - 0.5) * 2, 0.5),
        Math.random() * 13 + 5,
        `hsl(${Math.round(direction * 320) + 20}, 100%, 55%)`,
      ),
    )
  }, 80)

  let lastTime = performance.now()
  function loop() {
    const now = performance.now()
    const dt = now - lastTime
    lastTime = now

    const gridSize = solver.update(dt)
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
    drawGrid(ctx, gridSize, solver.size)

    if (useRAF) requestAnimationFrame(loop)
    else window.setTimeout(loop, 16)
  }

  if (useRAF) requestAnimationFrame(loop)
  else loop()
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  rowsColsCount: number,
  size: Vec2,
) {
  if (rowsColsCount === 0) return
  const [rows, cols] = [rowsColsCount, rowsColsCount]
  const { x: width, y: height } = size
  const rowHeight = height / rows
  const colWidth = width / cols
  for (let i = 0; i < rows; i++) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    ctx.moveTo(0, i * rowHeight)
    ctx.lineTo(width, i * rowHeight)
    ctx.stroke()
  }
  for (let i = 0; i < cols; i++) {
    ctx.beginPath()
    ctx.moveTo(i * colWidth, 0)
    ctx.lineTo(i * colWidth, height)
    ctx.stroke()
  }
}
