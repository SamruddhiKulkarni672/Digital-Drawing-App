"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTool } from "../context/ToolContext";
import { brushTypes } from "@/utils/Brushes";

// Clean base64 image string (placeholder brush)
const dabBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJElEQVQoU2NkYGD4z0AEMMDEgAkGhgYmBgaGgSmAwMDAwAAncgNMoBPj2gAAAABJRU5ErkJggg==";

const Canvas = () => {
  const [drawing, setDrawing] = useState(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const brushImage = useRef(null);
  const { settings, pushToUndo, canvasRef, ctxRef, previewCanvasRef } = useTool();

  const ASPECT_RATIO = 2.5;

  // Load brush image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      brushImage.current = img;
    };
    img.onerror = (e) => {
      console.error("Failed to load brush image", e);
    };
    img.src = dabBase64;
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const displayWidth = container.offsetWidth;
    const displayHeight = displayWidth / ASPECT_RATIO;

    const oldImage = ctxRef.current?.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (oldImage) {
      ctx.putImageData(oldImage, 0, 0);
    }

    ctxRef.current = ctx;

    updatePreview(); 
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const getOffset = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const updatePreview = () => {
    const mainCanvas = canvasRef.current;
    const previewCanvas = previewCanvasRef?.current;
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
      ctx.beginPath();
      ctx.moveTo(lastX.current, lastY.current);

      if (settings.brushType === "texture" && brushImage.current) {
        brush(ctx, x, y, settings, lastX.current, lastY.current, brushImage.current);
      } else {
        brush(ctx, x, y, settings);
      }
    }

    lastX.current = x;
    lastY.current = y;

    updatePreview(); // sync live preview
  };

  const endDrawing = () => {
    if (drawing) {
      ctxRef.current.closePath();
      setDrawing(false);
    }
  };

  return (
    <div className="w-full max-w-[1050px] mx-auto">
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
