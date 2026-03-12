import { type Node } from "three/webgpu";
import { type FloatOrVectorNode } from "./types.js";

export type EaseSignature = {
  (x: number): Node<"float">;
  <T extends FloatOrVectorNode>(x: T | number): T;
};
