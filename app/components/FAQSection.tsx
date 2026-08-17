"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronDown, FaCircleQuestion, FaRegClock, FaShieldHeart } from "react-icons/fa6";
import { DEFAULT_FAQ_ITEMS, FAQ_UPDATED_EVENT, FAQItem, getFaqItemsFromStorage } from "@/lib/faq";

export default function FAQSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQ_ITEMS);

  useEffect(() => {
    const syncFaqs = () => {
      setFaqs(getFaqItemsFromStorage());
    };

    syncFaqs();
    window.addEventListener(FAQ_UPDATED_EVENT, syncFaqs);
    return () => window.removeEventListener(FAQ_UPDATED_EVENT, syncFaqs);
  }, []);

  return (
    <motion.section
      id="faq"
      className="faq-section fade-section"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="faq-shell">
        <div className="faq-intro">
          <p className="eyebrow">NEED TO KNOW</p>
          <h2>FAQ</h2>
          <p>
            Quick answers to the questions we hear most often before a consultation or booking.
          </p>
          <div className="faq-pills" aria-hidden="true">
            <span><FaCircleQuestion /> Straight answers</span>
            <span><FaRegClock /> Fast replies</span>
            <span><FaShieldHeart /> Clear studio process</span>
          </div>
        </div>

        <div className="faq-panel">
          <label className="faq-select-label" htmlFor="faq-select">
            Choose a question
          </label>

          <div className="faq-select-wrap">
            <select
              id="faq-select"
              className="faq-select"
              value={selectedIndex}
              onChange={(event) => setSelectedIndex(Number(event.target.value))}
            >
              {faqs.map((faq, index) => (
                <option key={faq.question} value={index}>
                  {faq.question}
                </option>
              ))}
            </select>
            <FaChevronDown className="faq-select-icon" aria-hidden="true" />
          </div>

          <motion.article
            key={faqs[selectedIndex]?.question}
            className="faq-answer-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="faq-answer-question">{faqs[selectedIndex]?.question}</p>
            <p className="faq-answer-text">{faqs[selectedIndex]?.answer}</p>
          </motion.article>
        </div>
      </div>

      <div className="faq-cta">
        <p>Still have a specific question about your project?</p>
        <Link className="nike-btn-outline" href="/contact">
          ASK A QUESTION
        </Link>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 120px 4% 0;
          border-top: 1px solid var(--border-color);
          background: var(--bg-color);
        }

        .faq-shell {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 1024px) {
          .faq-shell {
            grid-template-columns: 0.9fr 1.1fr;
            gap: 3rem;
            align-items: start;
          }
        }

        .faq-intro {
          display: grid;
          gap: 1rem;
          align-content: start;
          position: sticky;
          top: 2rem;
        }

        .faq-intro p {
          margin: 0;
          line-height: 1.8;
          opacity: 0.72;
          max-width: 38rem;
        }

        .faq-intro h2 {
          margin: 0;
        }

        .faq-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .faq-pills span {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.7rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 999px;
          background: var(--card-bg);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .faq-list {
          display: none;
        }

        .faq-panel {
          display: grid;
          gap: 1rem;
          align-content: start;
        }

        .faq-select-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.58;
        }

        .faq-select-wrap {
          position: relative;
        }

        .faq-select {
          width: 100%;
          appearance: none;
          border: 1px solid var(--border-color);
          border-radius: 18px;
          padding: 1rem 3rem 1rem 1.1rem;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)), #111111;
          color: var(--text-color);
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          outline: none;
          color-scheme: dark;
        }

        .faq-select:focus {
          border-color: rgba(180, 0, 26, 0.45);
          box-shadow: 0 0 0 4px rgba(180, 0, 26, 0.12);
        }

        .faq-select option {
          background: #111111;
          color: #ffffff;
        }

        .faq-select option:checked,
        .faq-select option:focus,
        .faq-select option:hover {
          background: #6f0000;
          color: #ffffff;
        }

        .faq-select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          opacity: 0.7;
        }

        .faq-answer-card {
          border: 1px solid var(--border-color);
          border-radius: 22px;
          padding: 1.35rem 1.4rem;
          background: var(--card-bg);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
          display: grid;
          gap: 0.75rem;
        }

        .faq-answer-question {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .faq-answer-text {
          margin: 0;
          line-height: 1.8;
          opacity: 0.74;
          max-width: 60ch;
        }

        .faq-cta {
          max-width: 1400px;
          margin: 3rem auto 0;
          padding: 0 0 120px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .faq-cta p {
          margin: 0;
          font-size: 1rem;
          opacity: 0.7;
        }

        @media (max-width: 767px) {
          .faq-section {
            padding-top: 90px;
          }

          .faq-intro {
            position: static;
          }

          .faq-trigger {
            padding: 1.1rem 1.1rem;
          }

          .faq-answer-card {
            padding: 1.1rem;
          }

          .faq-cta {
            padding-bottom: 90px;
          }
        }
      `}</style>
    </motion.section>
  );
}