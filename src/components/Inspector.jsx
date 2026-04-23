import React from 'react';
import { Trash2, Settings } from 'lucide-react';

const Inspector = ({ selectedNode, updateNode, deleteNode, updatePort, addPort, removePort, isViewOnly, onClose }) => {
  if (!selectedNode) return null;

  return (
    <div className="w-72 bg-[#252525] border-l border-[#444] transition-all flex flex-col shadow-2xl z-40 h-full">
      <div className="p-4 border-b border-[#444] flex justify-between items-center bg-[#1a1a1a]">
        <h2 className="text-sm font-bold flex items-center gap-2"><Settings size={14}/> Node Inspector</h2>
        <button onClick={onClose} className="p-1 hover:bg-[#444] rounded text-[#888] hover:text-white">&times;</button>
      </div>
      
      <div className="p-4 overflow-y-auto flex-grow text-xs space-y-6">
        <div>
          <label className="block text-[#888] mb-1.5">タイトル</label>
          <input 
            value={selectedNode.title} 
            onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
            disabled={isViewOnly}
            className="w-full bg-[#1a1a1a] border border-[#444] rounded p-2 outline-none focus:border-[#3b82f6]"
          />
        </div>
        
        <div>
          <label className="block text-[#888] mb-1.5">カテゴリー</label>
          <select 
            value={selectedNode.cat} 
            onChange={(e) => updateNode(selectedNode.id, { cat: e.target.value })}
            disabled={isViewOnly}
            className="w-full bg-[#1a1a1a] border border-[#444] rounded p-2 outline-none"
          >
            <option value="input">Input (Blue)</option>
            <option value="math">Math (Brown)</option>
            <option value="effect">Effect (Indigo)</option>
            <option value="master">Master (Green)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#888]">入力ポート</label>
            {!isViewOnly && <button onClick={() => addPort(selectedNode.id, 'inputs')} className="text-[#3b82f6] hover:underline">+ 追加</button>}
          </div>
          {selectedNode.inputs.map((port, index) => (
            <div key={port.id} className="flex gap-2 mb-2">
              <input 
                value={port.name} 
                onChange={(e) => updatePort(selectedNode.id, 'inputs', index, e.target.value)}
                disabled={isViewOnly}
                className="flex-grow bg-[#1a1a1a] border border-[#444] rounded p-1"
              />
              {!isViewOnly && (
                <button onClick={() => removePort(selectedNode.id, 'inputs', index)} className="text-red-500 p-1"><Trash2 size={12}/></button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[#888]">出力ポート</label>
            {!isViewOnly && <button onClick={() => addPort(selectedNode.id, 'outputs')} className="text-[#3b82f6] hover:underline">+ 追加</button>}
          </div>
          {selectedNode.outputs.map((port, index) => (
            <div key={port.id} className="flex gap-2 mb-2">
              <input 
                value={port.name} 
                onChange={(e) => updatePort(selectedNode.id, 'outputs', index, e.target.value)}
                disabled={isViewOnly}
                className="flex-grow bg-[#1a1a1a] border border-[#444] rounded p-1"
              />
              {!isViewOnly && (
                <button onClick={() => removePort(selectedNode.id, 'outputs', index)} className="text-red-500 p-1"><Trash2 size={12}/></button>
              )}
            </div>
          ))}
        </div>

        {!isViewOnly && (
          <button 
            onClick={() => deleteNode(selectedNode.id)}
            className="w-full py-2 bg-red-900/30 border border-red-900 text-red-500 rounded hover:bg-red-900/50 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={14}/> ノードを削除
          </button>
        )}
      </div>
    </div>
  );
};

export default Inspector;