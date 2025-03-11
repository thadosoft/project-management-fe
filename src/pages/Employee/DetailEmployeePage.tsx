import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getEmployeeById, printPDF, updateEmployee } from "@/services/employee/EmployeeService";
import { Employee, EmployeeRequest } from "@/models/EmployeeRequest";
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
    const isUpdate = !!id;
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(!isUpdate);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employee, setEmployee] = useState<Employee | null>(null);
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employee) return;
        setLoading(true);

        try {
            await updateEmployee(employee.id, employee);
            alert("Cập nhật thành công!");
            setIsEditing(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật nhân viên:", error);
            alert("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!employee) return;
        const { name, value } = event.target;
        setEmployee((prevEmployee) => prevEmployee ? { ...prevEmployee, [name]: value } : null);
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            console.log("File:", file);


            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
                setEmployee((prevEmployee) => prevEmployee ? { ...prevEmployee, avatar: base64String } : null);
            };
            reader.readAsDataURL(file);
        }
    };

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
                                            Danh sách thông tin nhân viên
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
                                                {!isEditing && (<img src={employee.avatar} className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 cursor-pointer" onClick={openModal} />)}
                                                {isEditing && (
                                                    <div className="flex flex-col items-center">
                                                        <label htmlFor="image-upload" className="cursor-pointer">
                                                            <img className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4" src={image} alt="Profile" />
                                                        </label>
                                                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                    </div>
                                                )}
                                                <h1 className="text-xl font-bold"> {employee.fullName}</h1>
                                                <p className="">{employee.career}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-9">
                                        {isUpdate && !isEditing && (
                                            <button onClick={handleEdit} className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white mr-2">
                                                Cập nhật
                                            </button>
                                        )}

                                        {isEditing && (
                                            <button onClick={handleSubmit} disabled={!isEditing} className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white mr-2">
                                                Lưu
                                            </button>
                                        )}

                                        {isUpdate && !isEditing && (
                                            <button onClick={() => printPDF(employee.id, employee.fullName)} className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] gap-[10px] text-white">In hợp đồng lao động</button>
                                        )}

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
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="fullName"
                                                                        value={employee.fullName}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.fullName}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phòng ban</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="career"
                                                                        value={employee.career}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.career}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Ngày sinh</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="placeOfBirth"
                                                                        value={employee.placeOfBirth}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.placeOfBirth}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Giới tính</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="gender"
                                                                        value={employee.gender}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.gender}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Liên hệ khẩn cấp</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="emergencyContact"
                                                                        value={employee.emergencyContact}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.emergencyContact}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col py-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Quốc gia</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="nation"
                                                                        value={employee.nation}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.nation}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                                <div className="w-full">
                                                    <dl className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                                                        <div className="flex flex-col pb-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Tax</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="tax"
                                                                        value={employee.tax}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.tax}</p>
                                                                )}
                                                            </dd>
                                                        </div>

                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Phone Number</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="phone"
                                                                        value={employee.phone}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.phone}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        value={employee.email}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.email}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Email</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="companyEmail"
                                                                        value={employee.companyEmail}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.companyEmail}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Địa chỉ thường trú</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="houseHoldAddress"
                                                                        value={employee.houseHoldAddress}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.houseHoldAddress}</p>
                                                                )}
                                                            </dd>
                                                        </div>
                                                        <div className="flex flex-col pt-3">
                                                            <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">Địa chỉ tạm trú</dt>
                                                            <dd className="text-lg font-semibold">
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        name="currentAddress"
                                                                        value={employee.currentAddress}
                                                                        onChange={handleChange}
                                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                                    />
                                                                ) : (
                                                                    <p className="text-lg font-semibold">{employee.currentAddress}</p>
                                                                )}
                                                            </dd>
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
