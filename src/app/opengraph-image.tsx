import { ImageResponse } from 'next/og';

// Default Open Graph image for the whole site.
// Generated AT BUILD TIME (not runtime) under static export, so it costs zero
// serverless invocations once deployed to Cloudflare Pages.
// Individual pages can override this by placing their own opengraph-image.tsx
// in their route folder.

// Required under output: 'export' — emits as a static /opengraph-image.png
export const dynamic = 'force-static';

export const alt = 'UK49s Results — Brunchtime, Lunchtime, Drivetime & Teatime winning numbers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
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
          background: 'linear-gradient(135deg, #065f46 0%, #0d9488 50%, #059669 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #34D399 0%, #10B981 45%, #065F46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: '70%',
                height: '70%',
                border: '3px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              49
            </div>
          </div>
          <span style={{ color: 'white', fontSize: '44px', fontWeight: 800, letterSpacing: -1 }}>
            UK49s <span style={{ fontWeight: 500, color: '#34D399' }}>Results</span>
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            color: 'white',
            fontSize: '60px',
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '1000px',
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          UK 49s Results Today
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#d1fae5',
            fontSize: '28px',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
          }}
        >
          Brunchtime · Lunchtime · Drivetime · Teatime
        </div>

        {/* Sample balls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '40px',
          }}
        >
          {[7, 14, 23, 31, 38, 45].map(num => (
            <div
              key={num}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827',
                fontSize: '30px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
              }}
            >
              {num}
            </div>
          ))}
          <div style={{ color: '#fbbf24', fontSize: '32px', fontWeight: 'bold' }}>+</div>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '30px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
            }}
          >
            12
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            color: '#a7f3d0',
            fontSize: '20px',
          }}
        >
          uk49sresults.co.uk
        </div>
      </div>
    ),
    size,
  );
}
