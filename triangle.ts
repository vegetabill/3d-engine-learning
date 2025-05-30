import {
  buildRotationZMatrix,
  buildRotationXMatrix,
  multiplyMatrixVector,
  Matrix4x4,
} from "./matrix";
import { Vec3D } from "./vector";

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

  public add(vec: Vec3D) {
    return new Triangle(this.a.add(vec), this.b.add(vec), this.c.add(vec));
  }

  public multiply(vec: Vec3D) {
    return new Triangle(
      this.a.multiply(vec),
      this.b.multiply(vec),
      this.c.multiply(vec)
    );
  }

  public apply(matrix: Matrix4x4): Triangle {
    return new Triangle(
      multiplyMatrixVector(matrix, this.a),
      multiplyMatrixVector(matrix, this.b),
      multiplyMatrixVector(matrix, this.c)
    );
  }

  public rotate(theta: number) {
    const matRotZ = buildRotationZMatrix(theta);
    const matRotX = buildRotationXMatrix(theta * 0.5);
    const zRotated = this.apply(matRotZ);
    const xRotated = zRotated.apply(matRotX);
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

  public add(vec: Vec3D) {
    return new DrawableTriangle(this.triangle.add(vec), this.color);
  }

  public multiply(vec: Vec3D) {
    return new DrawableTriangle(this.triangle.multiply(vec), this.color);
  }

  public apply(matrix: Matrix4x4) {
    return new DrawableTriangle(this.triangle.apply(matrix), this.color);
  }
}
