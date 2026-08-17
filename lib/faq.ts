export type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ_STORAGE_KEY = "nexo.faq-content.v1";
export const FAQ_UPDATED_EVENT = "nexo:faq-content-updated";

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I book a tattoo consultation?",
    answer:
      "Use the contact page to send your reference images, placement ideas, and preferred timeline. We will reply with the next available steps and whether the design is a good fit for the studio.",
  },
  {
    question: "Do you take deposits for bookings?",
    answer:
      "Yes. A deposit is required to secure time on the calendar and begin design work. The exact amount depends on the size and complexity of the project, and it is always confirmed before we lock in the appointment.",
  },
  {
    question: "Can you help with cover-ups or reworks?",
    answer:
      "Yes. Cover-ups and reworks are handled carefully because they need the right composition, contrast, and planning. Send clear photos in natural light so we can assess what is possible before you book.",
  },
  {
    question: "What should I do before my session?",
    answer:
      "Arrive rested, hydrated, and fed. Avoid alcohol the day before, wear clothing that gives easy access to the area, and bring any reference images or notes that help explain the piece.",
  },
  {
    question: "How should I care for a fresh tattoo?",
    answer:
      "Follow the aftercare instructions given after your appointment. Keep the area clean, avoid soaking or scratching it, and protect it from direct sun while it heals.",
  },
  {
    question: "Do you accept walk-ins?",
    answer:
      "Walk-ins depend on artist availability and the size of the request. For larger or custom work, booking ahead is the best way to guarantee time with the right artist.",
  },
];

const sanitizeItem = (item: unknown): FAQItem | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const source = item as Record<string, unknown>;
  const question = typeof source.question === "string" ? source.question.trim() : "";
  const answer = typeof source.answer === "string" ? source.answer.trim() : "";

  if (!question || !answer) {
    return null;
  }

  return { question, answer };
};

export const getFaqItemsFromStorage = (): FAQItem[] => {
  if (typeof window === "undefined") {
    return DEFAULT_FAQ_ITEMS;
  }

  const raw = window.localStorage.getItem(FAQ_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_FAQ_ITEMS;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return DEFAULT_FAQ_ITEMS;
    }

    const items = parsed.map((item) => sanitizeItem(item)).filter((item): item is FAQItem => item !== null);
    return items.length > 0 ? items : DEFAULT_FAQ_ITEMS;
  } catch {
    return DEFAULT_FAQ_ITEMS;
  }
};

export const saveFaqItemsToStorage = (value: FAQItem[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  const cleaned = value
    .map((item) => sanitizeItem(item))
    .filter((item): item is FAQItem => item !== null);

  window.localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(cleaned));
  window.dispatchEvent(new Event(FAQ_UPDATED_EVENT));
};