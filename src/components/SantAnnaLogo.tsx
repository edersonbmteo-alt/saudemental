import React from "react";

interface SantAnnaLogoProps {
  className?: string;
  variant?: "full" | "shield" | "compact";
  height?: number | string;
}

export const SantAnnaLogo: React.FC<SantAnnaLogoProps> = ({
  className = "h-8 w-auto",
  variant = "full",
}) => {
  if (variant === "shield") {
    return (
      <svg
        className={className}
        viewBox="0 0 175 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 12 18 C 12 18, 90 18, 160 18 C 160 85, 160 135, 86 195 C 12 135, 12 85, 12 18 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path
          d="M 18 22 C 18 22, 90 22, 154 22 C 154 82, 154 130, 86 186 C 18 130, 18 82, 18 22 Z"
          fill="#FFFFFF"
          stroke="#005CA9"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 24 28 C 24 28, 90 28, 148 28 C 148 80, 148 126, 86 180 C 24 126, 24 80, 24 28 Z"
          fill="#FFFFFF"
          stroke="#FFCC00"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x="36" y="40" width="100" height="24" rx="2" fill="#005CA9" />
        <text
          x="86"
          y="57"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="900"
          fontSize="14"
          fill="#FFCC00"
          textAnchor="middle"
          letterSpacing="1"
        >
          SANT'ANNA
        </text>
        <g transform="translate(38, 74)">
          <rect x="4" y="8" width="6" height="68" rx="2" fill="#0F763E" />
          <circle cx="7" cy="14" r="4" fill="#0F763E" />
          <circle cx="7" cy="34" r="4" fill="#0F763E" />
          <circle cx="7" cy="54" r="4" fill="#0F763E" />
          <circle cx="7" cy="74" r="4" fill="#0F763E" />
          <rect x="24" y="8" width="6" height="68" rx="2" fill="#0F763E" />
          <circle cx="27" cy="14" r="4" fill="#0F763E" />
          <circle cx="27" cy="34" r="4" fill="#0F763E" />
          <circle cx="27" cy="54" r="4" fill="#0F763E" />
          <circle cx="27" cy="74" r="4" fill="#0F763E" />
          <rect x="4" y="24" width="26" height="4.5" rx="1.5" fill="#0F763E" />
          <rect x="4" y="44" width="26" height="4.5" rx="1.5" fill="#0F763E" />
          <rect x="4" y="64" width="26" height="4.5" rx="1.5" fill="#0F763E" />
        </g>
        <g transform="translate(86, 70)">
          <path d="M 23 8 C 21 0, 27 0, 25 8 C 24 12, 22 12, 23 8 Z" fill="#38A2DB" />
          <path d="M 24 6 C 26 10, 24 14, 21 15 C 19 13, 21 9, 24 6 Z" fill="#005CA9" opacity="0.4" />
          <path d="M 12 28 C 12 18, 36 18, 36 28 C 36 34, 30 38, 28 46 L 31 56 L 17 56 L 20 46 C 18 38, 12 34, 12 28 Z" fill="#D9232D" />
          <circle cx="24" cy="28" r="8" fill="#FFFFFF" />
          <path
            d="M 24 22 L 24 34 M 22 24 C 25 22, 28 22, 28 25 C 28 28, 25 28, 22 28 M 20 25 L 28 32 M 28 25 L 20 32"
            stroke="#D9232D"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M 12 24 C 6 22, 6 32, 12 30" stroke="#D9232D" strokeWidth="2.5" fill="none" />
          <path d="M 36 24 C 42 22, 42 32, 36 30" stroke="#D9232D" strokeWidth="2.5" fill="none" />
          <rect x="10" y="58" width="28" height="6" rx="1.5" fill="#005CA9" />
          <path d="M 22 62 L 26 62 L 24 66 Z" fill="#D9232D" />
          <rect x="8" y="65" width="32" height="4" rx="1.5" fill="#003E73" />
        </g>
      </svg>
    );
  }

  // Full Logo with clean SVG representation
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logo_santanna.svg"
        alt="Colégio Franciscano Sant'Anna"
        className="h-full w-auto object-contain max-h-full"
        loading="eager"
      />
    </div>
  );
};
