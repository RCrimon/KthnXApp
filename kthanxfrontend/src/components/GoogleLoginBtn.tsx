"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { signinWithGoogle } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

interface GoogleLoginBtnProps {
  setError: (msg: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export default function GoogleLoginBtn({ setError, setLoading }: GoogleLoginBtnProps) {
  const router = useRouter();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        setError("Google Auth Failed!");
        return;
      }
      setLoading(true);
      setError(null);

      const data = await signinWithGoogle({ googleToken: credentialResponse.credential });

      if (data.token) {
        login(data.token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Google Login failed!");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Google auth failed");
      } else {
        setError("An error occurred during Google sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[96%] sm:w-[92%] flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError("Google Login Failed")}
        shape="pill"
        theme="filled_blue"
        size="large"
      />
    </div>
  );
}