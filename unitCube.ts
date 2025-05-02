import { Vec3D, Triangle, Mesh } from "./olcPixelGameEngine";
const northL = new Triangle(
  new Vec3D(0, 1, 1),
  new Vec3D(1, 1, 1),
  new Vec3D(0, 0, 1)
);
const northR = new Triangle(
  new Vec3D(0, 0, 1),
  new Vec3D(1, 1, 1),
  new Vec3D(1, 0, 1)
);
const eastL = new Triangle(
  new Vec3D(1, 0, 0),
  new Vec3D(1, 1, 0),
  new Vec3D(1, 1, 1)
);
const eastR = new Triangle(
  new Vec3D(1, 0, 0),
  new Vec3D(1, 1, 1),
  new Vec3D(1, 0, 1)
);
const westL = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(0, 1, 0),
  new Vec3D(1, 1, 0)
);
const westR = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(1, 1, 0),
  new Vec3D(1, 0, 0)
);
const southL = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(0, 1, 0),
  new Vec3D(1, 1, 0)
);
const southR = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(1, 1, 0),
  new Vec3D(1, 0, 0)
);
const topL = new Triangle(
  new Vec3D(0, 1, 0),
  new Vec3D(0, 1, 1),
  new Vec3D(1, 1, 1)
);
const topR = new Triangle(
  new Vec3D(0, 1, 0),
  new Vec3D(1, 1, 1),
  new Vec3D(1, 1, 0)
);
const bottomL = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(0, 0, 1),
  new Vec3D(1, 0, 1)
);
const bottomR = new Triangle(
  new Vec3D(0, 0, 0),
  new Vec3D(1, 0, 1),
  new Vec3D(1, 0, 0)
);

const cube = new Mesh([
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
