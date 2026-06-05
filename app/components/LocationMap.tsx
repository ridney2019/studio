"use client";

import { useState } from "react";

const STUDIO_LOCATION = {
  name: "NEXO STUDIO TATTOO",
  address: "101-103 Francis St, The Liberties",
  city: "Dublin 8, D08 FHP9",
  country: "Ireland",
  lat: 53.33951,
  lng: -6.2908,
  phone: "01 123 4567",
  email: "nexo@studio-tattoo.com",
};

export const LocationMap = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <p className="eyebrow">VISIT US</p>
        <h2>Find Our Studio</h2>
        <p className="location-subtitle">
          Located in the heart of Dublin's Liberties, step into NEXO STUDIO TATTOO
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
                <p className="detail-label">ADDRESS</p>
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
                <p className="detail-label">PHONE</p>
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
                <p className="detail-label">EMAIL</p>
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
                GET DIRECTIONS
              </a>

              <button
                onClick={handleGetLocation}
                className="location-distance-btn"
                disabled={isLoading}
              >
                {isLoading ? "GETTING LOCATION..." : "SHOW DISTANCE"}
              </button>
            </div>

            {distance !== null && (
              <div className="distance-display">
                <p className="distance-text">
                  You are <span className="distance-value">{distance} km</span> away
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};