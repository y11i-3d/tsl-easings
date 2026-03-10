import { select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_OVERSHOOT = 1.70158;

export const customBackIn = createOverloadingHomoFn(
  ([x, s]: [FloatOrVectorNode, FloatOrVectorNode]) =>
    x.mul(x).mul(s.add(1).mul(x).sub(s)) as FloatOrVectorNode,
  "customBackIn",
  ["x", "s"],
) as {
  (x: number, s: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, s: T | number): T;
} & FunctionOverloadingNode;

export const customBackOut = createOverloadingHomoFn(
  ([x, s]: [FloatOrVectorNode, FloatOrVectorNode]) => {
    const t = x.sub(1);
    return t.mul(t).mul(s.add(1).mul(t).add(s)).add(1) as FloatOrVectorNode;
  },
  "customBackOut",
  ["x", "s"],
) as {
  (x: number, s: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, s: T | number): T;
} & FunctionOverloadingNode;

export const customBackInOut = createOverloadingHomoFn(
  ([x, s]: [FloatOrVectorNode, FloatOrVectorNode]) => {
    const s2 = s.mul(1.525);
    const s2p1 = s2.add(1);
    const t = x.mul(2);
    const t2 = t.sub(2);
    return select(
      (x as any).lessThan(0.5),
      t.mul(t).mul(s2p1.mul(t).sub(s2)).mul(0.5),
      t2.mul(t2).mul(s2p1.mul(t2).add(s2)).add(2).mul(0.5),
    ) as FloatOrVectorNode;
  },
  "customBackInOut",
  ["x", "s"],
) as {
  (x: number, s: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, s: T | number): T;
} & FunctionOverloadingNode;

export const backIn = ((x: FloatOrVectorNode | number) =>
  customBackIn(x, DEFAULT_OVERSHOOT)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

export const backOut = ((x: FloatOrVectorNode | number) =>
  customBackOut(x, DEFAULT_OVERSHOOT)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

export const backInOut = ((x: FloatOrVectorNode | number) =>
  customBackInOut(x, DEFAULT_OVERSHOOT)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

/* eslint-enable @typescript-eslint/no-explicit-any */
