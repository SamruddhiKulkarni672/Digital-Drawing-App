"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTool } from "../context/ToolContext";
import { brushTypes } from "@/utils/Brushes";
import { dabImages } from "@/utils/Dabs";

const Canvas = () => {
    const [drawing, setDrawing] = useState(false);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const brushImage = useRef(null);

    const {
        settings,
        pushToUndo,
        canvasRef,
        ctxRef,
        previewCanvasRef,
        zoom,
        canvasContainerRef,
        setZoom,
        backgroundImage,
        setBackgroundImage,
    } = useTool();

    const ASPECT_RATIO = 2.5;

    // Load brush image
    useEffect(() => {
        const dabKey = settings.dabType;
        if (!dabKey || !dabImages[dabKey]) {
            brushImage.current = null;
            return;
        }
        const img = new Image();
        img.onload = () => {
            brushImage.current = img;
        };
        img.src = dabImages[dabKey];
    }, [settings.dabType]);

    // Zoom handler
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const newZoom = Math.min(Math.max(zoom + delta, 0.2), 5);

        const container = canvasContainerRef.current;
        if (!container || !canvasRef.current) return;

        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        container.style.transformOrigin = `${offsetX}px ${offsetY}px`;
        setZoom(newZoom);
    };

    const drawBackgroundImage = () => {
        if (!canvasRef.current || !backgroundImage) return;
        const ctx = ctxRef.current;
        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = "#323232";
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            updatePreview();
        };
        img.src = backgroundImage;
    };

    const saveToLocalStorage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem("canvas-image", dataUrl);
    };

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const container = canvas.parentElement;
        const displayWidth = container.offsetWidth;
        const displayHeight = displayWidth / ASPECT_RATIO;

        canvas.width = displayWidth;
        canvas.height = displayHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#323232";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctxRef.current = ctx;
    };

    useEffect(() => {
        resizeCanvas();
        const handle = () => resizeCanvas();
        window.addEventListener("resize", handle);

        // Restore background and canvas drawing after resize
        const savedBg = localStorage.getItem("canvas-bg");
        if (savedBg) setBackgroundImage(savedBg);

        const savedCanvasImage = localStorage.getItem("canvas-image");
        if (savedCanvasImage) {
            const img = new Image();
            img.onload = () => {
                if (canvasRef.current && ctxRef.current) {
                    ctxRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    updatePreview();
                }
            };
            img.src = savedCanvasImage;
        }

        return () => window.removeEventListener("resize", handle);
    }, []);

    useEffect(() => {
        drawBackgroundImage();
    }, [backgroundImage]);

    const getOffset = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
            y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height,
        };
    };

    const updatePreview = () => {
        const mainCanvas = canvasRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!mainCanvas || !previewCanvas) return;
        const previewCtx = previewCanvas.getContext("2d");
        const scale = 0.25;
        const width = mainCanvas.width * scale;
        const height = mainCanvas.height * scale;
        previewCanvas.width = width;
        previewCanvas.height = height;
        previewCtx.clearRect(0, 0, width, height);
        previewCtx.drawImage(mainCanvas, 0, 0, width, height);
    };

    const startDrawing = (e) => {
        if (!["brush", "eraser"].includes(settings.tool)) return;
        const ctx = ctxRef.current;
        pushToUndo(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
        setDrawing(true);
        const { x, y } = getOffset(e);
        lastX.current = x;
        lastY.current = y;
        ctx.save();
        ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!drawing) return;
        const ctx = ctxRef.current;
        const { x, y } = getOffset(e);

        if (settings.tool === "eraser") {
            ctx.beginPath();
            ctx.moveTo(lastX.current, lastY.current);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "#1e1e1e";
            ctx.lineWidth = settings.size;
            ctx.globalAlpha = 1.0;
            ctx.stroke();
        } else {
            const brush = brushTypes[settings.brushType] || brushTypes.pencil;
            if (["dabBrush", "watercolor", "spray","flat"].includes(settings.brushType) && brushImage.current) {
                brush(ctx, x, y, settings, lastX.current, lastY.current, brushImage.current);
            } else {
                brush(ctx, x, y, settings);
            }
        }

        lastX.current = x;
        lastY.current = y;
        updatePreview();
        saveToLocalStorage();
    };

    const endDrawing = () => {
        if (drawing) {
            const ctx = ctxRef.current;
            ctx.closePath();
            ctx.restore();
            setDrawing(false);
        }
    };

    return (
        <div ref={canvasContainerRef} className="w-full max-w-[1050px] mx-auto"  >
            <canvas
                ref={canvasRef}
                className={`rounded-[12px] bg-[#323232] block p-0 w-full h-auto ${
                    settings.tool === "brush"
                        ? "cursor-crosshair"
                        : settings.tool === "eraser"
                        ? "cursor-cell"
                        : settings.tool === "fill"
                        ? "cursor-pointer"
                        : "cursor-default"
                }`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
            />
        </div>
    );
};

export default Canvas;
