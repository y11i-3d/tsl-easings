import { select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quartIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const sq = x.mul(x);
    return sq.mul(sq) as FloatOrVectorNode;
  },
  "quartIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quartOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    const sq = t.mul(t);
    return sq.mul(sq).negate().add(1) as FloatOrVectorNode;
  },
  "quartOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quartInOut = createOverloadingHomoFn(
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
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
