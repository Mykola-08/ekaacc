
import Link from 'next/link'

export default function BlogPost() {
 return (
  <div className="container mx-auto py-12 px-4 text-center">
   <h1 className="text-4xl font-bold mb-4">404 - Article Not Found</h1>
   <p className="text-muted-foreground mb-8">
    The article you are looking for does not exist or has been moved.
   </p>
   <Link href="/blog" className="text-primary hover:underline">
    Back to Blog
   </Link>
  </div>
 )
}
