import { ThemeProvider } from "@/components/theme-provider.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb.tsx";
import { CreateBOM, MaterialQuotationRequest } from "@/models/Bom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { addBom, getBomById, printBOMPDF, updateBom } from "@/services/ecommerce/bomService";


function CreateBOMPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isUpdate = !!id;
    const [errors, _] = useState<{ [key: string]: string }>({});
    const [isEditing, setIsEditing] = useState(!isUpdate);
    const [loading, setLoading] = useState(false);
    const [existingData, setExistingData] = useState<CreateBOM | null>(null);
    const [originalBom, setOriginalBom] = useState<CreateBOM | null>(null);
    const [bom, setBom] = useState<CreateBOM>({
        title: "",
        requesterName: "",
        requesterEmail: "",
        requesterTel: "",
        requesterAddress: "",
        requesterWebsite: "",
        receiverName: "",
        receiverEmail: "",
        receiverTel: "",
        receiverAddress: "",
        receiverWebsite: "",
        materialQuotations: [],
    });

    const addMaterial = () => {
        const newMaterial: MaterialQuotationRequest = {
            code: "",
            description: "",
            unit: "",
            quantity: "",
            deliveryDate: "",
            price: "",
            tax: "",
            priceNoTax: "",
            priceTax: "",
            totalPrice: "",
            isSaved: false,
        };

        setBom((prevBom) => ({
            ...prevBom,
            materialQuotations: [...prevBom.materialQuotations, newMaterial],
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setBom({ ...bom, [event.target.name]: event.target.value });
    };

    useEffect(() => {
        if (id) {
            getBomById(Number(id)).then((data) => {
                if (data) {
                    setExistingData(data);
                    setBom(data);
                    setOriginalBom(data);
                }
            });
        }
    }, [id]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (existingData?.id) {
                if (JSON.stringify(bom) !== JSON.stringify(originalBom)) {
                    const response = await updateBom(existingData.id, bom);
                    if (response) {
                        alert("BOM updated successfully!");
                        setOriginalBom(bom);
                        navigate("/search-bom");
                    }
                } else {
                    alert("Không có thay đổi nào để lưu.");
                }
            } else {
                const response = await addBom(bom);
                if (response) {
                    alert("BOM added successfully!");
                    setOriginalBom(bom);
                    navigate("/search-bom");
                }
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveMaterial = (index: any) => {
        setBom((prevBom) => {
            const updatedMaterials = [...prevBom.materialQuotations];
            updatedMaterials[index].isSaved = true;
            return { ...prevBom, materialQuotations: updatedMaterials };
        });
    };

    const removeMaterial = (index: any) => {
        setBom((prevBom) => {
            const updatedMaterials = prevBom.materialQuotations.filter((_, i) => i !== index);
            return { ...prevBom, materialQuotations: updatedMaterials };
        });
    };

    const updateMaterial = (index: number, field: keyof MaterialQuotationRequest, value: string | number) => {
        setBom((prevBom) => {
            const updatedMaterials = [...prevBom.materialQuotations];
            updatedMaterials[index] = {
                ...updatedMaterials[index],
                [field]: value,
            };
            return { ...prevBom, materialQuotations: updatedMaterials };
        });
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
                                        <BreadcrumbPage>Phiếu báo giá</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <form>
                        <div className="p-10">
                            <div className="flex justify-between items-center">
                                <h3 className="text-3xl mb-8 sm:text-5xl leading-normal font-extrabold tracking-tight text-white">{isUpdate ? "Cập nhật" : "Tạo mới"} phiếu báo <span className="text-indigo-600">giá</span></h3>
                                <div>
                                    {isUpdate && !isEditing && (
                                        <a onClick={() => bom.id && printBOMPDF(bom.id, bom.title)} className="cursor-pointer hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded mr-4">
                                            In phiếu báo giá
                                        </a>
                                    )}
                                    {isUpdate && !isEditing && (
                                        <button onClick={handleEdit} className=" hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded">
                                            Cập nhật
                                        </button>
                                    )}

                                    {isEditing && (
                                        <button onClick={handleSubmit} disabled={!isEditing} className="bg-green-500 text-white px-4 py-2 rounded">
                                            Lưu
                                        </button>
                                    )}
                                </div>
                            </div>
                            <section className="mx-auto border border-[#4D7C0F] rounded-lg p-8">
                                <div className="space-y-6">
                                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
                                        <div className="col-span-2">
                                            <label className="text-xs xs:text-sm font-medium mb-1">Tiêu đề</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={bom.title}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.title}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Người báo giá</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="requesterName"
                                                    value={bom.requesterName}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.requesterName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Người nhận báo giá</label>

                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="receiverName"
                                                    value={bom.receiverName}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiverName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Email</label>

                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="requesterEmail"
                                                    value={bom.requesterEmail}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.requesterEmail}</p>
                                            )}
                                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Email nhận báo giá</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="receiverEmail"
                                                    value={bom.receiverEmail}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiverEmail}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">SĐT</label>

                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="requesterTel"
                                                    value={bom.requesterTel}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.requesterTel}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">SĐT nhận báo giá</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="receiverTel"
                                                    value={bom.receiverTel}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiverTel}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Địa chỉ(Address)</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="requesterAddress"
                                                    value={bom.requesterAddress}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.requesterAddress}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Địa chỉ nhận báo giá(Address)</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="receiverAddress"
                                                    value={bom.receiverAddress}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiverAddress}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Website</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="requesterWebsite"
                                                    value={bom.requesterWebsite}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.requesterWebsite}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-xs xs:text-sm font-medium mb-1">Website nhận báo giá</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="receiverWebsite"
                                                    value={bom.receiverWebsite}
                                                    onChange={handleChange}
                                                    className="h-[50px] rounded-[5px] text-xs xs:text-sm border text-black border-[#D1D5DB] w-full px-2 pl-4 font-light"
                                                />
                                            ) : (
                                                <p className="h-[50px] flex items-center justify-start rounded-[5px] text-xs xs:text-sm border text-white border-[#D1D5DB] w-full px-2 pl-4 font-light">{bom.receiverWebsite}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {isEditing && (
                                <div onClick={addMaterial} className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                                    <button type="button" className="bg-[#4D7C0F] hover:bg-[#79ac37] rounded-[5px] p-[13px_25px] text-white">
                                        Thêm
                                    </button>
                                </div>
                            )}

                            <div className="w-full overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 overflow-x-auto mt-12 text-center text-black">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                STT
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mã hàng
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mô tả
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Đơn vị tính
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Số lượng
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thời gian giao hàng
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Đơn giá
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thuế
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thành tiền chưa thuế GTGT
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tiền thuế GTGT
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tổng thành tiền <br></br> (VNĐ)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                #
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bom.materialQuotations.map((material, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="text"
                                                            value={material.code}
                                                            onChange={(e) => updateMaterial(index, "code", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.code
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="text"
                                                            value={material.description}
                                                            onChange={(e) => updateMaterial(index, "description", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.description
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="text"
                                                            value={material.unit}
                                                            onChange={(e) => updateMaterial(index, "unit", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.unit
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.quantity}
                                                            onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.quantity
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="date"
                                                            value={material.deliveryDate}
                                                            onChange={(e) => updateMaterial(index, "deliveryDate", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.deliveryDate
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.price}
                                                            onChange={(e) => updateMaterial(index, "price", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.price
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.tax}
                                                            onChange={(e) => updateMaterial(index, "tax", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.tax
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.priceNoTax}
                                                            onChange={(e) => updateMaterial(index, "priceNoTax", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.priceNoTax
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.priceTax}
                                                            onChange={(e) => updateMaterial(index, "priceTax", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.priceTax
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing && !material.isSaved ? (
                                                        <input className="px-2 py-1 rounded-md border border-gray-300"
                                                            type="number"
                                                            value={material.totalPrice}
                                                            onChange={(e) => updateMaterial(index, "totalPrice", e.target.value)}
                                                        />
                                                    ) : (
                                                        material.totalPrice
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {isEditing ? (
                                                        !material.isSaved ? (
                                                            <button type="button" onClick={() => saveMaterial(index)} className="bg-green-500 text-white px-2 py-1 rounded">
                                                                Lưu
                                                            </button>
                                                        ) : (
                                                            <button type="button" onClick={() => removeMaterial(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                                                                Xóa
                                                            </button>
                                                        )
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default CreateBOMPage;