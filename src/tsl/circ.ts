import { max, select, sqrt, sub } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const circIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) =>
    sqrt(max(x.mul(x).oneMinus(), 0) as any).oneMinus() as FloatOrVectorNode,
  "circIn",
  ["x"],
);

export const circOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) =>
    sqrt(max(sub(2, x).mul(x), 0) as any) as FloatOrVectorNode,
  "circOut",
  ["x"],
);

export const circInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.mul(2).sub(2);
    return select(
      (x as any).lessThan(0.5),
      sqrt(max(x.mul(x).mul(-4).add(1), 0) as any)
        .oneMinus()
        .mul(0.5),
      sqrt(max(t.mul(t).oneMinus(), 0) as any)
        .add(1)
        .mul(0.5),
    ) as FloatOrVectorNode;
  },
  "circInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
