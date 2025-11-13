import { fetchData } from "@/utils/api";
import tokenService from "@/services/tokenService.ts";
import type { Event, EventRequest } from "@/models/Event";

const API_URL = "events";

export interface EventSearchFilter {
  title?: string;
  type?: string;
  startDate?: string;
  endDate?: string; // YYYY-MM-DD
  month?: number; // 1 - 12
  quarter?: number; // 1 - 4
  year?: number;
}

export const searchEvents = async (
  filters: EventSearchFilter = {},
  page: number = 0,
  size: number = 10,
  sort: string = "title,asc"
): Promise<{
  content: Event[];
  totalPages: number;
  number: number;
  numberOfElements: number;
}> => {
  try {
    const {
      title = "",
      type = "",
      startDate,
      endDate,
      month,
      quarter,
      year,
    } = filters;
    const requestBody = {
      title,
      startDate,
      endDate,
      type,
      month,
      year,
      quarter,
    };

    const response = await fetchData<{
      content: Event[];
      totalPages: number;
      number: number;
      numberOfElements: number;
    }>(
      `${API_URL}/search?page=${page}&size=${size}&sort=${sort}`,
      "POST",
      tokenService.accessToken,
      requestBody
    );

    return {
      content: response?.content || [],
      totalPages: response?.totalPages || 1,
      number: response?.number || 0,
      numberOfElements: response?.numberOfElements || 0,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      content: [],
      totalPages: 1,
      number: 0,
      numberOfElements: 0,
    };
  }
};

// Thêm event mới
export const createEvent = async (
  eventData: EventRequest
): Promise<number | null> => {
  try {
    const response = await fetchData<number>(
      API_URL,
      "POST",
      tokenService.accessToken,
      eventData
    );
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
};

// Cập nhật event theo ID
export const updateEvent = async (
  id: string,
  bookData: Partial<EventRequest>
): Promise<Event | null> => {
  try {
    const response = await fetchData<Event>(
      `${API_URL}/${id}`,
      "PUT",
      tokenService.accessToken,
      bookData
    );
    return response;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
};

// Xóa event
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const numericId = Number(id); // convert string sang number (Long)
    if (isNaN(numericId)) {
      console.error("ID không hợp lệ:", id);
      return false;
    }

    await fetchData(
      `${API_URL}/${numericId}`,
      "DELETE",
      tokenService.accessToken
    );
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};
