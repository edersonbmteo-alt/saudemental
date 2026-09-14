import React from "react";

interface FrancisquinhoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  pose?: "waving" | "holding_heart" | "happy";
}

export const Francisquinho: React.FC<FrancisquinhoProps> = ({
  className = "w-28 h-auto",
  size = "md",
  pose = "waving",
}) => {
  const sizeMap = {
    sm: "w-16 h-auto",
    md: "w-28 h-auto",
    lg: "w-40 h-auto",
    xl: "w-56 h-auto",
  };

  const finalClass = className || sizeMap[size];

  return (
    <div className={`inline-block select-none pointer-events-none drop-shadow-md ${finalClass}`}>
      <svg
        viewBox="0 0 240 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Hair Gradient */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5A341E" />
            <stop offset="50%" stopColor="#4A2612" />
            <stop offset="100%" stopColor="#321808" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE0BD" />
            <stop offset="100%" stopColor="#F5C79E" />
          </linearGradient>

          {/* Cheeks Blush */}
          <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8B8B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF8B8B" stopOpacity="0" />
          </radialGradient>

          {/* Habit Robe Gradient */}
          <linearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8D5B3A" />
            <stop offset="40%" stopColor="#7B4B2A" />
            <stop offset="100%" stopColor="#5E351A" />
          </linearGradient>

          {/* Habit Shadow */}
          <linearGradient id="habitShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F2B13" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3E200C" stopOpacity="0.8" />
          </linearGradient>

          {/* Eye Gradient */}
          <radialGradient id="eyeGrad" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#693712" />
            <stop offset="70%" stopColor="#3E1C05" />
            <stop offset="100%" stopColor="#1E0B01" />
          </radialGradient>

          {/* Shadow on Floor */}
          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Floor Shadow */}
        <ellipse cx="120" cy="370" rx="65" ry="8" fill="url(#floorShadow)" />

        {/* Feet / Sandals */}
        <g id="feet">
          {/* Left Foot */}
          <ellipse cx="102" cy="360" rx="14" ry="7" fill="#F0BE95" />
          <path d="M 89 360 C 89 356, 115 356, 115 360 Z" fill="#7A4520" />
          <line x1="94" y1="360" x2="104" y2="355" stroke="#522C11" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="108" y1="360" x2="102" y2="355" stroke="#522C11" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Foot */}
          <ellipse cx="138" cy="360" rx="14" ry="7" fill="#F0BE95" />
          <path d="M 125 360 C 125 356, 151 356, 151 360 Z" fill="#7A4520" />
          <line x1="130" y1="360" x2="140" y2="355" stroke="#522C11" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="144" y1="360" x2="138" y2="355" stroke="#522C11" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Habit Robe Body */}
        <g id="habit">
          {/* Robe Skirt */}
          <path
            d="M 90 200 C 90 190, 150 190, 150 200 L 165 352 C 165 356, 75 356, 75 352 Z"
            fill="url(#habitGrad)"
          />

          {/* Fold Shadows */}
          <path d="M 108 220 Q 112 280 110 352" stroke="#5E351A" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M 132 220 Q 128 280 130 352" stroke="#5E351A" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          {/* Robe Top / Chest */}
          <path
            d="M 85 180 C 85 155, 155 155, 155 180 L 152 230 C 152 230, 120 234, 88 230 Z"
            fill="url(#habitGrad)"
          />

          {/* Cowl / Capuz Collar */}
          <path
            d="M 82 170 C 80 205, 160 205, 158 170 C 158 155, 82 155, 82 170 Z"
            fill="#6E3D1D"
            stroke="#532C12"
            strokeWidth="1.5"
          />

          {/* Franciscan Cord (Cíngulo Franciscano com Nós) */}
          {/* Waist Band */}
          <path
            d="M 86 226 Q 120 232 154 226"
            stroke="#FFF9E8"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 86 226 Q 120 232 154 226"
            stroke="#E3D7BA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Hanging Cord Left */}
          <path
            d="M 112 230 Q 108 270 114 305"
            stroke="#FFF9E8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Franciscan Knot 1 (Pobreza) */}
          <circle cx="110" cy="255" r="4" fill="#FFF9E8" stroke="#D3C39E" strokeWidth="1" />
          {/* Franciscan Knot 2 (Castidade) */}
          <circle cx="111" cy="275" r="4" fill="#FFF9E8" stroke="#D3C39E" strokeWidth="1" />
          {/* Franciscan Knot 3 (Obediência) */}
          <circle cx="113" cy="295" r="4" fill="#FFF9E8" stroke="#D3C39E" strokeWidth="1" />
          {/* Cord tassel */}
          <path d="M 112 305 L 110 314 M 114 305 L 114 315 M 115 305 L 118 313" stroke="#FFF9E8" strokeWidth="1.5" />
        </g>

        {/* Arms */}
        <g id="arms">
          {/* Left Arm (Relaxed) */}
          <path
            d="M 88 175 C 68 200, 68 220, 80 235"
            stroke="url(#habitGrad)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Left Hand */}
          <circle cx="82" cy="242" r="10" fill="url(#skinGrad)" />
          <circle cx="80" cy="240" r="3.5" fill="#F2BF92" />

          {/* Right Arm: Waving / Welcoming */}
          {pose === "waving" ? (
            <>
              {/* Arm going up */}
              <path
                d="M 152 175 C 172 170, 185 145, 178 125"
                stroke="url(#habitGrad)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Sleeve Opening */}
              <ellipse cx="178" cy="125" rx="10" ry="6" fill="#5E351A" />
              {/* Waving Hand */}
              <g transform="translate(178, 110)">
                <ellipse cx="0" cy="0" rx="9" ry="10" fill="url(#skinGrad)" />
                {/* 4 Fingers */}
                <rect x="-8" y="-14" width="4" height="8" rx="2" fill="#F8CEAA" />
                <rect x="-3" y="-16" width="4" height="10" rx="2" fill="#F8CEAA" />
                <rect x="2" y="-15" width="4" height="9" rx="2" fill="#F8CEAA" />
                <rect x="7" y="-12" width="3.5" height="7" rx="1.7" fill="#F8CEAA" />
                {/* Thumb */}
                <ellipse cx="-7" cy="2" rx="3" ry="5" fill="#F8CEAA" transform="rotate(-30 -7 2)" />
              </g>
            </>
          ) : (
            <>
              {/* Holding Heart Pose */}
              <path
                d="M 152 175 C 168 200, 150 225, 135 220"
                stroke="url(#habitGrad)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <circle cx="132" cy="220" r="10" fill="url(#skinGrad)" />
              {/* Little sunflower or heart */}
              <text x="115" y="215" fontSize="22">🌻</text>
            </>
          )}
        </g>

        {/* Head & Face */}
        <g id="head">
          {/* Neck */}
          <rect x="110" y="150" width="20" height="18" fill="#F2BE93" rx="4" />

          {/* Ears */}
          <ellipse cx="62" cy="115" rx="11" ry="14" fill="url(#skinGrad)" />
          <ellipse cx="63" cy="115" rx="6" ry="8" fill="#F5B891" />
          <ellipse cx="178" cy="115" rx="11" ry="14" fill="url(#skinGrad)" />
          <ellipse cx="177" cy="115" rx="6" ry="8" fill="#F5B891" />

          {/* Face Base */}
          <path
            d="M 68 110 C 68 65, 172 65, 172 110 C 172 155, 145 168, 120 168 C 95 168, 68 155, 68 110 Z"
            fill="url(#skinGrad)"
          />

          {/* Cheeks Blush */}
          <circle cx="85" cy="130" r="13" fill="url(#blushGrad)" />
          <circle cx="155" cy="130" r="13" fill="url(#blushGrad)" />

          {/* Eyes */}
          {/* Left Eye */}
          <g id="leftEye">
            <ellipse cx="94" cy="112" rx="13" ry="15" fill="#FFFFFF" />
            <ellipse cx="96" cy="112" rx="10" ry="12" fill="url(#eyeGrad)" />
            {/* Eye Highlight */}
            <circle cx="93" cy="107" r="4.5" fill="#FFFFFF" />
            <circle cx="99" cy="116" r="2" fill="#FFFFFF" />
          </g>

          {/* Right Eye */}
          <g id="rightEye">
            <ellipse cx="146" cy="112" rx="13" ry="15" fill="#FFFFFF" />
            <ellipse cx="144" cy="112" rx="10" ry="12" fill="url(#eyeGrad)" />
            {/* Eye Highlight */}
            <circle cx="141" cy="107" r="4.5" fill="#FFFFFF" />
            <circle cx="147" cy="116" r="2" fill="#FFFFFF" />
          </g>

          {/* Eyebrows (Warm & Friendly) */}
          <path
            d="M 83 93 Q 95 86 107 92"
            stroke="#522C11"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 133 92 Q 145 86 157 93"
            stroke="#522C11"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Cute Nose */}
          <path
            d="M 118 122 Q 120 126 123 124"
            stroke="#DE9B6B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Big Warm Joyful Smile */}
          <path
            d="M 100 134 Q 120 155 140 134"
            fill="#B12B2B"
            stroke="#8E1F1F"
            strokeWidth="1.5"
          />
          {/* Teeth */}
          <path
            d="M 105 136 Q 120 144 135 136 Q 120 134 105 136 Z"
            fill="#FFFFFF"
          />
          {/* Tongue */}
          <path
            d="M 112 144 Q 120 152 128 144 Z"
            fill="#FF8A8A"
          />

          {/* Boyish Franciscan Hair */}
          <path
            d="M 64 100 C 64 55, 176 55, 176 100 C 176 80, 168 62, 145 54 C 120 46, 85 52, 64 100 Z"
            fill="url(#hairGrad)"
          />
          {/* Fringe / Franja */}
          <path
            d="M 65 95 Q 85 105 105 88 Q 125 108 148 85 Q 165 102 175 92 C 175 75, 160 52, 120 50 C 80 52, 65 75, 65 95 Z"
            fill="url(#hairGrad)"
          />
          {/* Hair shine highlight */}
          <path
            d="M 90 62 Q 120 56 150 64"
            stroke="#8C5330"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
};
