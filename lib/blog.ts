export type BlogPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  content: string;
};

export const BLOG_STORAGE_KEY = "nexo.blog-posts.v1";
export const BLOG_UPDATED_EVENT = "nexo:blog-updated";

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "fine-line-blackwork",
    title: "The Renaissance of Fine-Line Blackwork",
    description:
      "An exploration into the structural physics and minimalistic philosophy transforming modern skin art into high-end luxury.",
    date: "JUNE 12, 2026",
    author: "Gabriel Nexo",
    readTime: "5 MIN READ",
    category: "INSIGHTS",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800",
    featured: true,
    content:
      "Fine-line blackwork continues to evolve as artists prioritize longevity, skin flow, and restraint over visual noise. The strongest designs feel intentional from a distance and reveal complexity up close.",
  },
  {
    id: "ink-chemistry-safety",
    title: "Beneath the Surface: Modern Ink Chemistry",
    description:
      "A comprehensive look at organic pigment compounds, allergen safety updates, and how premium composition preserves micro-lines over decades.",
    date: "MAY 28, 2026",
    author: "Dr. Elena Rostova",
    readTime: "8 MIN READ",
    category: "FINE LINE",
    image:
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800",
    featured: false,
    content:
      "Pigment quality and particle stability have become central to modern tattoo safety. Better compounds and transparent supplier standards improve both healing outcomes and long-term clarity.",
  },
  {
    id: "minimalist-placement-guide",
    title: "Geometry & Anatomy: The Art of Placement",
    description:
      "How structural muscle flow dictates where minimalist designs should live. Master the alignment balance before hitting the needle.",
    date: "APRIL 14, 2026",
    author: "Sasha Vane",
    readTime: "4 MIN READ",
    category: "DESIGN",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800",
    featured: false,
    content:
      "A strong tattoo can fail visually when placement ignores anatomy. Mapping design weight to movement lines gives minimalist tattoos their premium, intentional feel.",
  },
  {
    id: "aftercare-physics-healing",
    title: "The Physics of Dermal Healing Over Time",
    description:
      "Ditching old myths for advanced scientific methods. Why medical-grade breathable barriers radically alter long-term crispness.",
    date: "MARCH 03, 2026",
    author: "Gabriel Nexo",
    readTime: "6 MIN READ",
    category: "AFTERCARE",
    image:
      "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=800",
    featured: false,
    content:
      "Aftercare determines whether lines stay sharp or blur early. Controlled moisture, low friction, and proper UV discipline protect contrast and detail retention.",
  },
];

const sanitizePost = (post: Partial<BlogPost>): BlogPost | null => {
  const title = typeof post.title === "string" ? post.title.trim() : "";
  const description = typeof post.description === "string" ? post.description.trim() : "";
  const date = typeof post.date === "string" ? post.date.trim() : "";
  const author = typeof post.author === "string" ? post.author.trim() : "";
  const readTime = typeof post.readTime === "string" ? post.readTime.trim() : "";
  const category = typeof post.category === "string" ? post.category.trim() : "";
  const image = typeof post.image === "string" ? post.image.trim() : "";
  const content = typeof post.content === "string" ? post.content.trim() : "";

  if (!title || !description || !date || !author || !readTime || !category || !image) {
    return null;
  }

  return {
    id: typeof post.id === "string" && post.id.trim() ? post.id.trim() : createBlogId(title),
    title,
    description,
    date,
    author,
    readTime,
    category,
    image,
    featured: Boolean(post.featured),
    content: content || description,
  };
};

export const createBlogId = (title: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `post-${Date.now().toString(36)}`;
};

export const normalizeBlogPosts = (value: unknown): BlogPost[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => sanitizePost(item as Partial<BlogPost>))
    .filter((post): post is BlogPost => post !== null);
};

export const getBlogPostsFromStorage = (): BlogPost[] => {
  if (typeof window === "undefined") {
    return DEFAULT_BLOG_POSTS;
  }

  const raw = window.localStorage.getItem(BLOG_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_BLOG_POSTS;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeBlogPosts(parsed);
    return normalized.length > 0 ? normalized : DEFAULT_BLOG_POSTS;
  } catch {
    return DEFAULT_BLOG_POSTS;
  }
};

export const saveBlogPostsToStorage = (posts: BlogPost[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event(BLOG_UPDATED_EVENT));
};
