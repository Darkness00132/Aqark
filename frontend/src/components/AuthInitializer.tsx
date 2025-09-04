"use client";
import useProfile from "@/hooks/useProfile";
import useAuth from "@/store/useAuth";
import { useEffect } from "react";

export default function AuthInitializer() {
  const user = useAuth((state) => state.user);
  const { refetch } = useProfile();
  useEffect(() => {
    if (user === null) {
      refetch();
    }
  }, [user, refetch]);
  return <></>;
}
