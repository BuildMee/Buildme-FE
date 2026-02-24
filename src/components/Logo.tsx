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
      <rect width="100" height="100" rx="16" fill="#0A0A0A" />
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontFamily="'Syne', sans-serif"
        fontWeight="800"
        fontSize="70"
        fill="rgba(255,255,255,0.15)"
      >
        B
      </text>
      <text
        x="42"
        y="72"
        textAnchor="middle"
        fontFamily="'Syne', sans-serif"
        fontWeight="800"
        fontSize="58"
        fill="#FFFFFF"
      >
        B
      </text>
    </svg>
  );
}
