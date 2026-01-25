"use client";

interface SkillCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  isOfficial?: boolean;
  onClick: () => void;
}

export function SkillCard({
  id,
  name,
  description,
  icon,
  isActive,
  isOfficial = false,
  onClick,
}: SkillCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full rounded-xl p-5 transition-all duration-300 cursor-pointer"
      style={{
        background: isActive ? "var(--bg-surface)" : "transparent",
        border: `1px solid ${isActive ? "var(--accent-gold)" : "var(--border-subtle)"}`,
        boxShadow: isActive ? "0 0 24px var(--glow-gold)" : "none",
        transform: isActive ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Hover glow */}
      {!isActive && (
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, var(--glow-gold), transparent)",
          }}
        />
      )}

      <div className="relative">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-amber) 100%)"
                  : "var(--bg-elevated)",
                color: isActive ? "var(--bg-deep)" : "var(--text-muted)",
              }}
            >
              {icon}
            </div>
            <span
              className="font-semibold"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {name}
            </span>
          </div>

          {isOfficial && (
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{
                background: "rgba(204, 120, 92, 0.1)",
                border: "1px solid rgba(204, 120, 92, 0.2)",
              }}
              title="Anthropic Official"
            >
              <svg width="10" height="10" viewBox="0 0 256 176" fill="#cc785c">
                <path d="M153.1 0h46.2L256 175.6h-46.2L153.1 0ZM56.7 0 0 175.6h47.3l11.6-31.4h59.2l11.5 31.4h47.3L120.2 0H56.7Zm7.2 108.3 21.5-58.6 21.5 58.6H63.9Z" />
              </svg>
            </div>
          )}

          {id === "remotion" && (
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full"
              style={{
                background: "rgba(0, 200, 200, 0.1)",
                border: "1px solid rgba(0, 200, 200, 0.2)",
              }}
              title="Remotion"
            >
              <svg width="12" height="12" viewBox="0 0 410 425" fill="#0cc">
                <path d="M141.332 92.4681C136.307 92.7408 132.259 93.5379 128.179 95.0902C126.144 95.8559 122.809 97.5236 120.973 98.6774C113.295 103.492 107.443 110.729 104.391 119.151C103.782 120.819 102.136 126.137 101.076 129.797C94.0174 154.267 90.0107 181.023 89.1506 209.343C89.0143 213.853 89.0143 224.593 89.1506 229.03C89.7275 247.804 91.5211 264.754 94.7725 282.039C96.0941 289.035 98.2128 298.433 99.44 302.702C101.947 311.376 107.065 318.76 114.344 324.172C119.221 327.801 124.759 330.235 130.895 331.43C133.853 332.007 137.755 332.269 140.629 332.081C144.604 331.818 152.491 330.759 158.9 329.616C187.786 324.466 214.469 315.246 238.666 302.052C253.99 293.692 267.09 284.641 279.729 273.659C292.326 262.73 303.066 250.972 312.516 237.777C314.708 234.725 315.81 232.942 316.911 230.698C319.743 224.908 321.075 219.15 321.064 212.71C321.064 206.71 319.932 201.382 317.488 195.928C316.313 193.295 315.191 191.407 312.674 187.82C303.402 174.615 293.112 163.109 280.568 151.928C261.122 134.601 238.026 120.389 212.235 109.869C206.644 107.593 201.138 105.589 194.509 103.418C180.475 98.8347 163.106 94.8595 148.411 92.8771C146.104 92.5625 142.968 92.3842 141.332 92.4681Z" />
              </svg>
            </div>
          )}

          {id === "copy-doctor" && (
            <div
              className="flex items-center justify-center w-6 h-6"
              title="stashmd native"
            >
              {/* Wax seal style S monogram */}
              <svg width="24" height="24" viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="stashGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde68a"/>
                    <stop offset="50%" stopColor="#fbbf24"/>
                    <stop offset="100%" stopColor="#b45309"/>
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="22" fill="#0c0a09"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke="url(#stashGold)" strokeWidth="1.5"/>
                <circle cx="24" cy="24" r="17" fill="none" stroke="url(#stashGold)" strokeWidth="0.75" opacity="0.5"/>
                <path
                  d="M29 13 C29 13 27 9 22 9 C16 9 13 12.5 13 16 C13 20 16.5 22 21 23.5 C26 25.5 30 27.5 30 32 C30 36.5 26 40 21 40 C16 40 13 37 13 37"
                  fill="none"
                  stroke="url(#stashGold)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: isActive ? "var(--text-secondary)" : "var(--text-muted)",
          }}
        >
          {description}
        </p>

        {/* Active indicator */}
        {isActive && (
          <div
            className="absolute -right-1 -top-1 w-2 h-2 rounded-full"
            style={{
              background: "var(--accent-gold)",
              boxShadow: "0 0 8px var(--accent-gold)",
            }}
          />
        )}
      </div>
    </button>
  );
}
