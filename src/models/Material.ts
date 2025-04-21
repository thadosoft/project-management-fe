import { MaterialCategory } from "./MaterialCategory";

export interface ReferenceFile {
    id: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    filePath: string;
    accessUrl: string;
}

export interface Material {
    id?: number;
    name: string;
    sku: string;
    inventoryCategory?: MaterialCategory;
    inventoryCategoryId?: number;
    unit: string;
    quantityInStock: number;
    // reorderLevel: number;
    location: string;
    purchasePrice: number;
    // sellingPrice: number;
    status?: string;
    images?: ReferenceFile[];
}

export interface UpdateMaterial {
    name: string;
    sku: string;
    inventoryCategoryId?: number;
    unit: string;
    quantityInStock: number;
    // reorderLevel: number;
    location: string;
    purchasePrice: number;
    // sellingPrice: number;
}

export interface SearchMaterialRequest {
    name?: string;
    sku?: string;
}