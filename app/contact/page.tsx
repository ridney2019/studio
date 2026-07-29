"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/providers";
import { SocialLinks } from "@/app/components/SocialLinks";
import ScrollToTopButton from "@/app/components/ScrollToTopButton";
import FloatingSocials from "@/app/components/FloatingSocials";

type IntakeField = {
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
};

type IntakeSection = {
  id: string;
  category: string;
  title: string;
  description: string;
  fields?: IntakeField[];
  scale?: { min: number; max: number; minLabel: string; maxLabel: string };
  skills?: string[];
  subcategories?: { title: string; options: string[] }[];
};

const intakeSections: IntakeSection[] = [
  {
    id: "01",
    category: "ABOUT YOU",
    title: "YOUR DETAILS",
    description: "So I know who I'm talking to and where to send your result.",
    fields: [
      { label: "Full name *", type: "text", required: true },
      { label: "WhatsApp (with country code) *", type: "text", required: true },
      { label: "Email", type: "email" },
      { label: "City and country", type: "text" },
      {
        label: "Preferred language for classes",
        type: "single_select_buttons",
        options: ["English", "Portuguese", "Spanish", "No preference"],
      },
    ],
  },
  {
    id: "02",
    category: "STARTING POINT",
    title: "WHERE YOU ARE TODAY",
    description: "There's no wrong answer here. There's only an honest one.",
    fields: [
      {
        label: "How long have you been tattooing? *",
        type: "single_select_buttons",
        options: ["Never tattooed", "Studying, not tattooing yet", "Under 1 year", "1-3 years", "3-7 years", "7+ years"],
      },
      {
        label: "How many tattoos have you done?",
        type: "single_select_buttons",
        options: ["None", "1-20", "21-100", "100-500", "500+"],
      },
      {
        label: "Where do you work right now?",
        type: "single_select_buttons",
        options: ["Not working yet", "From home", "Someone else's studio", "My own studio", "Guest / travelling"],
      },
      {
        label: "Do you hold a tattoo licence or health registration?",
        type: "single_select_buttons",
        options: ["Yes", "No", "Not sure what I need"],
      },
      {
        label: "Which styles do you work in — or want to?",
        type: "multi_select_buttons",
        options: ["Black & grey", "Realism", "Fineline", "Blackwork", "Traditional", "Neo traditional", "Japanese", "Geometric", "Lettering", "Colour", "Surrealism", "Still deciding"],
      },
    ],
  },
  {
    id: "03",
    category: "SELF-ASSESSMENT",
    title: "WHAT YOU CAN HANDLE",
    description: "Rate each skill honestly. This map is what sets your level.",
    scale: { min: 1, max: 5, minLabel: "can't do it yet", maxLabel: "confident" },
    skills: [
      "Drawing and composition",
      "Linework",
      "Shading and gradients",
      "Solid packing",
      "Needle depth and reading the skin",
      "Machine setup",
      "Stencil and body placement",
      "Cover-ups",
      "Realism and textures",
      "Hygiene and workstation setup",
      "Client handling and closing quotes",
      "Marketing and Instagram",
    ],
  },
  {
    id: "04",
    category: "INTERESTS",
    title: "WHAT YOU WANT TO LEARN",
    description: "Tick everything that interests you. We'll prioritise together afterwards.",
    subcategories: [
      {
        title: "DRAWING AND DESIGN",
        options: ["2D tattoo design", "3D design for tattooing", "Procreate from scratch", "Photoshop for compositing", "AI as a reference tool", "Composition, flow and body anatomy", "Freehand on skin", "Lettering and calligraphy", "Stencil making and application"],
      },
      {
        title: "TECHNIQUE ON SKIN",
        options: ["Linework: steadiness and consistency", "Smooth shading and gradients", "Whip shading", "Dotwork", "Solid packing and blackout", "Depth, stretching and reading the skin", "Machines, needles and pigments", "Machine tuning per technique", "Practice routine on synthetic skin"],
      },
      {
        title: "REALISM AND TEXTURES",
        options: ["Values and contrast in black and grey", "Skin and pores", "Wrinkles and facial expression", "Eyes, mouth and nose", "Hair and beards", "Animal fur", "Fabric, metal, water and smoke", "Portraits: likeness and proportion", "Choosing and editing reference photos"],
      },
      {
        title: "COVER-UPS AND DIFFICULT CASES",
        options: ["Cover-ups: reading the old tattoo", "Designs that actually hide", "Laser plus cover: when to advise it", "Reworking someone else's tattoo", "Scars and damaged skin", "Tattooing dark and deep skin tones", "How tattoos age: what survives"],
      },
      {
        title: "SAFETY AND SETUP",
        options: ["Hygiene and infection control", "Setting up your workstation", "Disposal, sterilisation and barriers", "Licensing and regulations (Ireland)", "Ergonomics and artist health", "Opening your own studio"],
      },
      {
        title: "BUSINESS AND CLIENTS",
        options: ["Client care from first message to aftercare", "Closing quotes on WhatsApp", "Pricing: hourly, session or project", "Bookings, deposits and no-shows", "Marketing for tattoo artists", "Instagram: content and positioning", "Photographing and editing your portfolio", "Personal brand", "Guest spots and conventions", "Money management for artists"],
      },
    ],
  },
  {
    id: "05",
    category: "GOALS",
    title: "WHERE YOU WANT TO GET TO",
    description: "This part matters more than all the rest. Take your time.",
    fields: [
      { label: "What do you want to have achieved six months from now?", type: "textarea" },
      { label: "What's your biggest struggle right now?", type: "textarea" },
      {
        label: "What's holding you back most?",
        type: "multi_select_buttons",
        options: ["Technique on skin", "Drawing", "Not enough clients", "Charging too little", "Fear of messing up", "Equipment", "Time", "No clear direction"],
      },
    ],
  },
  {
    id: "06",
    category: "FORMAT",
    title: "HOW YOU WANT TO STUDY",
    description: "So I can put you in the right group or format straight away.",
    fields: [
      {
        label: "Preferred format",
        type: "single_select_buttons",
        options: ["Live online", "Recorded online", "In person in Dublin", "One-to-one mentoring", "Weekend intensive"],
      },
      {
        label: "When you're usually free",
        type: "multi_select_buttons",
        options: ["Mornings", "Afternoons", "Evenings", "Weekends"],
      },
      {
        label: "When do you want to start?",
        type: "single_select_buttons",
        options: ["Right away", "Within 4 weeks", "Within 3 months", "Just researching"],
      },
      {
        label: "What are you planning to invest in your training?",
        type: "single_select_buttons",
        options: ["Up to €300", "€300-800", "€800-2,000", "Over €2,000", "Rather talk first"],
      },
      { label: "Have you taken a tattoo course before? What was missing from it?", type: "textarea" },
    ],
  },
  {
    id: "07",
    category: "PORTFOLIO",
    title: "SHOW ME YOUR WORK",
    description: "If you already tattoo, seeing your linework changes my recommendation completely.",
    fields: [
      { label: "Instagram", type: "text" },
      { label: "Portfolio link (optional)", type: "text" },
      {
        label: "I'm happy to be contacted about the courses",
        type: "single_select_buttons",
        options: ["Yes, get in touch", "Just the result"],
      },
    ],
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const createInitialFormState = () => {
  const state: Record<string, string | string[]> = {
    full_name: "",
    whatsapp_with_country_code: "",
    email: "",
    city_and_country: "",
    preferred_language_for_classes: "",
    how_long_have_you_been_tattooing: "",
    how_many_tattoos_have_you_done: "",
    where_do_you_work_right_now: "",
    do_you_hold_a_tattoo_licence_or_health_registration: "",
    which_styles_do_you_work_in_or_want_to: [],
    what_do_you_want_to_have_achieved_six_months_from_now: "",
    whats_your_biggest_struggle_right_now: "",
    whats_holding_you_back_most: [],
    preferred_format: "",
    when_youre_usually_free: [],
    when_do_you_want_to_start: "",
    what_are_you_planning_to_invest_in_your_training: "",
    have_you_taken_a_tattoo_course_before_what_was_missing_from_it: "",
    instagram: "",
    portfolio_link_optional: "",
    im_happy_to_be_contacted_about_the_courses: "",
  };

  intakeSections
    .find((section) => section.id === "03")
    ?.skills?.forEach((skill) => {
      state[slugify(skill)] = "";
    });

  return state;
};

export default function ContactPage() {
  const { t, isHydrated } = useTranslation();
  const { theme, toggleTheme } = useLanguage();

  // State Management for Form Submission & Popup Overlays
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Grid entrance animation state
  const [animateGrid, setAnimateGrid] = useState(false);

  useEffect(() => {
    setAnimateGrid(true);
  }, []);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | string[]>>(createInitialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  if (!isHydrated) return null;

  const currentSection = intakeSections[step];

  const updateField = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleMultiSelect = (key: string, option: string) => {
    const currentValue = (formData[key] as string[]) || [];
    const nextValue = currentValue.includes(option)
      ? currentValue.filter((item) => item !== option)
      : [...currentValue, option];
    updateField(key, nextValue);
  };

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};
    const requiredFields = currentSection.fields?.filter((field) => field.required) || [];

    requiredFields.forEach((field) => {
      const key = slugify(field.label);
      const value = formData[key];
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && value.trim() === "")) {
        nextErrors[key] = "This field is required.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, intakeSections.length - 1));
    setFeedback("");
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    setFeedback("");
  };

  const handleCopyAnswers = async () => {
    const summary = intakeSections
      .map((section) => {
        const lines = [section.category, section.title, ""] as string[];
        if (section.fields) {
          section.fields.forEach((field) => {
            const key = slugify(field.label);
            const value = formData[key];
            const formattedValue = Array.isArray(value) ? value.join(", ") : value || "—";
            lines.push(`${field.label}: ${formattedValue}`);
          });
        }

        if (section.skills) {
          section.skills.forEach((skill) => {
            const key = slugify(skill);
            const value = formData[key] || "—";
            lines.push(`${skill}: ${value}`);
          });
        }

        if (section.subcategories) {
          section.subcategories.forEach((subcategory) => {
            const selected = (formData[slugify(subcategory.title)] as string[]) || [];
            lines.push(`${subcategory.title}: ${selected.length ? selected.join(", ") : "—"}`);
          });
        }

        return lines.join("\n");
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(summary);
      setFeedback("Answers copied to clipboard.");
    } catch {
      setFeedback("Copy failed. Please copy manually.");
    }
  };

  const handleWhatsApp = () => {
    const url = "https://api.whatsapp.com/send/?phone=353831757502&text=Hello%21+I%27m+looking+to+get+a+new+tattoo%2C+how+can+I+get+a+quote%3F&type=phone_number&app_absent=0";
    window.open(url, "_blank", "noopener,noreferrer");
    setFeedback("Opening WhatsApp link.");
  };

  const handleClear = () => {
    setFormData(createInitialFormState());
    setErrors({});
    setStep(0);
    setFeedback("Form cleared.");
  };

  const renderField = (field: IntakeField) => {
    const key = slugify(field.label);
    const value = formData[key];
    const error = errors[key];

    if (field.type === "single_select_buttons") {
      return (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <label style={{ fontSize: "0.95rem", fontWeight: 600 }}>{field.label}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {field.options?.map((option) => {
              const selected = value === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField(key, option)}
                  style={{
                    border: selected ? "1px solid var(--accent-color, #fff)" : "1px solid var(--border-color, #333)",
                    background: selected ? "rgba(255,255,255,0.12)" : "transparent",
                    color: "inherit",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {error && <span style={{ color: "#ff4a4a", fontSize: "0.8rem" }}>{error}</span>}
        </div>
      );
    }

    if (field.type === "multi_select_buttons") {
      return (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <label style={{ fontSize: "0.95rem", fontWeight: 600 }}>{field.label}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {field.options?.map((option) => {
              const selected = (value as string[])?.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleMultiSelect(key, option)}
                  style={{
                    border: selected ? "1px solid var(--accent-color, #fff)" : "1px solid var(--border-color, #333)",
                    background: selected ? "rgba(255,255,255,0.12)" : "transparent",
                    color: "inherit",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>{field.label}</span>
          <textarea
            rows={4}
            value={(value as string) || ""}
            onChange={(event) => updateField(key, event.target.value)}
            style={{ minHeight: "110px", padding: "0.9rem", borderRadius: "14px", border: "1px solid var(--border-color, #333)", background: "rgba(255,255,255,0.03)", color: "inherit" }}
          />
          {error && <span style={{ color: "#ff4a4a", fontSize: "0.8rem" }}>{error}</span>}
        </label>
      );
    }

    return (
      <label key={key} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>{field.label}</span>
        <input
          type={field.type === "email" ? "email" : "text"}
          value={(value as string) || ""}
          onChange={(event) => updateField(key, event.target.value)}
          style={{ padding: "0.9rem", borderRadius: "14px", border: "1px solid var(--border-color, #333)", background: "rgba(255,255,255,0.03)", color: "inherit" }}
        />
        {error && <span style={{ color: "#ff4a4a", fontSize: "0.8rem" }}>{error}</span>}
      </label>
    );
  };

  return (
    <>
      {/* Main visual viewport layout container */}
      <main className="contact-shell loaded relative">
        
        {/* Exact Header Matched from Home Page */}
        <header className="site-header fade-section">
          <button 
            onClick={toggleTheme}
            className="accessibility-toggle"
            aria-label="Toggle Accessibility Theme"
          >
            {theme === 'dark' ? '☀ LIGHT MODE' : '☾ DARK MODE'}
          </button>
          
          <a href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            NEXO STUDIO TATTOO
          </a>
          
          <a className="appointment-link" href="/">
            RETURN HOME
          </a>
        </header>

        {/* Contact Hero Section */}
        <section className="contact-hero fade-section" style={{ paddingBottom: "2rem" }}>
          <div>
            <p className="eyebrow">EXPERIENCES</p>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.3" }}>
              Let’s create the most unforgettable tattoo event for you & your brand
            </h2>
            <p style={{ marginTop: "1rem", maxWidth: "600px" }}>
              Whether you want to lock in a private milestone session, activate a corporate branding showcase, or walk right into the studio, explore our booking structures below.
            </p>
          </div>
        </section>

        {/* Booking Options Grid Section */}
        <section className="booking-options-section fade-section" style={{ padding: "0 2rem 4rem 2rem" }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes floatingIcon {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-6px); }
            }
          `}} />
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
              gap: "2.5rem",
              borderTop: "1px solid var(--border-color, #333)",
              paddingTop: "2.5rem"
            }}
          >
            {/* 01: Brand Activations */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 12l10 10 10-10L12 2z"/>
                  <path d="M12 6l6 6-6 6-6-6 6-6z" opacity="0.5"/>
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>01</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Brand Activations</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Book our resident talent for live corporate pop-ups, brand launches, VIP media mixers, and luxury curated events.
              </p>
            </div>

            {/* 02: Walk-Ins */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 0.5s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>02</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Walk-Ins</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Spontaneous ideas are always welcome. Drop directly by our Francis Street studio space for swift, same-day flash custom pieces.
              </p>
            </div>

            {/* 03: Group Sessions */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 1s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>03</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Group Sessions</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Reserve dedicated floor time for creative retreats, private celebrations, or custom party blocks with multiple artists.
              </p>
            </div>

            {/* 04: Matching Tattoos */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0.75rem",
              opacity: animateGrid ? 1 : 0,
              transform: animateGrid ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s'
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                animation: 'floatingIcon 4s ease-in-out infinite 1.5s'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5-1.5-2.5-3.5-2.5-4.5s1-3 2.5-4.5 3.5-1.5 4.5 0l6 6c1 1.5 3 1.5 4.5 0s2.5-3.5 2.5-4.5-1-3-2.5-4.5-3.5-1.5-4.5 0l-6 6" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "var(--accent-color, #888)", letterSpacing: "1px" }}>04</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", margin: "0.25rem 0 0 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Matching Tattoos</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, lineHeight: "1.5" }}>
                Commemorate shared stories, partnerships, or bonds with clean, synchronized fine-line concepts tailored for pairs.
              </p>
            </div>
          </div>
        </section>
   
        {/* Contact Form & Info Grid */}
        <section className="contact-grid fade-section" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="contact-card contact-form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>TRAINING INTAKE</p>
                <h2 style={{ margin: 0, textTransform: "uppercase" }}>NEXO STUDIOS - TATTOO TRAINING INTAKE</h2>
              </div>
              <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Step {step + 1} / {intakeSections.length}
              </div>
            </div>

            <p style={{ margin: "0 0 1.2rem", opacity: 0.8, lineHeight: 1.6 }}>
              {intakeSections[step].description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
              {intakeSections.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setStep(index)}
                  style={{
                    border: index === step ? "1px solid var(--accent-color, #fff)" : "1px solid var(--border-color, #333)",
                    background: index === step ? "rgba(255,255,255,0.10)" : "transparent",
                    color: "inherit",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                  }}
                >
                  {section.id}
                </button>
              ))}
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()} noValidate>
              <div style={{ display: "grid", gap: "1rem" }}>
                <div style={{ borderBottom: "1px solid var(--border-color, #333)", paddingBottom: "0.9rem" }}>
                  <p style={{ margin: 0, opacity: 0.75, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.8rem" }}>
                    {currentSection.category}
                  </p>
                  <h3 style={{ margin: "0.25rem 0 0", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    {currentSection.title}
                  </h3>
                </div>

                {currentSection.fields?.map((field) => renderField(field))}

                {currentSection.skills && (
                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    {currentSection.skills.map((skill) => {
                      const key = slugify(skill);
                      const value = formData[key];
                      return (
                        <div key={skill} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                          <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>{skill}</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                            {Array.from({ length: 5 }, (_, index) => index + 1).map((rating) => {
                              const selected = String(value) === String(rating);
                              return (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => updateField(key, String(rating))}
                                  style={{
                                    width: "2.4rem",
                                    height: "2.4rem",
                                    borderRadius: "999px",
                                    border: selected ? "1px solid var(--accent-color, #fff)" : "1px solid var(--border-color, #333)",
                                    background: selected ? "rgba(255,255,255,0.10)" : "transparent",
                                    color: "inherit",
                                    cursor: "pointer",
                                  }}
                                >
                                  {rating}
                                </button>
                              );
                            })}
                          </div>
                          <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                            {currentSection.scale?.minLabel} — {currentSection.scale?.maxLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentSection.subcategories && (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {currentSection.subcategories.map((subcategory) => (
                      <div key={subcategory.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        <h4 style={{ margin: 0, textTransform: "uppercase", letterSpacing: "0.7px" }}>{subcategory.title}</h4>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                          {subcategory.options.map((option) => {
                            const key = slugify(subcategory.title);
                            const selected = (formData[key] as string[])?.includes(option);
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => toggleMultiSelect(key, option)}
                                style={{
                                  border: selected ? "1px solid var(--accent-color, #fff)" : "1px solid var(--border-color, #333)",
                                  background: selected ? "rgba(255,255,255,0.10)" : "transparent",
                                  color: "inherit",
                                  padding: "0.6rem 0.9rem",
                                  borderRadius: "999px",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={handlePrev} className="button" disabled={step === 0} style={{ opacity: step === 0 ? 0.6 : 1 }}>
                  Back
                </button>
                {step < intakeSections.length - 1 ? (
                  <button type="button" onClick={handleNext} className="button">
                    Next
                  </button>
                ) : (
                  <button type="button" onClick={handleNext} className="button">
                    Review
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" onClick={handleWhatsApp} className="button" style={{ background: "#25D366", color: "#07120b" }}>
                  Send on WhatsApp
                </button>
                <button type="button" onClick={handleCopyAnswers} className="button">
                  Copy answers
                </button>
                <button type="button" onClick={handleClear} className="button">
                  Clear form
                </button>
              </div>

              {feedback ? (
                <p style={{ marginTop: "0.75rem", opacity: 0.9, fontSize: "0.95rem" }}>{feedback}</p>
              ) : null}
            </form>
          </div>

          <div className="contact-card contact-info-card">
            <h2>{t('studioDetails')}</h2>
            <div className="info-block">
              <h3>{t('location')}</h3>
              <p>101-103 Francis St, The Liberties</p>
              <p>Dublin 8, D08 FHP9</p>
            </div>
            <div className="info-block">
              <h3>{t('hours')}</h3>
              <p>{t('timeOpen')}</p>
              <p>{t('tuesdayToSunday')}</p>
              <p>{t('closedMonday')}</p>
            </div>
            <div className="info-block">
              <h3>Booking</h3>
              <p>{t('textPreferred')}</p>
              <p>nexostudiosltd@gmail.com</p>
            </div>
          </div>
        </section>

        {/* Integrated Global Footer */}
        <SocialLinks />
      </main>

      {/* Modern Studio Success Overlay Modal Popup */}
      {showPopup && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: "var(--background-color, #111)",
              border: "1px solid var(--border-color, #333)",
              padding: "3rem 2rem",
              textAlign: "center",
              maxWidth: "400px",
              width: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem"
            }}
          >
            {/* Elegant Fine-line Email Icon */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color, #fff)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            
            <div>
              <h3 style={{ textTransform: "uppercase", fontSize: "1.2rem", margin: "0 0 0.5rem 0", letterSpacing: "1px" }}>Thank You</h3>
              <p style={{ opacity: 0.8, fontSize: "0.95rem", margin: 0, lineHeight: "1.5" }}>
                Your message has been sent successfully. We will review your event configuration and get back to you shortly.
              </p>
            </div>

            <button 
              onClick={() => setShowPopup(false)} 
              className="button"
              style={{ padding: "0.5rem 2rem", fontSize: "0.85rem", width: "auto" }}
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}

      {/* Floating Overlays Matched from Home Page Layout */}
      <FloatingSocials />
      <ScrollToTopButton />
    </>
  );
}