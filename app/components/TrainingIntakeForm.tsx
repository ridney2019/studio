"use client";

import React, { useState } from "react";

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

export default function TrainingIntakeForm() {
  const [formData, setFormData] = useState<Record<string, string | string[]>>(createInitialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

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

  const validateAllFields = () => {
    const nextErrors: Record<string, string> = {};

    intakeSections.forEach((section) => {
      const requiredFields = section.fields?.filter((field) => field.required) || [];

      requiredFields.forEach((field) => {
        const key = slugify(field.label);
        const value = formData[key];
        if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && value.trim() === "")) {
          nextErrors[key] = "This field is required.";
        }
      });
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateAllFields()) {
      setFeedback("Please complete the required fields before sending.");
      return;
    }

    setFeedback("");
    handleWhatsApp();
  };

  const handleWhatsApp = () => {
    const summary = intakeSections
      .map((section) => {
        const lines = [`${section.category}: ${section.title}`];
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

    const whatsappText = encodeURIComponent(`NEXO STUDIOS TRAINING INTAKE\n\n${summary}`);
    const whatsappUrl = `https://wa.me/message/WBIQIE64UGJ3J1?text=${whatsappText}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    const emailRecipient = typeof formData.email === "string" ? formData.email.trim() : "";
    const studioEmail = "nexostudiosltd@gmail.com";
    const emailSubject = encodeURIComponent("NEXO Studios training intake");
    const emailBody = encodeURIComponent(summary);

    if (emailRecipient) {
      const emailUrl = `mailto:${emailRecipient}?cc=${studioEmail}&subject=${emailSubject}&body=${emailBody}`;
      window.open(emailUrl, "_blank", "noopener,noreferrer");
      setFeedback("WhatsApp opened and copies were prepared for you and the studio.");
    } else {
      const emailUrl = `mailto:${studioEmail}?subject=${emailSubject}&body=${emailBody}`;
      window.open(emailUrl, "_blank", "noopener,noreferrer");
      setFeedback("WhatsApp opened and a copy was prepared for the studio.");
    }
  };

  const handleClear = () => {
    setFormData(createInitialFormState());
    setErrors({});
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
    <div className="contact-card contact-form-card" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>TRAINING INTAKE</p>
          <h2 style={{ margin: 0, textTransform: "uppercase" }}>NEXO STUDIOS - TATTOO TRAINING INTAKE</h2>
        </div>
        <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          {intakeSections.length} sections
        </div>
      </div>

      <p style={{ margin: "0 0 1.2rem", opacity: 0.8, lineHeight: 1.6 }}>
        Complete the full intake below. Everything is visible on one scrollable page so you can review the full experience before sending.
      </p>

      <form className="contact-form" onSubmit={(event) => event.preventDefault()} noValidate>
        <div style={{ display: "grid", gap: "1rem" }}>
          {intakeSections.map((section) => (
            <div key={section.id} style={{ border: "1px solid var(--border-color, #333)", borderRadius: "20px", padding: "1.25rem", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ borderBottom: "1px solid var(--border-color, #333)", paddingBottom: "0.9rem", marginBottom: "1rem" }}>
                <p style={{ margin: 0, opacity: 0.75, textTransform: "uppercase", letterSpacing: "1px", fontSize: "0.8rem" }}>
                  {section.category}
                </p>
                <h3 style={{ margin: "0.25rem 0 0", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  {section.title}
                </h3>
                <p style={{ margin: "0.45rem 0 0", opacity: 0.75, lineHeight: 1.6, fontSize: "0.95rem" }}>
                  {section.description}
                </p>
              </div>

              {section.fields?.map((field) => renderField(field))}

              {section.skills && (
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {section.skills.map((skill) => {
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
                          {section.scale?.minLabel} — {section.scale?.maxLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.subcategories && (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {section.subcategories.map((subcategory) => (
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
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button type="button" onClick={handleSubmit} className="button" style={{ background: "#25D366", color: "#07120b" }}>
            Send on WhatsApp + Email
          </button>
          <button type="button" onClick={handleClear} className="button">
            Clear form
          </button>
        </div>

        {feedback ? <p style={{ marginTop: "0.75rem", opacity: 0.9, fontSize: "0.95rem" }}>{feedback}</p> : null}
      </form>
    </div>
  );
}
