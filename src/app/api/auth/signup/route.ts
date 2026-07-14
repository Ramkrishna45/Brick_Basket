import { signUp } from "@/lib/services/auth.service";
import { success, badRequest, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !phone || !password) {
      return withCors(badRequest("Missing required fields: name, email, phone, password"));
    }

    const result = await signUp({ name, email, phone, password });
    return withCors(success(result));
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Invalid data" || message === "Email already registered") {
      return withCors(badRequest(message));
    }
    return withCors(serverError(message));
  }
}
