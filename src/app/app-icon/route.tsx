import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const size = parseInt(url.searchParams.get('size') || '192', 10);
  const maskable = url.searchParams.get('maskable') === '1';

  // Maskable icons need extra padding around the safe zone
  const padding = maskable ? size * 0.18 : 0;
  const fontSize = (size - padding * 2) * 0.42;
  const labelSize = (size - padding * 2) * 0.09;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: maskable ? '#0d9488' : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size - padding * 2}px`,
            height: `${size - padding * 2}px`,
            color: 'white',
            fontWeight: 800,
          }}
        >
          <div style={{ display: 'flex', lineHeight: 1, fontSize: `${fontSize}px` }}>49</div>
          <div style={{ fontSize: `${labelSize}px`, fontWeight: 600, marginTop: labelSize * 0.3 }}>
            UK Results
          </div>
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
