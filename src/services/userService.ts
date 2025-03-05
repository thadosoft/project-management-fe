import {fetchData} from "@/utils/api.ts";
import {User} from "@/models/User.ts";

export const getUsers = async (): Promise<User[] | null> => {
  return await fetchData<User[]>("users", "GET", localStorage.getItem("accessToken"));
};

export const getUserById = async (userId: string | null): Promise<User | null> => {
  return await fetchData<User>(`users/${userId}`, "GET", localStorage.getItem("accessToken"));
}