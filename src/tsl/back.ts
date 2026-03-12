import { float, select } from "three/tsl";
import { type Node } from "three/webgpu";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode, type JSHomoFn } from "./types.js";
import { createHomoFn } from "./utils.js";

type BackEaseSignature = {
  (x: number, s: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, s: T | number): T;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_OVERSHOOT = 1.70158;

const jsCustomBackIn: JSHomoFn<[FloatOrVectorNode, FloatOrVectorNode]> = ([
  x,
  s,
]) => x.mul(x).mul(s.add(1).mul(x).sub(s)) as FloatOrVectorNode;

const jsCustomBackOut: JSHomoFn<[FloatOrVectorNode, FloatOrVectorNode]> = ([
  x,
  s,
]) => {
  const t = x.sub(1);
  return t.mul(t).mul(s.add(1).mul(t).add(s)).add(1) as FloatOrVectorNode;
};

const jsCustomBackInOut: JSHomoFn<[FloatOrVectorNode, FloatOrVectorNode]> = ([
  x,
  s,
]) => {
  const s2 = s.mul(1.525);
  const s2p1 = s2.add(1);
  const t = x.mul(2);
  const t2 = t.sub(2);
  return select(
    (x as any).lessThan(0.5),
    t.mul(t).mul(s2p1.mul(t).sub(s2)).mul(0.5),
    t2.mul(t2).mul(s2p1.mul(t2).add(s2)).add(2).mul(0.5),
  ) as FloatOrVectorNode;
};

const jsBackIn: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomBackIn([x, float(DEFAULT_OVERSHOOT)]);

const jsBackOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomBackOut([x, float(DEFAULT_OVERSHOOT)]);

const jsBackInOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomBackInOut([x, float(DEFAULT_OVERSHOOT)]);

export const customBackIn = createHomoFn<
  BackEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomBackIn, "customBackIn", ["x", "s"]);

export const customBackOut = createHomoFn<
  BackEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomBackOut, "customBackOut", ["x", "s"]);

export const customBackInOut = createHomoFn<
  BackEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomBackInOut, "customBackInOut", ["x", "s"]);

export const backIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBackIn,
  "backIn",
  ["x"],
);

export const backOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBackOut,
  "backOut",
  ["x"],
);

export const backInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBackInOut,
  "backInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
