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
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { searchEmployees } from "@/services/employee/EmployeeService";
import { Employee, SearchEmployeeRequest } from "@/models/EmployeeRequest";
import { useNavigate } from "react-router";

function SearchEmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState<SearchEmployeeRequest>({
        fullName: '',
        career: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await searchEmployees(searchParams, page, size);

                if (result) {
                    setEmployees(result.content);
                }
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParams, currentPage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        try {
            const result = await searchEmployees(searchParams, page, size);
            if (result) {
                setEmployees(result.content);
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const handleViewDetail = (employeeId: string) => {
        navigate(`/detail-employee/${employeeId}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-SearchEmployeePageer:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">
                                            Thông tin nhân viên
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Tìm kiếm nhân viên</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-6">
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <h2 className="sm:text-xl text-[12px] font-bold mb-6">Tìm kiếm thông tin nhân viên</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tên nhân viên</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={searchParams.fullName}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                placeholder="Nguyễn Trung Dũng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Phòng ban</label>
                                            <input
                                                type="text"
                                                name="career"
                                                value={searchParams.career}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                placeholder="Phòng Kỹ Thuật"
                                            />
                                        </div>
                                        {/* <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Ngày bắt đầu</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={searchParams.startDate}
                                                onChange={handleSearchChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Ngày kết thúc</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={searchParams.endDate}
                                                onChange={handleSearchChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div> */}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                                    <button onClick={handleSearch}
                                        type="submit"
                                        className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white"
                                    >
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </section>
                        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mã số thuế</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={employee.avatar}
                                                        alt="Profile"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-500">
                                                        {employee.fullName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500"> {employee.gender} </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {employee.tax}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.placeOfBirth}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {employee.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a onClick={() => handleViewDetail(employee.id)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">Xem chi tiết</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default SearchEmployeePage;
