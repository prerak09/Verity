/** Pixel-art CRT monitor with a smiley — the auth-page mascot from the screenshots. */
export function PixelMonitor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label="Retro computer"
    >
      {/* monitor body */}
      <rect x="16" y="10" width="80" height="60" fill="#0A0A09" />
      <rect x="20" y="14" width="72" height="52" fill="#C4F542" />
      {/* smiley */}
      <rect x="38" y="30" width="8" height="10" fill="#0A0A09" />
      <rect x="66" y="30" width="8" height="10" fill="#0A0A09" />
      <rect x="40" y="48" width="4" height="4" fill="#0A0A09" />
      <rect x="44" y="52" width="24" height="4" fill="#0A0A09" />
      <rect x="68" y="48" width="4" height="4" fill="#0A0A09" />
      {/* stand */}
      <rect x="52" y="70" width="16" height="8" fill="#0A0A09" />
      <rect x="40" y="78" width="40" height="6" fill="#0A0A09" />
      {/* keyboard */}
      <rect x="30" y="86" width="60" height="8" fill="#0A0A09" />
      <rect x="34" y="88" width="52" height="4" fill="#B9A9F5" />
      {/* plant */}
      <rect x="6" y="60" width="10" height="4" fill="#0A0A09" />
      <rect x="8" y="48" width="2" height="12" fill="#0A7E3C" />
      <rect x="4" y="50" width="4" height="4" fill="#0A7E3C" />
      <rect x="10" y="46" width="4" height="4" fill="#0A7E3C" />
      {/* mug */}
      <rect x="100" y="74" width="12" height="10" fill="#0A0A09" />
      <rect x="102" y="76" width="8" height="6" fill="#F9C6D3" />
    </svg>
  );
}
