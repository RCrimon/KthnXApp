import axios from "axios";
import Cookies from "js-cookie";

export interface signupInput{
  name?: string,
  email: string,
  password: string
}
export interface loginInput {
  email: string,
  password: string
}
export interface googleInput {
  googleToken: string
}


const baseUrl = process.env.NEXT_PUBLIC_API_URL

export const signupWithEmail = async (userData: signupInput)=>{
  const res = await axios.post(`${baseUrl}/signup`,userData)
  return res.data
}

export const loginWithPassword = async(credentials: loginInput)=>{
  const res = await axios.post(`${baseUrl}/login`,credentials)
  return res.data
}

export const signinWithGoogle = async(googleData: googleInput)=>{
  const res = await axios.post(`${baseUrl}/google`,googleData)
  return res.data
}

export const getUserProfile = async (token?: string) => {
  const activeToken =
    token ||
    Cookies.get("token") ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : "") ||
    "";

  if (!activeToken) {
    throw new Error("No authentication token found");
  }

  const res = await axios.get(`${baseUrl}/profile`, {
    headers: {
      Authorization: `Bearer ${activeToken}`,
    },
  });

  return res.data;
};

