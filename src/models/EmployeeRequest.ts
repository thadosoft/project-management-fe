
export interface Employee {
    id: number;

    username: string;

    avatar: string;

    fullName: string;

    career: string;

    placeOfBirth: string;

    nation: string;

    gender: string;

    tax: string;

    email: string;

    phone: string;

    companyEmail: string;

    emergencyContact: string;

    houseHoldAddress: string;

    currentAddress: string;

    description: string;
}

export interface EmployeeRequest {
    username: string;

    avatar: string;

    fullName: string;

    career: string;

    placeOfBirth: string;

    nation: string;

    gender: string;

    tax: string;

    email: string;

    phone: string;

    companyEmail: string;

    emergencyContact: string;

    houseHoldAddress: string;

    currentAddress: string;

    description: string;
}

export interface SearchEmployeeRequest {
    fullName?: string;
    career?: string
}
