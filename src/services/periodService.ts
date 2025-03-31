import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { AttendanceByPeriodResponse } from "@/models/Attendance";

export const getPeriods = async (
): Promise<any> => {
    const attendanceData: number = (await fetchData<any>(
        "periods",
        "GET",
        tokenService.accessToken
    )) ?? 0;
    return attendanceData;
};

export const getMonthlyAttendanceByPeriodId = async (
    id: number,
): Promise<AttendanceByPeriodResponse[] | null> => {
    try {
        return await fetchData<AttendanceByPeriodResponse[] | null>(
            `periods/attandance-detail/${id}`,
            "GET",
            tokenService.accessToken
        );
    } catch (error) {
        console.error("Error fetching monthly attendance:", error);
        return null;
    }
};
