import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const CategoryManager = ({ categories, onCategoriesChange, isViewOnly, isOpen, onClose }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories[newCategoryName]) {
      onCategoriesChange({
        ...categories,
        [newCategoryName]: newCategoryColor
      });
      setNewCategoryName('');
      setNewCategoryColor('#3b82f6');
    }
  };

  const handleRemoveCategory = (catName) => {
    const newCategories = { ...categories };
    delete newCategories[catName];
    onCategoriesChange(newCategories);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] border border-[#333] rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#333] flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">Manage Categories</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#333] rounded text-[#888] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Existing Categories */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[#888] uppercase">Existing Categories</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2 p-2 bg-[#252525] rounded border border-[#333]">
                  <div 
                    className="w-5 h-5 rounded border-2 border-[#555]"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-grow text-sm text-[#e0e0e0]">{name}</span>
                  {!isViewOnly && (
                    <button 
                      onClick={() => handleRemoveCategory(name)}
                      className="text-[#666] hover:text-red-500 p-1 rounded hover:bg-[#333] transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {!isViewOnly && (
            <>
              <div className="h-px bg-[#333]" />

              {/* Add New Category */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#888] uppercase">Add New Category</h3>
                <input 
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  className="w-full bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 text-sm outline-none focus:border-[#3b82f6] transition-all"
                />
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-[#444]"
                  />
                  <button 
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim() || !!categories[newCategoryName]}
                    className="flex-grow flex items-center justify-center gap-1 bg-[#3b82f6] hover:bg-[#3b82f6]/80 disabled:bg-[#333] disabled:cursor-not-allowed text-white rounded px-3 py-1.5 text-sm font-medium transition-colors"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
