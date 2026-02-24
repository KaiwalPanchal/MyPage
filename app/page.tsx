import { getLatestPosts } from "@/lib/blog"
import HomeClient from "@/components/HomeClient"

export default async function Home() {
  const posts = getLatestPosts(4)
  return <HomeClient posts={posts} />
}
