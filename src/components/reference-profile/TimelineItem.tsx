import React, { useState } from "react";
import ReferenceProfilePopup from "./ReferenceProfilePopup"; // Import popup

interface TimelineItemProps {
    number: number;
    title: string;
    description: string;
    position: "left" | "right";
}

const TimelineItem: React.FC<TimelineItemProps> = ({ number, title, description, position }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleSave = (data: any) => {
        console.log("Dữ liệu mới:", data);
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
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="text-indigo-700 border border-indigo-600 py-2 px-6 gap-2 rounded inline-flex items-center"
                            >
                                <span>Thêm mới</span>
                            </button>
                        </div>
                        <p className="text-gray-700 leading-tight">{description}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="bg-gray-400 rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h3 className="mb-3 font-bold text-gray-800 text-xl">{title}</h3>
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="text-indigo-700 border border-indigo-600 py-2 px-6 gap-2 rounded inline-flex items-center"
                            >
                                <span>Thêm mới</span>
                            </button>
                        </div>
                        <p className="text-gray-700 leading-tight">{description}</p>
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
