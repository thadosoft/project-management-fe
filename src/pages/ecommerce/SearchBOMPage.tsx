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
import { useNavigate } from "react-router";
import { deleteBom, searchBom } from "@/services/ecommerce/bomService";
import { QuotationResponse, SearchQuotationRequest } from "@/models/Bom";
import { log } from "console";

function SearchBOMPage() {
    const [quotations, setQuotation] = useState<QuotationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    const navigate = useNavigate();

    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [searchParams, setSearchParams] = useState<SearchQuotationRequest>({
        title: "",
        requesterName: "",
        receiverName: "",
        startDate: today.toISOString().split("T")[0],
        endDate: endOfDay.toISOString().split("T")[0]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await searchBom(searchParams, page, size);
                if (result) {
                    setQuotation(result.content);
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
            const result = await searchBom(searchParams, page, size);
            if (result) {
                setQuotation(result.content);
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const handleViewDetail = (employeeId: number) => {
        navigate(`/update-bom/${employeeId}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };


    const handleDelete = async (employeeId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá báo giá này?")) return;

        try {
            await deleteBom(employeeId);
            setQuotation((prevEmployees) => prevEmployees.filter(emp => emp.id !== employeeId));
            alert("Xoá báo giá thành công!");
        } catch (error) {
            console.error("Lỗi khi xoá báo giá:", error);
            alert("Xoá báo giá thất bại!");
        }
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-SearchBOMPageer:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/home">
                                            Thông tin báo giá
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Tìm kiếm báo giá</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-6">
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <h2 className="sm:text-xl text-[12px] font-bold mb-6">Tìm kiếm thông tin phiếu báo giá</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tiêu đề</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={searchParams.title}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                placeholder="Nguyễn Trung Dũng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Người báo giá</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={searchParams.requesterName}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                placeholder="Nguyễn Trung Dũng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Người nhận báo giá</label>
                                            <input
                                                type="text"
                                                name="career"
                                                value={searchParams.receiverName}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                placeholder="Nguyễn Trung Dũng"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Từ ngày</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={searchParams.startDate}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Đến ngày</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={searchParams.endDate}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
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
                        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center text-gray-500">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Người báo giá</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Người nhận báo giá</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 text-center">
                                {quotations.map((quota, index) => (
                                    <tr key={quota.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{page * size + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{quota.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{quota.requesterName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{quota.receiverName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{new Date(quota.createdAt).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a onClick={() => handleViewDetail(quota.id)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">Xem chi tiết</a>
                                            <a onClick={() => handleDelete(quota.id)} className="text-red-600 hover:text-red-900 ml-4 cursor-pointer">Xoá</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                disabled={page === 0}
                                className="px-4 py-2 mx-1 bg-gray-500 text-white rounded disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-4 py-2">{page + 1} / {totalPages}</span>
                            <button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                                disabled={page >= totalPages - 1}
                                className="px-4 py-2 mx-1 bg-gray-500 text-white rounded disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default SearchBOMPage;
