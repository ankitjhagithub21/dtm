"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { AuthState, UserProfile } from "@/types/auth";
import type { User } from "@supabase/supabase-js";

interface AuthStore extends AuthState {
  setSession: (user: User | null, profile: UserProfile | null) => void;
  clearSession: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  setSession: (user, profile) => set({ user, profile, isLoading: false }),
  clearSession: () => set({ user: null, profile: null, isLoading: false }),
  fetchProfile: async () => {
    set({ isLoading: true });

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ user: null, profile: null, isLoading: false });
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("id, role, full_name, phone, created_at")
        .eq("id", user.id)
        .maybeSingle();

      const profile: UserProfile | null = data
        ? {
            id: data.id,
            role: data.role === "admin" ? "admin" : "user",
            fullName: data.full_name,
            phone: data.phone,
            createdAt: data.created_at,
          }
        : null;

      set({ user, profile, isLoading: false });
    } catch {
      set({ user: null, profile: null, isLoading: false });
    }
  },
}));
