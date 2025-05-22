import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { CreateWhiteBoard, SearchWhiteBoardRequest, WhiteBoard } from "@/models/WhiteBoard";

export const createWhiteBoard = async (data: CreateWhiteBoard): Promise<WhiteBoard | null> => {
    return await fetchData<WhiteBoard, CreateWhiteBoard>("white-boards", "POST", tokenService.accessToken, data);
};

export const searchWhiteBoards = async (
    request: SearchWhiteBoardRequest,
    page: number,
    size: number
): Promise<{ content: WhiteBoard[]; totalPages: number } | null> => {
    return await fetchData<{ content: WhiteBoard[]; totalPages: number }, SearchWhiteBoardRequest>(
        `white-boards/search?page=${page}&size=${size}`,
        "POST",
        tokenService.accessToken,
        request
    );
};
