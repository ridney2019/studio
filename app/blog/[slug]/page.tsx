"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { DEFAULT_BLOG_POSTS, getBlogPostsFromStorage } from "@/lib/blog";
import { useLanguage } from "@/app/providers";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const { theme } = useLanguage();
  const slug = params?.slug;

  const post = useMemo(() => {
    const posts = getBlogPostsFromStorage();
    return posts.find((item) => item.id === slug) ?? DEFAULT_BLOG_POSTS.find((item) => item.id === slug) ?? null;
  }, [slug]);

  if (!post) {
    return (
      <main style={{ minHeight: "100vh", padding: "5rem 1.5rem", display: "grid", placeItems: "center" }}>
        <div style={{ maxWidth: "620px", textAlign: "center", display: "grid", gap: "1rem" }}>
          <h1 style={{ margin: 0 }}>Post not found</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>This blog entry does not exist yet.</p>
          <Link href="/blog" style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "4rem 1.5rem 6rem",
        color: theme === "dark" ? "#fff" : "#111",
        background: theme === "dark" ? "#0a0a0a" : "#fff",
      }}
    >
      <article style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "1.2rem" }}>
        <Link href="/blog" style={{ textDecoration: "none", color: "inherit", opacity: 0.75 }}>
          Back to blog
        </Link>
        <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.12em", opacity: 0.65 }}>
          {post.category} | {post.date}
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 1.1 }}>{post.title}</h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          Written by {post.author} | {post.readTime}
        </p>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "12px", overflow: "hidden" }}>
          <Image src={post.image} alt={post.title} fill style={{ objectFit: "cover" }} />
        </div>
        <p style={{ margin: 0, lineHeight: 1.9, fontSize: "1.05rem", opacity: 0.9 }}>{post.content}</p>
      </article>
    </main>
  );
}
