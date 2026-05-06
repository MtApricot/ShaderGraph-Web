import React from "react";

const Node = ({ node, isSelected, onSelect, onStartDrag, onStartLink }) => {
    return (
            <div className={`node absolute w-[200px] bg-[#333] rounded-lg border-2 shadow-xl cursor-grab active:cursor-grabbing ${isSelected ? 'border-blue-500' : 'border-[#444]'}`}
                style={{ left: node.x, top: node.y, zIndex: 10 }}
            onMouseDown={(e) => {
                onSelect(e);
                onStartDrag?.(e);
            }}
        >
            <div 
              className={`px-3 py-1.5 rounded-t-md text-xs font-bold text-white`}
              style={{ backgroundColor: node.color || '#d97706' }}
            >
              {node.title}
            </div>
            <div className="flex py-2">
                <div className="flex-1 flex flex-col gap-2">
                    {node.inputs.map(p => (
                        <div key={p.id} className="relative flex items-center px-2 h-6 text-[10px]">
                            <div 
                                className="absolute -left-1.5 w-3 h-3 bg-[#888] rounded-full border-2 border-[#1e1e1e] hover:bg-white transition-colors"
                                onMouseDown={(e) => onStartLink(e, node.id, p.id, 'input')}
                                data-node={node.id} data-port={p.id} data-type="input"
                            >
                            </div>
                            <span className="ml-1 opacity-70">{p.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 flex flex-col gap-2 items-end">
                    {node.outputs.map(p => (
                        <div key={p.id} className="relative flex items-center px-2 h-6 text-[10px]">
                            <span className="mr-1 opacity-70">{p.name}</span>
                            <div 
                                className="absolute -right-1.5 w-3 h-3 bg-[#888] rounded-full border-2 border-[#1e1e1e] hover:bg-white transition-colors"
                                onMouseDown={(e) => onStartLink(e, node.id, p.id, 'output')}
                                data-node={node.id} data-port={p.id} data-type="output"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default Node;