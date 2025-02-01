import {fetchData} from "@/utils/api.ts";
import {User} from "@/models/User.ts";
import {accessToken} from "@/utils/token.ts";

export const getUsers = async (): Promise<User[] | null> => {
  return await fetchData<User[]>("users", "GET", accessToken);
};
