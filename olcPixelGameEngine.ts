/**
 * From One Lone Coder tutorial (in C++)
 * https://www.youtube.com/watch?v=ih20l3pJoeU
 */
import { Window, type CanvasRenderingContext2D } from "skia-canvas";

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

export class Mesh {
  public triangles: Triangle[];
  constructor(triangles: Triangle[]) {
    this.triangles = triangles;
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
      background: "black",
      fullscreen: true,
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
      // ctx.moveTo(0, 0);
      // ctx.strokeStyle = "white";
      // ctx.strokeRect(0, 0, 100, 50);
      // ctx.stroke();
    });
  }

  drawTriangle(tri: Triangle) {
    // console.debug(tri);
    const ctx = this.context;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(tri.a.x, tri.a.y);
    ctx.lineTo(tri.b.x, tri.b.y);
    ctx.lineTo(tri.c.x, tri.c.y);
    ctx.lineTo(tri.a.x, tri.a.y);
    ctx.stroke();
  }
}
