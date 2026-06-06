"use client";

import React from "react";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const FloatingSocials = () => {
  const buttons = [
    {
      href: "https://wa.me/+3530831532243",
      icon: <FaWhatsapp size={18} />,
      color: "#25D366",
      tooltip: "WhatsApp",
    },
    {
      href: "https://instagram.com/ridney_silva",
      icon: <FaInstagram size={18} />,
      color: "#E1306C",
      tooltip: "Instagram",
    },
    {
      href: "https://ie.linkedin.com/in/ridney-silva",
      icon: <FaLinkedinIn size={18} />,
      color: "#0077B5",
      tooltip: "LinkedIn",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: "1.5rem",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {buttons.map((button, index) => (
        <a
          key={index}
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            color: "#ffffff",
            backgroundColor: button.color,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label={button.tooltip}
          title={button.tooltip}
        >
          {button.icon}
        </a>
      ))}
    </div>
  );
};

export default FloatingSocials;