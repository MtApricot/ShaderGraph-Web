import React from 'react';
import { Trash2, Settings, Plus, X, Layers, LogIn, LogOut, Palette, Tags } from 'lucide-react';
import ColorPalette from './ColorPalette';

const Inspector = ({ selectedNode, updateNode, deleteNode, updatePort, addPort, removePort, isViewOnly, onClose, categories, onCategoriesChange, onOpenCategories }) => {
  if (!selectedNode) return null;

  return (
    <div className="w-80 bg-[#1c1c1c] border-l border-[#333] transition-all flex flex-col shadow-2xl z-40 h-full text-[#e0e0e0] font-sans">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#333] flex justify-between items-center bg-[#252525]">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
          <Settings size={16} className="text-[#888]" /> 
          Node Inspector
        </h2>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-[#3c3c3c] rounded-md text-[#888] hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div className="p-4 overflow-y-auto flex-grow text-xs space-y-6">
        
        {/* General Info Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Layers size={12} /> General
          </h3>
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-[#888]">Title</label>
            <input 
              value={selectedNode.title} 
              onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
              disabled={isViewOnly}
              className="w-full bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-50"
            />
          </div>
          
          <div className="grid grid-cols-[80px_1fr] items-center gap-2">
            <label className="text-[#888]">Category</label>
            <div className="flex items-center gap-2">
              <select 
                value={selectedNode.cat} 
                onChange={(e) => updateNode(selectedNode.id, { cat: e.target.value })}
                disabled={isViewOnly}
                className="w-full bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all appearance-none disabled:opacity-50"
              >
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                onClick={() => onOpenCategories?.()}
                disabled={isViewOnly}
                className="p-1.5 bg-[#2a2a2a] border border-[#444] rounded hover:bg-[#333] text-[#888]"
                title="Manage categories"
              >
                <Tags size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#888] flex items-center gap-2">
              <Palette size={12} /> Node Color
            </label>
            <ColorPalette 
              color={selectedNode.color}
              onColorChange={(color) => updateNode(selectedNode.id, { color })}
              isViewOnly={isViewOnly}
            />
          </div>
        </div>

        <div className="h-px bg-[#333] my-4" />

        {/* Inputs Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider flex items-center gap-2">
               <LogIn size={12} /> Inputs
            </h3>
            {!isViewOnly && (
              <button 
                onClick={() => addPort(selectedNode.id, 'inputs')} 
                className="flex items-center gap-1 text-xs text-[#3b82f6] hover:text-white bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 px-2 py-1 rounded transition-colors"
              >
                <Plus size={12} /> Add
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {selectedNode.inputs.map((port, index) => (
              <div key={port.id} className="flex gap-2 items-center group">
                <input 
                  value={port.name} 
                  onChange={(e) => updatePort(selectedNode.id, 'inputs', index, e.target.value)}
                  disabled={isViewOnly}
                  className="flex-grow bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 outline-none focus:border-[#3b82f6] transition-all disabled:opacity-50"
                  placeholder="Port Name"
                />
                {!isViewOnly && (
                  <button 
                    onClick={() => removePort(selectedNode.id, 'inputs', index)} 
                    className="text-[#666] hover:text-red-500 p-1.5 rounded hover:bg-[#333] transition-colors"
                    title="Remove Port"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {selectedNode.inputs.length === 0 && (
              <p className="text-[#666] italic text-center py-2 bg-[#252525] rounded border border-dashed border-[#444]">No inputs</p>
            )}
          </div>
        </div>

        <div className="h-px bg-[#333] my-4" />

        {/* Outputs Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-semibold text-[#888] uppercase tracking-wider flex items-center gap-2">
               <LogOut size={12} /> Outputs
            </h3>
            {!isViewOnly && (
              <button 
                onClick={() => addPort(selectedNode.id, 'outputs')} 
                className="flex items-center gap-1 text-xs text-[#3b82f6] hover:text-white bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 px-2 py-1 rounded transition-colors"
              >
                <Plus size={12} /> Add
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {selectedNode.outputs.map((port, index) => (
              <div key={port.id} className="flex gap-2 items-center group">
                <input 
                  value={port.name} 
                  onChange={(e) => updatePort(selectedNode.id, 'outputs', index, e.target.value)}
                  disabled={isViewOnly}
                  className="flex-grow bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 outline-none focus:border-[#3b82f6] transition-all disabled:opacity-50"
                  placeholder="Port Name"
                />
                {!isViewOnly && (
                  <button 
                    onClick={() => removePort(selectedNode.id, 'outputs', index)} 
                    className="text-[#666] hover:text-red-500 p-1.5 rounded hover:bg-[#333] transition-colors"
                    title="Remove Port"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
            {selectedNode.outputs.length === 0 && (
              <p className="text-[#666] italic text-center py-2 bg-[#252525] rounded border border-dashed border-[#444]">No outputs</p>
            )}
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      {!isViewOnly && (
        <div className="p-4 border-t border-[#333] bg-[#252525] space-y-3">
          <button 
            onClick={() => deleteNode(selectedNode.id)}
            className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-medium text-sm"
          >
            <Trash2 size={16}/> Delete Node
          </button>
        </div>
      )}
    </div>
  );
};

export default Inspector;