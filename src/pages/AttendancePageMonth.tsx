import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { getAllEmployees } from "@/services/employee/EmployeeService";
import { AttendanceByDayRequest } from "@/models/Attendance";
import { getAttendance } from "@/services/attendanceService";

function AttendancePageMonth() {

    const [employees, setEmployees] = useState<any[]>([]); // List of employees
    const [attendanceData, setAttendanceData] = useState<Record<string, Record<string, string>>>({}); // Attendance data for each employee per day
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (!isDataLoaded) {
            getAllEmployees().then((data) => {
                setEmployees(data);
                setIsDataLoaded(true); // Chỉ cập nhật khi dữ liệu đã tải
            });
        }
    }, [isDataLoaded]);

    const getDaysInMonth = (year: number, month: number) => {
        const days = [];
        const firstDay = new Date(Date.UTC(year, month, 1));

        while (firstDay.getUTCMonth() === month) {
            let dayOfWeek = firstDay.toLocaleDateString("vi-VN", { weekday: "short", timeZone: "Asia/Ho_Chi_Minh" }).replace("Th ", "T");
            days.push({
                date: firstDay.toISOString().split("T")[0],
                dayOfWeek: dayOfWeek === "CN" ? "CN" : dayOfWeek
            });

            firstDay.setUTCDate(firstDay.getUTCDate() + 1);
        }
        return days;
    };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const days = getDaysInMonth(currentYear, currentMonth);

    const fetchAttendanceData = async (employees: any[], days: any[]) => {
        const data: Record<string, Record<string, string>> = {};
        for (const employee of employees) {
            const attendancePerEmployee: Record<string, string> = {};
            // console.log(`Fetching attendance for employee: ${employee.employeeCode}`); // Log the employee's code

            await Promise.all(
                days.map(async (day) => {
                    const request: AttendanceByDayRequest = {
                        empCode: employee.employeeCode,
                        date: day.date,
                    };

                    try {
                        // console.log(`Fetching attendance for ${employee.employeeCode} on ${day.date}`); // Log the date and employee
                        const attendance = await getAttendance(request);

                        if (attendance !== null) {
                            // console.log(`Attendance for ${employee.employeeCode} on ${day.date}: ${attendance}`); // Log fetched attendance data
                            attendancePerEmployee[day.date] = attendance.toString();
                        } else {
                            // console.log(`No attendance data for ${employee.employeeCode} on ${day.date}`); // Log if no data found
                            attendancePerEmployee[day.date] = 'Chưa có dữ liệu';
                        }
                    } catch (error) {
                        // console.error(`Error fetching attendance for ${employee.employeeCode} on ${day.date}:`, error); // Log error if any
                        attendancePerEmployee[day.date] = 'Lỗi tải dữ liệu';
                    }
                })
            );

            // console.log(`Attendance data for employee ${employee.employeeCode}:`, attendancePerEmployee); // Log the attendance data for the employee
            data[employee.employeeCode] = attendancePerEmployee;
        }

        // console.log("Final attendance data:", data); // Log the final data structure after all employees are processed
        setAttendanceData(data);
        setIsDataLoaded(true);
    };

    const handleLoadData = async () => {
        const employeeData = await getAllEmployees();
        setEmployees(employeeData);
        fetchAttendanceData(employeeData, days);
    };


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrAttendancePageer:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Bảng chấm công tháng</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">Bảng chấm công <span className="text-indigo-600">tháng {currentMonth + 1}</span></h3>
                            <button className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white" onClick={handleLoadData}>Lấy dữ liệu chấm công</button>
                        </div>
                        <div className="flex flex-col">
                            <div className=" overflow-x-auto pb-4">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="overflow-hidden  border rounded-lg border-gray-300">
                                        <table className="table-auto min-w-full rounded-xl">
                                            <thead className="border border-gray-300">
                                                <tr className="bg-gray-50 border border-gray-300 text-center">
                                                    <th className="border border-gray-300 p-3 text-center" rowSpan={2}>
                                                        <input type="checkbox" value="" className="w-5 h-5 appearance-none border border-gray-300 rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100" />
                                                    </th>
                                                    <th scope="col" className="border border-gray-300 p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize" rowSpan={2}>STT</th>
                                                    <th scope="col" className="border border-gray-300 p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize" rowSpan={2}>MNV</th>
                                                    <th scope="col" className="border border-gray-300 p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize" rowSpan={2}>Họ và tên</th>
                                                    {days.map((day, index) => (
                                                        <th key={index} className="border border-gray-300 p-5 text-center text-sm font-semibold text-gray-900">
                                                            {new Date(day.date).getUTCDate()}
                                                        </th>
                                                    ))}
                                                    <th scope="col" className="border border-gray-300 p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize" rowSpan={2}>Trạng thái</th>
                                                    <th scope="col" className="border border-gray-300 p-5 text-left whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize" rowSpan={2}>Actions</th>
                                                </tr>
                                                <tr className="bg-gray-50 border border-gray-300">
                                                    {days.map((day, index) => (
                                                        <th key={index} className="border border-gray-300 p-5 text-center text-sm font-semibold text-gray-900">
                                                            {day.dayOfWeek}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-300 border border-gray-300 text-black bg-white">
                                                {employees ? (
                                                    employees.map((employee, index) => (
                                                        <tr key={employee.id}>
                                                            <td className="border border-gray-300 p-3 text-center">
                                                                <input type="checkbox" className="w-5 h-5" />
                                                            </td>
                                                            <td className="border border-gray-300 p-5 text-left text-sm font-semibold text-gray-900">{index + 1}</td>
                                                            <td className="border border-gray-300 p-5 text-left text-sm font-semibold text-gray-900">{employee.employeeCode}</td>
                                                            <td className="border border-gray-300 p-5 text-left text-sm font-semibold text-gray-900">{employee.fullName}</td>
                                                            {days.map((day, dayIndex) => (
                                                                <td
                                                                    key={dayIndex}
                                                                    className={`border border-gray-300 p-5 text-center text-sm font-semibold text-gray-900 ${attendanceData[employee.employeeCode]?.[day.date] &&
                                                                            parseFloat(attendanceData[employee.employeeCode]?.[day.date]) > 0
                                                                            ? 'bg-green-500 text-white'
                                                                            : ''
                                                                        }`}
                                                                >
                                                                    {attendanceData[employee.employeeCode]?.[day.date] ?? 'Chưa có dữ liệu'}
                                                                </td>
                                                            ))}

                                                            <td className="border border-gray-300 p-5 text-left text-sm font-semibold text-gray-900">Đang làm việc</td>
                                                            <td className="border border-gray-300 p-5 text-left text-sm font-semibold text-gray-900">
                                                                <button className="bg-blue-500 text-white px-3 py-1 rounded">Sửa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={days.length + 6} className="text-center text-sm font-semibold text-gray-900">
                                                            Không có dữ liệu nhân viên.
                                                        </td>
                                                    </tr>
                                                )}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider >
    )
}

export default AttendancePageMonth
