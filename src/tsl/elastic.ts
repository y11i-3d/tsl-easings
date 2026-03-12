import { float, HALF_PI, select, sin, TWO_PI } from "three/tsl";
import { type Node } from "three/webgpu";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode, type JSHomoFn } from "./types.js";
import { createHomoFn } from "./utils.js";

type ElasticEaseSignature = {
  (x: number, a: number, p: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number, a: T | number, p: T | number): T;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_AMPLITUDE = 1;
const DEFAULT_PERIOD = 0.3;

const jsCustomElasticIn: JSHomoFn<
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
> = ([x, a, p]) => {
  const s = p.div(TWO_PI).mul(HALF_PI);
  const t = x.sub(1);
  return select(
    (x as any).lessThanEqual(0),
    x,
    select(
      (x as any).greaterThanEqual(1),
      x,
      a
        .negate()
        .mul(sin(t.sub(s).mul(TWO_PI).div(p) as any))
        .mul((t.mul(10) as any).exp2()),
    ),
  ) as FloatOrVectorNode;
};

const jsCustomElasticOut: JSHomoFn<
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
> = ([x, a, p]) => {
  const s = p.div(TWO_PI).mul(HALF_PI);
  return select(
    (x as any).lessThanEqual(0),
    x,
    select(
      (x as any).greaterThanEqual(1),
      x,
      a
        .mul(sin(x.sub(s).mul(TWO_PI).div(p) as any))
        .mul((x.mul(-10) as any).exp2())
        .add(1),
    ),
  ) as FloatOrVectorNode;
};

const jsCustomElasticInOut: JSHomoFn<
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
> = ([x, a, p]) => {
  const s = p.div(TWO_PI).mul(HALF_PI);
  const t = x.mul(2).sub(1);
  const sinVal = sin(t.sub(s).mul(TWO_PI).div(p) as any);
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
          .mul((t.mul(10) as any).exp2())
          .mul(0.5),
        a
          .mul(sinVal)
          .mul((t.mul(-10) as any).exp2())
          .mul(0.5)
          .add(1),
      ),
    ),
  ) as FloatOrVectorNode;
};

const jsElasticIn: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomElasticIn([x, float(DEFAULT_AMPLITUDE), float(DEFAULT_PERIOD)]);

const jsElasticOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomElasticOut([x, float(DEFAULT_AMPLITUDE), float(DEFAULT_PERIOD)]);

const jsElasticInOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  jsCustomElasticInOut([x, float(DEFAULT_AMPLITUDE), float(DEFAULT_PERIOD)]);

export const customElasticIn = createHomoFn<
  ElasticEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomElasticIn, "customElasticIn", ["x", "a", "p"]);
export const customElasticOut = createHomoFn<
  ElasticEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomElasticOut, "customElasticOut", ["x", "a", "p"]);
export const customElasticInOut = createHomoFn<
  ElasticEaseSignature,
  [FloatOrVectorNode, FloatOrVectorNode, FloatOrVectorNode]
>(jsCustomElasticInOut, "customElasticInOut", ["x", "a", "p"]);
export const elasticIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsElasticIn,
  "elasticIn",
  ["x"],
);
export const elasticOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsElasticOut,
  "elasticOut",
  ["x"],
);
export const elasticInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsElasticInOut,
  "elasticInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
