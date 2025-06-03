"use client";
import React, { Fragment, useState, useEffect } from "react";
import { useTool } from "../context/ToolContext";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import Image from "next/image";
// import eraser from "../assets/eraser.png";
// import Eraser from "../assets/eraser.svg";
// import Pencil from "../assets/pencil.svg";
// import FlatBrush from "../assets/flatBrush.svg";
// import OilPaint from "../assets/oilPaint.svg";
// import Marker from "../assets/marker.svg";
// import SketchPen from "../assets/sketchPen.svg";
// import Blender from "../assets/blender.svg";

import ShadeSlider from "@uiw/react-color-shade-slider";
import CustomEraser from "@/assets/EraserIcon.js";
import FlatBrush from "@/assets/FlatBrush";
import Marker from "@/assets/Marker";
import Blender from "@/assets/Blender";
import OilPaint from "@/assets/OilPaint";
import Pencil from "@/assets/Pencil";
import Sketchpen from "@/assets/Sketchpen";
import { Fullscreen } from "lucide-react";

const DrawPanel = () => {
    const { settings, setSettings } = useTool();
    const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: settings.opacity });

    useEffect(() => {
        const hex = hsvaToHex(hsva);
        setSettings((prev) => ({
            ...prev,
            color: hex,
            opacity: hsva.a,
        }));
        console.log("brush selectes");
    }, [hsva, setSettings]);

    return (
        // <div className="absolute bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg space-y-4 w-64">
        //   <div className="flex justify-between items-center">
        //     <button
        //       onClick={() => setSettings({ ...settings, tool: 'brush' })}
        //       className={`p-2 rounded ${settings.tool === 'brush' ? 'bg-blue-600' : 'bg-gray-700'}`}
        //     >
        //       <Brush size={20} />
        //     </button>

        //     <button
        //       onClick={() => setSettings({ ...settings, tool: 'eraser' })}
        //       className={`p-2 rounded ${settings.tool === 'eraser' ? 'bg-blue-600' : 'bg-gray-700'}`}
        //     >
        //       <Eraser size={20} />
        //     </button>
        //   </div>

        //   <div>
        //     <label className="block text-sm">Brush Size</label>
        //     <input
        //       type="range"
        //       min="1"
        //       max="50"
        //       value={settings.size}
        //       onChange={(e) => setSettings({ ...settings, size: +e.target.value })}
        //       className="w-full"
        //     />
        //   </div>

        //   <div>
        //     <label className="block text-sm">Opacity</label>
        //     <input
        //       type="range"
        //       min="0.1"
        //       max="1"
        //       step="0.1"
        //       value={settings.opacity}
        //       onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
        //       className="w-full"
        //     />
        //   </div>

        //   <div>
        //     <label className="block text-sm">Color</label>
        //     <input
        //       type="color"
        //       value={settings.color}
        //       onChange={(e) => setSettings({ ...settings, color: e.target.value })}
        //       className="w-full h-10 rounded"
        //     />
        //   </div>
        // </div>

        <div className="flex flex-row w-full">
            {/* color picker  */}
            <div className="flex flex-col mt-0 p-1 lg:ml-2 xl:ml-4  w-[15%] ">
                <Fragment>
                    <div className="transform scale-75 origin-top-left">
                        <Wheel
                            color={hsva}
                            onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
                        />
                    </div>{" "}
                    {/* <div
                        style={{
                            width: "100%",
                            height: 20,
                            marginTop: 20,
                            background: hsvaToHex(hsva),
                        }}
                    ></div> */}
                </Fragment>
            </div>

            {/* brush settings  */}
            <div className="flex flex-col  w-[35%]">
                {/* brush setting  */}
                <div
                    className="flex flex-col m-3 rounded-[12px] mt-0  bg-[#222222] border border-[#2B2929]  "
                    style={{ boxShadow: "4px 4px 4px 0px #00000040" }}
                >
                    <div className="flex flex-col m-2 p-2">
                        <label className="block text-md ml-6">Brush Size</label>
                        <div className="flex justify-center items-center w-full">
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={settings.size}
                                onChange={(e) =>
                                    setSettings({ ...settings, size: +e.target.value })
                                }
                                className="w-[85%] h-3 custom-range"
                                style={{
                                    height: 10,
                                    width: "90%",

                                    background: `linear-gradient(to right, #4F4D4D 0%, 
                                         #4F4D4D
                                     ${((settings.size - 1) / 49) * 100}%, #000000 ${
                                        ((settings.size - 1) / 49) * 100
                                    }%, #000000 100%)`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col m-2 p-2 pt-0 mt-0">
                        <label className="block text-md ml-6">Opacity</label>
                        <div className="flex justify-center items-center w-full">
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={settings.opacity}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        opacity: parseFloat(e.target.value),
                                    })
                                }
                                className="w-[85%] h-3 custom-range"
                                style={{
                                    height: 10,
                                    width: "90%",
                                    background: `linear-gradient(to right, #4F4D4D 0%, 
                                       #4F4D4D ${(settings.opacity - 0.1) * 111.11}%, 
                                       #000000 ${(settings.opacity - 0.1) * 111.11}%, 
                                       #000000 100%)`,
                                }}
                            />
                        </div>
                    </div>

                    <div></div>
                </div>
                <div
                    className="flex flex-row ml-3 w-[95%] mt-3 mx-2 p-3 border border-[#2D2C2C] rounded-[12px] items-center justify-evenly bg-gradient-to-r from-[#292A29] to-[#1B1B1C] shadow-md"
                    style={{ boxShadow: "4px 4px 4px 0px #00000040" }}
                >
                    <Fragment>
                        <ShadeSlider
                            className="rounded-2xl"
                            radius={12}
                            hsva={hsva}
                            style={{ width: "80%", marginTop: 2, height: 20 }}
                            onChange={(newShade) => {
                                setHsva({ ...hsva, ...newShade });
                            }}
                            pointer={({ color, style }) => {
                                return (
                                    <div style={style}>
                                        <div
                                            style={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: color,
                                            }}
                                        />
                                    </div>
                                );
                            }}
                        />
                    </Fragment>
                </div>
            </div>

            {/* brush selector  */}
            <div className="flex flex-row  w-[50%]">
                {/* <Image src={eraser} alt="Eraser" width={80} height={50} />{" "} */}
                <div
                    className="flex m- ml-14 mt-8"
                    onClick={() => setSettings({ ...settings, tool: "eraser" })}
                >
                    <CustomEraser width={50} height={140} />
                </div>

                <div
                    className="flex m-   mt-0 "
                    onClick={() => setSettings({ ...settings, brushType: "pencil" })}
                >
                    <Pencil width={80} height={160} />
                </div>

                <div className="flex m-   mt-0 ">
                    <FlatBrush width={70} height={160} />
                </div>

                <div
                    className="flex m-   mt-2 "
                    onClick={() => setSettings({ ...settings, brushType: "crayon" })}
                >
                    <Sketchpen width={70} height={160} />
                </div>

                <div className="flex m-  mt-2 ">
                    <Blender width={70} height={160} />
                </div>

                <div
                    className="flex m-   mt-2 "
                    onClick={() => setSettings({ ...settings, brushType: "watercolor" })}
                >
                    <Marker width={70} height={160} />
                </div>

                <div
                    className="flex m-  mt-0 "
                    onClick={() => setSettings({ ...settings, brushType: "oil" })}
                >
                    <OilPaint width={70} height={160} />
                </div>
            </div>
        </div>
    );
};

export default DrawPanel;
