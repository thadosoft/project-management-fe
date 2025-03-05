export interface Material {
    id?: number;

    name?: string;

    sku?: string;

    inventoryCategory?: any | null;

    inventoryCategoryId?: any | null;

    unit?: string;

    quantityInStock?: number;

    reorderLevel?: number;

    location?: string;

    purchasePrice?: number;

    sellingPrice?: number;

    status?: string;
}
export interface UpdateMaterial {
    id?: number;

    name?: string;

    sku?: string;

    inventoryCategoryId?: number;

    unit?: string;

    quantityInStock?: number;

    reorderLevel?: number;

    location?: string;

    purchasePrice?: number;

    sellingPrice?: number;
}

export interface SearchMaterialRequest {
    name?: string;
    sku?: string;
}