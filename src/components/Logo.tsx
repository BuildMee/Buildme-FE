interface LogoProps {
  size?: number;
}

export default function Logo({ size = 36 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="22" fill="#111827" />

      <defs>
        <linearGradient id="bgrad" x1="50" y1="38" x2="50" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="pgrad" x1="30" y1="28" x2="30" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* P 형태 — 왼쪽 뒷레이어 */}
      <path
        d="M24 28 L24 72 L33 72 L33 54
           C33 54 50 56 50 42
           C50 28 33 28 33 28 Z"
        fill="url(#pgrad)"
      />

      {/* B 형태 — 오른쪽 메인, 파란 그라디언트 */}
      <path
        d="M34 28 L34 72 L56 72
           C65 72 70 66 70 59
           C70 53 67 49 62 47
           C67 45 70 41 70 35
           C70 28 65 28 56 28 Z
           M43 36 L55 36 C59 36 61 38 61 41
           C61 45 59 47 55 47 L43 47 Z
           M43 53 L57 53 C61 53 63 55 63 59
           C63 63 61 64 57 64 L43 64 Z"
        fill="url(#bgrad)"
        fillRule="evenodd"
      />
    </svg>
  );
}
