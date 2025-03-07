import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Attendance } from "@/models/Attendance";

// Search employees by parameters (full name, career)
export const searchAttendances = async (
    searchParams: Attendance,
    page: number,
    size: number
): Promise<any | null> => {
    try {
        return await fetchData<any, Attendance>(
            `attendances/search?page=${page}&size=${size}`,
            "POST",
            tokenService.accessToken,
            searchParams
        );
    } catch (error) {
        console.error("Error searching attendances:", error);
        return null;
    }
};
