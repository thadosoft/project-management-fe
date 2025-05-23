import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { CreateEmployeeOfMonth, EmployeeOfMonth, SearchEmployeeOfMonthRequest } from "@/models/EmployeeOfMonth";

export const CreateEmployeeOfTheMonth = async (data: CreateEmployeeOfMonth): Promise<EmployeeOfMonth | null> => {
    return await fetchData<EmployeeOfMonth, CreateEmployeeOfMonth>("employee-of-month", "POST", tokenService.accessToken, data);
};

export const searchEmployeeOfMonth = async (
    request: SearchEmployeeOfMonthRequest,
    page: number,
    size: number
): Promise<{ content: EmployeeOfMonth[]; totalPages: number } | null> => {
    return await fetchData<{ content: EmployeeOfMonth[]; totalPages: number }, SearchEmployeeOfMonthRequest>(
        `employee-of-month/search?page=${page}&size=${size}`,
        "POST",
        tokenService.accessToken,
        request
    );
};


export const deleteEmployeeOfMonth = async (id: number): Promise<boolean> => {
    try {
        await fetchData<void, void>(`employee-of-month/${id}`, "DELETE", tokenService.accessToken);
        return true;
    } catch (error) {
        console.error("Error deleting BOM:", error);
        return false;
    }
};