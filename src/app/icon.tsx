import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
const Icon = async () => {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#0066cc',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '8px',
        }}
      >
        D79
      </div>
    ),
    {
      ...size,
    }
  )
}

export default Icon 