import { getPayloadClient } from '@/lib/platform/payload'
import Link from 'next/link'
import Image from 'next/image'
import { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog | EKA Account',
  description: 'Latest updates and articles from EKA.',
}

export default async function BlogIndex() {
  const payload = await getPayloadClient()
  
  const posts = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.docs.map((post) => {
          const coverImage = post.coverImage as Media | undefined
          
          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                {coverImage?.url && (
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image 
                      src={coverImage.url} 
                      alt={coverImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4 mt-auto">
                    {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      {posts.docs.length === 0 && (
        <p className="text-gray-500">No posts found.</p>
      )}
    </div>
  )
}
