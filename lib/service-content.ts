export type ServiceKey = "cover-up" | "new-tattoo" | "scalp-micropigmentation";

export type ProcessStep = {
  title: string;
  description: string;
};

export type ComparisonSlide = {
  label: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

export type ComparisonBlock = {
  title: string;
  intro: string;
  slides: ComparisonSlide[];
};

export type ServiceFunnelContent = {
  serviceLabel: string;
  hookTitle: string;
  hookDescription: string;
  hookPromise: string;
  awarenessTitle: string;
  awarenessItems: string[];
  painTitle: string;
  painItems: string[];
  fearTitle: string;
  fearLead: string;
  fearItems: string[];
  authorityTitle: string;
  authorityDescription: string;
  authorityProof: string[];
  solutionTitle: string;
  solutionLead: string;
  processSteps: ProcessStep[];
  comparisonBlocks: ComparisonBlock[];
  scarcityTitle: string;
  scarcityDescription: string;
  scarcityItems: string[];
  formCta: string;
  formHelper: string;
};

export type ServiceContentOverride = {
  processSteps?: ProcessStep[];
  comparisonBlocks?: Array<{
    title?: string;
    intro?: string;
    slides?: Array<{
      label?: string;
      caption?: string;
      imageSrc?: string;
      imageAlt?: string;
    }>;
  }>;
};

export type ServiceContentOverrideMap = Record<ServiceKey, ServiceContentOverride>;

export const SERVICE_CONTENT_STORAGE_KEY = "nexo.service-content.v1";
export const SERVICE_CONTENT_UPDATED_EVENT = "nexo:service-content-updated";

const sanitizeStep = (step: Partial<ProcessStep>): ProcessStep | null => {
  const title = typeof step.title === "string" ? step.title.trim() : "";
  const description = typeof step.description === "string" ? step.description.trim() : "";

  if (!title || !description) {
    return null;
  }

  return { title, description };
};

const sanitizeSlideOverride = (slide: unknown) => {
  if (!slide || typeof slide !== "object") {
    return null;
  }

  const source = slide as Record<string, unknown>;
  const next: { label?: string; caption?: string; imageSrc?: string; imageAlt?: string } = {};

  if (typeof source.label === "string" && source.label.trim()) next.label = source.label.trim();
  if (typeof source.caption === "string" && source.caption.trim()) next.caption = source.caption.trim();
  if (typeof source.imageSrc === "string" && source.imageSrc.trim()) next.imageSrc = source.imageSrc.trim();
  if (typeof source.imageAlt === "string" && source.imageAlt.trim()) next.imageAlt = source.imageAlt.trim();

  return Object.keys(next).length > 0 ? next : null;
};

const sanitizeBlockOverride = (block: unknown) => {
  if (!block || typeof block !== "object") {
    return null;
  }

  const source = block as Record<string, unknown>;
  const next: {
    title?: string;
    intro?: string;
    slides?: Array<{ label?: string; caption?: string; imageSrc?: string; imageAlt?: string }>;
  } = {};

  if (typeof source.title === "string" && source.title.trim()) next.title = source.title.trim();
  if (typeof source.intro === "string" && source.intro.trim()) next.intro = source.intro.trim();

  if (Array.isArray(source.slides)) {
    const slides = source.slides
      .map((slide) => sanitizeSlideOverride(slide))
      .filter((slide): slide is { label?: string; caption?: string; imageSrc?: string; imageAlt?: string } => slide !== null);

    if (slides.length > 0) {
      next.slides = slides;
    }
  }

  return Object.keys(next).length > 0 ? next : null;
};

const sanitizeOverride = (value: unknown): ServiceContentOverride | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Partial<ServiceContentOverride>;
  const processSteps = Array.isArray(source.processSteps)
    ? source.processSteps
        .map((item) => sanitizeStep(item as Partial<ProcessStep>))
        .filter((item): item is ProcessStep => item !== null)
    : [];

  const comparisonBlocks = Array.isArray(source.comparisonBlocks)
    ? source.comparisonBlocks
        .map((item) => sanitizeBlockOverride(item))
        .filter(
          (
            item
          ): item is {
            title?: string;
            intro?: string;
            slides?: Array<{ label?: string; caption?: string; imageSrc?: string; imageAlt?: string }>;
          } => item !== null
        )
    : [];

  const next: ServiceContentOverride = {};
  if (processSteps.length > 0) {
    next.processSteps = processSteps;
  }
  if (comparisonBlocks.length > 0) {
    next.comparisonBlocks = comparisonBlocks;
  }

  if (!next.processSteps && !next.comparisonBlocks) {
    return null;
  }

  return next;
};

export const getServiceOverridesFromStorage = (): Partial<ServiceContentOverrideMap> => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(SERVICE_CONTENT_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Record<ServiceKey, unknown>>;
    const result: Partial<ServiceContentOverrideMap> = {};

    const keys: ServiceKey[] = ["cover-up", "new-tattoo", "scalp-micropigmentation"];
    keys.forEach((key) => {
      const cleaned = sanitizeOverride(parsed[key]);
      if (cleaned) {
        result[key] = cleaned;
      }
    });

    return result;
  } catch {
    return {};
  }
};

export const saveServiceOverridesToStorage = (value: Partial<ServiceContentOverrideMap>): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SERVICE_CONTENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(SERVICE_CONTENT_UPDATED_EVENT));
};

export const applyServiceOverrides = (
  service: ServiceKey,
  base: ServiceFunnelContent
): ServiceFunnelContent => {
  const overrides = getServiceOverridesFromStorage();
  const target = overrides[service];

  if (!target) {
    return base;
  }

  const mergedComparisonBlocks = target.comparisonBlocks
    ? base.comparisonBlocks.map((block, blockIndex) => {
        const overrideBlock = target.comparisonBlocks?.[blockIndex];
        if (!overrideBlock) {
          return block;
        }

        const mergedSlides = overrideBlock.slides
          ? block.slides.map((slide, slideIndex) => ({
              ...slide,
              ...overrideBlock.slides?.[slideIndex],
            }))
          : block.slides;

        return {
          ...block,
          ...(overrideBlock.title ? { title: overrideBlock.title } : {}),
          ...(overrideBlock.intro ? { intro: overrideBlock.intro } : {}),
          slides: mergedSlides,
        };
      })
    : base.comparisonBlocks;

  return {
    ...base,
    processSteps: target.processSteps ?? base.processSteps,
    comparisonBlocks: mergedComparisonBlocks,
  };
};
