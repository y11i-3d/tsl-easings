import { exp2, select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const expoIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).lessThanEqual(0),
      x,
      exp2(x.mul(10).sub(10) as any),
    ) as FloatOrVectorNode,
  "expoIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const expoOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).greaterThanEqual(1),
      x,
      exp2(x.mul(-10) as any).oneMinus(),
    ) as FloatOrVectorNode,
  "expoOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const expoInOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).lessThanEqual(0),
      x,
      select(
        (x as any).greaterThanEqual(1),
        x,
        select(
          (x as any).lessThan(0.5),
          exp2(x.mul(20).sub(11) as any),
          exp2(x.mul(-20).add(9) as any).oneMinus(),
        ),
      ),
    ) as FloatOrVectorNode,
  "expoInOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
