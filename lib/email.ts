import nodemailer from "nodemailer";

const resendApiKey = process.env.RESEND_API_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPassword);

const getTransporter = () =>
  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser && smtpPassword ? { user: smtpUser, pass: smtpPassword } : undefined,
  });

type MailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const sendMail = async ({ to, subject, text, html }: MailPayload): Promise<void> => {
  if (!emailFrom) {
    throw new Error("Missing EMAIL_FROM");
  }

  // Priority 1: Resend API
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
      }
      return;
    } catch (error) {
      console.error("Resend API failed:", error);
      // Fall through to SMTP
    }
  }

  // Priority 2: SMTP
  if (smtpConfigured) {
    await getTransporter().sendMail({ from: emailFrom, to, subject, text, html });
    return;
  }

  // Priority 3: Dev logging (only in non-production)
  if (process.env.NODE_ENV !== "production") {
    console.info("[mail][dev-fallback]", { to, subject, text });
    return;
  }

  throw new Error("Missing auth configuration: Missing RESEND_API_KEY or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD.");
};

export const sendOwnerVerificationEmail = async (email: string, verificationUrl: string) => {
  await sendMail({
    to: email,
    subject: "Verify your owner admin email",
    text: `Verify your owner admin account by opening this link: ${verificationUrl}`,
    html: `<p>Verify your owner admin account by opening this link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  });
};

export const sendOwnerPasswordResetEmail = async (email: string, resetUrl: string) => {
  await sendMail({
    to: email,
    subject: "Reset your owner admin password",
    text: `Reset your owner admin password by opening this link: ${resetUrl}`,
    html: `<p>Reset your owner admin password by opening this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};