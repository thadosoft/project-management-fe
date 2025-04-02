export interface InventoryTransactionRequest {
    itemId: number;

    transactionType: string;

    quantity: number;

    transactionDate: string;

    reason: string;

    processedBy: string;

    receiver: string;
}

export interface InventoryTransactionResponse {
    id: number;

    itemId: number;

    transactionType: string;

    itemName: string,

    quantity: number;

    transactionDate: string;

    reason: string;

    processedBy: string;

    receiver: string;
}

export interface SearchInventoryTransactionRequest {
    transactionType: string;

    processedBy: string;

    receiver: string;
}