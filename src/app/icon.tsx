import { ImageResponse } from 'next/og';

// 32x32 PNG used for browser tab favicon
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          letterSpacing: -0.5,
          borderRadius: 6,
        }}
      >
        49
      </div>
    ),
    { ...size },
  );
}
