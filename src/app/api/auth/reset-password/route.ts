import { resetPassword } from "@/lib/services/auth.service";
import { success, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return withCors(badRequest("Missing required fields: email, otp, newPassword"));
    }

    const result = await resetPassword(email, otp, newPassword);
    return withCors(success(result));
  } catch (error) {
    const message = (error as Error).message;
    if (
      message === "Invalid or expired OTP." ||
      message === "Incorrect OTP." ||
      message === "OTP has expired. Please request a new one."
    ) {
      return withCors(badRequest(message));
    }
    return withCors(serverError(message));
  }
}
