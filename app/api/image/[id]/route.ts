import { NextRequest, NextResponse } from 'next/server'

// Import the image store from upload route
// Since we can't directly import, we'll use a global
declare global {
  var imageStore: Map<string, { data: Buffer; contentType: string }> | undefined
}

if (!global.imageStore) {
  global.imageStore = new Map()
}

const imageStore = global.imageStore

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const image = imageStore.get(id)
  
  if (!image) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }
  
  // Convert Buffer to Uint8Array for NextResponse
  const uint8Array = new Uint8Array(image.data)
  
  return new NextResponse(uint8Array, {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

