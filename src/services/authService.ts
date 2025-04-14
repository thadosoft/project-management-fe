import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";

export const login = async (username: string, password: string): Promise<{ accessToken: string; refreshToken: string, id: string } | null> => {
  return await fetchData<
      { accessToken: string; refreshToken: string, id: string },
      { username: string, password: string }
  >
  ("auth/authenticate", "POST", undefined, {username, password});
};

export const register = async (name: string, email: string, username: string, phoneNumber: string, password: string): Promise<{ accessToken: string; refreshToken: string, id: string } | null> => {
  return await fetchData<
      { accessToken: string; refreshToken: string, id: string },
      { name: string, email: string, username: string, phoneNumber: string, password: string, role: string }
  >
  ("auth/register", "POST", undefined, {name, email, username, phoneNumber, password, role: "USER"});
};

export const logout = async (): Promise<void | null> => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("id");
  return await fetchData<void>(`auth/logout`, "POST", tokenService.accessToken);
};

export const isTokenValidate = async (token: string): Promise<boolean | null> => {
  return await fetchData<boolean>(`auth/validate-token?token=${token}`, "POST", undefined);
};

export const verifyUsername = async (username: string): Promise<{ usernameExists: boolean; message: string } | null> => {
  return await fetchData<
      { usernameExists: boolean; message: string },
      { username: string }
  >
  ("auth/forgot-password", "POST", undefined, { username });
};

export const resetPassword = async (username: string, password: string, confirmPassword: string): Promise<void | null> => {
  return await fetchData<
      void,
      { username: string; password: string; confirmPassword: string }
  >
  ("auth/reset-password", "POST", undefined, { username, password, confirmPassword });
};