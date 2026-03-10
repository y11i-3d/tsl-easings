import { select, sin } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_AMPLITUDE = 1;
const DEFAULT_PERIOD = 0.3;
const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

export const customElasticIn = createOverloadingHomoFn(
  ([x, a, p]: [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]) => {
    const s = p.div(TAU).mul(HALF_PI);
    const t = x.sub(1);
    return select(
      (x as any).lessThanEqual(0),
      x,
      select(
        (x as any).greaterThanEqual(1),
        x,
        a
          .negate()
          .mul(sin(t.sub(s).mul(TAU).div(p) as any) as any)
          .mul((t.mul(10) as any).exp2() as any),
      ),
    ) as FloatOrVectorNode;
  },
  "customElasticIn",
  ["x", "a", "p"],
) as {
  (x: number, a: number, p: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, a: T | number, p: T | number): T;
} & FunctionOverloadingNode;

export const customElasticOut = createOverloadingHomoFn(
  ([x, a, p]: [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]) => {
    const s = p.div(TAU).mul(HALF_PI);
    return select(
      (x as any).lessThanEqual(0),
      x,
      select(
        (x as any).greaterThanEqual(1),
        x,
        a
          .mul(sin(x.sub(s).mul(TAU).div(p) as any) as any)
          .mul((x.mul(-10) as any).exp2() as any)
          .add(1),
      ),
    ) as FloatOrVectorNode;
  },
  "customElasticOut",
  ["x", "a", "p"],
) as {
  (x: number, a: number, p: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, a: T | number, p: T | number): T;
} & FunctionOverloadingNode;

export const customElasticInOut = createOverloadingHomoFn(
  ([x, a, p]: [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]) => {
    const s = p.div(TAU).mul(HALF_PI);
    const t = x.mul(2).sub(1);
    const sinVal = sin(t.sub(s).mul(TAU).div(p) as any) as any;
    return select(
      (x as any).lessThanEqual(0),
      x,
      select(
        (x as any).greaterThanEqual(1),
        x,
        select(
          (x as any).lessThan(0.5),
          a
            .negate()
            .mul(sinVal)
            .mul((t.mul(10) as any).exp2() as any)
            .mul(0.5),
          a
            .mul(sinVal)
            .mul((t.mul(-10) as any).exp2() as any)
            .mul(0.5)
            .add(1),
        ),
      ),
    ) as FloatOrVectorNode;
  },
  "customElasticInOut",
  ["x", "a", "p"],
) as {
  (x: number, a: number, p: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, a: T | number, p: T | number): T;
} & FunctionOverloadingNode;

export const elasticIn = ((x: FloatOrVectorNode | number) =>
  customElasticIn(x, DEFAULT_AMPLITUDE, DEFAULT_PERIOD)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

export const elasticOut = ((x: FloatOrVectorNode | number) =>
  customElasticOut(x, DEFAULT_AMPLITUDE, DEFAULT_PERIOD)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

export const elasticInOut = ((x: FloatOrVectorNode | number) =>
  customElasticInOut(x, DEFAULT_AMPLITUDE, DEFAULT_PERIOD)) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

/* eslint-enable @typescript-eslint/no-explicit-any */
