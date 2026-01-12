
import Link from 'next/link'

export const metadata = {
 title: 'Blog | EKA Account',
 description: 'Latest updates and articles from EKA.',
}

export default function BlogIndex() {
 return (
  <div className="container mx-auto py-12 px-4">
   <h1 className="text-4xl font-bold mb-8">Blog</h1>
   <div className="p-12 text-center bg-gray-50 rounded-xl border">
    <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
    <p className="text-gray-500 mb-6">
     Our blog is currently undergoing maintenance. Please check back later.
    </p>
    <Link href="/" className="text-primary hover:underline">
     Return to Home
    </Link>
   </div>
  </div>
 )
}
