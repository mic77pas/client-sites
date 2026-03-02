"use client";

import { useEffect, useMemo, useState } from "react";

function useWindowWidth() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}

export default function WidthClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const w = useWindowWidth();

  const STOP_INSET = 28;
  const STOP_SCALE = 0.85;

  const zoomedOutWidth = useMemo(() => {
    if (!w) return "100%";
    const base = w - STOP_INSET * 2;
    const scaled = base * STOP_SCALE;
    return `${Math.max(0, Math.floor(scaled))}px`;
  }, [w]);

  return (
    <div
      className="w-full flex flex-col gap-8 justify-center mx-auto rounded-xl"
      style={{ width: zoomedOutWidth }}
    >
      {children}
    </div>
  );
}
