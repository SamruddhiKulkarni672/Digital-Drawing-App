'use client';
import React, { useRef } from 'react';
import Toolbar from '../components/Toolbar';
import Canvas from '../components/Canvas';
import DrawPanel from '../components/DrawPanel';
import { ToolProvider } from '../context/ToolContext';
import PreviewPanel from '@/components/PreviewPanel';

export default function Home() {
  const canvasRef = useRef(); //  This will allow us to call canvasRef.current.clearCanvas()

  return (
   <ToolProvider>
            <div className=" relative  flex flex-col h-full  w-screen bg-[#1E1E1E]  ">
                {/* <div className="absolute top-4 left-4 z-10">
          <Toolbar />
        </div>
        <div className="m-auto">
          <Canvas />
        </div>
        <DrawPanel /> */}

                <div className="w-full h-[4%] bg-[#252524] border-b-2 border-[#414141]">1</div>
                <div className="flex flex-row w-full   h-[96%]">
                  {/* toolbar  */}
                    <div className=" flex h-full w-[7%] p-2 md:p-3 lg:p-4  py-6 justify-center ">
                      <Toolbar />
                    </div>
                    {/* right Select */}
                    <div className=" flex flex-col  h-full w-[93%] ">
                        {/* canvas&&priview */}
                        
                        <div className="flex flex-row h-[75%]  *:">


                            {/* canvas */}
                            <div className="flex w-[75%] p-3 pt-7 "><Canvas /></div>



                            {/* preview section */}
                            <div className="flex w-[25%] mt-1 md:mt-3 p-2"><PreviewPanel/></div>
                        </div>
                        {/* draw panel */}
                        <div className="flex h-[25%]  mt-3  "><DrawPanel /></div>
                    </div>
                </div>
            </div>
        </ToolProvider>
  );
}
