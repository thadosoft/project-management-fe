export interface Attendance {
    personName: string;
    startDate: string;
    endDate: string;
}

export interface CaptureDatumResponse {

    captureId: string;

    sequnce: string;

    deviceId: string;

    addrName: string;

    time: string;

    matchStatus: string;

    matchType: string;

    personId: string;

    personName: string;

    hatColor: string;

    wgCardId: string;

    matchFailedReson: string;

    existMask: string;

    bodyTemp: string;

    deviceSn: string;

    idcardNumber: string;

    idcardName: string;

    closeup: string;

    qRcodestatus: string;

    qRcode: string;

    tripInfor: string;

    createdAt: string
}

export interface AttendanceByDayRequest {

    date: string;

    empCode: string;
}

export interface AttendanceByDayResponse {
    
    employeeCode: string;

    fullName: string;

    workDate: string;

    totalShifts: number;
}