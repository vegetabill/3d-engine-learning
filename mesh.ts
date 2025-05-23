import * as fs from "fs";

import { DrawableTriangle, Triangle } from "./triangle";
import { Vec3D } from "./vector";

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
      tris.map(
        (tri) => new DrawableTriangle(tri, DrawableTriangle.DEFAULT_COLOR)
      )
    );
  }

  public static fromObjFile(filename: string): Mesh {
    const vertices: Vec3D[] = [];
    const triangles: Triangle[] = [];

    const lines = fs.readFileSync(filename).toString().split("\n");

    lines.forEach((line) => {
      if (!line || line.trim() === "") {
        return;
      }
      const code = line.charAt(0);
      const rest = line.substring(1).trim();
      if (code === "v") {
        const [x, y, z] = rest.split(" ").map(Number.parseFloat);
        const vertex = new Vec3D(x, y, z);
        vertices.push(vertex);
      } else if (code === "f") {
        const [idx1, idx2, idx3] = rest
          .split(" ")
          .map((s) => Number.parseInt(s));
        const p1 = vertices[idx1 - 1];
        const p2 = vertices[idx2 - 1];
        const p3 = vertices[idx3 - 1];
        const triangle = new Triangle(p1, p2, p3);
        triangles.push(triangle);
      } else if (code === "#" || code === "s") {
        // skip
      } else {
        console.warn(`unknown char ${code}`);
      }
    });

    console.debug(
      `loaded ${triangles.length} triangles consisting of ${vertices.length} vertices`
    );

    return this.fromTriangles(triangles);
  }

  constructor(triangles: DrawableTriangle[]) {
    this.drawables = triangles;
  }
}
