'use client';
import React, { createContext, useContext, useRef, useState } from 'react';

const defaultSettings = {
  tool: 'brush',
  color: '#ff0000',
  size: 10,
  opacity: 1,
};

const ToolContext = createContext({
  settings: defaultSettings,
  setSettings: () => {},
  undoStack: [],
  redoStack: [],
  pushToUndo: () => {},
  undo: () => {},
  redo: () => {},
  clearCanvas: () => {},
  canvasRef: null,
  ctxRef: null,
});

export const ToolProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Use refs (NOT state) for canvas and context
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const pushToUndo = (img) => {
    setUndoStack((prev) => [...prev, img]);
    setRedoStack([]); // clear redo on new action
  };

  const undo = () => {
    if (undoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;

    const last = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);

    ctxRef.current.putImageData(last, 0, 0);
    console.log("Undo clicked");
  };

  const redo = () => {
    if (redoStack.length === 0 || !ctxRef.current || !canvasRef.current) return;

    const last = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, last]);

    ctxRef.current.putImageData(last, 0, 0);
    console.log("Redo clicked");
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    console.log("clearCanvas called", canvas.width, canvas.height);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      pushToUndo(imageData);
    } catch (e) {
      console.warn("ImageData error:", e);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#323232";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    console.log("Canvas cleared and filled");

    setRedoStack([]);
  };

  return (
    <ToolContext.Provider
      value={{
        settings,
        setSettings,
        undoStack,
        redoStack,
        pushToUndo,
        undo,
        redo,
        clearCanvas,
        canvasRef,
        ctxRef,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => useContext(ToolContext);
