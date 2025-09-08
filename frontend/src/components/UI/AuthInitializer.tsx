"use client";
import useProfile from "@/hooks/useProfile";

export default function AuthInitializer({ login }: { login: string }) {
  const { refetch } = useProfile();
  if (login === "success") {
    refetch();
  }
  return <></>;
}
