import { ImageResponse } from 'next/og';

// 180x180 PNG used for iOS "Add to Home Screen".
// `force-static` is required under output: 'export' so the icon is emitted
// once at build time as a plain PNG.
export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          padding: 18,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 35% 30%, #34D399 0%, #10B981 45%, #065F46 100%)',
            borderRadius: '50%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70%',
              height: '70%',
              border: '4px solid white',
              borderRadius: '50%',
              color: 'white',
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            49
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
