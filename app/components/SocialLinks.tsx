import React from "react";

export const SocialLinks = () => {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/felipesantostattooartist/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"></path>
          <circle cx="17.5" cy="6.5" r="1.5"></circle>
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com", // Replace with your TikTok profile link if needed
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com", // Replace with your YouTube channel link if needed
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
        </svg>
      ),
    },
    {
      name: "Pinterest",
      url: "https://www.pinterest.com/nexostudiotattoo/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="8" x2="12" y2="22"></line>
          <path d="M12 22c0 0 4.5-4.5 4.5-9a4.5 4.5 0 0 0-9 0c0 3.5 2.5 6 4.5 9z"></path>
          <circle cx="12" cy="11" r="8"></circle>
        </svg>
      ),
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/felipesantosinked/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://api.whatsapp.com/send/?phone=353831757502&text=Hello%21+I%27m+looking+to+get+a+new+tattoo%2C+how+can+I+get+a+quote%3F&type=phone_number&app_absent=0",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:nexostudiosltd@gmail.com",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      ),
    },
  ];

  return (
    <footer className="site-footer fade-section">
      <div className="footer-main">
        {/* Brand Block */}
        <div className="footer-brand">
          <span className="brand">Ceo - Felipe Santos</span>
          <p className="footer-description">Studio Tattoo & Creative Arts</p>
        </div>

        {/* Quick Links Navigation */}
        <div className="footer-nav-group">
          <span className="footer-heading">Navigation</span>
          <ul className="footer-nav-links">
            <li><a href="./">Home</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#artists">Artists</a></li>
            <li><a href="./contact">Book Session</a></li>
          </ul>
        </div>

        {/* Social Links Container */}
        <div className="footer-social-group">
          <span className="footer-heading">Follow Us</span>
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title={link.name}
                aria-label={link.name}
              >
                <span className="social-icon">{link.icon}</span>
                <span className="link-indicator">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="external-icon"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom Metadata */}
      <div className="footer-bottom">
        <p className="copyright-text">&copy; 2026 Ridney Silva. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};