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

export interface CreateAttendanceResponse {
    employeeCode: string;

    fullName: string;

    month: number;

    year: number;

    startDate: string;

    endDate: string;

    dailyAttendance: DailyAttendance[];
}

export interface DailyAttendance {
    workDate: string;

    shiftName: string;

    totalShift: number;

    checkInTime: string;

    checkOutTime: string;

    otherCheckins: string;
}

export interface AttendanceByPeriodResponse {

    id: number;

    employeeCode: string;

    fullName: string;

    month: number;

    year: number;

    startDate: string;

    endDate: string;

    dailyAttendance: DailyAttendanceResponse[];
}

export interface DailyAttendanceResponse {

    id: number;

    workDate: string;

    shiftName: string;

    totalShift: number;

    checkInTime: string;

    checkOutTime: string;

    otherCheckins: string;
}

export interface UpdateDailyAttendance {
    employeeCode: string;

    fullName: string;

    workDate: string;

    shiftName: string;

    totalShifts: string;

    morningCheckin: string;

    afternoonCheckout: string;

    otherCheckins: string;
}

export interface LateStaft {
    personId: string;

    personName: string;

    time: string;

    closeup: string;
}