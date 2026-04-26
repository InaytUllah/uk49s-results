import { ImageResponse } from 'next/og';

// 180x180 PNG used for iOS "Add to Home Screen"
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        <div style={{ display: 'flex', lineHeight: 1 }}>49</div>
        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: 0 }}>UK Results</div>
      </div>
    ),
    { ...size },
  );
}
