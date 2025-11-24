import { getPayloadClient } from '@/lib/payload'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  
  const post = posts.docs[0]
  
  if (!post) {
    return {}
  }

  return {
    title: `${post.title} | Blog`,
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  
  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: 'published',
      },
    },
  })

  const post = posts.docs[0]

  if (!post) {
    notFound()
  }

  const coverImage = post.coverImage as Media | undefined

  return (
    <article className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500">
          {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'No date'}
        </p>
      </div>

      {coverImage?.url && (
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden bg-gray-100">
          <Image 
            src={coverImage.url} 
            alt={coverImage.alt || post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose max-w-none">
        {/* Placeholder for RichText content */}
        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} className="hidden" />
        <p>Content rendering is not yet fully implemented. Please check back later.</p>
      </div>
    </article>
  )
}
