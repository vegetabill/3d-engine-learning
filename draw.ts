import * as fs from "fs";
import {
  Vec3D,
  Triangle,
  Mesh,
  GameEngine,
  DrawableTriangle,
  Vec2D,
} from "./olcPixelGameEngine";

const HEIGHT = 240;
const WIDTH = 256;

const engine = new GameEngine(WIDTH, HEIGHT, 1);
let totalTime = 0;
let theta = 0.0;

const lines: string[] = fs.readFileSync("./demo.txt", "utf8").split("\n");

engine.onFrame((elapsedTime) => {
  let points: Vec3D[] = [];
  let line: string | undefined;
  while ((line = lines.shift())) {
    if (!line) break;
    if (line.includes("---")) break;
    const [p1, p2] = line
      .split("=>")
      .map((s) => s.trim())
      .map((s) =>
        s.split(",").map((s) => s.trim().replace("(", "").replace(")", ""))
      )
      .map(([x, y]) => new Vec3D(Number.parseInt(x), Number.parseInt(y), 0.0));

    points = points.concat(p1, p2);
  }

  if (points.length != 6) throw new Error("Invalid points: " + points);

  const triangle = new Triangle(points[0], points[2], points[4]);
  const drawable = new DrawableTriangle(triangle, GameEngine.DEFAULT_COLOR);
  engine.drawTriangle(drawable);
});
engine.start();
