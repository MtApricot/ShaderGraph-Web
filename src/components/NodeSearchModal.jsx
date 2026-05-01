import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { UNITY_PRESET_NODES, PRESET_NODE_COLORS } from '../data/unityNodes';

const NodeSearchModal = ({ onSelectNode, onClose, presetType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredNodes, setFilteredNodes] = useState([]);

  // 表示するノード一覧を決定
  const availableNodes = presetType === 'unity' ? UNITY_PRESET_NODES : [];

  // フィルタリング処理
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNodes(availableNodes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = availableNodes.filter(node =>
        node.name.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query) ||
        node.subCategory.toLowerCase().includes(query)
      );
      setFilteredNodes(filtered);
    }
    setSelectedIndex(0);
  }, [searchQuery, presetType, availableNodes]);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(filteredNodes.length - 1, prev + 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredNodes[selectedIndex]) {
          onSelectNode(filteredNodes[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredNodes, selectedIndex, onSelectNode, onClose]);

  if (presetType !== 'unity' || availableNodes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#2d2d2d] rounded-lg w-96 max-h-96 shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#444]">
          <div className="flex items-center gap-2">
            <Search size={18} className="text-[#888]" />
            <span className="text-sm font-semibold">ノードを検索</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white transition"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-[#444]">
          <input
            type="text"
            placeholder="ノード名で検索... (Arrow Up/Down, Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-[#1e1e1e] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Node List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNodes.length === 0 ? (
            <div className="p-4 text-center text-[#888] text-sm">
              ノードが見つかりません
            </div>
          ) : (
            filteredNodes.map((node, idx) => (
              <button
                key={`${node.category}-${node.subCategory}-${node.name}`}
                onClick={() => onSelectNode(node)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-2 flex items-center gap-3 transition ${
                  idx === selectedIndex
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-[#3d3d3d] text-[#ccc]'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PRESET_NODE_COLORS[node.category] || '#d97706' }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{node.name}</div>
                  <div className="text-xs text-[#888]">
                    {node.category} • {node.subCategory}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="p-2 border-t border-[#444] text-center text-[#888] text-xs">
          {filteredNodes.length} 件のノード
        </div>
      </div>
    </div>
  );
};

export default NodeSearchModal;
