import cube from "./unitCube";

import {
  buildIdentityMatrix,
  buildProjectionMatrix,
  buildRotationXMatrix,
  buildRotationZMatrix,
  buildTranslationMatrix,
  Matrix4x4,
  multiplyMatrixMatrix,
  multiplyMatrixVector,
} from "./matrix";
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

function transform(mesh: Mesh, theta: number, cam: Vec3D, lightSrc: Vec3D) {
  const lightNorm = lightSrc.normalized();
  const matRotZ = buildRotationZMatrix(theta * 0.5);
  const matRotX = buildRotationXMatrix(theta);
  const matTrans = buildTranslationMatrix(0, 0, 5.0);

  let matWorld = buildIdentityMatrix();
  matWorld = multiplyMatrixMatrix(matRotZ, matRotX);
  matWorld = multiplyMatrixMatrix(matWorld, matTrans);

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
    .map(scaleTriangle);
  return new Mesh(projected);
}

const engine = new GameEngine(WIDTH, HEIGHT, 1);
let totalTime = 0;
let theta = 0.0;
const lightSrc = new Vec3D(0.0, 0.0, -1.0);
// const loadedMesh = cube;
const loadedMesh = Mesh.fromObjFile("./VideoShip.obj");

engine.onFrame((elapsedTime) => {
  totalTime += elapsedTime;
  theta += 1.0 * 0.05; // * totalTime;
  const transformedMesh = transform(loadedMesh, theta, engine.camera, lightSrc);
  transformedMesh.drawables.forEach((tri) => engine.fillTriangle(tri));
});
engine.start();
