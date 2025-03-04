import {fetchData} from "@/utils/api.ts";
import {Assignment, AssignmentRequest} from "@/models/Assignment.ts";
import tokenService from "@/services/tokenService.ts";

export const getAssignments = async (): Promise<Assignment[] | null> => {
  return await fetchData<Assignment[]>("assignments", "GET", tokenService.accessToken);
};

export const createAssignment = async (assignmentRequest: AssignmentRequest): Promise<Assignment | null> => {
  return await fetchData<Assignment>("assignments", "POST", tokenService.accessToken, assignmentRequest);
};

export const getAssignmentsByProjectId = async (id: string): Promise<Assignment[] | null> => {
  return await fetchData<Assignment[]>(`assignments/project/${id}`, "GET", tokenService.accessToken);
};

export const updateAssignment = async (id: string, assignmentRequest: AssignmentRequest): Promise<void | null> => {
  return await fetchData<void, AssignmentRequest>(`assignments/${id}`, "PUT", tokenService.accessToken, assignmentRequest);
};

export const deleteAssignment = async (id: string): Promise<void | null> => {
  return await fetchData<void>(`assignments/${id}`, "DELETE", tokenService.accessToken);
};