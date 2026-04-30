import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const size = parseInt(url.searchParams.get('size') || '192', 10);
  const maskable = url.searchParams.get('maskable') === '1';

  // Maskable icons need a 18% safe-zone padding around the visible mark
  const padding = maskable ? size * 0.18 : size * 0.06;
  const innerSize = size - padding * 2;
  const ringFontSize = innerSize * 0.42;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maskable ? '#0F172A' : '#0F172A',
        }}
      >
        <div
          style={{
            width: `${innerSize}px`,
            height: `${innerSize}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 35% 30%, #34D399 0%, #10B981 45%, #065F46 100%)',
            borderRadius: '50%',
          }}
        >
          <div
            style={{
              width: '70%',
              height: '70%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `${Math.max(2, innerSize * 0.025)}px solid white`,
              borderRadius: '50%',
              color: 'white',
              fontSize: `${ringFontSize}px`,
              fontWeight: 800,
              letterSpacing: ringFontSize * -0.04,
            }}
          >
            49
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
