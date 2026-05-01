import React from "react";
import {Plus,Save,Share2,Eye,Tags} from "lucide-react";

const Toolbar = ({ title,setTitle,onAdd,onSave,onShare,isViewOnly,onCategoriesClick,presetType,onPresetTypeChange }) => {
    return (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-[#252525] p-2 rounded-lg border border-[#444] shadow-2xl">
            <input
                value={title}
                onChange={(e) => !isViewOnly && setTitle(e.target.value)}
                disabled={isViewOnly}
                className="bg-transparent border-none focus:ring-0 font-bold px-2 w-48 text-sm outline-none text-white"
                placeholder="Shader Name"
            />
            <div className="h-6 w-[1px] bg-[#444] mx-1" />
            
            {!isViewOnly && (
              <select 
                value={presetType}
                onChange={(e) => onPresetTypeChange(e.target.value)}
                className="bg-[#3d3d3d] text-white text-xs px-2 py-1 rounded border border-[#555] hover:border-[#888] transition"
                title="Select node preset type"
              >
                <option value="normal">Normal</option>
                <option value="unity">Unity</option>
                <option value="blender">Blender</option>
              </select>
            )}
            <div className="h-6 w-[1px] bg-[#444] mx-1" />
            {!isViewOnly && (
                <>
                <button onClick={onAdd} className="p-1.5 hover:bg-[#3b82f6] rounded transition-colors" title="Add Node">
                    <Plus size={18} />
                </button>
                <button onClick={onSave} className="p-1.5 hover:bg-green-600 rounded transition-colors" title="Save">
                    <Save size={18} />
                </button>
                <button onClick={onCategoriesClick} className="p-1.5 hover:bg-amber-600 rounded transition-colors" title="Manage Categories">
                    <Tags size={18} />
                </button>
                </>
             )}
            <button onClick={onShare} className="p-1.5 hover:bg-purple-600 rounded transition-colors" title="Share">
                <Share2 size={18} />
            </button>
            {isViewOnly && (
                <div className="flex items-center gap-1 text-xs text-yellow-500 font-medium px-2 bg-yellow-950/30 rounded border border-yellow-800 ml-2">
                    <Eye size={14} />
                    View Only
                </div>
            )}
        </div>
    );
};

export default Toolbar;