import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'stashmd - AI skills that prove themselves'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c0a09',
          backgroundImage: 'radial-gradient(ellipse at center, rgba(251,191,36,0.12) 0%, transparent 60%)',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Wax seal logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #1c1917 0%, #0c0a09 100%)',
            boxShadow: '0 0 60px rgba(251,191,36,0.25), inset 0 0 20px rgba(0,0,0,0.5)',
            marginBottom: '48px',
            position: 'relative',
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              position: 'absolute',
              inset: '4px',
              borderRadius: '50%',
              border: '2px solid #b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          {/* Inner ring */}
          <div
            style={{
              position: 'absolute',
              inset: '24px',
              borderRadius: '50%',
              border: '1px solid #b45309',
            }}
          />
          {/* Cardinal dots */}
          <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          {/* Diagonal dots */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', width: '4px', height: '4px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', width: '4px', height: '4px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '4px', height: '4px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '4px', height: '4px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde68a 0%, #b45309 100%)' }} />
          {/* S letter */}
          <span
            style={{
              fontSize: '56px',
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #b45309 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              position: 'relative',
              zIndex: 1,
            }}
          >
            S
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '72px',
              fontWeight: 400,
              color: '#fafaf9',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.02em',
            }}
          >
            AI skills that
          </span>
          <span
            style={{
              fontSize: '80px',
              fontWeight: 400,
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.02em',
            }}
          >
            prove themselves
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: '26px',
            color: '#78716c',
            marginTop: '40px',
            fontFamily: 'system-ui',
            letterSpacing: '0.05em',
          }}
        >
          Demo first. Install second.
        </span>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #fbbf24 50%, transparent 100%)',
            opacity: 0.4,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
