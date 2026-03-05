import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://yultingrinpoche.com";

export async function GET() {
  const posts = getAllPosts("en");

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/en/blog/${post.slug}</link>
      <description><![CDATA[${post.summary}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/en/blog/${post.slug}</guid>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yulting Rinpoche</title>
    <link>${BASE_URL}</link>
    <description>Thoughts, reflections, and insights on Buddhist philosophy, translation, and education.</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
