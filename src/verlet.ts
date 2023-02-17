import { Vec2 } from './vec2'

const sub_steps = 10
export const constraint_radius = 400
export const constraint_position = new Vec2(450, 450)

export class VerletObject {
  position_current: Vec2
  position_old: Vec2
  acceleration: Vec2
  radius: number
  color: string

  constructor(
    position = new Vec2(0, 0),
    acceleration = new Vec2(0, 0),
    radius: number = 10,
    color: string = 'red',
  ) {
    this.position_current = position
    this.position_old = position
    this.acceleration = acceleration
    this.radius = radius
    this.color = color
  }

  updatePosition(dt: number) {
    const velocity = Vec2.diff(this.position_current, this.position_old)
    this.position_old = this.position_current
    this.position_current = Vec2.add(
      Vec2.add(this.position_current, velocity),
      this.acceleration.multiply(dt * dt),
    )
    this.acceleration = new Vec2(0, 0)
  }

  accelerate(acceleration: Vec2) {
    this.acceleration = Vec2.add(this.acceleration, acceleration)
  }
}

export class Solver {
  gravity: Vec2 = new Vec2(0, 0.002)
  // gravity: Vec2 = { x: 0, y: 0.0002 };
  objects: VerletObject[]
  size: Vec2
  useSpatialPartitioning: boolean

  constructor(
    objects: VerletObject[] = [],
    useSpatialPartitioning: boolean = true,
    size: Vec2 = new Vec2(100, 100),
  ) {
    this.objects = objects
    this.size = size
    this.useSpatialPartitioning = useSpatialPartitioning
  }

  addObject(object: VerletObject) {
    this.objects.push(object)
  }

  update(dt: number) {
    const sub_dt = dt / sub_steps
    let gridSize = 0
    for (let i = 0; i < sub_steps; i++) {
      this.applyGravity()
      this.applyConstraints()
      gridSize = this.solveCollisions()
      this.updatePositions(sub_dt)
    }
    return gridSize
  }

  updatePositions(dt: number) {
    for (const object of this.objects) {
      object.updatePosition(dt)
    }
  }

  applyGravity() {
    for (const object of this.objects) {
      object.accelerate(this.gravity)
    }
  }

  applyConstraints() {
    const position = constraint_position
    const radius = constraint_radius
    for (const object of this.objects) {
      const to_object = Vec2.diff(object.position_current, position)
      const distance = to_object.getLength()
      if (distance > radius - object.radius) {
        const direction = to_object.multiply(1 / distance)
        const new_position = Vec2.add(
          position,
          direction.multiply(radius - object.radius),
        )
        object.position_current = new_position
      }
    }
  }

  solveCollisions() {
    if (!this.useSpatialPartitioning) {
      solveCollisionsForObjects(this.objects)
      return 0
    }

    const gridSize = Math.floor(Math.sqrt(this.objects.length))
    const cells = Array.from(Array(gridSize), () => new Array(gridSize))
    for (const object of this.objects) {
      const x = Math.floor((object.position_current.x / this.size.x) * gridSize)
      const y = Math.floor((object.position_current.y / this.size.y) * gridSize)
      if (cells[x][y] === undefined) {
        cells[x][y] = []
      }
      cells[x][y].push(object)
    }

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const cell = cells[x][y]
        if (cell === undefined) {
          continue
        }
        const objects = getAdjacentCellsObjects(cells, x, y)
        solveCollisionsForObjects(objects)
      }
    }
    return gridSize
  }
}

function solveCollisionsForObjects(objects: VerletObject[]) {
  for (let i = 0; i < objects.length; i++) {
    const object_1 = objects[i]
    for (let k = i + 1; k < objects.length; k++) {
      const object_2 = objects[k]
      const collision_axis = Vec2.diff(
        object_1.position_current,
        object_2.position_current,
      )
      const distance = collision_axis.getLength()
      const min_distance = object_1.radius + object_2.radius
      if (distance < min_distance) {
        const direction = collision_axis.multiply(1 / distance)
        const delta = min_distance - distance
        const new_position_1 = Vec2.add(
          object_1.position_current,
          direction.multiply(delta / 2),
        )
        const new_position_2 = Vec2.add(
          object_2.position_current,
          direction.multiply(-delta / 2),
        )
        object_1.position_current = new_position_1
        object_2.position_current = new_position_2
      }
    }
  }
}

function getAdjacentCellsObjects(
  cells: VerletObject[][][],
  x: number,
  y: number,
): VerletObject[] {
  const content: VerletObject[] = []
  for (let i = x - 1; i <= x + 1; i++) {
    for (let k = y - 1; k <= y + 1; k++) {
      if (cells[i] !== undefined && cells[i][k] !== undefined) {
        content.push(...cells[i][k])
      }
    }
  }
  return content
}
