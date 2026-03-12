import { select } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quadIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => x.mul(x) as FloatOrVectorNode,
  "quadIn",
  ["x"],
);

export const quadOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => x.mul(x.sub(2)).negate() as FloatOrVectorNode,
  "quadOut",
  ["x"],
);

export const quadInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const p = x.mul(x).mul(2);
    return select(
      (x as any).lessThan(0.5),
      p,
      p.negate().add(x.mul(4)).sub(1),
    ) as FloatOrVectorNode;
  },
  "quadInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
