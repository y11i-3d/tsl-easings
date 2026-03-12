import { select } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const cubicIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => x.mul(x).mul(x) as FloatOrVectorNode,
  "cubicIn",
  ["x"],
);

export const cubicOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    return t.mul(t).mul(t).add(1) as FloatOrVectorNode;
  },
  "cubicOut",
  ["x"],
);

export const cubicInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    return select(
      (x as any).lessThan(0.5),
      x.mul(x).mul(x).mul(4),
      t.mul(t).mul(t).mul(4).add(1),
    ) as FloatOrVectorNode;
  },
  "cubicInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
