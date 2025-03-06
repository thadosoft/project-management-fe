import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { useState } from "react";
import { SearchMaterialCategory } from "@/models/MaterialCategory";

function SearchMaterialCategoryPage() {

    const [catergory, setSearchMaterialCategory] = useState<SearchMaterialCategory>({
        name: '',
        code: '',
        description: ''
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchMaterialCategory((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
    };


    const handleSearch = async () => {
        try {

        } catch (error) {
            console.error("Error during search:", error);
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
                                        <BreadcrumbLink href="/">
                                            Home
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Tìm kiếm loại vật tư</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Loại vật tư</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={catergory.name}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mã loại vật tư</label>
                                            <input
                                                type="text"
                                                name="career"
                                                value={catergory.code}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mô tả</label>
                                            <input
                                                type="text"
                                                name="career"
                                                value={catergory.description}
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

                        <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại vật tư
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã vật tư
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        #
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">1</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Camera</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">CAM</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Mô tả ngắn
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                                        <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default SearchMaterialCategoryPage;