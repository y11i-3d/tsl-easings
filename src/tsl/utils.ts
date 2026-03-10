import { Fn, overloadingFn } from "three/tsl";
import { type Node } from "three/webgpu";
import { type FloatOrVectorNode, type FloatOrVectorNodeType } from "./types.js";

export type JSFunc<T extends FloatOrVectorNode[] = FloatOrVectorNode[]> = (
  args: T,
) => FloatOrVectorNode;

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

export const createOverloadingHomoFn = <T extends FloatOrVectorNode[]>(
  jsFunc: JSFunc<T>,
  layoutName: string,
  inputNames: string[],
) => {
  return overloadingFn(
    (["float", "vec2", "vec3", "vec4"] as const).map(
      (type: FloatOrVectorNodeType) =>
        Fn(jsFunc).setLayout(
          createHomoFnLayout(type, layoutName, inputNames),
        ) as unknown as Node<FloatOrVectorNodeType>,
    ),
  );
};
