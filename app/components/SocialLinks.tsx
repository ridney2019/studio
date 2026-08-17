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
      url: "https://wa.me/message/WBIQIE64UGJ3J1",
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
            <li><a href="/">Home</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/#artists">Artists</a></li>
            <li><a href="/workshop">Workshop</a></li>
            <li><a href="/contact">Book Session</a></li>
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
        <p className="copyright-text">&copy; 2026 Ridney Silva. All rights reserved |
          Designed & built in-house
        </p>
        <div className="footer-legal">
          {/*<a href="#privacy">Privacy Policy</a>*/}
          {/*<a href="#terms">Terms</a>*/}
        </div>
      </div>
    </footer>
  );
};