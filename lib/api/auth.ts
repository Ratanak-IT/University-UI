// Auth API Service

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
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

export async function loginUser(email: string, password: String): Promise<LoginResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      console.warn(`Login failed: status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error during login:", error);
    return null;
  }
}

export async function fetchUserProfile(token: string): Promise<UserProfileResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn(`Failed to fetch user profile: status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
