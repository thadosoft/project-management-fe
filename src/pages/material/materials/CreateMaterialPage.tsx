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
import { uploadMaterialImage, getImage } from "@/services/material/uploadFileService";
import { Table, Button, Space, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../../../css/CreateMaterialPage.module.css';

function CreateMaterialPage() {
    const [categories, setCategories] = useState<MaterialCategory[]>([]);
    const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

    const [material, setMaterial] = useState<Material>({
        name: "",
        sku: "",
        inventoryCategoryId: undefined,
        unit: "",
        quantityInStock: 0,
        location: "",
        purchasePrice: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const loadImage = async (materialId: number, accessUrl: string) => {
        try {
            const filename = accessUrl.split('/').pop();
            if (filename) {
                const blob = await getImage(filename);
                const objectUrl = URL.createObjectURL(blob);
                setImageUrls(prev => ({ ...prev, [materialId]: objectUrl }));
            }
        } catch (error) {
            console.error(`Error loading image for material ${materialId}:`, error);
        }
    };

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        if (!material.name) newErrors.name = "Tên vật tư không được để trống";
        if (!material.sku) newErrors.sku = "Mã serial không được để trống";
        if (!material.inventoryCategoryId) newErrors.category = "Loại vật tư không được để trống";
        if (!material.unit) newErrors.unit = "Đơn vị không được để trống";
        if (imageFile && !imageFile.type.startsWith("image/")) {
            newErrors.image = "Chỉ chấp nhận file hình ảnh";
        }
        if (imageFile && imageFile.size > 10 * 1024 * 1024) {
            newErrors.image = "Kích thước hình ảnh không được vượt quá 10MB";
        }

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa vật tư này không? Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteMaterial(id);
                    Modal.success({
                        title: 'Thành công',
                        content: 'Xóa vật tư thành công!',
                    });
                    const data = await getAllMaterial();
                    if (data) {
                        setMaterials(data);
                        data.forEach(material => {
                            if (material.id && material.images && material.images.length > 0) {
                                loadImage(material.id, material.images[0].accessUrl);
                            }
                        });
                    } else {
                        setMaterials([]);
                        setImageUrls({});
                    }
                } catch (error: any) {
                    console.error("Lỗi khi xóa:", error);
                    const errorMessage = error.response?.data?.message || error.message || "Không thể xóa vật tư!";
                    Modal.error({
                        title: 'Lỗi',
                        content: `Xóa thất bại: ${errorMessage}`,
                    });
                }
            },
        });
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
                        location: data.location || "",
                        purchasePrice: data.purchasePrice || 0,
                    });
                    setImageFile(null);
                    setImagePreview(null);
                    setEditingMaterialId(material.id);
                } else {
                    alert("Không tìm thấy vật tư!");
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
            location: material.location,
            purchasePrice: material.purchasePrice,
        };

        console.log("Payload gửi lên:", payload);

        try {
            let materialId: number;
            if (editingMaterialId) {
                await updateMaterial(editingMaterialId, payload);
                alert("Cập nhật vật tư thành công!");
                materialId = editingMaterialId;
            } else {
                const createdMaterial = await createMaterial(payload);
                if (!createdMaterial?.id) {
                    console.warn("createdMaterial thiếu id, thử lấy id từ API khác");
                    const allMaterials = await getAllMaterial();
                    const latestMaterial = allMaterials?.sort((a, b) => Number(b.id) - Number(a.id))[0];
                    materialId = latestMaterial ? Number(latestMaterial.id) : 0;
                    if (!materialId) {
                        throw new Error("Không thể lấy ID vật tư vừa tạo");
                    }
                } else {
                    materialId = Number(createdMaterial.id);
                }
                alert("Thêm vật tư thành công!");
            }

            if (imageFile) {
                const uploadResult = await uploadMaterialImage(imageFile, materialId);
                console.log("uploadMaterialImage result:", uploadResult);
                alert("Tải hình ảnh thành công!");
            }

            setMaterial({
                name: "",
                sku: "",
                inventoryCategoryId: undefined,
                unit: "",
                quantityInStock: 0,
                location: "",
                purchasePrice: 0,
            });
            setImageFile(null);
            setImagePreview(null);
            setEditingMaterialId(null);
            setErrors({});

            const data = await getAllMaterial();
            console.log("Dữ liệu sau khi làm mới:", JSON.stringify(data, null, 2));
            if (data) {
                setMaterials(data);
                data.forEach(material => {
                    if (material.id && material.images && material.images.length > 0) {
                        loadImage(material.id, material.images[0].accessUrl);
                    }
                });
            } else {
                setMaterials([]);
                setImageUrls({});
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật/thêm vật tư hoặc hình ảnh:", error);
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
                console.log("Materials:", JSON.stringify(data, null, 2));
                if (data) {
                    setMaterials(data);
                    data.forEach(material => {
                        if (material.id && material.images && material.images.length > 0) {
                            loadImage(material.id, material.images[0].accessUrl);
                        }
                    });
                } else {
                    setMaterials([]);
                }
            } catch (error) {
                console.error("Error fetching materials:", error);
            }
        };

        fetchCategories();
        fetchMaterials();

        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreview]);

    const columns: ColumnsType<Material> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'id',
            key: 'image',
            align: 'center',
            width: 120,
            render: (id) =>
                id && imageUrls[id] ? (
                    <img
                        src={imageUrls[id]}
                        alt="Material"
                        className="max-w-[80px] max-h-[80px] object-contain mx-auto"
                    />
                ) : (
                    <span className="text-gray-400">Không có hình</span>
                ),
        },
        {
            title: 'Tên vật tư',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 200,
        },
        {
            title: 'Serial',
            dataIndex: 'sku',
            key: 'sku',
            align: 'center',
            width: 150,
        },
        {
            title: 'Nhóm vật tư',
            dataIndex: 'inventoryCategory',
            key: 'category',
            align: 'center',
            width: 150,
            render: (category) => category?.name || 'N/A',
        },
        {
            title: 'Đơn vị',
            dataIndex: 'unit',
            key: 'unit',
            align: 'center',
            width: 100,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantityInStock',
            key: 'quantityInStock',
            align: 'center',
            width: 100,
        },
        {
            title: 'Nguồn gốc',
            dataIndex: 'location',
            key: 'location',
            align: 'center',
            width: 150,
        },
        {
            title: 'Giá mua',
            dataIndex: 'purchasePrice',
            key: 'purchasePrice',
            align: 'center',
            width: 150,
            render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: 120,
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 200,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        onClick={() => record.id && handleDelete(record.id)}
                        className="hover:bg-red-600"
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                        <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8 bg-gray-800">
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Tên vật tư</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={material.name || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Mã serial</label>
                                            <input
                                                type="text"
                                                name="sku"
                                                value={material.sku || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                            {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Nhóm vật tư</label>
                                            <select
                                                name="inventoryCategoryId"
                                                value={material.inventoryCategoryId ?? ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
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
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Đơn vị</label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={material.unit || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                            {errors.unit && <p className="text-red-500 text-sm">{errors.unit}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Số lượng</label>
                                            <input
                                                type="number"
                                                name="quantityInStock"
                                                value={material.quantityInStock || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Nguồn gốc</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={material.location || ""}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Giá mua</label>
                                            <input
                                                type="number"
                                                name="purchasePrice"
                                                value={material.purchasePrice || 0}
                                                onChange={handleInputChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1 text-gray-200">Hình ảnh</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light bg-white"
                                            />
                                            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-[200px] max-h-[200px] object-contain"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-600 flex justify-between">
                                    <button
                                        type="submit"
                                        className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white"
                                    >
                                        {editingMaterialId ? "Cập nhật" : "Thêm"}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <div className="mt-12">
                            <Table
                                columns={columns}
                                dataSource={materials}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                                bordered
                                className={`${styles.table} shadow-xl rounded-lg bg-gray-200 text-gray-900 border-2 border-gray-400`}
                                scroll={{ x: 'max-content' }}
                            />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default CreateMaterialPage;