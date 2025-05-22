import { useState, useEffect } from "react";
import { WhiteBoard, CreateWhiteBoard } from "@/models/WhiteBoard";
import {
  createWhiteBoard,
  searchWhiteBoards,
} from "@/services/whiteboard/whiteBoardService";
import { Table, Pagination } from "antd";
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
import { User } from "@/models/User";
import { getAllEmployees } from "@/services/employee/EmployeeService";
import { Employee } from "@/models/EmployeeRequest";

dayjs.extend(customParseFormat);

export default function WhiteBoardPage() {
  const [form, setForm] = useState<CreateWhiteBoard>({
    employeeId: 0,
    projectName: "",
    description: "",
    deadline: "",
    startDate: "",
    endDate: "",
    status: "",
    assignBy: "",
  });

  const [whiteBoards, setWhiteBoards] = useState<WhiteBoard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  console.log(employees);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "employeeId" ? Number(value) : value,
    }));
  };

  const fetchWhiteBoards = async (page: number) => {
    const res = await searchWhiteBoards({}, page - 1, 10);
    if (res) {
      setWhiteBoards(res.content);
      setTotalPages(res.totalPages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName || !form.employeeId)
      return alert("Vui lòng nhập đầy đủ!");
    await createWhiteBoard(form);
    await fetchWhiteBoards(currentPage);
    setForm({
      employeeId: 0,
      projectName: "",
      description: "",
      deadline: "",
      startDate: "",
      endDate: "",
      status: "",
      assignBy: "",
    });
  };

  useEffect(() => {
    getAllEmployees().then((res) => {
      if (res) {
        setEmployees(res);
      }
    });
    fetchWhiteBoards(currentPage);
  }, [currentPage]);
  console.log("Employees:", employees);
  console.log("Form employeeId:", form.employeeId);

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
                  <BreadcrumbPage>Quản lý WhiteBoard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <main className="p-10">
            <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">
              Quản lý <span className="text-indigo-600">WhiteBoard</span>
            </h3>

            {/* FORM */}
            <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8 bg-gray-800 mb-10">
              <form onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                  {/* Select dropdown cho Employee */}
                  <div>
                    <div>
                      <label className="text-xs font-medium mb-1 text-gray-200">
                        Nhânj sự
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
                    {
                      name: "projectName",
                      type: "text",
                      label: "Tên dự án",
                    },
                    { name: "description", type: "text", label: "Miêu tả" },
                    { name: "startDate", type: "date", label: "Ngày bắt đầu" },
                    { name: "endDate", type: "date", label: "Ngày kết thúc" },
                    { name: "deadline", type: "date", label: "Deadline" },
                    { name: "status", type: "text", label: "Trạng thái" },
                    { name: "assignBy", type: "text", label: "Người giao" },
                  ].map(({ name, type, label }) => (
                    <div key={name}>
                      <label className="text-xs font-medium mb-1 text-gray-200">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={(form as any)[name]}
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
                  title: "Dự án",
                  dataIndex: "projectName",
                  key: "projectName",
                },
                {
                  title: "Nhân sự",
                  key: "employee",
                  render: (_: any, record: WhiteBoard) =>
                    record?.employeeName || "N/A",
                },
                { title: "Trạng thái", dataIndex: "status", key: "status" },
                {
                  title: "Ngày bắt đầu",
                  dataIndex: "startDate",
                  key: "startDate",
                  render: (date: string) =>
                    dayjs(date).isValid()
                      ? dayjs(date).format("DD/MM/YYYY")
                      : "N/A",
                },
                {
                  title: "Ngày kết thúc",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (date: string) =>
                    dayjs(date).isValid()
                      ? dayjs(date).format("DD/MM/YYYY")
                      : "N/A",
                },
                {
                  title: "Deadline",
                  dataIndex: "deadline",
                  key: "deadline",
                  render: (date: string) =>
                    dayjs(date).isValid()
                      ? dayjs(date).format("DD/MM/YYYY")
                      : "N/A",
                },
              ]}
              className="shadow-xl rounded-lg bg-gray-200 text-gray-900 border border-gray-400"
              scroll={{ x: "max-content" }}
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
