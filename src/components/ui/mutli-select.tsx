import { Employee } from "@/models/EmployeeRequest";
import { useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface MultiSelectProps {
  employees: Employee[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

export default function MultiSelect({
  employees,
  selectedIds,
  setSelectedIds,
}: MultiSelectProps) {
  const [search, setSearch] = useState("");

  // toggle chọn 1 employee
  const toggleEmployee = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  
  // filter theo search
  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor="description">Mô tả chi tiết</Label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds
          .map((id) => employees.find((e) => e.id === id))
          .filter(Boolean)
          .map((emp) => (
            <span
              key={emp!.id}
              className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-sm"
            >
              {emp!.fullName}
              <button
                type="button"
                className="font-bold"
                onClick={() => toggleEmployee(emp!.id)}
              >
                ×
              </button>
            </span>
          ))}
      </div>

      {/* Search input */}
      <Input
        type="text"
        placeholder="Tìm nhân viên..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=""
      />

      {/* Employee list */}
      <div className="max-h-48 overflow-y-auto border rounded p-2">
        {filteredEmployees.map((emp) => (
          <label
            key={emp.id}
            className="flex items-center gap-2 p-1 hover:bg-blue-500 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(emp.id)}
              onChange={() => toggleEmployee(emp.id)}
              className="w-4 h-4 accent-slate-500"
            />
            <span>{emp.fullName}</span>
          </label>
        ))}
        {filteredEmployees.length === 0 && (
          <div className="text-gray-400 text-sm">No employees found</div>
        )}
      </div>
    </div>
  );
}
