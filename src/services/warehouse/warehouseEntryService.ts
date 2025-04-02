import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { InventoryTransactionRequest, InventoryTransactionResponse, SearchInventoryTransactionRequest } from "@/models/Warehouse";

export const creatInventoryTransaction = async (inventory: InventoryTransactionRequest): Promise<any | null> => {
    return await fetchData<any>("inventory/transactions", "POST", tokenService.accessToken, inventory);
};

export const getInventoryTransactionByProjectId = async (id: number): Promise<InventoryTransactionResponse> => {
    const response = await fetchData<InventoryTransactionResponse | null>(`inventory/transactions/${id}`, "GET", tokenService.accessToken);
    if (!response) {
        throw new Error("Failed to fetch inventory transaction by project ID");
    }
    return response;
};

export const updateInventoryTransaction = async (id: number, employee: InventoryTransactionRequest): Promise<any | null> => {
    try {
        const response = await fetchData<any, InventoryTransactionRequest>(`inventory/transactions/${id}`, "PUT", tokenService.accessToken, employee);
        return response; 
    } catch (error) {
        console.error("Error in updating inventory transaction:", error);
        throw error;
    }
};


export const deletInventoryTransaction = async (id: number): Promise<void | null> => {
    return await fetchData<void>(`inventory/transactions/${id}`, "DELETE", tokenService.accessToken);
};

export const searchInventoryTransactions = async (
    request: SearchInventoryTransactionRequest,
    page: number,
    size: number
): Promise<any | null> => {
    return await fetchData<any, SearchInventoryTransactionRequest>(
        `inventory/transactions/search?page=${page}&size=${size}`,
        "POST",
        tokenService.accessToken,
        request
    );
};
