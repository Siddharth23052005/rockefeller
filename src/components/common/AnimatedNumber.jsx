import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export default function AnimatedNumber({ value = 0, duration = 1, format }) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, safeValue, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [motionValue, rounded, safeValue, duration]);

  if (typeof format === "function") {
    return format(display);
  }

  return display.toLocaleString();
}
