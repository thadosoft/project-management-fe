import {fetchData} from "@/utils/api.ts";
import {Assignment, AssignmentRequest} from "@/models/Assignment.ts";
import {accessToken} from "@/utils/token.ts";

export const getAssignments = async (): Promise<Assignment[] | null> => {
  return await fetchData<Assignment[]>("assignments", "GET", accessToken);
};

export const createAssignment = async (assignmentRequest: AssignmentRequest): Promise<Assignment | null> => {
  return await fetchData<Assignment>("assignments", "POST", accessToken, assignmentRequest);
};

export const getAssignmentsByProjectId = async (id: string): Promise<Assignment[] | null> => {
  return await fetchData<Assignment[]>(`assignments/project/${id}`, "GET", accessToken);
};

export const updateAssignment = async (id: string, assignmentRequest: AssignmentRequest): Promise<void | null> => {
  return await fetchData<void, AssignmentRequest>(`assignments/${id}`, "PUT", accessToken, assignmentRequest);
};