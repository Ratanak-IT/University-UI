const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.careerpatch.site";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserProfileResponse {
  id: string;
  keycloakId: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isActive: boolean;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  const contentType = res.headers.get("content-type");
  const responseBody = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      typeof responseBody === "object"
        ? responseBody.message
        : responseBody;

    throw new Error(
      message || `Login failed with status ${res.status}`
    );
  }

  // Support both:
  // { accessToken: "..." }
  // and { success: true, data: { accessToken: "..." } }
  if (
    responseBody &&
    typeof responseBody === "object" &&
    "data" in responseBody
  ) {
    return (responseBody as ApiResponse<LoginResponse>).data;
  }

  return responseBody as LoginResponse;
}

export async function fetchUserProfile(
  token: string
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseBody = await res.json();

  if (!res.ok) {
    throw new Error(
      responseBody.message ||
        `Failed to fetch profile: ${res.status}`
    );
  }

  if (
    responseBody &&
    typeof responseBody === "object" &&
    "data" in responseBody
  ) {
    return (
      responseBody as ApiResponse<UserProfileResponse>
    ).data;
  }

  return responseBody as UserProfileResponse;
}