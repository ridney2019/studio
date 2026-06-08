import React from "react";

export const Footer = () => {
  
  return (
    <footer className="site-footer fade-section">
      <div className="footer-main">
        {/* Brand Block */}
        <div className="footer-brand">
          <span className="brand">Ridney Silva</span>
          <p className="footer-description">Studio Tattoo & Creative Arts</p>
        </div>

        {/* Quick Links Navigation */}
        <div className="footer-nav-group">
          <span className="footer-heading">Navigation</span>
          <ul className="footer-nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#artists">Artists</a></li>
            <li><a href="#contact">Book Session</a></li>
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
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
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
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
};