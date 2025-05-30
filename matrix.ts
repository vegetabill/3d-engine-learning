import { Vec3D } from "./vector";

export type Matrix4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export function buildIdentityMatrix(): Matrix4x4 {
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function buildTranslationMatrix(
  x: number,
  y: number,
  z: number
): Matrix4x4 {
  const m = buildIdentityMatrix();
  m[3] = [x, y, z, m[3][3]];
  return m;
}

export function buildProjectionMatrix(
  aspectRatio: number,
  fovDeg: number,
  near: number,
  far: number
): Matrix4x4 {
  const fovRad = 1.0 / Math.tan(((fovDeg * 0.5) / 180.0) * Math.PI);
  const totalVisibleDistance = far - near;
  return [
    [aspectRatio * fovRad, 0, 0, 0],
    [0, fovRad, 0, 0],
    [0, 0, far / totalVisibleDistance, 1.0],
    [0, 0, (-1.0 * far * near) / totalVisibleDistance, 0.0],
  ];
}

export function buildRotationZMatrix(theta: number): Matrix4x4 {
  return [
    [Math.cos(theta), Math.sin(theta), 0, 0],
    [-1.0 * Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function buildRotationXMatrix(theta: number): Matrix4x4 {
  return [
    [1, 0, 0, 0],
    [0, Math.cos(theta), Math.sin(theta), 0],
    [0, -1.0 * Math.sin(theta), Math.cos(theta), 0],
    [0, 0, 0, 1],
  ];
}

export function multiplyMatrixVector(matrix: Matrix4x4, vec: Vec3D): Vec3D {
  return new Vec3D(
    vec.x * matrix[0][0] +
      vec.y * matrix[1][0] +
      vec.z * matrix[2][0] +
      vec.w * matrix[3][0],
    vec.x * matrix[0][1] +
      vec.y * matrix[1][1] +
      vec.z * matrix[2][1] +
      vec.w * matrix[3][1],
    vec.x * matrix[0][2] +
      vec.y * matrix[1][2] +
      vec.z * matrix[2][2] +
      vec.w * matrix[3][2],
    vec.x * matrix[0][3] +
      vec.y * matrix[1][3] +
      vec.z * matrix[2][3] +
      vec.w * matrix[3][3]
  );
}

export function multiplyMatrixMatrix(m1: Matrix4x4, m2: Matrix4x4): Matrix4x4 {
  const matrix: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      matrix[r][c] =
        m1[r][0] * m2[0][c] +
        m1[r][1] * m2[1][c] +
        m1[r][2] * m2[2][c] +
        m1[r][3] * m2[3][c];
  return matrix;
}
