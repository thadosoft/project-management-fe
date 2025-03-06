export interface MaterialCategory {
    id?: number,
    name: string,
    code: string,
    description: string
}

export interface UpdateMaterialCategory {
    name: string,
    code: string,
    description: string
}

export interface SearchMaterialCategory {
    name: string,
    code: string,
    description: string
}