"use client";
import React, { createContext, useContext, useRef, useState } from "react";

const ToolContext = createContext();

export const ToolProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    tool: "brush",
    color: "#ffffff",
    size: 5,
    opacity: 1.0,
  });

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const pushToUndo = (data) => {
    setUndoStack((prev) => [...prev, data]);
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;
    const last = undoStack.pop();
    setUndoStack([...undoStack]);
    setRedoStack((prev) => [...prev, ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    ctxRef.current.putImageData(last, 0, 0);
  };

  const redo = () => {
    if (redoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;
    const last = redoStack.pop();
    setRedoStack([...redoStack]);
    setUndoStack((prev) => [...prev, ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)]);
    ctxRef.current.putImageData(last, 0, 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    pushToUndo(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => useContext(ToolContext);