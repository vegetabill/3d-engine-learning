import { multiplyMatrixVector } from "./matrix";
import { Vec3D, NumTransformFn } from "./vector";

export class Triangle {
  public vertices: [Vec3D, Vec3D, Vec3D];

  public get a() {
    return this.vertices[0];
  }

  public get b() {
    return this.vertices[1];
  }

  public get c() {
    return this.vertices[2];
  }

  public normalVec() {
    const line1 = new Vec3D(
      this.b.x - this.a.x,
      this.b.y - this.a.y,
      this.b.z - this.a.z
    );
    const line2 = new Vec3D(
      this.c.x - this.a.x,
      this.c.y - this.a.y,
      this.c.z - this.a.z
    );
    const norm = new Vec3D(
      line1.y * line2.z - line1.z * line2.y,
      line1.z * line2.x - line1.x * line2.z,
      line1.x * line2.y - line1.y * line2.x
    );
    return norm.normalized();
  }

  public transform(
    xFn: NumTransformFn,
    yFn: NumTransformFn,
    zFn: NumTransformFn
  ): Triangle {
    return new Triangle(
      this.a.transform(xFn, yFn, zFn),
      this.b.transform(xFn, yFn, zFn),
      this.c.transform(xFn, yFn, zFn)
    );
  }

  public rotate(theta: number) {
    const matRotZ = [
      [Math.cos(theta), Math.sin(theta), 0, 0],
      [-1.0 * Math.sin(theta), Math.cos(theta), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];

    const matRotX = [
      [1, 0, 0, 0],
      [0, Math.cos(theta * 0.5), Math.sin(theta * 0.5), 0],
      [0, -1.0 * Math.sin(theta * 0.5), Math.cos(theta * 0.5), 0],
      [0, 0, 0, 1],
    ];

    const zRotated = new Triangle(
      multiplyMatrixVector(matRotZ, this.a),
      multiplyMatrixVector(matRotZ, this.b),
      multiplyMatrixVector(matRotZ, this.c)
    );

    const xRotated = new Triangle(
      multiplyMatrixVector(matRotX, zRotated.a),
      multiplyMatrixVector(matRotX, zRotated.b),
      multiplyMatrixVector(matRotX, zRotated.c)
    );
    return xRotated;
  }

  constructor(p1: Vec3D, p2: Vec3D, p3: Vec3D) {
    if (p1 instanceof Vec3D && p2 instanceof Vec3D && p3 instanceof Vec3D) {
      this.vertices = [p1, p2, p3];
    } else {
      throw new Error(`invalid vertices: 'p1=${p1}', p2='${p2}', p3='${p3}'`);
    }
  }
}

export class DrawableTriangle {
  public color: string;
  public triangle: Triangle;

  public static DEFAULT_COLOR = "white";
  public static DEFAULT_BG = "black";
  public static DEFAULT_INVISIBLE = this.DEFAULT_BG;

  constructor(tri: Triangle, color: string) {
    this.triangle = tri;
    this.color = color;
  }

  public transform(
    xFn: NumTransformFn,
    yFn: NumTransformFn,
    zFn: NumTransformFn
  ) {
    const { a, b, c } = this.triangle;
    const transformed = new Triangle(
      a.transform(xFn, yFn, zFn),
      b.transform(xFn, yFn, zFn),
      c.transform(xFn, yFn, zFn)
    );
    return new DrawableTriangle(transformed, this.color);
  }
}
