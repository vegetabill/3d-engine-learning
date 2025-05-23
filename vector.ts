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

export type NumTransformFn = (n: number) => number;

export class Vec3D extends Vec2D {
  public z: number;

  constructor(x: number, y: number, z: number) {
    super(x, y);
    if (Number.isNaN(y)) {
      throw new Error(`invalid z value '${z}'`);
    }
    this.z = z;
  }

  public dotProduct(other: Vec3D) {
    const d = this.x * other.x + this.y * other.y + this.z * other.z;
    return d;
  }

  public normalized(): Vec3D {
    const { x, y, z } = this;
    // normalize to 1 unit
    const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    return new Vec3D(x / length || 0, y / length || 0, z / length || 0);
  }

  public transform(
    xFn: NumTransformFn,
    yFn: NumTransformFn,
    zFn: NumTransformFn
  ): Vec3D {
    return new Vec3D(xFn(this.x), yFn(this.y), zFn(this.z));
  }
}

export class Vec4D extends Vec3D {
  public w: number;

  constructor(x: number, y: number, z: number, w: number) {
    super(x, y, z);
    this.w = w;
  }
}
