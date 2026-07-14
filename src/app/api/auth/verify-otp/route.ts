import { verifyOtp } from "@/lib/services/auth.service";
import { success, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return withCors(badRequest("Missing required fields: email, otp"));
    }

    const result = await verifyOtp(email, otp);
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
