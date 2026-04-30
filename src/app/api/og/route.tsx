import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'UK 49s Results';
  const subtitle = searchParams.get('subtitle') || 'Lunchtime & Teatime Winning Numbers';
  const numbers = searchParams.get('numbers') || '';
  const booster = searchParams.get('booster') || '';
  const type = searchParams.get('type') || 'default'; // default, result, prediction

  const numbersList = numbers ? numbers.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n)) : [];
  const boosterNum = booster ? parseInt(booster, 10) : null;

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
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #34D399 0%, #10B981 45%, #065F46 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: '70%',
                height: '70%',
                border: '2px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: -0.8,
              }}
            >
              49
            </div>
          </div>
          <span style={{ color: 'white', fontSize: '32px', fontWeight: 800, letterSpacing: -1 }}>
            UK49s <span style={{ fontWeight: 500, color: '#34D399' }}>Results</span>
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: type === 'default' ? '52px' : '42px',
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: '#d1fae5',
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '800px',
            marginBottom: numbersList.length > 0 ? '32px' : '0',
          }}
        >
          {subtitle}
        </div>

        {/* Lottery balls */}
        {numbersList.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {numbersList.map((num, i) => (
              <div
                key={i}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#111827',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                }}
              >
                {num}
              </div>
            ))}
            {boosterNum && (
              <>
                <div style={{ color: '#fbbf24', fontSize: '28px', fontWeight: 'bold' }}>+</div>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  }}
                >
                  {boosterNum}
                </div>
              </>
            )}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            color: '#a7f3d0',
            fontSize: '18px',
          }}
        >
          uk49sresults.co.uk
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
