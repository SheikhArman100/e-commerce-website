"use client";

import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Splits the remaining time between now and `target` into display parts.
 * Returns `null` for a missing/invalid date, and clamps at zero once the
 * deadline has passed (so a still-live campaign never shows negative numbers —
 * campaign dates are display-only, `isActive` is what makes it live).
 */
export const getCountdownParts = (target) => {
  const remaining = new Date(target).getTime() - Date.now();
  if (!Number.isFinite(remaining)) return null;

  const clamped = Math.max(remaining, 0);

  return {
    total: clamped,
    isExpired: clamped <= 0,
    days: Math.floor(clamped / DAY),
    hours: Math.floor(clamped / HOUR) % 24,
    minutes: Math.floor(clamped / MINUTE) % 60,
    seconds: Math.floor(clamped / SECOND) % 60,
  };
};

/**
 * Live countdown to `target`, re-computed every second.
 *
 * Starts as `null` on the first render (server AND client) and only fills in
 * from an effect, so the server-rendered markup and the hydrated markup always
 * agree — no "text content did not match" warning. Consumers render their own
 * placeholder while the value is still `null`.
 */
const useCountdown = (target, intervalMs = SECOND) => {
  const [parts, setParts] = useState(null);

  useEffect(() => {
    if (!target) {
      setParts(null);
      return undefined;
    }

    const tick = () => setParts(getCountdownParts(target));
    tick();

    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [target, intervalMs]);

  return parts;
};

export default useCountdown;
