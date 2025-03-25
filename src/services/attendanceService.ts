import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Attendance, AttendanceByDayRequest, AttendanceByDayResponse } from "@/models/Attendance";

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


export const getAttendance = async (
    request: AttendanceByDayRequest
): Promise<number | null> => {  // Change the return type to number
    try {
        // Fetch attendance data, expecting a BigDecimal in response
        const attendanceData: number = (await fetchData<number | null, AttendanceByDayRequest>(
            "attendances",
            "POST",
            tokenService.accessToken,
            request
        )) ?? 0; // Provide a default value of 0 if null is returned
        return attendanceData;  // Return the BigDecimal value
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return null;  // Return null if there is an error
    }
};
