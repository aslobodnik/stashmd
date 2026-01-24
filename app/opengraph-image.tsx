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
          backgroundImage: 'radial-gradient(ellipse at center top, rgba(251,191,36,0.15) 0%, transparent 50%)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 600,
              color: '#fafaf9',
              fontFamily: 'system-ui',
            }}
          >
            stash<span style={{ color: '#fbbf24', fontStyle: 'italic' }}>.md</span>
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
              fontSize: '64px',
              fontWeight: 400,
              color: '#fafaf9',
              fontFamily: 'serif',
              marginBottom: '8px',
            }}
          >
            AI skills that
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 400,
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              fontFamily: 'serif',
            }}
          >
            prove themselves
          </span>
        </div>

        {/* Tagline */}
        <span
          style={{
            fontSize: '24px',
            color: '#a8a29e',
            marginTop: '32px',
            fontFamily: 'system-ui',
          }}
        >
          See the difference before you install
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
