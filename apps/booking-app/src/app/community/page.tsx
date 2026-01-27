import { getPosts } from "@/server/community/actions";
import { CommunityList } from "@/components/community/CommunityList";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
 const posts = await getPosts();
 // Cast to any to bypass strict type matching if server action returns slightly different shape during migration
 return <CommunityList posts={posts as any[]} />;
}