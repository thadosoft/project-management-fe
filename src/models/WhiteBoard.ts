export interface WhiteBoard {
    id?: number;
    employeeId: string;
    employee?: {
        id?: string;
        name?: string;
    };
    employeeName?: string,
    projectName: string;
    description?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    assignBy?: string;
}

export interface SearchWhiteBoardRequest {
    startDate?: string;
    endDate?: string;
}

export interface UpdateWhiteBoard {
    projectName?: string;
    description?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    assignBy?: string;
}

export interface CreateWhiteBoard {
    employeeId: number;
    projectName: string;
    description?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    assignBy?: string;
}