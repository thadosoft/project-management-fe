import {fetchData} from "@/utils/api.ts";

export const login = async (username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
  return await fetchData<
      { accessToken: string; refreshToken: string },
      { username: string, password: string }
  >
  ("auth/authenticate", "POST", undefined, {username, password});
};
