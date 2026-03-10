import { select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const quadIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => x.mul(x) as FloatOrVectorNode,
  "quadIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quadOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => x.mul(x.sub(2)).negate() as FloatOrVectorNode,
  "quadOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const quadInOut = createOverloadingHomoFn(
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
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
