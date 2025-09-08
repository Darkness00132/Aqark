import useAuth from "@/store/useAuth";
import { useEffect } from "react";
//for google redirects
export default function CheckAuth() {
  const setToken = useAuth((state) => state.setToken);
  const setLoggedIn = useAuth((state) => state.setLoggedIn);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
      setLoggedIn();
    }
  }, [setToken]);
  return <></>;
}
