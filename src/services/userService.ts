import {fetchData} from "@/utils/api.ts";
import {User} from "@/models/User.ts";
import tokenService from "@/services/tokenService.ts";

export const getUsers = async (): Promise<User[] | null> => {
  return await fetchData<User[]>("users", "GET", tokenService.accessToken);
};

export const getUserById = async (userId: string | null): Promise<User | null> => {
  return await fetchData<User | null>(`users/${userId}`, "GET", tokenService.accessToken);
}