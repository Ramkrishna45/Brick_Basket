import nodemailer from "nodemailer";

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

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
    if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_PASSWORD) {
      console.log("---------------------------------------------------------");
      console.log(`[MOCK EMAIL to ${to}]`);
      console.log(`Subject: ${subject}`);
      console.log("---------------------------------------------------------");
      console.log("NOTE: To actually send emails, add NODEMAILER_EMAIL and NODEMAILER_PASSWORD to your .env file.");
      return { success: true };
    }

    const fromEmail = process.env.NODEMAILER_EMAIL;

    const info = await transporter.sendMail({
      from: `"Brick Basket" <${fromEmail}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, data: info };
  } catch (err: any) {
    console.error("Email send exception:", err);
    return { error: err.message };
  }
}
