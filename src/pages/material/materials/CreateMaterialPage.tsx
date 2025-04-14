import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { Material } from "@/models/Material";
import { useEffect, useState } from "react";
import { createMaterial, deleteMaterial, getAllMaterial, getMaterialById, updateMaterial } from "@/services/material/materialService";
import { getAllMaterialCategory } from "@/services/material/materialCategoryService";
import { MaterialCategory } from "@/models/MaterialCategory";

function CreateMaterialPage() {
    const [categories, setCategories] = useState<MaterialCategory[]>([]);
    const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [material, setMaterial] = useState<Material>({
        name: "",
        sku: "",
        inventoryCategoryId: undefined,
        unit: "",
        quantityInStock: 0,
        reorderLevel: 0,
        location: "",
        purchasePrice: 0,
        sellingPrice: 0,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        if (!material.name) newErrors.name = "Tên vật tư không được để trống";
        if (!material.sku) newErrors.sku = "Mã vật tư không được để trống";
        if (!material.inventoryCategoryId) newErrors.category = "Loại vật tư không được để trống";
        if (!material.unit) newErrors.unit = "Đơn vị không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMaterial((prev) => ({
            ...prev,
            [name]: name === "inventoryCategoryId" ? Number(value) : value,
        }));
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMaterial(id);
            alert("Xóa vật tư thành công!");
            const data = await getAllMaterial();
            setMaterials(data || []);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Xóa thất bại!");
        }
    };

    const handleEdit = async (material: Material) => {
        if (material.id) {
            try {
                const data = await getMaterialById(material.id);
                if (data) {
                    setMaterial({
                        name: data.name || "",
                        sku: data.sku || "",
                        inventoryCategoryId: data.inventoryCategory?.id || undefined,
                        unit: data.unit || "",
                        quantityInStock: data.quantityInStock || 0,
                        reorderLevel: data.reorderLevel || 0,
                        location: data.location || "",
                        purchasePrice: data.purchasePrice || 0,
                        sellingPrice: data.sellingPrice || 0,
                    });
                    setEditingMaterialId(material.id);
                }
            } catch (error) {
                console.error("Lỗi khi lấy vật tư:", error);
                alert("Không thể lấy thông tin vật tư!");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.warn("Có lỗi nhập liệu");
            return;
        }

        const payload = {
            name: material.name,
            sku: material.sku,
            inventoryCategoryId: material.inventoryCategoryId,
            unit: material.unit,
            quantityInStock: material.quantityInStock,
            reorderLevel: material.reorderLevel,
            location: material.location,
            purchasePrice: material.purchasePrice,
            sellingPrice: material.sellingPrice,
        };

        console.log("Payload gửi lên:", payload);

        try {
            if (editingMaterialId) {
                await updateMaterial(editingMaterialId, payload);
                alert("Cập nhật vật tư thành công!");
            } else {
                await createMaterial(material);
                alert("Thêm vật tư thành công!");
            }

            // Reset form
            setMaterial({
                name: "",
                sku: "",
                inventoryCategoryId: undefined,
                unit: "",
                quantityInStock: 0,
                reorderLevel: 0,
                location: "",
                purchasePrice: 0,
                sellingPrice: 0,
            });
            setEditingMaterialId(null);
            setErrors({});

            // Làm mới danh sách vật tư
            const data = await getAllMaterial();
            console.log("Dữ liệu sau khi làm mới:", data);
            setMaterials(data || []);
        } catch (error) {
            console.error("Lỗi khi cập nhật/thêm vật tư:", error);
            alert("Đã xảy ra lỗi!");
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllMaterialCategory();
            if (data) {
                setCategories(data);
            }
        };

        const fetchMaterials = async () => {
            try {
                const data = await getAllMaterial();
                if (data) {
                    setMaterials(data);
                }
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };

        fetchCategories();
        fetchMaterials();
    }, []);

    return (
        // ... Phần JSX không thay đổi, giữ nguyên như mã bạn đã cung cấp
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
                                        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Quản lý vật tư</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-10">
                        <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">
                            Quản lý <span className="text-indigo-600">vật tư</span>
                        </h3>
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tên vật tư</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={material.name || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Mã vật tư</label>
                                            <input
                                                type="text"
                                                name="sku"
                                                value={material.sku || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Loại vật tư</label>
                                            <select
                                                name="inventoryCategoryId"
                                                value={material.inventoryCategoryId ?? ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Đơn vị</label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={material.unit || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                            {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Số lượng</label>
                                            <input
                                                type="number"
                                                name="quantityInStock"
                                                value={material.quantityInStock || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Số lượng cảnh báo</label>
                                            <input
                                                type="number"
                                                name="reorderLevel"
                                                value={material.reorderLevel || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Vị trí</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={material.location || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Giá mua</label>
                                            <input
                                                type="number"
                                                name="purchasePrice"
                                                value={material.purchasePrice || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Giá bán</label>
                                            <input
                                                type="number"
                                                name="sellingPrice"
                                                value={material.sellingPrice || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white"
                                    >
                                        {editingMaterialId ? "Cập nhật" : "Thêm"}
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
                                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.inventoryCategory?.name || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.unit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.quantityInStock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.reorderLevel}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.purchasePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.sellingPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{material.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                                            <button
                                                onClick={() => handleEdit(material)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => material.id && handleDelete(material.id)}
                                                className="text-red-600 hover:text-red-900 ml-4"
                                            >
                                                Xoá
                                            </button>
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

export default CreateMaterialPage;