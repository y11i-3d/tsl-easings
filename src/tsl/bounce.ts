import { select } from "three/tsl";
import { type EaseSignature } from "./common.js";
import { type FloatOrVectorNode, type JSHomoFn } from "./types.js";
import { createHomoFn } from "./utils.js";

/* eslint-disable @typescript-eslint/no-explicit-any */

const N1 = 7.5625;
const D1 = 2.75;

const jsBounceOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) => {
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
};

const jsBounceIn: JSHomoFn<[FloatOrVectorNode]> = ([x]) =>
  (jsBounceOut([(x as any).oneMinus()]) as any).oneMinus() as FloatOrVectorNode;

const jsBounceInOut: JSHomoFn<[FloatOrVectorNode]> = ([x]) => {
  const x2 = (x as any).mul(2);
  return select(
    (x as any).lessThan(0.5),
    (jsBounceOut([x2.negate().add(1)]) as any).oneMinus().mul(0.5),
    (jsBounceOut([x2.sub(1)]) as any).mul(0.5).add(0.5),
  ) as FloatOrVectorNode;
};

export const bounceOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBounceOut,
  "bounceOut",
  ["x"],
);
export const bounceIn = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBounceIn,
  "bounceIn",
  ["x"],
);
export const bounceInOut = createHomoFn<EaseSignature, [FloatOrVectorNode]>(
  jsBounceInOut,
  "bounceInOut",
  ["x"],
);

/* eslint-enable @typescript-eslint/no-explicit-any */
