/**
 * From One Lone Coder tutorial (in C++)
 * https://www.youtube.com/watch?v=ih20l3pJoeU
 */
import {
  KeyboardEventProps,
  Window,
  type CanvasRenderingContext2D,
} from "skia-canvas";
import { Vec3D } from "./vector";
import { DrawableTriangle } from "./triangle";
import { Key } from "ts-key-enum";

export class GameEngine {
  context: CanvasRenderingContext2D;
  pixelSize: number;
  win: Window;
  width: number;
  height: number;
  previousTime: number;
  camera: Vec3D;
  setupFn: () => Promise<void>;

  public keysPressed: Set<Key>;

  constructor(width: number, height: number, pixelSize: number) {
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;
    this.previousTime = 0;
    this.keysPressed = new Set();
    this.camera = new Vec3D(0, 0, 0);
    this.setupFn = async () => undefined;
    this.win = new Window(this.height, this.width, {
      title: "3D Cube",
      background: DrawableTriangle.DEFAULT_BG,
      // fullscreen: true,
      fit: "fill",
    });
    this.win.on("keydown", ({ code }) => {
      this.keysPressed.add(code as unknown as Key);
    });
    this.win.on("keyup", ({ code }) => {
      this.keysPressed.delete(code as unknown as Key);
    });
  }

  onSetup(cb: () => Promise<void>) {
    this.setupFn = cb;
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      const setupCb = () => {
        this.context = this.win.canvas.getContext("2d");
        this.win.off("setup", setupCb);
        this.setupFn().then(resolve);
      };
      this.win.on("setup", setupCb);
    });
  }

  onFrame(cb: (elapsedTime: number, keysPressed: Set<Key>) => void) {
    this.win.on("frame", ({ frame }) => {
      const ctx = this.context;
      ctx.reset();
      cb.bind(this)(frame - this.previousTime, this.keysPressed);
      this.previousTime = frame;
    });
  }

  fillTriangle(drawable: DrawableTriangle) {
    const tri = drawable.triangle;
    const { color } = drawable;
    const ctx = this.context;
    ctx.moveTo(tri.a.x, tri.a.y);
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.lineTo(tri.b.x, tri.b.y);
    ctx.lineTo(tri.c.x, tri.c.y);
    ctx.lineTo(tri.a.x, tri.a.y);
    ctx.fill();
    ctx.stroke();
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
