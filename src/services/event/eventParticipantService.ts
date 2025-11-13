import { fetchData } from "@/utils/api";
import tokenService from "@/services/tokenService.ts";

const API_URL = "events"; // base URL giống event, sẽ append /{eventId}/participants

export interface ParticipantRequest {
  employeeIds: number[];
}

// ----------------------------
// Thêm người tham gia (nếu event mới)
// ----------------------------
export const createParticipants = async (
  eventId: string,
  data: ParticipantRequest
): Promise<boolean> => {
  try {
    await fetchData(
      `${API_URL}/${eventId}/participants`,
      "POST",
      tokenService.accessToken,
      data
    );
    return true;
  } catch (error) {
    console.error("Error creating participants:", error);
    return false;
  }
};

// ----------------------------
// Cập nhật toàn bộ danh sách participant
// ----------------------------
export const updateParticipants = async (
  eventId: string,
  data: ParticipantRequest
): Promise<boolean> => {
  try {
    await fetchData(
      `${API_URL}/${eventId}/participants`,
      "PUT",
      tokenService.accessToken,
      data
    );
    return true;
  } catch (error) {
    console.error("Error updating participants:", error);
    return false;
  }
};

// ----------------------------
// Xóa 1 participant khỏi event
// ----------------------------
export const deleteParticipant = async (
  eventId: string,
  employeeId: number
): Promise<boolean> => {
  try {
    await fetchData(
      `${API_URL}/${eventId}/participants/${employeeId}`,
      "DELETE",
      tokenService.accessToken
    );
    return true;
  } catch (error) {
    console.error("Error deleting participant:", error);
    return false;
  }
};

export const getParticipants = async (
  eventId: string
): Promise<number[] | null> => {
  try {
    const data = await fetchData(
      `${API_URL}/${eventId}/participants`,
      "GET",
      tokenService.accessToken
    );
    // API backend trả List<Long> => TypeScript: number[]
    return data as number[];
  } catch (error) {
    console.error("Error fetching participants:", error);
    return null;
  }
};
