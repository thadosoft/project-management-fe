import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getEmployeeById } from "@/services/employee/EmployeeService";
import { EmployeeRequest } from "@/models/EmployeeRequest";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ZoomModal = ({ imageUrl, closeModal }: { imageUrl: string; closeModal: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative">
                <button onClick={closeModal} className="absolute top-0 right-0 text-white px-2 m-2">
                    X
                </button>
                <img src={imageUrl} className="max-w-full max-h-full object-contain" />
            </div>
        </div>
    );
};

function DetailEmployeePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employee, setEmployee] = useState<EmployeeRequest | null>(null);
    const [image, setImage] = useState<string>("https://randomuser.me/api/portraits/women/21.jpg");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    // Fetch employee data by ID
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("Không tìm thấy ID nhân viên.");
                const response = await getEmployeeById(Number(id)); // Gọi API
                setEmployee(response);
                if (response.avatar) {
                    setImage(response.avatar);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!employee) return <p>Không tìm thấy nhân viên.</p>;

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
                                        <BreadcrumbLink href="/search-employee">
                                            Tìm kiếm thông tin nhân viên
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Chi tiết nhân viên</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-6">
                        <div>
                            <div className="container mx-auto py-8">
                                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                                    <div className="col-span-4 sm:col-span-3">
                                        <div className="shadow rounded-lg p-6">
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={employee.avatar}
                                                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 cursor-pointer"
                                                    onClick={openModal}
                                                />
                                                <h1 className="text-xl font-bold"> {employee.fullName}</h1>
                                                <p className="">{employee.career}</p>
                                                {/* <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                                    <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Contact</a>
                                                    <a href="#" className="bg-gray-300 hover:bg-gray-400  py-2 px-4 rounded">Resume</a>
                                                </div> */}
                                            </div>
                                            <hr className="my-6 border-t border-gray-300" />
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-9">
                                        <button className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white">In hợp đồng lao động</button>
                                        <div className="shadow rounded-lg p-6 border my-4">
                                            <h2 className="text-xl font-bold mb-4">About Me</h2>
                                            <p className="">{employee.description}</p>
                                        </div>


                                        <div className="w-full my-auto py-6 flex flex-col justify-center gap-2">
                                            <div className="w-full flex sm:flex-row flex-col gap-2 justify-center">
                                                <div className="w-full">
                                                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                                        <div className="flex flex-col pb-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Họ và tên</dt>
                                                            <dd className="text-lg font-semibold">{employee.fullName}</dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phòng ban</dt>
                                                            <dd className="text-lg font-semibold">{employee.career}</dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Ngày sinh</dt>
                                                            <dd className="text-lg font-semibold">{employee.placeOfBirth}</dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Giới tính</dt>
                                                            <dd className="text-lg font-semibold">{employee.gender}</dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Liên hệ khẩn cấp</dt>
                                                            <dd className="text-lg font-semibold">{employee.emergencyContact}</dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Quốc gia</dt>
                                                            <dd className="text-lg font-semibold">{employee.nation}</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                                <div className="w-full">
                                                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                                        <div className="flex flex-col pb-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Tax</dt>
                                                            <dd className="text-lg font-semibold">{employee.tax}</dd>
                                                        </div>

                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phone Number</dt>
                                                            <dd className="text-lg font-semibold">{employee.phone}</dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                                            <dd className="text-lg font-semibold">{employee.email}</dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                                            <dd className="text-lg font-semibold">{employee.companyEmail}</dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Địa chỉ thường trú</dt>
                                                            <dd className="text-lg font-semibold">{employee.houseHoldAddress}</dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Địa chỉ tạm trú</dt>
                                                            <dd className="text-lg font-semibold">{employee.currentAddress}</dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            {isModalOpen && <ZoomModal imageUrl={employee.avatar} closeModal={closeModal} />}
        </ThemeProvider>
    );
}

export default DetailEmployeePage;
