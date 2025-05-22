export interface AuditLog {

    id: number;

    username: string;

    action: string;

    resource: string;

    details: string;

    createdAt: string;
}

export interface SearchAuditLog {

    resource: string;

    startDate: string;

    endDate: string;

}