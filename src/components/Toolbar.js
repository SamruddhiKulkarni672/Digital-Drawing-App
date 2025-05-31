"use client";
import React from "react";
import { useTool } from "../context/ToolContext";

import Select from "@/assets/Select";
import Fill from "@/assets/Fill";
import Undo from "@/assets/Undo";
import Redo from "@/assets/Redo";
import Save from "@/assets/Save";
import Rect from "@/assets/Rect.js";
import BrushIcon from "@/assets/BrushIcon";
import Clear from "@/assets/Clear";

const Toolbar = ({onClear}) => {
    const { settings, setSettings, undo, redo, clearCanvas } = useTool();

    const setTool = (tool) => {
        setSettings({ ...settings, tool });
    };

    const getIconClasses = (toolName) =>
        `${settings.tool === toolName ? "text-[#4080C5]" : "text-[#B3B1B1]"} 
         w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-12 xl:h-12`;

    return (
        <div
            className="flex flex-col gap-4 md:gap-4 lg:gap-4 p-4 bg-[#222222] h-auto border border-[#363434] rounded-[10px] sm:rounded-[12px] md:rounded-[14px] lg:rounded-[16px] items-center w-full"
            style={{ boxShadow: "4px 4px 4px 0px #00000040" }}
        >
            <button className="mt-10 cursor-pointer" onClick={() => setTool("cursor")}>
                <Select className={getIconClasses("cursor")} />
            </button>
            <button className="cursor-pointer" onClick={() => setTool("brush")}>
                <BrushIcon className={getIconClasses("brush")} />
            </button>
            <button className="cursor-pointer" onClick={() => setTool("fill")}>
                <Fill className={getIconClasses("fill")} />
            </button>
            <button className="cursor-pointer" onClick={() => setTool("rect")}>
                <Rect className={getIconClasses("rect")} />
            </button>
            <button className="cursor-pointer" onClick={undo}>
                <Undo className="text-[#B3B1B1] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12" />
            </button>
            <button className="cursor-pointer" onClick={redo}>
                <Redo className="text-[#B3B1B1] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12" />
            </button>
            <button className="cursor-pointer" onClick={clearCanvas}>
                <Clear className={getIconClasses("clear")} />
            </button>
        </div>
    );
};

export default Toolbar;
