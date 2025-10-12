import { NextRequest, NextResponse } from 'next/server'

// Store uploaded images temporarily in memory (shared globally)
declare global {
  var imageStore: Map<string, { data: Buffer; contentType: string }> | undefined
}

if (!global.imageStore) {
  global.imageStore = new Map()
}

const imageStore = global.imageStore

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique ID
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Store in memory
    imageStore.set(id, {
      data: buffer,
      contentType: file.type || 'image/jpeg'
    })
    
    // Clean up after 5 minutes
    setTimeout(() => {
      imageStore.delete(id)
    }, 5 * 60 * 1000)
    
    // Return public URL
    const baseUrl = request.nextUrl.origin
    return NextResponse.json({ 
      imageUrl: `${baseUrl}/api/image/${id}` 
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    stored: imageStore.size 
  })
}

