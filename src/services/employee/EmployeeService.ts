import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { EmployeeRequest, SearchEmployeeRequest } from "@/models/EmployeeRequest";

// Fetch all employees with pagination and sorting
export const getAllEmployees = async (page: number, size: number): Promise<any | null> => {
  try {
    return await fetchData<any>(`employees?page=${page}&size=${size}&sort=createdAt,desc`, "GET", tokenService.accessToken);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return null;
  }
};

// Fetch employee by ID
export const getEmployeeById = async (id: number): Promise<any | null> => {
  try {
    return await fetchData<any>(`employees/${id}`, "GET", tokenService.accessToken);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    return null;
  }
};

// Add a new employee
export const addEmployee = async (employee: EmployeeRequest): Promise<any | null> => {
  try {
    return await fetchData<any, EmployeeRequest>(`employees`, "POST", tokenService.accessToken, employee);
  } catch (error) {
    console.error("Error adding employee:", error);
    return null;
  }
};

// Update an existing employee
export const updateEmployee = async (id: number, employee: EmployeeRequest): Promise<void | null> => {
  try {
    await fetchData<void, EmployeeRequest>(`employees/${id}`, "PUT", tokenService.accessToken, employee);
  } catch (error) {
    console.error("Error updating employee:", error);
  }
};

// Delete an employee by ID
export const removeEmployee = async (id: number): Promise<void | null> => {
  try {
    await fetchData<void>(`employees/${id}`, "DELETE", tokenService.accessToken);
  } catch (error) {
    console.error("Error removing employee:", error);
  }
};

// Search employees by parameters (full name, career)
export const searchEmployees = async (
  searchParams: SearchEmployeeRequest,
  page: number,
  size: number
): Promise<any | null> => {
  try {
    return await fetchData<any, SearchEmployeeRequest>(
      `employees/search?page=${page}&size=${size}`,
      "POST",
      tokenService.accessToken,
      searchParams
    );
  } catch (error) {
    console.error("Error searching employees:", error);
    return null;
  }
};
