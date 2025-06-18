"use client";
import React, { createContext, useContext, useRef, useState } from "react";

const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
    const previewCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const canvasWrapperRef = useRef(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [settings, setSettings] = useState({
        tool: "brush",
        brushType: "pencil",
        color: "#ffffff",
        size: 5,
        opacity: 1.0,
        dabType: "watercolor",
    });

    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [zoom, setZoom] = useState(1);

    const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 5));
    const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.2));

    const pushToUndo = (data) => {
        setUndoStack((prev) => [...prev, data]);
        setRedoStack([]);
    };

    const undo = () => {
        if (undoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;
        const last = undoStack.pop();
        setUndoStack([...undoStack]);
        setRedoStack((prev) => [
            ...prev,
            ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height),
        ]);
        ctxRef.current.putImageData(last, 0, 0);
    };

    const redo = () => {
        if (redoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;
        const last = redoStack.pop();
        setRedoStack([...redoStack]);
        setUndoStack((prev) => [
            ...prev,
            ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height),
        ]);
        ctxRef.current.putImageData(last, 0, 0);
    };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Push current canvas to undo stack
    pushToUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));

    // Fill with background color
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //  Re-draw background image  
    if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = backgroundImage;
    }

    // Clear preview canvas
    const previewCtx = previewCanvasRef.current?.getContext("2d");
    if (previewCtx)
        previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
};



    const saveToLocalStorage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataURL = canvas.toDataURL("image/png");
        localStorage.setItem("canvas-image", dataURL);
    };

    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <ToolContext.Provider
            value={{
                settings,
                setSettings,
                canvasRef,
                ctxRef,
                pushToUndo,
                undoStack,
                redoStack,
                undo,
                redo,
                clearCanvas,
                previewCanvasRef,
                zoom,
                setZoom,
                zoomIn,
                zoomOut,
                saveCanvas,
                canvasContainerRef,
                canvasWrapperRef,
                backgroundImage,
                setBackgroundImage,
                saveToLocalStorage,
            }}
        >
            {children}
        </ToolContext.Provider>
    );
};

export const useTool = () => useContext(ToolContext);
