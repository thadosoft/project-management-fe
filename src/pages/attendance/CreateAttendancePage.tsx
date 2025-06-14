
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
import { CreateAttendanceResponse } from "@/models/Attendance";
import { getMonthlyAttendance, CreateMonthlyAttendance } from "@/services/attendanceService";

function CreateAttendancePage() {

    const currentDate = new Date();
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [month, setMonth] = useState<number>(currentDate.getMonth() + 1); // Tháng trong JS bắt đầu từ 0, cần +1//ok đã hiểu
    const [attendanceData, setAttendanceData] = useState<CreateAttendanceResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLoadData = async () => {
        setLoading(true);
        try {
            const data = await getMonthlyAttendance(year, month);
            if (data) {
                setAttendanceData(data);
            }
        } catch (error) {
            console.error("Failed to fetch attendance data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleLoadData();
    }, [year, month]);

    const getDaysInMonth = (year: number, month: number) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1; 
            const date = new Date(year, month - 1, day);
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return {
                date: formattedDate,
                dayOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()]
            };
        });
    };

    const handleCreateAttendance = async () => {
        CreateMonthlyAttendance(year, month).then(response => {
            if (response) {
                alert("Tạo bảng chấm công thành công");
                handleLoadData();
            } else {
                alert("Tạo bảng chấm công thất bại dữ liệu đã tồn tại");
            }
        });
    };
    const days = getDaysInMonth(year, month);

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
                                        <BreadcrumbPage>Tạo bảng chấm công tháng</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">Tạo bảng chấm công </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border p-2 rounded-md bg-black">
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                Tháng {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border p-2 rounded-md bg-black">
                                        {[...Array(5)].map((_, i) => {
                                            const y = currentDate.getFullYear() - i;
                                            return (
                                                <option key={y} value={y}>
                                                    {y}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>  
                                <button
                                    className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white"
                                    onClick={handleCreateAttendance}
                                    disabled={loading}
                                >
                                    {loading ? "Đang tạo..." : "Tạo bảng chấm công"}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className=" overflow-x-auto pb-4">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="overflow-hidden  border rounded-lg border-gray-300">
                                        <table className="table-auto min-w-full rounded-xl">
                                        <thead className="border border-gray-300"> 
                                            <tr className="bg-gray-50 border border-gray-300 text-center">
                                                <th scope="col" className="border border-gray-300 whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize w-8" rowSpan={2}>STT</th>
                                                <th scope="col" className="border border-gray-300 whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize w-[120px]" rowSpan={2}>Mã nhân viên</th>
                                                <th scope="col" className="border border-gray-300 whitespace-nowrap text-sm leading-6 font-semibold text-gray-900 capitalize w-[100px]" rowSpan={2}>Họ và tên</th>
                                                {days.map((day, index) => (
                                                    <th
                                                        key={index}
                                                        className={`border border-gray-300 text-center text-sm font-semibold text-gray-900 ${day.dayOfWeek === "CN" ? "bg-yellow-300" : ""}`}
                                                    >
                                                        {index + 1}
                                                    </th>
                                                ))}
                                            </tr>
                                            <tr className="bg-gray-50 border border-gray-300">
                                                {days.map((day, index) => (
                                                    <th
                                                        key={index}
                                                        className={`border border-gray-300 text-center text-sm font-semibold text-gray-900 w-8 ${day.dayOfWeek === "CN" ? "bg-yellow-300" : ""}`}
                                                    >
                                                        {day.dayOfWeek}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-300 border border-gray-300 text-black bg-white">
                                            {attendanceData.map((employee, empIndex) => (
                                                <tr key={empIndex}>
                                                    <td className="border border-gray-300 text-center">{empIndex + 1}</td>
                                                    <td className="border border-gray-300 text-center">{employee.employeeCode}</td>
                                                    <td className="border border-gray-300 px-5 whitespace-nowrap">{employee.fullName}</td>
                                                    {days.map((day, index) => {
                                                    const attendance = employee.dailyAttendance.find(a => {
                                                        return a.workDate === day.date;
                                                    });
                                                    const isSunday = day.dayOfWeek === "CN";
                                                    return (
                                                        <td
                                                                    key={index}
                                                                    className={`border border-gray-300 text-center ${
                                                                        isSunday
                                                                            ? 'bg-yellow-300 text-black'
                                                                            : attendance
                                                                            ? attendance.shiftName === 'C'
                                                                                ? 'bg-orange-500 text-white'
                                                                                : attendance.shiftName === 'S'
                                                                                ? 'bg-purple-500 text-white'
                                                                                : attendance.shiftName === 'CN'
                                                                                ? 'bg-green-500 text-white'
                                                                                : 'bg-white'
                                                                            : 'bg-white'
                                                                    }`}
                                                                >
                                                                    {attendance ? `${attendance.shiftName}` : "-"}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-end gap-4 my-8 border border-white w-max p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-yellow-300 w-8 h-8"></div>
                                            <div>Chủ nhật</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-500 w-8 h-8"></div>
                                            <div>Cả ngày</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-500 w-8 h-8"></div>
                                            <div>Ca sáng</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-orange-500 w-8 h-8"></div>
                                            <div>Ca chiều</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-500 w-8 h-8"></div>
                                            <div>Nhà máy</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-cyan-300 w-8 h-8"></div>
                                            <div>Phép</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-pink-500 w-8 h-8"></div>
                                            <div>Lễ</div>
                                        </div>
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

export default CreateAttendancePage



