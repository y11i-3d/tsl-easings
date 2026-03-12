import { cos, HALF_PI, PI, select, sin } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const sineIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).greaterThanEqual(1),
      x,
      cos(x.mul(HALF_PI) as any).oneMinus(),
    ) as FloatOrVectorNode,
  "sineIn",
  ["x"],
);

export const sineOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).greaterThanEqual(1),
      x,
      sin(x.mul(HALF_PI) as any),
    ) as FloatOrVectorNode,
  "sineOut",
  ["x"],
);

export const sineInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) =>
    cos(x.mul(PI) as any)
      .oneMinus()
      .mul(0.5) as FloatOrVectorNode,
  "sineInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
