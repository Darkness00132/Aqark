import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuth: boolean;
  role: string;
  setLoggedIn(): void;
  setSignup(): void;
  setProfile(user: User): void;
  setLogout(): void;
  setRole(role: string): void;
}

const useAuth = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuth: false,
      role: "user",
      setLoggedIn: () => {
        set({ isAuth: true });
      },
      setSignup: () => {
        set({ isAuth: true });
      },
      setProfile: (user) => {
        set({ user: user });
      },
      setLogout: () => {
        set({ isAuth: false, user: null });
      },
      setRole: (role: string) => {
        set({ role });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
