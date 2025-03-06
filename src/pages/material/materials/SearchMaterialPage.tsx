import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { useEffect, useState } from "react";
import { deleteMaterial, getAllMaterial, searchMaterials } from "@/services/material/materialService";
import { Material } from "@/models/Material";

function SearchMaterialPage() {

    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [searchRequest, setSearchRequest] = useState({
        name: "",
        sku: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await searchMaterials(searchRequest, page, size);
            if (result) {
                setMaterials(result.content);
                setTotalPages(result.totalPages);
            }
        } catch (error) {
            console.error("Error searching materials:", error);
        }
    };

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const data = await searchMaterials(searchRequest, page, size);
                if (data) {
                    setMaterials(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };
        fetchMaterials();
    }, [page, size]);


    const handleDelete = async (id: number) => {
        try {
            await deleteMaterial(id);
            alert("Xóa loại vật tư thành công!");
            const data = await searchMaterials(searchRequest, page, size);
            setMaterials(data.content);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại!");
        }
    };

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrProjectPageer:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/home">
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Tìm kiếm vật tư</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">Tìm kiếm <span className="text-indigo-600">vật tư</span></h3>
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <form onSubmit={handleSearch}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tên vật tư</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={searchRequest.name}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mã vật tư</label>
                                            <input
                                                type="text"
                                                name="sku"
                                                value={searchRequest.sku}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                                    <button type="submit" className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white">
                                        Tìm kiếm
                                    </button>
                                </div>
                            </form>
                        </section>

                        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center text-black">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên vật tư
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã vật tư - SKU
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại vật tư
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn vị
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số lượng cảnh báo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vị trí
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá mua
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá bán
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {materials.map((material, index) => (
                                    <tr key={material.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{page * size + index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.inventoryCategory.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.unit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.quantityInStock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.reorderLevel}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.purchasePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.sellingPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material?.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                                            <button onClick={() => material?.id && handleDelete(material.id)} className="text-red-600 hover:text-red-900 ml-4">Xoá</button>
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

export default SearchMaterialPage;