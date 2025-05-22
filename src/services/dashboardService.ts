import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Dashboard } from "@/models/Dashboard";

export const getDashboard = async (): Promise<Dashboard[] | null> => {
    return await fetchData<Dashboard[]>("dashboard", "GET", tokenService.accessToken);
};
