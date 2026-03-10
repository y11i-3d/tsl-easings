import { select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const cubicIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => x.mul(x).mul(x) as FloatOrVectorNode,
  "cubicIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const cubicOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.sub(1);
    return t.mul(t).mul(t).add(1) as FloatOrVectorNode;
  },
  "cubicOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const cubicInOut = createOverloadingHomoFn(
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
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
