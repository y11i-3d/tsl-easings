import { cos, HALF_PI, PI, select, sin } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const sineIn = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).greaterThanEqual(1),
      x,
      cos(x.mul(HALF_PI) as any).oneMinus(),
    ) as FloatOrVectorNode,
  "sineIn",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const sineOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    select(
      (x as any).greaterThanEqual(1),
      x,
      sin(x.mul(HALF_PI) as any),
    ) as FloatOrVectorNode,
  "sineOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const sineInOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) =>
    cos(x.mul(PI) as any)
      .oneMinus()
      .mul(0.5) as FloatOrVectorNode,
  "sineInOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

/* eslint-enable @typescript-eslint/no-explicit-any */
