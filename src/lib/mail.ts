import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    // If SMTP is not fully configured, log the email to the console instead of crashing
    if (!smtpEmail || !smtpPassword || smtpPassword === "your_gmail_app_password_here") {
      console.log("---------------------------------------------------------");
      console.log(`[MOCK EMAIL to ${to}]`);
      console.log(`Subject: ${subject}`);
      console.log("---------------------------------------------------------");
      console.log("NOTE: To actually send emails, configure SMTP_EMAIL and SMTP_PASSWORD in your .env file.");
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `"Brick Basket" <${smtpEmail}>`,
      to,
      subject,
      html,
    });

    return { success: true, data: info };
  } catch (err: any) {
    console.error("Email send exception:", err);
    return { error: err.message };
  }
}
