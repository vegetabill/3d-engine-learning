import { Vec3D } from "./vector";

export function multiplyMatrixVector(matrix: number[][], vec: Vec3D): Vec3D {
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
