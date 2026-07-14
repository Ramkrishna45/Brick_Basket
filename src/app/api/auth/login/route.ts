import { loginWithCredentials } from "@/lib/services/auth.service";
import { generateApiToken } from "@/lib/api-auth";
import { success, badRequest, unauthorized, serverError, withCors, handleCors } from "@/lib/api-utils";

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return withCors(badRequest("Missing required fields: email, password"));
    }

    const user = await loginWithCredentials(email, password);

    const token = generateApiToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? undefined,
      phone: user.phone ?? undefined,
    });

    return withCors(success({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    }));
  } catch (error) {
    const message = (error as Error).message;
    if (
      message === "Invalid email or password." ||
      message === "This account uses Google login. Please use Google Sign-In."
    ) {
      return withCors(unauthorized(message));
    }
    return withCors(serverError(message));
  }
}
