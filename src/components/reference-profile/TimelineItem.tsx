import React, { useState } from "react";
import ReferenceProfilePopup from "./ReferenceProfilePopup"; // Import popup
import { useNavigate } from "react-router-dom";
import { uploadFile } from "@/services/reference-profile/uploadFIleService";
import { getByProfileReferenceId } from "@/services/reference-profile/profileReferenceService";

interface TimelineItemProps {
    id: number;
    number: number;
    title: string;
    description: string;
    position: "left" | "right";
}


const TimelineItem: React.FC<TimelineItemProps> = ({ id, number, title, description, position }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [, setLoading] = useState(true);
    const [, setProfile] = useState<any>(null);
    const [, setError] = useState<string | null>(null);

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
            await uploadFile(Number(id), selectedFile);
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

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const navigate = useNavigate();

    const handleSave = (data: any) => {
    };

    const handleViewDetail = () => {
        navigate(`/profile/${id}`);
    };


    return (
        <div className="mb-8 flex justify-between items-center w-full">
            {position === "left" ? (
                <>
                    <div className="w-5/12"></div>
                    <div className="z-20 flex items-center bg-gray-800 shadow-xl w-12 h-12 rounded-full">
                        <h1 className="mx-auto font-semibold text-lg text-white">{number}</h1>
                    </div>
                    <div className="bg-gray-400 rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-3 font-bold text-gray-800 text-xl">{title}</h3>
                            <button onClick={handleViewDetail} className="text-indigo-700 border border-indigo-600 hover:bg-indigo-400 hover:text-white py-2 px-3 gap-2 rounded inline-flex items-center">Xem thêm</button>
                        </div>
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

                        <p className="text-gray-700 leading-tight font-semibold text-lg">{description}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="bg-gray-400 rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-3 font-bold text-gray-800 text-xl">{title}</h3>
                            <button onClick={handleViewDetail} className="text-indigo-700 border border-indigo-600 hover:bg-indigo-400 hover:text-white py-2 px-3 gap-2 rounded inline-flex items-center">Xem thêm</button>
                        </div>
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
                        <p className="text-gray-700 leading-tight font-semibold text-lg">{description}</p>
                    </div>
                    <div className="z-20 flex items-center bg-gray-800 shadow-xl w-12 h-12 rounded-full">
                        <h1 className="mx-auto font-semibold text-lg text-white">{number}</h1>
                    </div>
                    <div className="w-5/12"></div>
                </>
            )}

            {/* Hiển thị popup */}
            <ReferenceProfilePopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};

export default TimelineItem;
