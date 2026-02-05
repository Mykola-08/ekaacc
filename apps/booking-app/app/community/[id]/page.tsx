import { getPost } from "@/server/community/actions";
import { CommunityPost } from "@/components/community/CommunityPost";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
 const post = await getPost(params.id);
 if (!post) notFound();
 return <CommunityPost post={post} />;
}
