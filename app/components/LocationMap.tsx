"use client";

import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const STUDIO_LOCATION = {
  name: "NEXO STUDIO TATTOO",
  address: "101-103 Francis St, The Liberties",
  city: "Dublin 8, D08 FHP9",
  country: "Ireland",
  lat: 53.33951,
  lng: -6.2908,
  phone: "353 83 330 0832",
  email: "nexostudiosltd@gmail.com",
};

export const LocationMap = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handleGetLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const dist = calculateDistance(
            latitude,
            longitude,
            STUDIO_LOCATION.lat,
            STUDIO_LOCATION.lng
          );
          setDistance(parseFloat(dist));
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          alert("Unable to access your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const googleMapsUrl = `https://maps.google.com/maps?q=${STUDIO_LOCATION.lat},${STUDIO_LOCATION.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="location-section fade-section">
      <div className="location-header">
        <p className="eyebrow">{t('visitUs')}</p>
        <h2>{t('findOurStudio')}</h2>
        <p className="location-subtitle">
          {t('locationSubtitle')}
        </p>
      </div>

      <div className="location-container">
        {/* Left Side: Map wrapper */}
        <div className="location-map-wrapper">
          <iframe
            width="100%"
            loading="lazy"
            allowFullScreen={true} // FIXED: Changed from "" to true to satisfy TypeScript types
            referrerPolicy="no-referrer-when-downgrade"
            src={googleMapsUrl}
            title="Google Map Location"
          ></iframe>
        </div>

    {/* Right Side: Info Panel */}
        <div className="location-info">
          <div className="location-card">
            <h3>{STUDIO_LOCATION.name}</h3>

            {/* Address Block */}
            <div className="location-detail">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p className="detail-label">{t('addressLabel')}</p>
                <p className="detail-value">
                  {STUDIO_LOCATION.address}
                  <br />
                  {STUDIO_LOCATION.city}
                </p>
              </div>
            </div>

            {/* Phone Block */}
            <div className="location-detail">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <p className="detail-label">{t('phoneLabel')}</p>
                <p className="detail-value">{STUDIO_LOCATION.phone}</p>
              </div>
            </div>

            {/* Email Block */}
            <div className="location-detail">
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
              <div>
                <p className="detail-label">{t('emailLabel')}</p>
                <p className="detail-value">{STUDIO_LOCATION.email}</p>
              </div>
            </div>

            {/* Brand Colorful Social Media Icons */}
            <div 
              className="location-card-socials" 
              style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '0.5rem', 
                marginBottom: '0.5rem',
                alignItems: 'center' 
              }}
            >
              {/* Instagram Icon */}
              <a 
                href="https://instagram.com/felipesantostattooartist/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Follow us on Instagram"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', 
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(220, 39, 67, 0.25)',
                  transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>

              {/* Facebook Icon */}
              <a 
                href="https://facebook.com/felipesantosinked/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Follow us on Facebook"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  backgroundColor: '#1877F2', 
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(24, 119, 242, 0.25)',
                  transition: 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.12)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
            </div>

            {/* Actions Block */}
            <div className="location-actions">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  STUDIO_LOCATION.address + " " + STUDIO_LOCATION.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button-outline"
              >
                {t('getDirections')}
              </a>

              <button
                onClick={handleGetLocation}
                className="location-distance-btn"
                disabled={isLoading}
              >
                {isLoading ? t('gettingLocation') : t('showDistance')}
              </button>
            </div>

            {distance !== null && (
              <div className="distance-display">
                <p className="distance-text">
                  {t('distanceAway')} <span className="distance-value">{distance} {t('distanceKm')}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
    </section>
  );
};