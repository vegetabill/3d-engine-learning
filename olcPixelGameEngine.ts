/**
 * From One Lone Coder tutorial (in C++)
 * https://www.youtube.com/watch?v=ih20l3pJoeU
 */
import { Window, type CanvasRenderingContext2D } from "skia-canvas";

const DEFAULT_COLOR = "white";
const DEFAULT_BG = "black";
const DEFAULT_INVISIBLE = "blue";

type NumTransformFn = (n: number) => number;

export class Vec3D {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public transform(
    xFn: NumTransformFn,
    yFn: NumTransformFn,
    zFn: NumTransformFn
  ): Vec3D {
    return new Vec3D(xFn(this.x), yFn(this.y), zFn(this.z));
  }
}

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
    // normalize to 1 unit
    const length = Math.sqrt(
      norm.x * norm.x + norm.y * norm.y + norm.z * norm.z
    );
    const normalized = new Vec3D(
      norm.x / length,
      norm.y / length,
      norm.z / length
    );
    // console.debug(normalized, length);
    return normalized;
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

  constructor(p1: Vec3D, p2: Vec3D, p3: Vec3D) {
    this.vertices = [p1, p2, p3];
  }
}

export class DrawableTriangle {
  public color: string;
  public triangle: Triangle;

  constructor(tri: Triangle, color: string) {
    this.triangle = tri;
    this.color = color;
  }
}

export class Mesh {
  public get triangles() {
    return this.drawables.map((d) => d.triangle);
  }

  colorAt(index: number): string {
    const drawable = this.drawables[index];
    if (!drawable) {
      return "red;";
    }
    return drawable.color;
  }

  public drawables: DrawableTriangle[];

  public static fromTriangles(tris: Triangle[]): Mesh {
    return new Mesh(
      tris.map((tri) => new DrawableTriangle(tri, DEFAULT_COLOR))
    );
  }

  constructor(triangles: DrawableTriangle[]) {
    this.drawables = triangles;
  }
}

export class GameEngine {
  context: CanvasRenderingContext2D;
  pixelSize: number;
  win: Window;
  width: number;
  height: number;
  previousTime: number;

  constructor(width: number, height: number, pixelSize: number) {
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.previousTime = 0;

    this.win = new Window(this.height, this.width, {
      title: "3D Cube",
      background: DEFAULT_BG,
      // fullscreen: true,
      fit: "fill",
    });
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      const setupCb = () => {
        this.context = this.win.canvas.getContext("2d");
        this.win.off("setup", setupCb);
        resolve();
      };
      this.win.on("setup", setupCb);
    });
  }

  onFrame(cb: (elapsedTime: number) => void) {
    this.win.on("frame", ({ frame }) => {
      const ctx = this.context;
      ctx.reset();
      cb.bind(this)(frame - this.previousTime);
      this.previousTime = frame;
    });
  }

  drawTriangle(drawable: DrawableTriangle) {
    const tri = drawable.triangle;
    const { color } = drawable;
    const ctx = this.context;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(tri.a.x, tri.a.y);
    ctx.lineTo(tri.b.x, tri.b.y);
    ctx.lineTo(tri.c.x, tri.c.y);
    ctx.lineTo(tri.a.x, tri.a.y);
    ctx.stroke();
  }
}
