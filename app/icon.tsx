import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#1A3F6F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Diamond orbit — rotated square */}
        <div
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            border: '1.5px solid rgba(255,255,255,0.85)',
            borderRadius: 2,
            transform: 'rotate(45deg)',
          }}
        />
        {/* Gold apex node — top */}
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: 13.5,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#F5C400',
          }}
        />
        {/* Blue node — left */}
        <div
          style={{
            position: 'absolute',
            top: 13.5,
            left: 3,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#4A9FE8',
          }}
        />
        {/* Blue node — right */}
        <div
          style={{
            position: 'absolute',
            top: 13.5,
            right: 3,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#4A9FE8',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
