"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function useInViewReplay<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  cycle: number;
  isVisible: boolean;
} {
  const ref = useRef<T>(null);
  const [cycle, setCycle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setCycle(1);
      }, 0);
      return () => clearTimeout(timer);
    }

    let wasVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setIsVisible(visible);
        if (visible && !wasVisible) setCycle((value) => value + 1);
        wasVisible = visible;
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, cycle, isVisible };
}

export function useCountUp<T extends HTMLElement>(
  target: number,
  duration = 950,
) {
  const { ref, cycle, isVisible } = useInViewReplay<T>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible || cycle === 0) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => setValue(target));
      return () => window.cancelAnimationFrame(frame);
    }

    let frame = 0;
    let startTime: number | null = null;
    const tick = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(target * eased);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [cycle, duration, isVisible, target]);

  return { ref, value, cycle, isVisible };
}

export function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  decimals,
  className,
  duration,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const { ref, value: animatedValue } = useCountUp<HTMLSpanElement>(
    value,
    duration,
  );
  const fractionDigits =
    decimals ??
    (Number.isInteger(value)
      ? 0
      : Math.min(1, String(value).split(".")[1]?.length ?? 0));
  const display = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(animatedValue);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
