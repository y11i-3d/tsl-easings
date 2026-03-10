import { select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quintIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const sq = x.mul(x);
    return sq.mul(sq).mul(x) as FloatOrVectorNode;
  },
  "quintIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quintOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const sq = t.mul(t);
    return sq.mul(sq).mul(t).add(1) as FloatOrVectorNode;
  },
  "quintOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quintInOut = createOverloadingHomoFn(
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
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
