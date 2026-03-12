import { select } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quartIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const sq = x.mul(x);
    return sq.mul(sq) as FloatOrVectorNode;
  },
  "quartIn",
  ["x"],
);

export const quartOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const sq = t.mul(t);
    return sq.mul(sq).negate().add(1) as FloatOrVectorNode;
  },
  "quartOut",
  ["x"],
);

export const quartInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const tSq = t.mul(t);
    return select(
      (x as any).lessThan(0.5),
      x.mul(x).mul(x.mul(x)).mul(8),
      tSq.mul(tSq).mul(-8).add(1),
    ) as FloatOrVectorNode;
  },
  "quartInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
