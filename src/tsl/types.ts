import { type FunctionOverloadingNode, type Node } from "three/webgpu";

export type FloatOrVectorNode =
  | Node<"float">
  | Node<"vec2">
  | Node<"vec3">
  | Node<"vec4">;

export type FloatOrVectorNodeType =
  FloatOrVectorNode extends Node<infer T> ? T : never;

export type JSHomoFn<T extends FloatOrVectorNode[] = FloatOrVectorNode[]> = (
  args: T,
) => FloatOrVectorNode;

export type HomoFn<T> = T & {
  fn(): T & FunctionOverloadingNode;
};
