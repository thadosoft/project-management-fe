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
import { EmployeeRequest } from "@/models/EmployeeRequest";
import { addEmployee } from "@/services/employee/EmployeeService";
import { useNavigate } from "react-router";

function CreateEmployeePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const [image, setImage] = useState<string>("https://randomuser.me/api/portraits/women/21.jpg");

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
                setEmployee((prevEmployee) => ({
                    ...prevEmployee,
                    avatar: base64String,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        if (!employee.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
        if (!employee.username.trim()) newErrors.username = "Username không được để trống";
        if (!employee.email.trim()) newErrors.email = "Email không được để trống";
        if (!employee.gender.trim()) newErrors.gender = "Giới tính không được để trống";
        if (!employee.career.trim()) newErrors.career = "Phân hệ không được để trống";
        if (!employee.placeOfBirth.trim()) newErrors.placeOfBirth = "Ngày sinh không được để trống";
        if (!employee.nation.trim()) newErrors.nation = "Quốc gia không được để trống";
        if (!employee.companyEmail.trim()) newErrors.companyEmail = "Email công ty không được để trống";
        if (!employee.tax.trim()) newErrors.tax = "Mã số thuế không được để trống";
        if (!employee.houseHoldAddress.trim()) newErrors.houseHoldAddress = "Địa chỉ thường trú không được để trống";
        if (!employee.currentAddress.trim()) newErrors.currentAddress = "Địa chỉ tạm trú không được để trống";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };


    const [employee, setEmployee] = useState<EmployeeRequest>({
        username: "",
        avatar: "",
        fullName: "",
        career: "",
        placeOfBirth: new Date().toISOString().split("T")[0],
        nation: "",
        gender: "",
        tax: "",
        email: "",
        phone: "",
        companyEmail: "",
        emergencyContact: "",
        houseHoldAddress: "",
        currentAddress: "",
        description: ""
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.log("Change detected:", event.target.name, event.target.value);
        setEmployee({ ...employee, [event.target.name]: event.target.value });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.warn("Có lỗi nhập liệu");
            return;
        }

        try {
            await addEmployee(employee);
            navigate("/search-employee");
        } catch (error) {
            console.error("Lỗi khi thêm nhân viên:", error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-CreateEmployeePageer:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/create-employee">
                                            Thông tin nhân viên
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Khởi tạo nhân viên</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="">
                        <div className="border rounded-lg shadow relative m-10">

                            <div className="flex items-start justify-between p-5 border-b rounded-t">
                                <h3 className="text-xl font-semibold">
                                    Khởi tạo nhân viên
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="product-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col items-center">
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <img
                                                className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                                                src={image}
                                                alt="Profile"
                                            />
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Họ và tên</label>
                                            <input type="text" name="fullName" value={employee.fullName} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Nguyễn Trung Dũng" />
                                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Username</label>
                                            <input type="text" name="username" value={employee.username} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="dungnt" />
                                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Phân hệ</label>
                                            <input type="text" name="career" value={employee.career} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Kỹ thuật" />
                                            {errors.career && <p className="text-red-500 text-sm">{errors.career}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Ngày sinh</label>
                                            <input type="date" name="placeOfBirth" value={employee.placeOfBirth} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="09/11/2001" />
                                            {errors.placeOfBirth && <p className="text-red-500 text-sm">{errors.placeOfBirth}</p>}
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium block mb-2">Giới tính</label>
                                            <select
                                                name="gender"
                                                value={employee.gender}
                                                onChange={handleChange}
                                                className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </select>
                                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Email</label>
                                            <input type="email" name="email" value={employee.email} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="dung.nt@thadosoft.com" />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Quốc gia</label>
                                            <input type="text" name="nation" value={employee.nation} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Việt Nam" />
                                            {errors.nation && <p className="text-red-500 text-sm">{errors.nation}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Email Công ty</label>
                                            <input type="text" name="companyEmail" value={employee.companyEmail} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="dung.nt@thadosoft.com" />
                                            {errors.companyEmail && <p className="text-red-500 text-sm">{errors.companyEmail}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Mã số thuế</label>
                                            <input type="text" name="tax" value={employee.tax} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="123" />
                                            {errors.tax && <p className="text-red-500 text-sm">{errors.tax}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Liên hệ khẩn cấp</label>
                                            <input type="text" name="emergencyContact" value={employee.emergencyContact} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Nguyễn Trung Dũng - 0942597170" />
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Địa chỉ thường trú</label>
                                            <input type="text" name="houseHoldAddress" value={employee.houseHoldAddress} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Tầng 2, Nhà Số 30 Đường Số 1, Khu Nhà Ở Hưng Phú, Khu Phố 1, Phường Tam Phú, Thành Phố Thủ Đức, Tp Hồ Chí Minh" />
                                            {errors.houseHoldAddress && <p className="text-red-500 text-sm">{errors.houseHoldAddress}</p>}
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label className="text-sm font-medium  block mb-2">Địa chỉ tạm trú</label>
                                            <input type="text" name="currentAddress" value={employee.currentAddress} onChange={handleChange} className="shadow-sm border-gray-300 text-black sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Tầng 2, Nhà Số 30 Đường Số 1, Khu Nhà Ở Hưng Phú, Khu Phố 1, Phường Tam Phú, Thành Phố Thủ Đức, Tp Hồ Chí Minh" />
                                            {errors.currentAddress && <p className="text-red-500 text-sm">{errors.currentAddress}</p>}
                                        </div>
                                        <div className="col-span-full">
                                            <label className="text-sm font-medium  block mb-2">Mô tả</label>
                                            <textarea value={employee.description} name="description" onChange={handleChange} className="border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4 text-black" placeholder="Tầng 2, Nhà Số 30 Đường Số 1, Khu Nhà Ở Hưng Phú, Khu Phố 1, Phường Tam Phú, Thành Phố Thủ Đức, Tp Hồ Chí Minh"></textarea>
                                        </div>
                                        <div className="p-6 border-t border-gray-200 rounded-b">
                                            <button className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Save all</button>
                                        </div>
                                    </div>
                                </form>
                            </div>


                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default CreateEmployeePage
