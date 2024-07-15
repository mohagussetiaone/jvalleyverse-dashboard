import { useEffect } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import { redirect, useNavigate } from "react-router-dom";
import { clearAllStorage } from "@/store/local/Forage-Helper";
import { handleCheckAuth } from "@/api/Auth/checkAuth";

export const authLoader = async ({ request }) => {
  const authToken = await localforage.getItem("userSession");
  const authData = await localforage.getItem("sessionData");
  const url = new URL(request.url);

  // Redirect to '/project' if the user is trying to access '/signin' or '/signup' and a token exists
  if ((authToken && url.pathname === "/signin") || url.pathname === "/signup") {
    return redirect("/project");
  } else if ((authData && url.pathname === "/signin") || url.pathname === "/signup") {
    return redirect("/project");
  }

  // Redirect to '/signin' if there's no token and the user is trying to access a protected route
  if (!authToken && !["/signin", "/signup"].includes(url.pathname)) {
    return redirect("/signin");
  } else if (!authData && !["/signin", "/signup"].includes(url.pathname)) {
    return redirect("/signin");
  }

  return { authToken };
};

export function useAuthValidation() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthValidation = async () => {
      const authToken = handleCheckAuth();
      console.log("authToken", authToken);

      if (authToken) {
        await clearAllStorage();
        toast.error("Token is expired, back to login", {
          duration: 2350,
        });

        setTimeout(() => {
          navigate("/signin");
        }, 2550);
      } else {
        await clearAllStorage();
        toast.error("Token is expired, back to login", {
          duration: 2350,
        });
        setTimeout(() => {
          navigate("/signin");
        }, 2550);
      }
    };

    handleAuthValidation();
  }, [navigate]);
}
