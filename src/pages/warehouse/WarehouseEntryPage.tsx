import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { InventoryTransactionResponse } from "@/models/Warehouse";
import { getAllMaterial } from "@/services/material/materialService";
import { creatInventoryTransaction, getInventoryTransactionByProjectId, updateInventoryTransaction } from "@/services/warehouse/warehouseEntryService";
import { Material } from "@/models/Material";


function WarehouseEntryPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = !!id;
    const [isEditing, setIsEditing] = useState(!isUpdate);
    const [loading, setLoading] = useState(false);
    const [existingData, setExistingData] = useState<InventoryTransactionResponse | null>(null);
    const [originalBom, setOriginalBom] = useState<InventoryTransactionResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [bom, setBom] = useState<InventoryTransactionResponse>({
        id: 0,
        itemId: 0,
        transactionType: "NK",
        itemName: "",
        quantity: 0,
        transactionDate: new Date().toISOString().slice(0, 10),
        reason: "",
        processedBy: "",
        receiver: "",
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setBom({ ...bom, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            getInventoryTransactionByProjectId(Number(id))
                .then((data) => {
                    if (data) {
                        setSearchTerm(data.itemName || "");
                        setExistingData(data);
                        setBom({
                            ...data,
                            transactionDate: new Date(Number(data.transactionDate) * 1000).toISOString().slice(0, 10)
                        });
                        setOriginalBom(data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching inventory data:", error);
                    alert("Failed to load inventory data");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};

        if (!bom.itemId || bom.itemId <= 0) newErrors.itemId = "Vui lòng chọn vật tư hợp lệ";
        if (!bom.quantity || bom.quantity <= 0) newErrors.quantity = "Số lượng không được để trống";
        if (!bom.transactionType) newErrors.transactionType = "Loại không được để trống";
        if (!bom.transactionDate) newErrors.transactionDate = "Ngày không được để trống";
        if (!bom.processedBy.trim()) newErrors.processedBy = "Người gửi không được để trống";
        if (!bom.receiver.trim()) newErrors.receiver = "Người nhận không được để trống";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            console.warn("Có lỗi nhập liệu");
            return;
        }

        try {
            setLoading(true);
            const dataToSubmit = {
                itemId: bom.itemId,
                transactionType: bom.transactionType,
                quantity: bom.quantity,
                transactionDate: bom.transactionDate,
                reason: bom.reason,
                processedBy: bom.processedBy,
                receiver: bom.receiver,
            };

            if (existingData?.id) {
                // UPDATE
                const response = await updateInventoryTransaction(existingData.id, dataToSubmit);
                if (response) {
                    alert("Inventory Transaction updated successfully!");
                    setOriginalBom({ ...bom });
                }
            } else {
                // CREATE
                const response = await creatInventoryTransaction(dataToSubmit); // bỏ id
                if (response) {
                    alert("Inventory Transaction added successfully!");
                    navigate("/search-warehouse");
                }
            }

            setIsEditing(false);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 2) {
            getAllMaterial().then((materials) => {
                const filtered = materials?.filter((m) =>
                    m.name.toLowerCase().includes(term.toLowerCase())
                ) ?? [];

                setFilteredMaterials(filtered);
            });
        } else {
            setFilteredMaterials([]);
        }
    };

    const handleSelect = (material: { id: number; name: string }) => {
        setBom({
            ...bom,
            itemId: material.id,
            itemName: material.name // Make sure to update itemName in the state
        });
        setSearchTerm(material.name);
        setFilteredMaterials([]);
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
                                            Tổng quan
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Xuất kho</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    {loading ? (
                        <div className="flex justify-center items-center p-20">
                            <div className="text-2xl text-white">Loading...</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="p-10">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight">
                                        {isUpdate ? "Cập nhật" : "Tạo mới"} phiếu <span className="text-indigo-600">nhập kho</span>
                                    </h3>
                                    <div>
                                        {isUpdate && !isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleEdit}
                                                className="hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Cập nhật
                                            </button>
                                        )}

                                        {isEditing && (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                            >
                                                Lưu
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                                    <div className="space-y-6">
                                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                                            <div className="relative">
                                                <label className="text-xs xs:text-sm font-medium mb-1">Vật tư</label>

                                                {bom.itemId ? (
                                                    <div className="h-[50px] rounded-[5px] text-xs xs:text-sm border border-[#D1D5DB] w-full px-2 pl-4 font-light flex items-center justify-between text-white">
                                                        <span className="border border-green-500 rounded-md p-2">{searchTerm}</span>
                                                        {isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setBom({ ...bom, itemId: 0, itemName: "" });
                                                                    setSearchTerm('');
                                                                }}
                                                                className="text-red-500 border border-red-500 p-2 rounded-[5px]"
                                                            >
                                                                Xóa
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm kiếm vật tư..."
                                                        value={searchTerm}
                                                        onChange={handleSearch}
                                                        disabled={!isEditing}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                    />
                                                )}

                                                {filteredMaterials.length > 0 && !bom.itemId && (
                                                    <ul className="absolute z-50 bg-gray-300 border w-full mt-1 max-h-40 overflow-y-auto rounded-md">
                                                        {filteredMaterials.map((material) => (
                                                            <li
                                                                key={material.id}
                                                                onClick={() =>
                                                                    handleSelect({ id: material.id!, name: `${material.name} (${material.sku})` })
                                                                }
                                                                className="p-2 cursor-pointer hover:bg-gray-200 text-black"
                                                            >
                                                                {material.name} <span className="text-sm text-gray-600">({material.sku})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {errors.itemId && <p className="text-red-500 text-sm">{errors.itemId}</p>}
                                            </div>

                                            <div>
                                                <label className="text-xs xs:text-sm font-medium mb-1">Số lượng</label>

                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        value={bom.quantity}
                                                        onChange={handleChange}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                    />
                                                ) : (
                                                    <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.quantity}</p>
                                                )}
                                                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs xs:text-sm font-medium mb-1">Loại</label>

                                                {isEditing ? (
                                                    <select name="transactionType" value={bom.transactionType} onChange={handleChange}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light">
                                                        <option value="NK">Nhập kho</option>
                                                        <option value="XK">Xuất kho</option>
                                                    </select>
                                                ) : (
                                                    <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">
                                                        {bom.transactionType === "NK" ? "Nhập kho" : "Xuất kho"}
                                                    </p>
                                                )}
                                                {errors.transactionType && <p className="text-red-500 text-sm">{errors.transactionType}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs xs:text-sm font-medium mb-1">Ngày nhập/xuất</label>
                                                {isEditing ? (
                                                    <input
                                                        type="date"
                                                        name="transactionDate"
                                                        value={bom.transactionDate}
                                                        onChange={handleChange}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                    />
                                                ) : (
                                                    <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.transactionDate}</p>
                                                )}
                                                {errors.transactionDate && <p className="text-red-500 text-sm">{errors.transactionDate}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs xs:text-sm font-medium mb-1">Người gửi</label>

                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="processedBy"
                                                        value={bom.processedBy}
                                                        onChange={handleChange}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                    />
                                                ) : (
                                                    <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.processedBy}</p>
                                                )}
                                                {errors.processedBy && <p className="text-red-500 text-sm">{errors.processedBy}</p>}
                                            </div>
                                            <div>
                                                <label className="text-xs xs:text-sm font-medium mb-1">Người nhận</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="receiver"
                                                        value={bom.receiver}
                                                        onChange={handleChange}
                                                        className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                    />
                                                ) : (
                                                    <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiver}</p>
                                                )}
                                                {errors.receiver && <p className="text-red-500 text-sm">{errors.receiver}</p>}
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs xs:text-sm font-medium mb-1">Lý do / Mô tả</label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="reason"
                                                        value={bom.reason}
                                                        onChange={handleChange}
                                                        className="h-[150px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full p-4 font-light"
                                                    ></textarea>
                                                ) : (
                                                    <p className="min-h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.reason}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </form>
                    )}
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default WarehouseEntryPage;