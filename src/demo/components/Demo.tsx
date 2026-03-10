import gsap from "gsap";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
import { abs, float, Fn, mix, step, uniform, uv, vec3 } from "three/tsl";
import {
  MeshBasicNodeMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  WebGPURenderer,
  type Node,
} from "three/webgpu";
import {
  bounceIn,
  bounceInOut,
  bounceOut,
  circIn,
  circInOut,
  circOut,
  cubicIn,
  cubicInOut,
  cubicOut,
  customBackIn,
  customBackInOut,
  customBackOut,
  customElasticIn,
  customElasticInOut,
  customElasticOut,
  expoIn,
  expoInOut,
  expoOut,
  quadIn,
  quadInOut,
  quadOut,
  quartIn,
  quartInOut,
  quartOut,
  quintIn,
  quintInOut,
  quintOut,
  sineIn,
  sineInOut,
  sineOut,
} from "../../tsl";

type EaseFn = (x: Node<"float">) => Node<"float">;

type EasingEntry = Record<string, EaseFn>;

const DEFAULT_OVERSHOOT = 1.70158;
const DEFAULT_AMPLITUDE = 1;
const DEFAULT_PERIOD = 0.3;

function buildEasingMap(
  backOvershoot: Node<"float">,
  elasticAmplitude: Node<"float">,
  elasticPeriod: Node<"float">,
) {
  const map: Record<string, EasingEntry> = {
    sine: { in: sineIn, out: sineOut, inOut: sineInOut },
    quad: { in: quadIn, out: quadOut, inOut: quadInOut },
    cubic: { in: cubicIn, out: cubicOut, inOut: cubicInOut },
    quart: { in: quartIn, out: quartOut, inOut: quartInOut },
    quint: { in: quintIn, out: quintOut, inOut: quintInOut },
    circ: { in: circIn, out: circOut, inOut: circInOut },
    expo: { in: expoIn, out: expoOut, inOut: expoInOut },
    back: {
      in: (x) => customBackIn(x, backOvershoot),
      out: (x) => customBackOut(x, backOvershoot),
      inOut: (x) => customBackInOut(x, backOvershoot),
    },
    elastic: {
      in: (x) => customElasticIn(x, elasticAmplitude, elasticPeriod),
      out: (x) => customElasticOut(x, elasticAmplitude, elasticPeriod),
      inOut: (x) => customElasticInOut(x, elasticAmplitude, elasticPeriod),
    },
    bounce: { in: bounceIn, out: bounceOut, inOut: bounceInOut },
  };
  return map;
}

const easingNames = Object.keys(buildEasingMap(null!, null!, null!));
const directions = ["in", "out", "inOut"];

const MARGIN = 1 / 4;

function buildAllEasingsNode(
  dir: string,
  progress: Node<"float">,
  easingMap: Record<string, EasingEntry>,
) {
  const bandCount = easingNames.length;
  return Fn(() => {
    const y = float(1).sub(uv().y);
    const x = uv().x;

    const result = vec3(0, 0, 0).toVar();

    for (let i = 0; i < bandCount; i++) {
      const easeFn = easingMap[easingNames[i]][dir];
      const eased = easeFn(progress);
      const pos = float(MARGIN).add(eased.mul(1 - MARGIN * 2));
      const mask = step(pos, x);

      const bandStart = float(i / bandCount);
      const bandEnd = float((i + 1) / bandCount);
      const inBand = step(bandStart, y).mul(step(y, bandEnd));

      const atZero = easeFn(float(0));
      const atOne = easeFn(float(1));
      const err = abs(atZero).add(abs(atOne.sub(1)));
      const hasError = step(0.001, err);
      const color = mix(mask.toVec3(), vec3(1, 0, 0), hasError);

      result.assign(mix(result, color, inBand));
    }

    return result;
  })();
}

export default function Demo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<MeshBasicNodeMaterial | null>(null);
  const progress = useMemo(() => uniform(float(0)), []);
  const backOvershoot = useMemo(() => uniform(float(DEFAULT_OVERSHOOT)), []);
  const elasticAmplitude = useMemo(() => uniform(float(DEFAULT_AMPLITUDE)), []);
  const elasticPeriod = useMemo(() => uniform(float(DEFAULT_PERIOD)), []);
  const easingMap = useMemo(
    () => buildEasingMap(backOvershoot, elasticAmplitude, elasticPeriod),
    [backOvershoot, elasticAmplitude, elasticPeriod],
  );
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const durationRef = useRef(1.2);

  const { direction, duration } = useControls({
    direction: { value: "inOut", options: directions },
    duration: { value: 1.2, min: 0.4, max: 2.4, step: 0.4 },
  });

  const backParams = useControls("Back", {
    overshoot: { value: DEFAULT_OVERSHOOT, min: 0, max: 3, step: 0.1 },
  });

  const [elasticParams, setElasticParams] = useControls("Elastic", () => ({
    amplitude: { value: DEFAULT_AMPLITUDE, min: 0, max: 3, step: 0.1 },
    cycles: { value: Math.round(1 / DEFAULT_PERIOD), min: 1, max: 8, step: 1 },
    period: { value: DEFAULT_PERIOD, disabled: true },
  }));

  const period = 1 / elasticParams.cycles;

  useEffect(() => {
    setElasticParams({ period });
  }, [period, setElasticParams]);

  backOvershoot.value = backParams.overshoot;
  elasticAmplitude.value = elasticParams.amplitude;
  elasticPeriod.value = period;

  durationRef.current = duration;

  useEffect(() => {
    const tl = tweenRef.current;
    if (!tl) return;
    progress.value = 0;
    tl.clear();
    tl.to(progress, { value: 1, duration, ease: "none" });
    tl.set(progress, { value: 0 }, `+=0.3`);
    tl.restart();
  }, [duration, progress]);

  // Rebuild color node when direction changes
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.colorNode = buildAllEasingsNode(direction, progress, easingMap);
    material.needsUpdate = true;
  }, [direction]);

  // Three.js setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const renderer = new WebGPURenderer({ canvas, antialias: true });
      await renderer.init();
      if (disposed) {
        renderer.dispose();
        return;
      }

      const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const scene = new Scene();
      const material = new MeshBasicNodeMaterial();
      materialRef.current = material;

      material.colorNode = buildAllEasingsNode("inOut", progress, easingMap);

      const geometry = new PlaneGeometry(2, 2);
      const mesh = new Mesh(geometry, material);
      scene.add(mesh);

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(devicePixelRatio);
      };
      resize();
      window.addEventListener("resize", resize);

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 0.5 });
      tl.to(progress, {
        value: 1,
        duration: durationRef.current,
        ease: "none",
      });
      tl.set(progress, { value: 0 }, `+=0.5`);
      tweenRef.current = tl;

      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });

      cleanup = () => {
        tl.kill();
        window.removeEventListener("resize", resize);
        renderer.setAnimationLoop(null);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    };

    init();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 h-full w-full" />
  );
}
