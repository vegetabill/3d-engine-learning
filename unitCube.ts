import { Mesh } from "./mesh";
import { Triangle } from "./triangle";
import { Vec3D } from "./vector";

/**
 * https://github.com/OneLoneCoder/Javidx9/blob/3345794468195001572f6bf75fc8f10c4bdbb7bf/ConsoleGameEngine/BiggerProjects/Engine3D/OneLoneCoder_olcEngine3D_Part1.cpp#L107
 */
const southL = new Triangle(
  new Vec3D(0.0, 0.0, 0.0),
  new Vec3D(0.0, 1.0, 0.0),
  new Vec3D(1.0, 1.0, 0.0)
);
const southR = new Triangle(
  new Vec3D(0.0, 0.0, 0.0),
  new Vec3D(1.0, 1.0, 0.0),
  new Vec3D(1.0, 0.0, 0.0)
);
const eastL = new Triangle(
  new Vec3D(1.0, 0.0, 0.0),
  new Vec3D(1.0, 1.0, 0.0),
  new Vec3D(1.0, 1.0, 1.0)
);
const eastR = new Triangle(
  new Vec3D(1.0, 0.0, 0.0),
  new Vec3D(1.0, 1.0, 1.0),
  new Vec3D(1.0, 0.0, 1.0)
);
const northL = new Triangle(
  new Vec3D(1.0, 0.0, 1.0),
  new Vec3D(1.0, 1.0, 1.0),
  new Vec3D(0.0, 1.0, 1.0)
);
const northR = new Triangle(
  new Vec3D(1.0, 0.0, 1.0),
  new Vec3D(0.0, 1.0, 1.0),
  new Vec3D(0.0, 0.0, 1.0)
);
const westL = new Triangle(
  new Vec3D(0.0, 0.0, 1.0),
  new Vec3D(0.0, 1.0, 1.0),
  new Vec3D(0.0, 1.0, 0.0)
);
const westR = new Triangle(
  new Vec3D(0.0, 0.0, 1.0),
  new Vec3D(0.0, 1.0, 0.0),
  new Vec3D(0.0, 0.0, 0.0)
);
const topL = new Triangle(
  new Vec3D(0.0, 1.0, 0.0),
  new Vec3D(0.0, 1.0, 1.0),
  new Vec3D(1.0, 1.0, 1.0)
);
const topR = new Triangle(
  new Vec3D(0.0, 1.0, 0.0),
  new Vec3D(1.0, 1.0, 1.0),
  new Vec3D(1.0, 1.0, 0.0)
);
const bottomL = new Triangle(
  new Vec3D(1.0, 0.0, 1.0),
  new Vec3D(0.0, 0.0, 1.0),
  new Vec3D(0.0, 0.0, 0.0)
);
const bottomR = new Triangle(
  new Vec3D(1.0, 0.0, 1.0),
  new Vec3D(0.0, 0.0, 0.0),
  new Vec3D(1.0, 0.0, 0.0)
);

const cube = Mesh.fromTriangles([
  southL,
  southR,
  eastL,
  eastR,
  northL,
  northR,
  westL,
  westR,
  topL,
  topR,
  bottomL,
  bottomR,
]);

export default cube;
