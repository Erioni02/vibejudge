"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Small, dependency-free SVG charts for the admin dashboard. */

export type Granularity = "hour" | "day" | "week" | "month";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Bucket keys are local wall-clock times ("YYYY-MM-DDTHH:MM") already in the dashboard time zone. */
export function formatBucket(key: string, granularity: Granularity, long = false) {
  const [date, time = "00:00"] = key.split("T");
  const [year, month, day] = date.split("-").map(Number);
  const label = `${MONTHS[month - 1]} ${day}`;
  if (granularity === "hour") return long ? `${label}, ${time}` : time;
  if (granularity === "week") return long ? `Week of ${label}, ${year}` : label;
  if (granularity === "month") return long ? `${MONTHS[month - 1]} ${year}` : MONTHS[month - 1];
  return long ? `${label}, ${year}` : label;
}

export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

function niceMax(value: number) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const step of steps) {
    if (step * magnitude >= value) return step * magnitude;
  }
  return 10 * magnitude;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    setWidth(node.getBoundingClientRect().width);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export type Series = { label: string; color: string; values: number[]; dashed?: boolean };

export function LineChart({
  series,
  buckets,
  granularity,
  height = 240,
  ariaLabel
}: {
  series: Series[];
  buckets: string[];
  granularity: Granularity;
  height?: number;
  ariaLabel: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 12, right: 12, bottom: 26, left: 40 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = height - pad.top - pad.bottom;
  const count = buckets.length;
  const max = niceMax(Math.max(0, ...series.flatMap((item) => item.values)));
  const x = (index: number) => pad.left + (count <= 1 ? innerW / 2 : (index / (count - 1)) * innerW);
  const y = (value: number) => pad.top + innerH - (value / max) * innerH;

  const ticks = useMemo(() => {
    if (count === 0) return [];
    const target = Math.max(2, Math.min(7, Math.floor(innerW / 90)));
    const step = Math.max(1, Math.ceil(count / target));
    const result: number[] = [];
    for (let index = 0; index < count; index += step) result.push(index);
    return result;
  }, [count, innerW]);

  function onMove(event: React.PointerEvent<SVGSVGElement>) {
    if (count === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relative = event.clientX - rect.left - pad.left;
    const index = count <= 1 ? 0 : Math.round((relative / innerW) * (count - 1));
    setHover(Math.max(0, Math.min(count - 1, index)));
  }

  const total = series.reduce((sum, item) => sum + item.values.reduce((a, b) => a + b, 0), 0);

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          className="block touch-pan-y"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const value = max * fraction;
            return (
              <g key={fraction}>
                <line x1={pad.left} x2={width - pad.right} y1={y(value)} y2={y(value)} stroke="var(--adm-grid)" strokeWidth={1} />
                <text x={pad.left - 8} y={y(value) + 4} textAnchor="end" fontSize={11} fill="var(--adm-faint)">
                  {Number.isInteger(value) ? formatNumber(value) : value.toFixed(1)}
                </text>
              </g>
            );
          })}
          {ticks.map((index) => (
            <text key={index} x={x(index)} y={height - 6} textAnchor="middle" fontSize={11} fill="var(--adm-faint)">
              {formatBucket(buckets[index], granularity)}
            </text>
          ))}
          {series.map((item) => {
            if (!item.values.length) return null;
            const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
            return (
              <g key={item.label}>
                {count === 1 ? (
                  <circle cx={x(0)} cy={y(item.values[0])} r={3.5} fill={item.color} />
                ) : (
                  <polyline
                    points={points}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeDasharray={item.dashed ? "4 4" : undefined}
                  />
                )}
              </g>
            );
          })}
          {hover !== null ? (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + innerH} stroke="var(--adm-line-strong)" strokeWidth={1} />
              {series.map((item) => (
                <circle key={item.label} cx={x(hover)} cy={y(item.values[hover] ?? 0)} r={3.5} fill={item.color} stroke="var(--adm-surface)" strokeWidth={2} />
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
      {hover !== null && width > 0 ? (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[150px] rounded-lg border border-[var(--adm-line)] bg-[var(--adm-elevated)] px-3 py-2 text-xs shadow-lg"
          style={x(hover) > width / 2 ? { right: width - x(hover) + 12 } : { left: x(hover) + 12 }}
        >
          <p className="mb-1.5 font-medium text-[var(--adm-text)]">{formatBucket(buckets[hover], granularity, true)}</p>
          {series.map((item) => (
            <p key={item.label} className="flex items-center justify-between gap-4 py-0.5 text-[var(--adm-muted)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: item.color }} aria-hidden />
                {item.label}
              </span>
              <span className="font-medium tabular-nums text-[var(--adm-text)]">{formatNumber(item.values[hover] ?? 0)}</span>
            </p>
          ))}
        </div>
      ) : null}
      {width > 0 && total === 0 ? (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-[var(--adm-faint)]">
          No events in this range yet
        </p>
      ) : null}
    </div>
  );
}

export function Legend({ series }: { series: Pick<Series, "label" | "color" | "dashed">[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--adm-muted)]">
      {series.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-3.5 rounded-full"
            style={{ background: item.dashed ? `repeating-linear-gradient(90deg, ${item.color} 0 3px, transparent 3px 6px)` : item.color }}
            aria-hidden
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function Sparkline({ values, color = "var(--adm-accent)" }: { values: number[]; color?: string }) {
  const width = 96;
  const height = 28;
  if (values.length < 2 || values.every((value) => value === 0)) {
    return <svg width={width} height={height} aria-hidden><line x1={0} x2={width} y1={height - 2} y2={height - 2} stroke="var(--adm-grid)" /></svg>;
  }
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * width},${height - 2 - (value / max) * (height - 4)}`).join(" ");
  return (
    <svg width={width} height={height} aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function BarList({
  rows,
  empty = "No data yet",
  format = formatNumber,
  color = "var(--adm-bar)"
}: {
  rows: { label: string; value: number; hint?: string }[];
  empty?: string;
  format?: (value: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  if (!rows.length) return <p className="py-6 text-center text-sm text-[var(--adm-faint)]">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {rows.map((row) => (
        <li key={row.label} className="relative overflow-hidden rounded-md">
          <span className="absolute inset-y-0 left-0 rounded-md" style={{ width: `${(row.value / max) * 100}%`, background: color }} aria-hidden />
          <span className="relative flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
            <span className="min-w-0 truncate text-[var(--adm-text)]" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 tabular-nums text-[var(--adm-muted)]">
              {row.hint ? <span className="mr-2 text-xs text-[var(--adm-faint)]">{row.hint}</span> : null}
              {format(row.value)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
