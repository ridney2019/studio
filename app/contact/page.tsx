"use client";

import { useTranslation } from "@/app/hooks/useTranslation";

export default function ContactPage() {
  const { t, isHydrated } = useTranslation();

  if (!isHydrated) return null;

  return (
    <main className={`contact-shell loaded`}>
      <section className="contact-hero fade-section">
        <div>
          <p className="eyebrow">CONTACT</p>
          <h2>{t('bookAppointment')}</h2>
          <p>
            {t('bookingDescription')}
          </p>
        </div>
        <div className="contact-details">
          <p>nexostudiosltd@gmail.com</p>
          <p>101-103 Francis St, The Liberties, Dublin 8, D08 FHP9</p>
        </div>
      </section>
 
      <section className="contact-grid fade-section">
        <div className="contact-card contact-form-card">
          <h2>{t('sendMessage')}</h2>
          <form className="contact-form">
            <label>
              {t('name')}
              <input type="text" placeholder={t('yourName')} />
            </label>
            <label>
              {t('email')}
              <input type="email" placeholder={t('yourEmail')} />
            </label>
            <label>
              {t('message')}
              <textarea rows={5} placeholder={t('tattooIdea')} />
            </label>
            <button type="submit" className="button">
              {t('sendMessageBtn')}
            </button>
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
            <p>nexo@studio-tattoo.com</p>
          </div>
        </div>
      </section>
    </main>
  );
}
