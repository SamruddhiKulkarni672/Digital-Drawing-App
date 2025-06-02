import React from "react";
import Save from "@/assets/Save";
import Print from "@/assets/Print";
import ZoomIn from "@/assets/ZoomIn";
import ZoomOut from "@/assets/ZoomOut";
 import { useTool } from "../context/ToolContext";


function PreviewPanel() {
      const { previewCanvasRef,zoomIn, zoomOut  } = useTool();
 

    return (
        <div
            className="flex flex-col w-full h-60  bg-[#222222] border border-[#363434] rounded-[10px] sm:rounded-[12px] md:rounded-[14px] lg:rounded-[16px] items-center  "
            style={{ boxShadow: "4px 4px 4px 0px #00000040" }}
        >
            {/* canvas operation tool  */}
            <div className="flex flex-row w-[90%] mt-2 p-1 border border-[#363434] rounded-[10px] sm:rounded-[10px] md:rounded-[10px] lg:rounded-[12px] items-center justify-evenly bg-gradient-to-r from-[#292A29] to-[#1B1B1C] shadow-md">
                <button className="  cursor-pointer" onClick={zoomIn}>
                    <ZoomIn />
                </button>

                <button className="  cursor-pointer" onClick={zoomOut}>
                    <ZoomOut />
                </button>

                <button className="  cursor-pointer">
                    <Save />
                </button>

                <button className="  cursor-pointer">
                    <Print />
                </button>
            </div>

            {/* canvas preview  */}
            <div className=" flex mt-2 w-[100%]    items-center justify-center rounded-[12px]">
                        <canvas ref={previewCanvasRef} className="rounded-[10px] my-3 p-0" />

            </div>


        </div>
    );
}

export default PreviewPanel;
