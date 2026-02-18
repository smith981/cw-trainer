interface HamRadioSvgProps {
  width?: number;
  height?: number;
  className?: string;
}

export function HamRadioSvg({ width = 320, height = 220, className }: HamRadioSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 220"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Antenna */}
      <line x1="260" y1="10" x2="260" y2="65" stroke="#aaa" strokeWidth="3" />
      <line x1="260" y1="10" x2="230" y2="30" stroke="#aaa" strokeWidth="2" />
      <line x1="260" y1="10" x2="290" y2="30" stroke="#aaa" strokeWidth="2" />
      <circle cx="260" cy="8" r="4" fill="#e94560" />

      {/* Coax cable */}
      <path d="M260 65 Q260 75 250 80 L200 80" stroke="#666" strokeWidth="2" fill="none" />

      {/* Radio body */}
      <rect x="30" y="65" width="240" height="120" rx="8" fill="#2a2a3e" stroke="#444" strokeWidth="2" />

      {/* Front panel inset */}
      <rect x="40" y="75" width="220" height="100" rx="4" fill="#1e1e30" />

      {/* Display screen */}
      <rect x="50" y="85" width="100" height="40" rx="3" fill="#0a2a1a" stroke="#333" strokeWidth="1" />
      <text x="100" y="108" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#4caf50" fontWeight="bold">
        CW
      </text>
      <text x="100" y="120" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4caf5088">
        7.030 MHz
      </text>

      {/* Main tuning knob */}
      <circle cx="200" cy="105" r="28" fill="#333" stroke="#555" strokeWidth="2" />
      <circle cx="200" cy="105" r="22" fill="#3a3a4e" />
      <circle cx="200" cy="105" r="3" fill="#888" />
      <line x1="200" y1="83" x2="200" y2="90" stroke="#e94560" strokeWidth="2" strokeLinecap="round" />

      {/* Small knobs */}
      <circle cx="60" cy="155" r="10" fill="#333" stroke="#555" strokeWidth="1.5" />
      <circle cx="60" cy="155" r="2" fill="#777" />
      <circle cx="100" cy="155" r="10" fill="#333" stroke="#555" strokeWidth="1.5" />
      <circle cx="100" cy="155" r="2" fill="#777" />

      {/* LED indicators */}
      <circle cx="140" cy="150" r="3" fill="#4caf50">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="155" cy="150" r="3" fill="#e94560" opacity="0.3" />

      {/* Speaker grille */}
      <g>
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="170"
            y1={142 + i * 5}
            x2="240"
            y2={142 + i * 5}
            stroke="#444"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Feet */}
      <rect x="45" y="185" width="30" height="6" rx="2" fill="#555" />
      <rect x="225" y="185" width="30" height="6" rx="2" fill="#555" />

      {/* Table surface line */}
      <line x1="10" y1="195" x2="310" y2="195" stroke="#33334488" strokeWidth="1" />
    </svg>
  );
}
