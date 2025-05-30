export class Vec2D {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    if (Number.isNaN(x)) {
      throw new Error(`invalid x value '${x}'`);
    }
    if (Number.isNaN(y)) {
      throw new Error(`invalid x value '${y}'`);
    }
    this.x = x;
    this.y = y;
  }
}

export class Vec3D extends Vec2D {
  public z: number;
  public w: number;

  constructor(x: number, y: number, z: number, w?: number) {
    super(x, y);
    if (Number.isNaN(z)) {
      throw new Error(`invalid z value '${z}'`);
    }
    this.z = z;
    this.w = !w || Number.isNaN(w) ? 1.0 : w;
  }

  public dotProduct(other: Vec3D) {
    const d = this.x * other.x + this.y * other.y + this.z * other.z;
    return d;
  }

  public divideScalar(k: number) {
    return new Vec3D(this.x / k, this.y / k, this.z / k);
  }

  public crossProduct(other: Vec3D) {
    return new Vec3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  public normalized(): Vec3D {
    const { x, y, z } = this;
    // normalize to 1 unit
    const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    return new Vec3D(x / length || 0, y / length || 0, z / length || 0);
  }

  public add(other: Vec3D) {
    return new Vec3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Vec3D): Vec3D {
    return new Vec3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public multiply(other: Vec3D) {
    return new Vec3D(this.x * other.x, this.y * other.y, this.z * other.z);
  }
}
