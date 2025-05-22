import { fetchData } from "@/utils/api.ts";
import tokenService from "@/services/tokenService.ts";
import { AuditLog, SearchAuditLog } from "@/models/AuditLog";

export const searchAuditLogs = async (
    searchParams: SearchAuditLog,
    page: number,
    size: number
): Promise<AuditLog | null> => {
    try {
        return await fetchData<AuditLog, SearchAuditLog>(
            `audit-logs/search-params?page=${page}&size=${size}`,
            "POST",
            tokenService.accessToken,
            searchParams
        );
    } catch (error) {
        console.error("Error searching attendances:", error);
        return null;
    }
};

export const get6LatestAuditLogs = async (): Promise<AuditLog[] | null> => {
    try {
        return await fetchData<AuditLog[], null>(
            `audit-logs`,
            "GET",
            tokenService.accessToken
        );
    } catch (error) {
        console.error("Error fetching latest audit logs:", error);
        return null;
    }
};
