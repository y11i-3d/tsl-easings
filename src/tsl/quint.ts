import { select } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quintIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const sq = x.mul(x);
    return sq.mul(sq).mul(x) as FloatOrVectorNode;
  },
  "quintIn",
  ["x"],
);

export const quintOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const sq = t.mul(t);
    return sq.mul(sq).mul(t).add(1) as FloatOrVectorNode;
  },
  "quintOut",
  ["x"],
);

export const quintInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const tSq = t.mul(t);
    return select(
      (x as any).lessThan(0.5),
      x.mul(x).mul(x.mul(x)).mul(x).mul(16),
      tSq.mul(tSq).mul(t).mul(16).add(1),
    ) as FloatOrVectorNode;
  },
  "quintInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
