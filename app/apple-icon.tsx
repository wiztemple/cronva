import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#1A3F6F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Outer diamond orbit */}
        <div
          style={{
            position: 'absolute',
            width: 88,
            height: 88,
            border: '6px solid rgba(255,255,255,0.9)',
            borderRadius: 8,
            transform: 'rotate(45deg)',
          }}
        />
        {/* Inner diamond */}
        <div
          style={{
            position: 'absolute',
            width: 60,
            height: 60,
            border: '3px solid rgba(255,255,255,0.35)',
            borderRadius: 5,
            transform: 'rotate(45deg)',
          }}
        />
        {/* Gold apex node — top */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 76,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#F5C400',
          }}
        />
        {/* Blue node — left */}
        <div
          style={{
            position: 'absolute',
            top: 76,
            left: 16,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#4A9FE8',
          }}
        />
        {/* Blue node — right */}
        <div
          style={{
            position: 'absolute',
            top: 76,
            right: 16,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#4A9FE8',
          }}
        />
        {/* Small bottom node */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 82,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
