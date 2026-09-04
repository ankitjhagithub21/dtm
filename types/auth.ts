import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  role: "user" | "admin";
  fullName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
}
