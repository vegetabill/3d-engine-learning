// import cube from "./unitCube";

import {
  buildIdentityMatrix,
  buildPointAtMatrix,
  buildProjectionMatrix,
  buildRotationXMatrix,
  buildRotationZMatrix,
  buildTranslationMatrix,
  multiplyMatrixMatrix,
  quickInverse,
} from "./matrix";
import { Mesh } from "./mesh";
import { GameEngine } from "./olcPixelGameEngine";
import { DrawableTriangle, Triangle } from "./triangle";
import { Vec3D } from "./vector";
import { Key } from "ts-key-enum";

const HEIGHT = 240;
const WIDTH = 256;

const NEAR = 0.1;
const FAR = 1000.0;
const FOV = 90.0;
const ASPECT_RATIO = HEIGHT / WIDTH;

function transform(mesh: Mesh, theta: number, cam: Vec3D, lightSrc: Vec3D) {
  const lightNorm = lightSrc.normalized();
  const matRotZ = buildRotationZMatrix(0);
  const matRotX = buildRotationXMatrix(0);
  const matTrans = buildTranslationMatrix(0, 0, 8.0);

  let matWorld = buildIdentityMatrix();
  matWorld = multiplyMatrixMatrix(matRotZ, matRotX);
  matWorld = multiplyMatrixMatrix(matWorld, matTrans);

  const lookDir = new Vec3D(0, 0, 1);
  const up = new Vec3D(0, 1, 0);
  const target = cam.add(lookDir);

  const matrixCam = buildPointAtMatrix(cam, target, up);
  const matrixView = quickInverse(matrixCam);

  const threeDTriangles = mesh.triangles
    .map((tri) => tri.apply(matWorld))
    .flatMap((tri) => {
      // lines on either side of triangle
      const line1 = tri.b.subtract(tri.a);
      const line2 = tri.c.subtract(tri.a);
      const normal = line1.crossProduct(line2).normalized();
      const camRay = tri.a.subtract(cam);
      if (normal.dotProduct(camRay) < 0.0) {
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

  const projMat = buildProjectionMatrix(ASPECT_RATIO, FOV, NEAR, FAR);

  const projected = threeDTriangles
    // convert world space to view space
    .map((drawTri: DrawableTriangle) => drawTri.apply(matrixView))
    // project 3D -> 2D
    .map((drawTri: DrawableTriangle) => drawTri.apply(projMat))
    .map(({ triangle, color }) => {
      const { a, b, c } = triangle;
      return new DrawableTriangle(
        new Triangle(
          a.divideScalar(a.w),
          b.divideScalar(b.w),
          c.divideScalar(c.w)
        ),
        color
      );
    })
    .map((tri) => tri.add(new Vec3D(1, 1, 0)))
    .map((tri) => tri.multiply(new Vec3D(WIDTH * 0.5, HEIGHT * 0.5, 0)));
  return new Mesh(projected);
}

const engine = new GameEngine(WIDTH, HEIGHT, 1);
let totalTime = 0;
let theta = 0.0;
const lightSrc = new Vec3D(0.0, 0.0, -1.0);
// const loadedMesh = cube;
const loadedMesh = Mesh.fromObjFile("./axis.obj");

engine.onFrame((elapsedTime, keysPressed) => {
  totalTime += elapsedTime;
  theta += 1.0 * 0.05; // * totalTime;
  if (keysPressed.has(Key.ArrowUp)) {
    engine.camera.y += 0.05;
  }
  if (keysPressed.has(Key.ArrowLeft)) {
    engine.camera.x -= 0.05;
  }
  if (keysPressed.has(Key.ArrowRight)) {
    engine.camera.x += 0.05;
  }
  if (keysPressed.has(Key.ArrowDown)) {
    engine.camera.y -= 0.05;
  }
  const transformedMesh = transform(loadedMesh, theta, engine.camera, lightSrc);
  transformedMesh.drawables.forEach((tri) => engine.fillTriangle(tri));
});
engine.start();
