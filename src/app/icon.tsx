import { ImageResponse } from 'next/og';

// 32x32 favicon (auto-served by Next.js)
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
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
            border: '1.5px solid white',
            borderRadius: '50%',
            color: 'white',
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          49
        </div>
      </div>
    ),
    { ...size },
  );
}
