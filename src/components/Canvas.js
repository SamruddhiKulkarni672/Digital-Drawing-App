'use client';
import React, { useEffect, useState } from 'react';
import { useTool } from '../context/ToolContext';

const Canvas = () => {
  const [drawing, setDrawing] = useState(false);

  const {
    settings,
    pushToUndo,
    undoStack,
    redoStack,
    canvasRef,
    ctxRef,
  } = useTool();

  const ASPECT_RATIO = 2.2; // width / height

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const displayWidth = container.offsetWidth;
    const displayHeight = displayWidth / ASPECT_RATIO;

    // Backup old image data
    const oldImage = ctxRef.current?.getImageData(0, 0, canvas.width, canvas.height);

    // Set internal resolution
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    // Set visual size
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#323232';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Restore old image data
    if (oldImage) {
      ctx.putImageData(oldImage, 0, 0);
    }

    ctxRef.current = ctx;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getOffset = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e) => {
    if (!['brush', 'eraser'].includes(settings.tool)) return;
    const ctx = ctxRef.current;
    pushToUndo(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    setDrawing(true);
    const { x, y } = getOffset(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    const { x, y } = getOffset(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = settings.tool === 'eraser' ? '#1e1e1e' : settings.color;
    ctx.lineWidth = settings.size;
    ctx.globalAlpha = settings.opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const endDrawing = () => {
    if (drawing) {
      ctxRef.current.closePath();
      setDrawing(false);
    }
  };

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    if (undoStack.length > 0) {
      const latest = undoStack[undoStack.length - 1];
      ctx.putImageData(latest, 0, 0);
    }
  }, [undoStack]);

  useEffect(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    if (redoStack.length > 0) {
      const latest = redoStack[redoStack.length - 1];
      ctx.putImageData(latest, 0, 0);
    }
  }, [redoStack]);

  return (
    <div className="w-full max-w-[1300px] mx-auto">
      <canvas
        ref={canvasRef}
        className={`rounded-[12px] bg-[#323232] block p-0 w-full h-auto ${
          settings.tool === 'brush'
            ? 'cursor-crosshair'
            : settings.tool === 'eraser'
            ? 'cursor-cell'
            : settings.tool === 'fill'
            ? 'cursor-pointer'
            : 'cursor-default'
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
