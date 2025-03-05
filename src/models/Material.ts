export interface Material {
    name: string;

    sku: string;

    inventoryCategoryId: number;

    unit: string;

    quantityInStock: number;

    reorderLevel: number;

    location: string;

    purchasePrice: number;

    sellingPrice: number;
}