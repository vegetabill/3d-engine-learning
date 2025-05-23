// import cube from "./unitCube";

import { Mesh } from "./mesh";
import { GameEngine } from "./olcPixelGameEngine";
import { DrawableTriangle, Triangle } from "./triangle";
import { Vec3D } from "./vector";

const HEIGHT = 240;
const WIDTH = 256;

const NEAR = 0.1;
const FAR = 1000.0;
const FOV = 90.0;
const ASPECT_RATIO = HEIGHT / WIDTH;
const FOV_RAD = 1.0 / Math.tan(((FOV * 0.5) / 180.0) * Math.PI);

const PROJECTION = [
  [ASPECT_RATIO * FOV_RAD, 0, 0, 0],
  [0, FOV_RAD, 0, 0],
  [0, 0, FAR / (FAR - NEAR), 1.0],
  [0, 0, (-1.0 * FAR * NEAR) / (FAR - NEAR), 0.0],
];

function multiplyMatrixVector(matrix: number[][], vec: Vec3D): Vec3D {
  const w =
    vec.x * matrix[0][3] +
    vec.y * matrix[1][3] +
    vec.z * matrix[2][3] +
    // implied 4th coordinate in vector is 1
    1.0 * matrix[3][3];

  // if (w != 0.0) {
  return new Vec3D(
    (vec.x * matrix[0][0] +
      vec.y * matrix[1][0] +
      vec.z * matrix[2][0] +
      matrix[3][0]) /
      w,
    (vec.x * matrix[0][1] +
      vec.y * matrix[1][1] +
      vec.z * matrix[2][1] +
      matrix[3][1]) /
      w,
    (vec.x * matrix[0][2] +
      vec.y * matrix[1][2] +
      vec.z * matrix[2][2] +
      matrix[3][2]) /
      w
  );
  // }
}

function shiftPerspective(tri: Triangle): Triangle {
  return tri.transform(
    (x) => x,
    (y) => y,
    (z) => z + 8.0
  );
}

function scaleTriangle(tri: DrawableTriangle): DrawableTriangle {
  return tri
    .transform(
      (x) => x + 1.0,
      (y) => y + 1.0,
      () => 0.0
    )
    .transform(
      (x) => x * WIDTH * 0.5,
      (y) => y * HEIGHT * 0.5,
      () => 0.0 // not used because this is post-transform so it's 2D
    );
}

function rotate(tri: Triangle, theta: number) {
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
    multiplyMatrixVector(matRotZ, tri.a),
    multiplyMatrixVector(matRotZ, tri.b),
    multiplyMatrixVector(matRotZ, tri.c)
  );

  const xRotated = new Triangle(
    multiplyMatrixVector(matRotX, zRotated.a),
    multiplyMatrixVector(matRotX, zRotated.b),
    multiplyMatrixVector(matRotX, zRotated.c)
  );
  return xRotated;
}

function transform(mesh: Mesh, theta: number, cam: Vec3D, lightSrc: Vec3D) {
  const lightNorm = lightSrc.normalized();
  const threeDTriangles = mesh.triangles
    .map((tri) => rotate(tri, theta))
    .map(shiftPerspective)
    .flatMap((tri) => {
      const normal = tri.normalVec();
      if (
        normal.x * (tri.a.x - cam.x) +
          normal.y * (tri.a.y - cam.y) +
          normal.z * (tri.a.z - cam.z) <
        0.0
      ) {
        const dotProduct = lightNorm.dotProduct(normal);
        const grayscale = 100.0 * dotProduct;
        return [new DrawableTriangle(tri, `hsl(0, 0%, ${grayscale}%)`)];
      } else {
        return [];
      }
    })
    .sort((first, second) => {
      const z1 =
        first.triangle.a.z + first.triangle.b.z + first.triangle.c.z / 3.0;
      const z2 =
        second.triangle.a.z + second.triangle.b.z + second.triangle.c.z / 3.0;
      return z2 - z1;
    });

  const projected = threeDTriangles
    .map(
      (drawTri: DrawableTriangle) =>
        new DrawableTriangle(
          new Triangle(
            multiplyMatrixVector(PROJECTION, drawTri.triangle.a),
            multiplyMatrixVector(PROJECTION, drawTri.triangle.b),
            multiplyMatrixVector(PROJECTION, drawTri.triangle.c)
          ),
          drawTri.color
        )
    )
    .map(scaleTriangle);
  return new Mesh(projected);
}

const engine = new GameEngine(WIDTH, HEIGHT, 1);
let totalTime = 0;
let theta = 0.0;
const lightSrc = new Vec3D(0.0, 0.0, -1.0);
const loadedMesh = Mesh.fromObjFile("./VideoShip.obj");

engine.onFrame((elapsedTime) => {
  totalTime += elapsedTime;
  theta += 1.0 * 0.05; // * totalTime;
  const transformedMesh = transform(loadedMesh, theta, engine.camera, lightSrc);
  transformedMesh.drawables.forEach((tri) => engine.fillTriangle(tri));
});
engine.start();
