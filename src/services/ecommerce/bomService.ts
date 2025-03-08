import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { CreateBOM, QuotationResponse, SearchQuotationRequest } from "@/models/Bom";

export const addBom = async (employee: CreateBOM): Promise<any | null> => {
    try {
        return await fetchData<any, CreateBOM>(`quotations`, "POST", tokenService.accessToken, employee);
    } catch (error) {
        console.error("Error adding BOM:", error);
        return null;
    }
};

export const getBomById = async (id: number): Promise<any | null> => {
    try {
        return await fetchData<any>(`quotations/${id}`, "GET", tokenService.accessToken);
    } catch (error) {
        console.error("Error fetching quotations by ID:", error);
        return null;
    }
};

export const updateBom = async (id: number, employee: CreateBOM): Promise<any | null> => {
    try {
        return await fetchData<any, CreateBOM>(`quotations/${id}`, "PUT", tokenService.accessToken, employee);
    } catch (error) {
        console.error("Error updating BOM:", error);
        return null;
    }
};

export const deleteBom = async (id: number): Promise<boolean> => {
    try {
        await fetchData<void, void>(`quotations/${id}`, "DELETE", tokenService.accessToken);
        return true;
    } catch (error) {
        console.error("Error deleting BOM:", error);
        return false;
    }
};

export const searchBom = async (searchParams: SearchQuotationRequest, page: number, size: number): Promise<any | null> => {
    try {
        return await fetchData<QuotationResponse, SearchQuotationRequest>(
            `quotations/search?page=${page}&size=${size}`,
            "POST",
            tokenService.accessToken,
            searchParams
        );
    } catch (error) {
        console.error("Error searching BOM:", error);
        return null;
    }
};

export const printBOMPDF = async (id: number, name: string): Promise<void> => {
    try {
        const response = await fetchData<Blob>(
            `quotations/printPDF/${id}`,
            "GET",
            tokenService.accessToken,
            undefined
        );

        if (!response) {
            console.error("Failed to fetch PDF.");
            return;
        }

        const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Báo giá ${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error downloading PDF:", error);
    }
};
