import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Dashboard } from "@/models/Dashboard";

export const getDashboard = async (): Promise<Dashboard[] | null> => {
    const token = tokenService.accessToken;
    console.log("Access token in getDashboard:", token);
    try{
        return await fetchData<Dashboard[]>("dashboard", "GET", token);
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        return null;
    }
};
