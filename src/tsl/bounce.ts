import { float, select } from "three/tsl";
import { type FunctionOverloadingNode, type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";
import { createOverloadingHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

const N1 = 7.5625;
const D1 = 2.75;

export const bounceOut = createOverloadingHomoFn(
  ([x]: [FloatOrVectorNode]) => {
    const x1 = x.sub(1.5 / D1);
    const x2 = x.sub(2.25 / D1);
    const x3 = x.sub(2.625 / D1);
    return select(
      (x as any).lessThan(1 / D1),
      x.mul(x).mul(N1),
      select(
        (x as any).lessThan(2 / D1),
        x1.mul(x1).mul(N1).add(0.75),
        select(
          (x as any).lessThan(2.5 / D1),
          x2.mul(x2).mul(N1).add(0.9375),
          x3.mul(x3).mul(N1).add(0.984375),
        ),
      ),
    ) as FloatOrVectorNode;
  },
  "bounceOut",
  ["x"],
) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
} & FunctionOverloadingNode;

export const bounceIn = ((x: FloatOrVectorNode | number) => {
  const xn = typeof x === "number" ? float(x) : x;
  return (bounceOut((xn as any).oneMinus()) as any).oneMinus();
}) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

export const bounceInOut = ((x: FloatOrVectorNode | number) => {
  const xn = typeof x === "number" ? float(x) : x;
  const xn2 = (xn as any).mul(2);
  return select(
    (xn as any).lessThan(0.5),
    (bounceOut(xn2.negate().add(1)) as any).oneMinus().mul(0.5),
    (bounceOut(xn2.sub(1)) as any).mul(0.5).add(0.5),
  );
}) as {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};

/* eslint-enable @typescript-eslint/no-explicit-any */
