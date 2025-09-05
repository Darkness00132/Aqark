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
  token: string;
  setLoggedIn(): void;
  setSignup(): void;
  setProfile(user: User): void;
  setToken(token: string): void;
  setLogout(): void;
}

const useAuth = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuth: false,
      token: "",
      setLoggedIn: () => {
        set({ isAuth: true });
      },
      setSignup: () => {
        set({ isAuth: true });
      },
      setProfile: (user) => {
        set({ user: user });
      },
      setToken: (token: string) => {
        set({ token });
      },
      setLogout: () => {
        set({ isAuth: false, user: null, token: "" });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
