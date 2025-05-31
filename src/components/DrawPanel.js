'use client';
import React from 'react';
import { useTool } from '../context/ToolContext';
import { Brush, Eraser } from 'lucide-react';

const DrawPanel = () => {
  const { settings, setSettings } = useTool();

  return (
    <div className="absolute bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg space-y-4 w-64">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSettings({ ...settings, tool: 'brush' })}
          className={`p-2 rounded ${settings.tool === 'brush' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          <Brush size={20} />
        </button>

        
        <button
          onClick={() => setSettings({ ...settings, tool: 'eraser' })}
          className={`p-2 rounded ${settings.tool === 'eraser' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          <Eraser size={20} />
        </button>
      </div>

      <div>
        <label className="block text-sm">Brush Size</label>
        <input
          type="range"
          min="1"
          max="50"
          value={settings.size}
          onChange={(e) => setSettings({ ...settings, size: +e.target.value })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm">Opacity</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={settings.opacity}
          onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm">Color</label>
        <input
          type="color"
          value={settings.color}
          onChange={(e) => setSettings({ ...settings, color: e.target.value })}
          className="w-full h-10 rounded"
        />
      </div>
    </div>
  );
};

export default DrawPanel;
