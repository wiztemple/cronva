interface Props {
  size?: number
}

export function CronvaLogo({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cronva"
    >
      {/* Outer diamond orbit */}
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="3"
        transform="rotate(45 16 16)"
        stroke="#1A3F6F"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner diamond layer */}
      <rect
        x="7.5"
        y="7.5"
        width="17"
        height="17"
        rx="2"
        transform="rotate(45 16 16)"
        stroke="#1A3F6F"
        strokeWidth="1"
        fill="none"
        opacity="0.35"
      />
      {/* Gold apex node — top */}
      <circle cx="16" cy="4.5" r="2.5" fill="#F5C400" />
      {/* Electric blue nodes — left and right */}
      <circle cx="4.5" cy="16" r="2" fill="#4A9FE8" />
      <circle cx="27.5" cy="16" r="2" fill="#4A9FE8" />
      {/* Bottom node (navy) */}
      <circle cx="16" cy="27.5" r="1.5" fill="#1A3F6F" opacity="0.5" />
    </svg>
  )
}
