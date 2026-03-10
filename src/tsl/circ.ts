import { select, sqrt, sub } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const circIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    sqrt(x.mul(x).oneMinus() as any).oneMinus() as FloatOrVectorNode,
  "circIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const circOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    sqrt(sub(2, x).mul(x) as any) as FloatOrVectorNode,
  "circOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const circInOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const t = x.mul(2).sub(2);
    return select(
      (x as any).lessThan(0.5),
      sqrt(x.mul(x).mul(-4).add(1) as any)
        .oneMinus()
        .mul(0.5),
      sqrt(t.mul(t).oneMinus() as any)
        .add(1)
        .mul(0.5),
    ) as FloatOrVectorNode;
  },
  "circInOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
