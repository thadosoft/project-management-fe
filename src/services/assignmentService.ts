import {fetchData} from "@/utils/api.ts";
import {Assignment} from "@/models/Assignment.ts";
import {accessToken} from "@/utils/token.ts";

export const getAssignments = async (): Promise<Assignment[]> => {
  return await fetchData<Assignment[]>("assignments", "GET", accessToken);
};

export const getAssignmentsByProjectId = async (id: string): Promise<Assignment[]> => {
  return await fetchData<Assignment[]>(`assignments/project/${id}`, "GET", accessToken);
};

export const updateAssignment = async (id: string, updatedData: Partial<Assignment>): Promise<Assignment> => {
  return await fetchData<Assignment, Partial<Assignment>>(`assignments/${id}`, "PUT", accessToken, updatedData);
};
