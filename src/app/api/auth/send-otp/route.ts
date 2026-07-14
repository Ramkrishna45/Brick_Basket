import { sendOtp } from "@/lib/services/auth.service";
import { success, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return withCors(badRequest("Missing required field: email"));
    }

    const result = await sendOtp(email);
    return withCors(success(result));
  } catch (error) {
    return withCors(serverError((error as Error).message));
  }
}
