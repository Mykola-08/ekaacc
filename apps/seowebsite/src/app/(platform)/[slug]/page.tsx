import { getPayloadClient } from '@/lib/platform/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  
  const page = pages.docs[0]
  
  if (!page) {
    return {}
  }

  return {
    title: page.title,
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: 'published',
      },
    },
  })

  const page = pages.docs[0]

  if (!page) {
    notFound()
  }

  const coverImage = page.coverImage as Media | undefined

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      
      {coverImage?.url && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden bg-gray-100">
          <Image 
            src={coverImage.url} 
            alt={coverImage.alt || page.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose max-w-none">
         <p>Content rendering is not yet fully implemented.</p>
      </div>
    </div>
  )
}
