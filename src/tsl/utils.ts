import { Fn, overloadingFn } from "three/tsl";
import { type Node } from "three/webgpu";
import {
  type FloatOrVectorNode,
  type FloatOrVectorNodeType,
  type HomoFn,
  type JSHomoFn,
} from "./types.js";

export const createHomoFnLayout = (
  type: FloatOrVectorNodeType,
  layoutName: string,
  inputNames: string[],
) => {
  return {
    name: `${layoutName}_${type}`,
    type: type,
    inputs: inputNames.map((name) => ({ name, type })),
  };
};

export const createOverloadingHomoFn = <InputNodes extends FloatOrVectorNode[]>(
  jsFn: JSHomoFn<InputNodes>,
  layoutName: string,
  inputNames: string[],
) => {
  return overloadingFn(
    (["float", "vec2", "vec3", "vec4"] as const).map(
      (type: FloatOrVectorNodeType) =>
        Fn(jsFn).setLayout(
          createHomoFnLayout(type, layoutName, inputNames),
        ) as unknown as Node<FloatOrVectorNodeType>,
    ),
  );
};

export const createHomoFn = <
  HomoFnSignature,
  InputNodes extends FloatOrVectorNode[],
>(
  jsFn: JSHomoFn<InputNodes>,
  layoutName: string,
  inputNames: string[],
): HomoFn<HomoFnSignature> => {
  const inlineFn = Fn(jsFn);

  let cachedFn: ReturnType<typeof createOverloadingHomoFn> | null = null;

  return Object.assign(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: unknown[]) => inlineFn(...(args as any)),
    {
      fn: () => {
        if (!cachedFn)
          cachedFn = createOverloadingHomoFn(jsFn, layoutName, inputNames);
        return cachedFn;
      },
    },
  ) as HomoFn<HomoFnSignature>;
};
