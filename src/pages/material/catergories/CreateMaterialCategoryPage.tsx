import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { MaterialCategory } from "@/models/MaterialCategory";
import { useEffect, useState } from "react";
import { createMaterialCategory, deleteMaterialCategory, getAllMaterialCategory, updateMaterialCategory } from "@/services/material/materialCategoryService";

function CreateMaterialCategoryPage() {

    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [categories, setCategories] = useState<MaterialCategory[]>([]);
    const [category, setMaterialCategory] = useState<MaterialCategory>({
        name: '',
        code: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMaterialCategory((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handleEdit = (category: MaterialCategory) => {
        setMaterialCategory({
            name: category.name,
            code: category.code,
            description: category.description,
        });
        setEditingCategoryId(category.id || null);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMaterialCategory(id);
            alert("Xóa loại vật tư thành công!");
            const data = await getAllMaterialCategory();
            setCategories(data || []);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại!");
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!category.name || !category.code) {
                alert("Vui lòng nhập đầy đủ thông tin!");
                return;
            }

            if (editingCategoryId) {
                await updateMaterialCategory(editingCategoryId, category);
                alert("Cập nhật loại vật tư thành công!");
            } else {
                await createMaterialCategory(category);
                alert("Thêm loại vật tư thành công!");
            }

            setMaterialCategory({ name: "", code: "", description: "" });
            setEditingCategoryId(null);

            const data = await getAllMaterialCategory();
            setCategories(data || []);
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đã xảy ra lỗi!");
        }
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllMaterialCategory();
                if (data) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

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
                                        <BreadcrumbPage>Quản lý loại vật tư</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">Quản lý <span className="text-indigo-600">loại vật tư</span></h3>
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Loại vật tư</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={category.name}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mã loại vật tư</label>
                                            <input
                                                type="text"
                                                name="code"
                                                value={category.code}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mô tả</label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={category.description}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                                    <button type="submit" className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white">
                                        {editingCategoryId ? "Cập nhật" : "Thêm"}
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
                                {categories.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{category.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                                                <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                                <button onClick={() => category.id && handleDelete(category.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
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

export default CreateMaterialCategoryPage;