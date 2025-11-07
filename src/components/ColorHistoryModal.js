"use client";
import React from "react";
import { useTool } from "../context/ToolContext";

const ColorHistoryModal = ({ isOpen, onClose }) => {
  const { colorHistory, setSettings, settings } = useTool();

  if (!isOpen) return null;

  const handleSelectColor = (color) => {
    //  update color in ToolContext
    setSettings({ ...settings, color });
    onClose();
  };

  return (
    <div className="absolute top-20 left-16 bg-[#2a2a2a] p-3 rounded-lg shadow-lg border border-[#444] z-50 w-36">
      <h3 className="text-sm text-gray-300 mb-2">Recent Colors</h3>
      <div className="grid grid-cols-3 gap-2">
        {colorHistory.length === 0 && (
          <p className="text-xs text-gray-500 col-span-3">No colors yet</p>
        )}
        {colorHistory.map((c, i) => (
          <button
            key={i}
            className={`w-8 h-8 rounded-md border-2 ${
              settings.color === c ? "border-blue-400" : "border-gray-500"
            }`}
            style={{ backgroundColor: c }}
            onClick={() => handleSelectColor(c)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorHistoryModal;



 