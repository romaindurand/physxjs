export class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static diff(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y)
  }

  static add(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y)
  }

  multiply(value: number): Vec2 {
    return new Vec2(this.x * value, this.y * value)
  }

  getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  moveX(value: number): Vec2 {
    return new Vec2(this.x + value, this.y)
  }

  moveY(value: number): Vec2 {
    return new Vec2(this.x, this.y + value)
  }
}
