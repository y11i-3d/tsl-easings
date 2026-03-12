# TSL Easings

[![npm version](https://img.shields.io/npm/v/@y11i-3d/tsl-easings.svg)](https://www.npmjs.com/package/@y11i-3d/tsl-easings)
[![Build](https://github.com/y11i-3d/tsl-easings/actions/workflows/main.yml/badge.svg)](https://github.com/y11i-3d/tsl-easings/actions/workflows/main.yml)

This is a TSL (Three.js Shading Language) implementation of easing functions, based on Robert Penner's easing equations.
https://robertpenner.com/easing_terms_of_use.html

**MIT License**:  
Copyright (C) 2001 Robert Penner (Original easing equations)  
Copyright (C) 2026 Yuichiroh Arai (TSL port)

## Demo

https://y11i-3d.github.io/tsl-easings/

## Installation

```sh
npm install @y11i-3d/tsl-easings
```

## Usage

```ts
import { float, uniform, vec3, vec4 } from "three/tsl";
import { sineInOut } from "@y11i-3d/tsl-easings";

const t = uniform(float(0));
material.colorNode = vec4(vec3(sineInOut(t)), 1);
```

### Custom parameters

`back` and `elastic` provide customizable variants:

```ts
import { float, uniform, vec3, vec4 } from "three/tsl";
import { customBackIn, customElasticOut } from "@y11i-3d/tsl-easings";

const t = uniform(float(0));

const overshoot = uniform(float(1.70158));
material.colorNode = vec4(vec3(customBackIn(t, overshoot)), 1);

const amplitude = uniform(float(1));
const period = uniform(float(0.3));
material.colorNode = vec4(vec3(customElasticOut(t, amplitude, period)), 1);
```

### Inline vs named shader functions

By default, easing functions are **inlined** into the shader code. If you call `.fn()`, the function is compiled as a **named shader function** (via `setLayout` + `overloadingFn`), which can reduce code duplication when the same easing is used multiple times.

```ts
import { sineInOut } from "@y11i-3d/tsl-easings";

// Inline (default)
material.colorNode = vec4(vec3(sineInOut(t)), 1);

// Named shader function
const sineInOutFn = sineInOut.fn();
material.colorNode = vec4(vec3(sineInOutFn(t)), 1);
```

## API

### All easing functions

All functions accept `float`, `vec2`, `vec3`, or `vec4` as input and return the same type.

| Family  | In                | Out                | InOut                | Custom parameters     |
| ------- | ----------------- | ------------------ | -------------------- | --------------------- |
| sine    | `sineIn`          | `sineOut`          | `sineInOut`          |                       |
| quad    | `quadIn`          | `quadOut`          | `quadInOut`          |                       |
| cubic   | `cubicIn`         | `cubicOut`         | `cubicInOut`         |                       |
| quart   | `quartIn`         | `quartOut`         | `quartInOut`         |                       |
| quint   | `quintIn`         | `quintOut`         | `quintInOut`         |                       |
| expo    | `expoIn`          | `expoOut`          | `expoInOut`          |                       |
| circ    | `circIn`          | `circOut`          | `circInOut`          |                       |
| back    | `customBackIn`    | `customBackOut`    | `customBackInOut`    | `overshoot`           |
| elastic | `customElasticIn` | `customElasticOut` | `customElasticInOut` | `amplitude`, `period` |
| bounce  | `bounceIn`        | `bounceOut`        | `bounceInOut`        |                       |

### Convenience wrappers

| Family  | In          | Out          | InOut          | Default values                  |
| ------- | ----------- | ------------ | -------------- | ------------------------------- |
| back    | `backIn`    | `backOut`    | `backInOut`    | `overshoot = 1.70158`           |
| elastic | `elasticIn` | `elasticOut` | `elasticInOut` | `amplitude = 1`, `period = 0.3` |
