import { type Node } from "three/webgpu";

export type FloatOrVectorNode =
  | Node<"float">
  | Node<"vec2">
  | Node<"vec3">
  | Node<"vec4">;

export type FloatOrVectorNodeType =
  FloatOrVectorNode extends Node<infer T> ? T : never;
