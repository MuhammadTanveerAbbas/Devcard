"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import "./pixel-blast.css";

/**
 * Static fallback: soft radial vignette only, no dot grid, so there is no
 * visible swap when the canvas loads. Used for reduced-motion and WebGL
 * failures.
 */
function StaticField() {
  return <div aria-hidden="true" className="pixel-blast-static" />;
}

/**
 * While the canvas module is downloading we render nothing visible so the
 * background is the plain page colour. This prevents the dot-grid flicker
 * that happened when the static field was shown first and then replaced.
 */
const PixelBlast = dynamic(() => import("./pixel-blast"), {
  ssr: false,
  loading: () => null,
});

export function PixelBlastBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const showCanvas = mounted && !reduced && !failed;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FAFAFA] dark:bg-[#050607]">
      {showCanvas ? (
        <PixelBlast
          variant="circle"
          pixelSize={isDark ? 3 : 4}
          color={isDark ? "#6E767E" : "#C6CCD3"}
          patternScale={2.6}
          patternDensity={isDark ? 2.0 : 1.3}
          pixelSizeJitter={0.35}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.12}
          rippleIntensityScale={1.2}
          liquid
          liquidStrength={0.08}
          liquidRadius={1}
          liquidWobbleSpeed={4}
          speed={0.35}
          edgeFade={0.25}
          transparent
          onError={() => setFailed(true)}
        />
      ) : (
        <StaticField />
      )}
    </div>
  );
}
