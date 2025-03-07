import { useParams } from "react-router-dom";
import { ThemeProvider } from "../theme-provider";
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
import { getByProfileReferenceId } from "@/services/reference-profile/profileReferenceService";
import { downloadFile, uploadFile } from "@/services/reference-profile/uploadFIleService";
import { createReferenceProfileLink } from "@/services/reference-profile/profileReferenceLinkService";
import { ReferenceLinkRequest } from "@/models/ReferenceLinkRequest";
import other from "@/assets/imgs/other.png";

function ReferenceProfileDetail() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const { id } = useParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [newLink, setNewLink] = useState<string>("");
    const [newDescription, setNewDescription] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Vui lòng chọn một file!");
            return;
        }

        if (!id) {
            setMessage("Không tìm thấy ID hồ sơ!");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const response = await uploadFile(Number(id), selectedFile);
            setMessage("Upload thành công!");

            setSelectedFile(null);

            fetchData();
        } catch (error) {
            setMessage("Lỗi khi upload file!");
        } finally {
            setUploading(false);
        }
    };


    const fetchData = async () => {
        try {
            setLoading(true);
            if (id) {
                const data = await getByProfileReferenceId(Number(id));
                setProfile(data);
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };


    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newLink.trim() || !id) {
            setMessage("Vui lòng nhập liên kết hợp lệ!");
            return;
        }

        try {
            const request: ReferenceLinkRequest = {
                referenceProfile: Number(id),
                link: newLink,
                description: newDescription,
            };

            await createReferenceProfileLink(request);
            setMessage("Thêm liên kết thành công!");

            setNewLink("");
            setNewDescription("");

            fetchData();
        } catch (error) {
            setMessage("Lỗi khi thêm liên kết!");
        }
    };
    const handleDownload = async (fileId: number, fileName: string) => {
        await downloadFile(fileId, fileName);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (id) {
                    const data = await getByProfileReferenceId(Number(id));
                    setProfile(data);
                }
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="p-4">
                        <h1 className="font-bold text-2xl">
                            Thư mục tham khảo phân hệ: {profile?.title}
                        </h1>
                        <div className="flex justify-between">
                            <div className="w-2/5 mx-auto my-5 py-12 bg-gray-400  rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                                <div className="grid gap-1">
                                    <h2 className="text-center text-gray-400 text-xs leading-4">
                                        PNG, JPG hoặc PDF, nhỏ hơn 15MB
                                    </h2>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-center">
                                        <label>
                                            <input type="file" hidden onChange={handleFileChange} accept=".png,.jpg,.pdf" />
                                            <div className="flex w-28 h-9 px-2 flex-col rounded-full text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                                                Chọn file
                                                <img src="https://cdn-icons-png.flaticon.com/512/4807/4807934.png" width="60px" className="mx-auto mt-6" alt="" />
                                            </div>
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <p className="text-center text-gray-700 mt-2 text-sm">
                                            <strong>File đã chọn:</strong> {selectedFile.name}
                                        </p>
                                    )}
                                    <div className="mx-auto">
                                        {selectedFile && (
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className={`py-3 px-4 rounded-md ${uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white mt-2`}
                                            >
                                                {uploading ? "Đang tải lên..." : "Tải lên"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="w-2/5 mx-auto my-5 py-12 bg-gray-400  rounded-2xl border border-gray-300 gap-3 grid border-dashed text-gray-700">
                                <div className="p-4 sm:p-7">
                                    <div className="text-center">
                                        <h1 className="block text-2xl font-bold">Liên kết tham khảo</h1>
                                    </div>

                                    <div className="mt-5">
                                        <form onSubmit={handleAddLink}>
                                            <div className="grid gap-y-4">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm"
                                                        placeholder="Link"
                                                        required
                                                        value={newLink}
                                                        onChange={(e) => setNewLink(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm mt-2"
                                                        placeholder="Mô tả"
                                                        required
                                                        value={newDescription}
                                                        onChange={(e) => setNewDescription(e.target.value)}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-all"
                                                >
                                                    Thêm
                                                </button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Cột hiển thị danh sách file */}
                            <div className="p-4 rounded-lg border border-gray-300">
                                <h2 className="text-lg font-semibold mb-3">Danh sách tập tin</h2>
                                <ul className="space-y-2">
                                    {profile?.referenceFiles?.length ? (
                                        profile.referenceFiles.map((file: any) => (
                                            <li key={file.id} className="p-2 bg-white rounded-md border shadow">
                                                <button
                                                    onClick={() => handleDownload(file.id, file.fileName)}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    <img src={other} alt="" className="w-24 h-24 mx-auto"/>
                                                    {file.fileName}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <p>Không có tập tin nào.</p>
                                    )}
                                </ul>
                            </div>


                            {/* Cột hiển thị danh sách link */}
                            <div className="p-4 rounded-lg border border-gray-300">
                                <h2 className="text-lg font-semibold mb-3">Danh sách liên kết</h2>
                                <ul className="space-y-2">
                                    {profile?.referenceLinks?.length ? (
                                        profile.referenceLinks.map((link: any) => (
                                            <li key={link.id} className="p-2 bg-white rounded-md border shadow">
                                                <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {link.link}
                                                </a>
                                            </li>
                                        ))
                                    ) : (
                                        <p>Không có liên kết nào.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default ReferenceProfileDetail;
