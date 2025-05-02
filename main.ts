import { Vec3D, Triangle, Mesh, GameEngine } from "./olcPixelGameEngine";
import cube from "./unitCube";

const HEIGHT = 320.0;
const WIDTH = 240.0;

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
    (x) => x + 1.0,
    (y) => y + 1.0,
    (z) => z + 5.0
  );
}

function scaleTriangle(tri: Triangle): Triangle {
  return tri
    .transform(
      (x) => x + 0.5,
      (y) => y + 0.5,
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

function debugLog(tri: Triangle) {
  console.debug(tri);
  return tri;
}

function transform(mesh: Mesh, theta: number) {
  return new Mesh(
    mesh.triangles
      // .map(debugLog)
      .map((tri) => rotate(tri, theta))
      .map(shiftPerspective)
      .map(
        (tri: Triangle) =>
          new Triangle(
            multiplyMatrixVector(PROJECTION, tri.a),
            multiplyMatrixVector(PROJECTION, tri.b),
            multiplyMatrixVector(PROJECTION, tri.c)
          )
      )
      .map(scaleTriangle)
  );
}

const engine = new GameEngine(WIDTH, HEIGHT, 1);
let totalTime = 0;
let theta = 0.0;
engine.onFrame((elapsedTime) => {
  totalTime += elapsedTime;
  theta += 1.0 * 0.05; // * totalTime;
  const transformedMesh = transform(cube, theta);
  transformedMesh.triangles.forEach((tri) => engine.drawTriangle(tri));
});
engine.start();
