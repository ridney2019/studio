"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  BLOG_UPDATED_EVENT,
  BlogPost,
  createBlogId,
  DEFAULT_BLOG_POSTS,
  getBlogPostsFromStorage,
  saveBlogPostsToStorage,
} from "@/lib/blog";
import {
  getServiceOverridesFromStorage,
  saveServiceOverridesToStorage,
  ServiceContentOverrideMap,
  ServiceKey,
  SERVICE_CONTENT_UPDATED_EVENT,
} from "@/lib/service-content";

type BlogForm = {
  title: string;
  image: string;
  author: string;
  readTime: string;
  category: string;
  date: string;
  description: string;
  content: string;
  featured: boolean;
};

type SlideForm = {
  label: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

type BlockForm = {
  title: string;
  intro: string;
  slides: SlideForm[];
};

type ServiceForm = {
  processStepsText: string;
  blocks: BlockForm[];
};

const emptyBlogForm: BlogForm = {
  title: "",
  image: "",
  author: "",
  readTime: "",
  category: "",
  date: "",
  description: "",
  content: "",
  featured: false,
};

const serviceOptions: Array<{ key: ServiceKey; label: string }> = [
  { key: "cover-up", label: "Cover Up" },
  { key: "new-tattoo", label: "New Tattoo" },
  { key: "scalp-micropigmentation", label: "Scalp Micro" },
];

const makeEmptyServiceForm = (): ServiceForm => ({
  processStepsText: "",
  blocks: [
    {
      title: "",
      intro: "",
      slides: [
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
      ],
    },
    {
      title: "",
      intro: "",
      slides: [
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
      ],
    },
    {
      title: "",
      intro: "",
      slides: [
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
        { label: "", caption: "", imageSrc: "", imageAlt: "" },
      ],
    },
  ],
});

const applyOverrideToForm = (
  base: ServiceForm,
  override: Partial<ServiceContentOverrideMap[ServiceKey]> | undefined
): ServiceForm => {
  if (!override) {
    return base;
  }

  const next = structuredClone(base);

  if (override.processSteps && override.processSteps.length > 0) {
    next.processStepsText = override.processSteps
      .map((step) => `${step.title} | ${step.description}`)
      .join("\n");
  }

  if (override.comparisonBlocks && override.comparisonBlocks.length > 0) {
    override.comparisonBlocks.forEach((block, blockIndex) => {
      if (!next.blocks[blockIndex]) {
        return;
      }

      if (block.title) next.blocks[blockIndex].title = block.title;
      if (block.intro) next.blocks[blockIndex].intro = block.intro;

      block.slides?.forEach((slide, slideIndex) => {
        const targetSlide = next.blocks[blockIndex].slides[slideIndex];
        if (!targetSlide) {
          return;
        }

        if (slide.label) targetSlide.label = slide.label;
        if (slide.caption) targetSlide.caption = slide.caption;
        if (slide.imageSrc) targetSlide.imageSrc = slide.imageSrc;
        if (slide.imageAlt) targetSlide.imageAlt = slide.imageAlt;
      });
    });
  }

  return next;
};

export default function AdminContentPage() {
  const { data: session, status } = useSession();

  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogForm);

  const [serviceKey, setServiceKey] = useState<ServiceKey>("cover-up");
  const [serviceForms, setServiceForms] = useState<Record<ServiceKey, ServiceForm>>({
    "cover-up": makeEmptyServiceForm(),
    "new-tattoo": makeEmptyServiceForm(),
    "scalp-micropigmentation": makeEmptyServiceForm(),
  });

  useEffect(() => {
    const syncBlog = () => {
      setPosts(getBlogPostsFromStorage());
    };

    syncBlog();
    window.addEventListener(BLOG_UPDATED_EVENT, syncBlog);
    return () => window.removeEventListener(BLOG_UPDATED_EVENT, syncBlog);
  }, []);

  useEffect(() => {
    const syncServices = () => {
      const overrides = getServiceOverridesFromStorage();
      setServiceForms({
        "cover-up": applyOverrideToForm(makeEmptyServiceForm(), overrides["cover-up"]),
        "new-tattoo": applyOverrideToForm(makeEmptyServiceForm(), overrides["new-tattoo"]),
        "scalp-micropigmentation": applyOverrideToForm(makeEmptyServiceForm(), overrides["scalp-micropigmentation"]),
      });
    };

    syncServices();
    window.addEventListener(SERVICE_CONTENT_UPDATED_EVENT, syncServices);
    return () => window.removeEventListener(SERVICE_CONTENT_UPDATED_EVENT, syncServices);
  }, []);

  const currentServiceForm = serviceForms[serviceKey];

  const blogButtonLabel = useMemo(
    () => (editingPostId ? "Update Blog Post" : "Add Blog Post"),
    [editingPostId]
  );

  const handleBlogField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlogImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setBlogForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const resetBlogEditor = () => {
    setEditingPostId(null);
    setBlogForm(emptyBlogForm);
  };

  const persistPosts = (nextPosts: BlogPost[]) => {
    saveBlogPostsToStorage(nextPosts);
    setPosts(nextPosts);
  };

  const handleBlogSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: BlogForm = {
      title: blogForm.title.trim(),
      image: blogForm.image.trim(),
      author: blogForm.author.trim(),
      readTime: blogForm.readTime.trim(),
      category: blogForm.category.trim().toUpperCase(),
      date: blogForm.date.trim(),
      description: blogForm.description.trim(),
      content: blogForm.content.trim() || blogForm.description.trim(),
      featured: blogForm.featured,
    };

    if (!payload.title || !payload.image || !payload.author || !payload.readTime || !payload.category || !payload.date || !payload.description) {
      return;
    }

    const featuredReset = posts.map((post) => ({ ...post, featured: false }));

    if (editingPostId) {
      const updated = featuredReset.map((post) =>
        post.id === editingPostId
          ? { ...post, ...payload }
          : post
      );
      persistPosts(updated);
      resetBlogEditor();
      return;
    }

    const nextPost: BlogPost = {
      id: createBlogId(payload.title),
      ...payload,
    };

    persistPosts([nextPost, ...featuredReset]);
    resetBlogEditor();
  };

  const editPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setBlogForm({
      title: post.title,
      image: post.image,
      author: post.author,
      readTime: post.readTime,
      category: post.category,
      date: post.date,
      description: post.description,
      content: post.content,
      featured: post.featured,
    });
  };

  const removePost = (id: string) => {
    persistPosts(posts.filter((post) => post.id !== id));
    if (editingPostId === id) {
      resetBlogEditor();
    }
  };

  const restoreDefaultPosts = () => {
    persistPosts(DEFAULT_BLOG_POSTS);
    resetBlogEditor();
  };

  const handleServiceProcessText = (value: string) => {
    setServiceForms((prev) => ({
      ...prev,
      [serviceKey]: {
        ...prev[serviceKey],
        processStepsText: value,
      },
    }));
  };

  const handleServiceBlockField = (
    blockIndex: number,
    field: "title" | "intro",
    value: string
  ) => {
    setServiceForms((prev) => {
      const next = structuredClone(prev);
      next[serviceKey].blocks[blockIndex][field] = value;
      return next;
    });
  };

  const handleServiceSlideField = (
    blockIndex: number,
    slideIndex: number,
    field: keyof SlideForm,
    value: string
  ) => {
    setServiceForms((prev) => {
      const next = structuredClone(prev);
      next[serviceKey].blocks[blockIndex].slides[slideIndex][field] = value;
      return next;
    });
  };

  const handleServiceSlideImageUpload = (
    blockIndex: number,
    slideIndex: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      handleServiceSlideField(blockIndex, slideIndex, "imageSrc", result);
    };
    reader.readAsDataURL(file);
  };

  const saveCurrentServiceOverride = () => {
    const parsedSteps = currentServiceForm.processStepsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [titlePart, ...rest] = line.split("|");
        return {
          title: (titlePart || "").trim(),
          description: rest.join("|").trim(),
        };
      })
      .filter((step) => step.title && step.description);

    const comparisonBlocks = currentServiceForm.blocks
      .map((block) => {
        const slides = block.slides
          .map((slide) => ({
            label: slide.label.trim(),
            caption: slide.caption.trim(),
            imageSrc: slide.imageSrc.trim(),
            imageAlt: slide.imageAlt.trim(),
          }))
          .filter((slide) => slide.label || slide.caption || slide.imageSrc || slide.imageAlt);

        if (!block.title.trim() && !block.intro.trim() && slides.length === 0) {
          return null;
        }

        return {
          title: block.title.trim() || undefined,
          intro: block.intro.trim() || undefined,
          slides: slides.length > 0 ? slides : undefined,
        };
      })
      .filter((block): block is NonNullable<typeof block> => block !== null);

    const nextOverrides = {
      ...getServiceOverridesFromStorage(),
      [serviceKey]: {
        ...(parsedSteps.length > 0 ? { processSteps: parsedSteps } : {}),
        ...(comparisonBlocks.length > 0 ? { comparisonBlocks } : {}),
      },
    };

    saveServiceOverridesToStorage(nextOverrides);
  };

  const clearCurrentServiceOverride = () => {
    const nextOverrides = { ...getServiceOverridesFromStorage() };
    delete nextOverrides[serviceKey];
    saveServiceOverridesToStorage(nextOverrides);
    setServiceForms((prev) => ({
      ...prev,
      [serviceKey]: makeEmptyServiceForm(),
    }));
  };

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <p style={{ margin: 0, opacity: 0.7 }}>Checking owner access...</p>
      </main>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div style={{ display: "grid", gap: "0.8rem", textAlign: "center" }}>
          <h1 style={{ margin: 0 }}>Owner access required</h1>
          <Link href="/admin/artists" style={{ color: "inherit" }}>
            Go to admin sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem 4rem", display: "grid", gap: "1.6rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0 }}>Content Admin</h1>
          <p style={{ margin: "0.35rem 0 0", opacity: 0.75 }}>Manage blog posts and service image/process content.</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href="/admin/artists" style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: "999px", padding: "0.55rem 0.9rem", textDecoration: "none", color: "inherit" }}>
            Artist Admin
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/artists" })}
            style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: "999px", padding: "0.55rem 0.9rem", background: "transparent", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <section style={{ border: "1px solid rgba(0,0,0,0.15)", borderRadius: "16px", padding: "1rem", display: "grid", gap: "0.9rem" }}>
        <h2 style={{ margin: 0 }}>Blog Admin</h2>
        <form onSubmit={handleBlogSubmit} style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ display: "grid", gap: "0.7rem", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
            <input name="title" value={blogForm.title} onChange={handleBlogField} placeholder="Title" />
            <input name="author" value={blogForm.author} onChange={handleBlogField} placeholder="Written by" />
            <input name="readTime" value={blogForm.readTime} onChange={handleBlogField} placeholder="Min read (e.g. 5 MIN READ)" />
            <input name="category" value={blogForm.category} onChange={handleBlogField} placeholder="Category (INSIGHTS, FINE LINE...)" />
            <input name="date" value={blogForm.date} onChange={handleBlogField} placeholder="Date (JUNE 12, 2026)" />
          </div>

          <input name="image" value={blogForm.image} onChange={handleBlogField} placeholder="Image URL or upload" />
          <input type="file" accept="image/*" onChange={handleBlogImageUpload} />

          <textarea name="description" value={blogForm.description} onChange={handleBlogField} placeholder="Short description" rows={2} />
          <textarea name="content" value={blogForm.content} onChange={handleBlogField} placeholder="Full post content" rows={5} />

          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={blogForm.featured}
              onChange={(event) => setBlogForm((prev) => ({ ...prev, featured: event.target.checked }))}
            />
            Featured article
          </label>

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ border: 0, borderRadius: "999px", padding: "0.6rem 1rem", background: "#111", color: "#fff", cursor: "pointer" }}>
              {blogButtonLabel}
            </button>
            {editingPostId ? (
              <button type="button" onClick={resetBlogEditor} style={{ border: "1px solid rgba(0,0,0,0.25)", borderRadius: "999px", padding: "0.6rem 1rem", background: "transparent", cursor: "pointer" }}>
                Cancel Edit
              </button>
            ) : null}
            <button type="button" onClick={restoreDefaultPosts} style={{ border: "1px solid rgba(0,0,0,0.25)", borderRadius: "999px", padding: "0.6rem 1rem", background: "transparent", cursor: "pointer" }}>
              Restore Blog Defaults
            </button>
          </div>
        </form>

        <div style={{ display: "grid", gap: "0.7rem" }}>
          {posts.map((post) => (
            <article key={post.id} style={{ border: "1px solid rgba(0,0,0,0.13)", borderRadius: "12px", padding: "0.8rem", display: "grid", gridTemplateColumns: "88px 1fr auto", gap: "0.8rem", alignItems: "center" }}>
              <div style={{ width: "88px", height: "88px", borderRadius: "10px", overflow: "hidden", background: "rgba(0,0,0,0.06)" }}>
                <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1rem" }}>{post.title}</h3>
                <p style={{ margin: "0.2rem 0", opacity: 0.75 }}>
                  {post.category} | {post.author} | {post.readTime}
                </p>
                <p style={{ margin: 0, opacity: 0.65, fontSize: "0.9rem" }}>{post.description}</p>
              </div>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => editPost(post)} style={{ border: "1px solid rgba(0,0,0,0.22)", borderRadius: "999px", padding: "0.45rem 0.8rem", background: "transparent", cursor: "pointer" }}>
                  Edit
                </button>
                <button type="button" onClick={() => removePost(post.id)} style={{ border: "1px solid rgba(176, 0, 32, 0.4)", borderRadius: "999px", padding: "0.45rem 0.8rem", background: "rgba(176, 0, 32, 0.08)", color: "#8a0017", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={{ border: "1px solid rgba(0,0,0,0.15)", borderRadius: "16px", padding: "1rem", display: "grid", gap: "0.9rem" }}>
        <h2 style={{ margin: 0 }}>Service Admin</h2>
        <p style={{ margin: 0, opacity: 0.72 }}>
          Manage cover-up, new tattoo, and scalp micro visuals: before/after, fresh/healed, process slides, and process steps.
        </p>

        <label style={{ display: "grid", gap: "0.3rem", maxWidth: "280px" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Service</span>
          <select value={serviceKey} onChange={(event) => setServiceKey(event.target.value as ServiceKey)}>
            {serviceOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Process Steps</span>
          <span style={{ fontSize: "0.75rem", opacity: 0.65 }}>One per line: Step title | Step description</span>
          <textarea
            rows={6}
            value={currentServiceForm.processStepsText}
            onChange={(event) => handleServiceProcessText(event.target.value)}
            placeholder="Consultation | We review your references and goals"
          />
        </label>

        {currentServiceForm.blocks.map((block, blockIndex) => (
          <section key={blockIndex} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: "12px", padding: "0.9rem", display: "grid", gap: "0.7rem" }}>
            <h3 style={{ margin: 0 }}>Visual Block {blockIndex + 1}</h3>
            <input
              value={block.title}
              onChange={(event) => handleServiceBlockField(blockIndex, "title", event.target.value)}
              placeholder="Block title (e.g. Fresh vs. Healed)"
            />
            <textarea
              rows={2}
              value={block.intro}
              onChange={(event) => handleServiceBlockField(blockIndex, "intro", event.target.value)}
              placeholder="Block intro"
            />

            {block.slides.map((slide, slideIndex) => (
              <div key={slideIndex} style={{ border: "1px dashed rgba(0,0,0,0.2)", borderRadius: "10px", padding: "0.7rem", display: "grid", gap: "0.5rem" }}>
                <strong style={{ fontSize: "0.85rem" }}>Slide {slideIndex + 1}</strong>
                <input
                  value={slide.label}
                  onChange={(event) => handleServiceSlideField(blockIndex, slideIndex, "label", event.target.value)}
                  placeholder="Label"
                />
                <input
                  value={slide.caption}
                  onChange={(event) => handleServiceSlideField(blockIndex, slideIndex, "caption", event.target.value)}
                  placeholder="Caption"
                />
                <input
                  value={slide.imageSrc}
                  onChange={(event) => handleServiceSlideField(blockIndex, slideIndex, "imageSrc", event.target.value)}
                  placeholder="Image URL or upload"
                />
                <input
                  value={slide.imageAlt}
                  onChange={(event) => handleServiceSlideField(blockIndex, slideIndex, "imageAlt", event.target.value)}
                  placeholder="Image alt"
                />
                <input type="file" accept="image/*" onChange={(event) => handleServiceSlideImageUpload(blockIndex, slideIndex, event)} />
              </div>
            ))}
          </section>
        ))}

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button type="button" onClick={saveCurrentServiceOverride} style={{ border: 0, borderRadius: "999px", padding: "0.6rem 1rem", background: "#111", color: "#fff", cursor: "pointer" }}>
            Save {serviceOptions.find((item) => item.key === serviceKey)?.label}
          </button>
          <button type="button" onClick={clearCurrentServiceOverride} style={{ border: "1px solid rgba(0,0,0,0.25)", borderRadius: "999px", padding: "0.6rem 1rem", background: "transparent", cursor: "pointer" }}>
            Clear {serviceOptions.find((item) => item.key === serviceKey)?.label} Overrides
          </button>
        </div>
      </section>
    </main>
  );
}
