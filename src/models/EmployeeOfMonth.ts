export interface EmployeeOfMonth {

    id?: number;

    employeeId?: string;

    employee?: any;
    fullName?: string;
    monthYear?: string;

    reason?: string;

    month?: number;

    year?: number;

    awardDate?: string;
}

export interface SearchEmployeeOfMonthRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
}

export interface UpdateEmployeeOfMonth {
    projectName?: string;
    description?: string;
    deadline?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    assignBy?: string;
}

export interface CreateEmployeeOfMonth {
    employeeId?: string;
   
    employee?: {
        id?: string;
        name?: string;
    };

    monthYear?: string;

    reason?: string;

    month?: number;

    year?: number;

    awardDate?: string;
}