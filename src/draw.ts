import { Vec2 } from './vec2'
import { Solver } from './verlet'

export function drawDisc(
  ctx: CanvasRenderingContext2D,
  position: Vec2,
  radius: number,
  color: string,
  strokeColor?: string,
) {
  strokeColor = strokeColor || color
  drawCircle(ctx, position, radius, strokeColor)
  ctx.fillStyle = color
  ctx.fill()
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  position: Vec2,
  radius: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.stroke()
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: Vec2,
) {
  ctx.font = '12px sans-serif'
  ctx.fillStyle = 'white'
  ctx.fillText(text, position.x, position.y)
}

const statsPosition = new Vec2(10, 60)
const statsLineHeight = 15
export function drawStats(
  ctx: CanvasRenderingContext2D,
  solver: Solver,
  endCompute: number,
  now: number,
  endDraw: number,
) {
  drawText(
    ctx,
    'Objects : ' + solver.objects.length.toString(),
    new Vec2(statsPosition.x, statsPosition.y),
  )

  drawText(
    ctx,
    'Simulation : ' + (endCompute - now).toFixed(1) + 'ms',
    new Vec2(statsPosition.x, statsPosition.y + statsLineHeight),
  )

  drawText(
    ctx,
    'Render : ' + (endDraw - endCompute).toFixed(1) + 'ms',
    new Vec2(statsPosition.x, statsPosition.y + statsLineHeight * 2),
  )

  const endFrame = performance.now()

  drawText(
    ctx,
    'Frame : ' + (endFrame - now).toFixed(1) + 'ms',
    new Vec2(statsPosition.x, statsPosition.y + statsLineHeight * 3),
  )

  return endFrame
}
