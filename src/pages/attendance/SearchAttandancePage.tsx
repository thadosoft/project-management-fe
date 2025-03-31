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
import { getPeriods } from "@/services/periodService";
import { useNavigate } from "react-router";

function SearchAttandancePage() {
    const [attendances, setAttendance] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await getPeriods();
                if (data) {
                    setAttendance(data);
                }
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };
        fetchMaterials();
    }, []);


    const handleViewDetail = (employeeId: number) => {
        navigate(`/attandance-month-detail/${employeeId}`);
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrSearchAttandancePageer:h-12">
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
                                        <BreadcrumbPage>Bảng chấm công</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">Tìm kiếm bảng <span className="text-indigo-600">chấm công</span></h3>

                        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center text-black">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Năm
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tháng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Từ ngày
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đến ngày
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendances.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.month}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.startDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.endDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a onClick={() => handleViewDetail(item.id)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">Xem chi tiết</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default SearchAttandancePage
