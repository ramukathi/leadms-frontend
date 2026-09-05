"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "trader"
  | "vendor"
  | "team_member"
  | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface BackendUser {
  id?: string;
  _id?: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (
    accessToken: string,
    refreshToken: string,
    user: BackendUser | AuthUser
  ) => void;

  logout: () => void;
}

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

function normalizeRole(role: string): UserRole {
  switch (role.toLowerCase()) {
    case "trader":
      return "trader";

    case "vendor":
      return "vendor";

    case "team-member":
    case "team_member":
    case "team member":
      return "team_member";

    case "admin":
      return "admin";

    default:
      throw new Error(`Unsupported user role: ${role}`);
  }
}

function normalizeUser(user: BackendUser | AuthUser): AuthUser {
  return {
    id: user.id ?? "",
    email: user.email,
    role: normalizeRole(user.role),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      login: (accessToken, refreshToken, user) => {
        const normalizedUser = normalizeUser(user);

        set({
          accessToken,
          refreshToken,
          user: normalizedUser,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set(initialState);
      },
    }),
    {
      name: "leadms-auth",
    }
  )
);

