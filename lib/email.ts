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
    throw new Error("Missing EMAIL_FROM environment variable");
  }

  // Priority 1: Resend API
  if (resendApiKey) {
    try {
      console.log("[mail][resend] Attempting to send email via Resend API...");
      console.log("[mail][resend] Email from:", emailFrom);
      console.log("[mail][resend] Email to:", to);
      
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

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = typeof responseData === "object" && responseData !== null && "message" in responseData 
          ? (responseData as { message: string }).message 
          : response.statusText;
        console.error("[mail][resend] API error (status:", response.status, "):", errorMsg);
        console.error("[mail][resend] Full response:", JSON.stringify(responseData, null, 2));
        throw new Error(`Resend API error (${response.status}): ${errorMsg}`);
      }

      console.log("[mail][resend] Email sent successfully. Response:", JSON.stringify(responseData, null, 2));
      return;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[mail][resend] Resend API call failed:", errorMsg);
      console.error("[mail][resend] Error object:", error);
      // Fall through to SMTP
    }
  }

  // Priority 2: SMTP
  if (smtpConfigured) {
    try {
      console.log("[mail][smtp] SMTP configured, attempting to send...");
      await getTransporter().sendMail({ from: emailFrom, to, subject, text, html });
      console.log("[mail][smtp] Email sent successfully via SMTP");
      return;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[mail][smtp] SMTP send failed:", errorMsg);
      console.error("[mail][smtp] Error object:", error);
      // Fall through to dev logging
    }
  }

  // Priority 3: Dev logging (only in non-production)
  if (process.env.NODE_ENV !== "production") {
    console.log("[mail][dev-fallback] Email logged to console (dev mode)");
    console.log("[mail][dev-fallback]", { to, subject, text });
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