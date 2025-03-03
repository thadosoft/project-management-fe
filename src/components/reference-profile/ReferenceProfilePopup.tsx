import React, { useState } from "react";

interface ReferenceProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const ReferenceProfilePopup: React.FC<ReferenceProfilePopupProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [module, setModule] = useState("");
    const [description, setDescription] = useState("");
    const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
    const [referenceLinks, setReferenceLinks] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setReferenceFiles([...referenceFiles, ...Array.from(event.target.files)]);
        }
    };

    const handleSave = () => {
        const newProfile = {
            name,
            module,
            description,
            referenceFiles,
            referenceLinks
        };
        onSave(newProfile);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Thêm Reference Profile</h2>

                <input
                    type="text"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />

                <input
                    type="text"
                    placeholder="Module"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />

                <textarea
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                />

                <input type="file" multiple onChange={handleFileChange} className="mb-2" />

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded mr-2">Hủy</button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default ReferenceProfilePopup;
