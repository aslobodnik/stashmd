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
        boxShadow: isActive ? "0 0 20px var(--glow-gold)" : "none",
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
