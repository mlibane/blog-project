import { NextResponse } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'

export async function POST(req: Request) {
  const data = await req.formData()
  const file = data.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }).end(buffer)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return NextResponse.json({ error: 'Error uploading image' }, { status: 500 })
  }
}