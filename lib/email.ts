import nodemailer from "nodemailer";

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

  if (smtpConfigured) {
    await getTransporter().sendMail({ from: emailFrom, to, subject, text, html });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[mail][dev-fallback]", { to, subject, text });
    return;
  }

  throw new Error("SMTP is not configured for production email delivery.");
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