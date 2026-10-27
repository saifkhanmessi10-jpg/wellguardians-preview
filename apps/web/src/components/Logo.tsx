/** Placeholder wordmark until Sabine supplies the logo file. TODO(sabine): replace with official SVG. */
export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const ink = tone === "dark" ? "#163a31" : "#ffffff";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
        <path d="M15 1 2 6v10c0 8.3 5.6 14.4 13 17 7.4-2.6 13-8.7 13-17V6L15 1Z" fill={tone === "dark" ? "#205044" : "transparent"} stroke={tone === "dark" ? "#205044" : "#fff"} strokeWidth="2" />
        <path d="M15 24s-6-3.8-6-8.2A3.4 3.4 0 0 1 15 13.6a3.4 3.4 0 0 1 6 2.2c0 4.4-6 8.2-6 8.2Z" fill="#FEC42D" />
      </svg>
      <span className="font-display text-[1.35rem] leading-none tracking-tight" style={{ color: ink }}>
        WellGuardians
      </span>
    </span>
  );
}
