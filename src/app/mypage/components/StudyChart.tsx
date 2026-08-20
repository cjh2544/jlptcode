"use client";

import { Chart, type ChartConfiguration, type ChartTypeRegistry } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";

type StudyChartProps = {
  config: ChartConfiguration<keyof ChartTypeRegistry>;
  className?: string;
};

export default function StudyChart({ config, className }: StudyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart(canvas, config);
    return () => {
      chart.destroy();
    };
  }, [config]);

  return (
    <div className={className ?? "app-mypage-chart"}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export function ChartCard({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`app-mypage-chart-card ${wide ? "md:col-span-2" : ""}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function useNarrowScreen() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return narrow;
}

export function chartFont(narrow: boolean) {
  return { size: narrow ? 10 : 12 };
}

export function chartLegend(color: string, narrow: boolean) {
  return {
    position: "bottom" as const,
    labels: {
      color,
      boxWidth: narrow ? 8 : 10,
      padding: narrow ? 6 : 12,
      font: chartFont(narrow),
    },
  };
}

export function useChartTheme() {
  const [colors, setColors] = useState(readThemeColors);

  useEffect(() => {
    setColors(readThemeColors());
  }, []);

  return colors;
}

export function readThemeColors() {
  if (typeof window === "undefined") {
    return {
      foreground: "#334155",
      muted: "#64748b",
      border: "#e2e8f0",
      charts: ["#3b82f6", "#14b8a6", "#06b6d4", "#f59e0b", "#f43f5e"],
      correct: "#10b981",
      wrong: "#f43f5e",
    };
  }

  const styles = getComputedStyle(document.documentElement);
  const charts = [1, 2, 3, 4, 5].map((index) =>
    styles.getPropertyValue(`--chart-${index}`).trim(),
  );
  return {
    foreground: styles.getPropertyValue("--foreground").trim() || "#334155",
    muted: styles.getPropertyValue("--muted-foreground").trim() || "#64748b",
    border: styles.getPropertyValue("--border").trim() || "#e2e8f0",
    charts: charts.every(Boolean) ? charts : ["#3b82f6", "#14b8a6", "#06b6d4", "#f59e0b", "#f43f5e"],
    correct: "#10b981",
    wrong: "#f43f5e",
  };
}

export function palette(count: number, colors: string[]) {
  return Array.from({ length: count }, (_, index) => colors[index % colors.length]);
}
