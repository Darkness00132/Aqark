"use client";
import useProfile from "@/hooks/useProfile";

export default function AuthInitializer({
  login,
}: {
  login: string | undefined;
}) {
  const { refetch } = useProfile();
  if (login === "success") {
    refetch();
  }
  return <></>;
}
