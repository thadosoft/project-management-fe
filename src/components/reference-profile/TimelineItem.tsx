import React, { useState } from "react";
import ReferenceProfilePopup from "./ReferenceProfilePopup"; // Import popup
import { useNavigate } from "react-router-dom";

interface TimelineItemProps 
{
    id: number;
    number: number;
    title: string;
    description: string;
    position: "left" | "right";
}

const TimelineItem: React.FC<TimelineItemProps> = ({ id, number, title, description, position }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    const navigate = useNavigate();

    const handleSave = (data: any) => {
        console.log("Dữ liệu mới:", data);
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
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="text-indigo-700 border border-indigo-600 py-2 px-3 gap-2 rounded inline-flex items-center mb-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 1024 1024" className="icon" version="1.1"><path d="M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#FFEA00" /><path d="M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#FFFF8D" /><path d="M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z" fill="#3D5AFE" /><path d="M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z" fill="#536DFE" /></svg>
                        </button>
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
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="text-indigo-700 border border-indigo-600 py-2 px-3 gap-2 rounded inline-flex items-center mb-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 1024 1024" className="icon" version="1.1"><path d="M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#FFEA00" /><path d="M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#FFFF8D" /><path d="M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z" fill="#3D5AFE" /><path d="M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z" fill="#536DFE" /></svg>
                        </button>
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
