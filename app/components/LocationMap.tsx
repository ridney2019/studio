"use client";

import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { motion } from "framer-motion";

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

const InkBlot = ({ variant = 1, style }: { variant?: 1 | 2 | 3; style?: React.CSSProperties }) => {
  const paths = [
    "M47.7,-76.4C60.1,-70.2,68.2,-55.1,74.4,-40.4C80.7,-25.7,85.1,-11.3,83.9,2.8C82.7,16.8,75.8,30.5,66.4,42.4C56.9,54.3,44.9,64.4,31.4,70.9C17.9,77.4,2.9,80.3,-12.3,78.8C-27.5,77.2,-42.9,71.2,-55.5,61.4C-68.1,51.6,-77.9,38,-82.1,23.3C-86.4,8.5,-85.1,-7.4,-80.1,-21.5C-75.1,-35.6,-66.4,-47.9,-55.1,-55.1C-43.8,-62.3,-30,-64.3,-17.8,-70.5C-5.6,-76.7,5.1,-87,21.5,-86.3C37.9,-85.6,41.3,-82.6,47.7,-76.4Z",
    "M39.9,-68.2C50.2,-61.1,56.1,-46.6,62.8,-33.1C69.5,-19.6,77.1,-7.1,78.4,6.4C79.7,19.9,74.7,34.5,66,46.7C57.4,58.9,45,68.7,31.4,73.1C17.8,77.5,2.9,76.5,-11.1,74.3C-25.1,72.1,-38.3,68.7,-49.4,61.1C-60.5,53.5,-69.6,41.7,-74.6,28.6C-79.6,15.5,-80.6,1.1,-78.3,-12.6C-76,-26.3,-70.4,-39.3,-60.9,-46.8C-51.4,-54.3,-38,-56.3,-26.6,-62.9C-15.3,-69.5,-5.9,-80.8,5.1,-88.7C16.1,-96.6,29.5,-75.3,39.9,-68.2Z",
    "M41.4,-72.1C53.3,-65.4,62.5,-52.8,70.1,-39.5C77.7,-26.2,83.7,-12.1,84.6,2.2C85.5,16.5,81.3,31,73.1,43.2C64.9,55.4,52.7,65.3,39.1,72.4C25.5,79.5,10.5,83.8,-4.2,91C-18.9,98.2,-33.3,108.3,-45.5,106.1C-57.7,103.9,-67.7,89.4,-75.3,74.6C-82.9,59.8,-88.1,44.7,-91.1,29.7C-94.1,14.7,-94.9,-0.2,-91.4,-14.2C-87.9,-28.2,-80.1,-41.3,-69.4,-49.2C-58.7,-57.1,-45.1,-59.8,-33,-66.3C-20.9,-72.8,-10.4,-83.1,2.8,-88.1C16.1,-93.1,32.2,-92.8,41.4,-72.1Z"
  ];
  return (
    <motion.svg 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg" 
      style={{ 
        position: 'absolute', 
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.1,
        filter: 'blur(50px)',
        color: 'var(--accent-color, #f39c12)',
        ...style 
      }}
      animate={{
        scale: [1, 1.1, 0.95, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 20 + variant * 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path fill="currentColor" d={paths[variant - 1]} transform="translate(100 100)" />
    </motion.svg>
  );
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
      <InkBlot variant={1} style={{ top: '-10%', left: '10%', width: '80%', height: '80%', opacity: 0.15 }} />
      <InkBlot variant={2} style={{ bottom: '-10%', right: '0', width: '60%', height: '60%', opacity: 0.1 }} />
      <div 
        className="parallax-bg" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("/map-bg.jpg")' 
        }} 
      />
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