import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { Attendance, AttendanceByDayRequest, AttendanceByDayResponse, CreateAttendanceResponse, UpdateDailyAttendance } from "@/models/Attendance";

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
): Promise<number | null> => {
    try {
        const attendanceData: number = (await fetchData<number | null, AttendanceByDayRequest>(
            "attendances",
            "POST",
            tokenService.accessToken,
            request
        )) ?? 0;
        return attendanceData;
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return null;
    }
};

export const getMonthlyAttendance = async (
    year: number,
    month: number
): Promise<CreateAttendanceResponse[] | null> => {
    try {
        return await fetchData<CreateAttendanceResponse[] | null>(
            `attendances/monthly?year=${year}&month=${month}`,
            "GET",
            tokenService.accessToken
        );
    } catch (error) {
        console.error("Error fetching monthly attendance:", error);
        return null;
    }
};

export const CreateMonthlyAttendance = async (year: number, month: number): Promise<any> => {
    try {
        return await fetchData<any>(`attendances/create/monthly?year=${year}&month=${month}`, "POST", tokenService.accessToken);
    }
    catch (error) {
        return null;
    }
};


export const updateAttendance = async (id: number, attendance: UpdateDailyAttendance): Promise<void | null> => {
    try {
      await fetchData<void, UpdateDailyAttendance>(`attendances/${id}`, "PUT", tokenService.accessToken, attendance);
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };
  