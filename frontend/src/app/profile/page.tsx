"use client";
import { Metadata } from "next";
import { useEffect } from "react";
import useAuth from "@/store/useAuth";

export default function Profile() {
  const setToken = useAuth((state) => state.setToken);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
    }
  }, [setToken]);
  return <div>الملف الشخصي</div>;
}
