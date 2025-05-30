import { useState, useEffect } from "react";

import { Table, Pagination, Button, Popconfirm } from "antd";  // thêm Button, Popconfirm
import { ThemeProvider } from "@/components/theme-provider";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CreateEmployeeOfTheMonth, deleteEmployeeOfMonth, searchEmployeeOfMonth } from "@/services/employeeOfMonthService";
import { CreateEmployeeOfMonth, EmployeeOfMonth } from "@/models/EmployeeOfMonth";
import { getAllEmployees } from "@/services/employee/EmployeeService";

dayjs.extend(customParseFormat);

export default function EmployeeOfMonthPage() {
    const [form, setForm] = useState<CreateEmployeeOfMonth>({
        awardDate: dayjs().format("YYYY-MM-DDTHH:mm"),
    });

    const [whiteBoards, setEmployeeOfMonth] = useState<EmployeeOfMonth[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [employees, setEmployees] = useState<EmployeeOfMonth[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "employeeId" ? Number(value) : value,
        }));
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteEmployeeOfMonth(id);  // bạn cần import và định nghĩa hàm này trong services
            await fetchWhiteBoards(currentPage);
        } catch (error) {
            alert("Xoá thất bại");
        }
    };

    const fetchWhiteBoards = async (page: number) => {
        const res = await searchEmployeeOfMonth({}, page - 1, 10);
        if (res) {
            setEmployeeOfMonth(res.content);
            setTotalPages(res.totalPages);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.awardDate) {
            alert("Vui lòng chọn ngày nhận thưởng");
            return;
        }

        // parse awardDate đúng format
        const date = dayjs(form.awardDate, "YYYY-MM-DDTHH:mm");

        if (!date.isValid()) {
            alert("Ngày không hợp lệ");
            return;
        }

        const payload = {
            ...form,
            awardDate: date.format("YYYY-MM-DDTHH:mm:ss"), 
            month: date.month() + 1, 
            year: date.year(),
        };

        await CreateEmployeeOfTheMonth(payload);

        await fetchWhiteBoards(currentPage);

        setForm({});
    };

    useEffect(() => {
        if (employees.length > 0 && !form.employeeId) {
            setForm(prev => ({ ...prev, employeeId: employees[0].id?.toString() }));
        }
    }, [employees]);

    useEffect(() => {
        getAllEmployees().then((res) => {
            if (res) {
                setEmployees(res);
            }
        });
        fetchWhiteBoards(currentPage);
    }, [currentPage]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 items-center gap-2 px-4">
                        <SidebarTrigger />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Nhân viên của tháng</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    <main className="p-10">
                        <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">
                            Nhân viên của <span className="text-indigo-600">tháng</span>
                        </h3>

                        {/* FORM */}
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8 bg-gray-800 mb-10">
                            <form onSubmit={handleSubmit}>
                                <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                    {/* Select dropdown cho Employee */}
                                    <div>
                                        <div>
                                            <label className="text-xs font-medium mb-1 text-gray-200">
                                                Nhân sự
                                            </label>
                                            <select
                                                name="employeeId"
                                                value={form.employeeId}
                                                onChange={handleChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            >
                                                <option value={0} disabled>
                                                    Chọn nhân viên
                                                </option>
                                                {employees.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Các input còn lại */}
                                    {[
                                        { name: "reason", type: "text", label: "Lý do" },
                                        { name: "awardDate", type: "datetime-local", label: "Ngày nhận thưởng" },
                                    ].map(({ name, type, label }) => (
                                        <div key={name}>
                                            <label className="text-xs font-medium mb-1 text-gray-200">
                                                {label}
                                            </label>
                                            <input
                                                type={type}
                                                name={name}
                                                value={((form as any)[name] !== undefined && (form as any)[name] !== null) ? (form as any)[name] : ""}
                                                onChange={handleChange}
                                                className="h-[50px] rounded-[5px] text-xs border text-black border-gray-300 w-full px-4 bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-600 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* BẢNG */}
                        <Table
                            dataSource={whiteBoards}
                            rowKey="id"
                            pagination={false}
                            columns={[
                                { title: "ID", dataIndex: "id", key: "id" },
                                {
                                    title: "Nhân sự",
                                    key: "employee",
                                    dataIndex: "employee",
                                    render: (employee) => (
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <img
                                                src={employee?.avatar}
                                                alt={employee?.fullName}
                                                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                                            />
                                            <span>{employee?.fullName || "N/A"}</span>
                                        </div>
                                    ),
                                },
                                { title: "Tháng", dataIndex: "month", key: "month" },
                                { title: "Năm", dataIndex: "year", key: "year" },
                                { title: "awardDate", dataIndex: "awardDate", key: "awardDate" },
                                { title: "Lý do", dataIndex: "reason", key: "reason" },
                                {
                                    title: "Thao tác",
                                    key: "action",
                                    render: (_: any, record: EmployeeOfMonth) => (
                                        <Popconfirm
                                            title="Bạn có chắc muốn xoá?"
                                            onConfirm={() => record.id && handleDelete(record.id)}
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <Button danger size="small">Xoá</Button>
                                        </Popconfirm>
                                    ),
                                },
                            ]}
                        />


                        <div className="mt-4 flex justify-center">
                            <Pagination
                                current={currentPage}
                                total={totalPages * 10}
                                onChange={(page) => setCurrentPage(page)}
                            />
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
