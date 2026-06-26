import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

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
    // If no real API key is set, log to console instead of failing
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_dummy_key_replace_me") {
      console.log("---------------------------------------------------------");
      console.log(`[MOCK EMAIL to ${to}]`);
      console.log(`Subject: ${subject}`);
      console.log("---------------------------------------------------------");
      console.log("NOTE: To actually send emails, add your real RESEND_API_KEY to your .env file.");
      return { success: true };
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "Brick Basket <onboarding@resend.dev>";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Email send exception:", err);
    return { error: err.message };
  }
}
