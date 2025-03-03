import React, { useEffect, useState } from "react";
import TimelineItem from "./TimelineItem";
import { getAll } from "@/services/reference-profile/moduleService";
import { ModuleModel } from "@/models/Module";


const Timeline: React.FC = () => {
  const [timelineData, setTimelineData] = useState<ModuleModel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll();
        if (response) {
          setTimelineData(response);
        }
      } catch (error) {
        console.error("Error fetching timeline data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative wrap overflow-hidden">
        <div className="border-2 absolute border-opacity-20 border-gray-700 h-full left-1/2"></div>
        {timelineData.map((item, index) => (
          <TimelineItem
            key={index}
            id={item.id}
            number={index + 1} // 🌟 Tự động đánh số
            title={item.title}
            description={item.description}
            position={index % 2 === 0 ? "right" : "left"}  // 🌟 Xác định vị trí tự động
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
