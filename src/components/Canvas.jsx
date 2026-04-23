import React, { useState } from 'react';
import Node from './Node';

const Canvas = ({ graph, isViewOnly, onMouseDown }) => {
  const { nodes, links, selectedNodeId, setSelectedNodeId, activeLink, setActiveLink } = graph;
  const { draggingNodeId, setDraggingNodeId, setNodes } = graph;
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const getPortPos = (nodeId, portId, type) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const ports = type === 'input' ? node.inputs : node.outputs;
    const index = ports.findIndex(p => p.id === portId);
    const x = type === 'input' ? node.x : node.x + 200;
    const y = node.y + 40 + (index * 32) + 12; 
    return { x, y };
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      setNodes(nodes.map((node) => (
        node.id === draggingNodeId
          ? { ...node, x: e.clientX - offset.x, y: e.clientY - offset.y }
          : node
      )));
    }

    if (activeLink) {
      setActiveLink({ ...activeLink, mx: e.clientX, my: e.clientY });
    }
  };

  const handleMouseUp = (e) => {
    if (activeLink) {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target && target.dataset.node && target.dataset.type !== activeLink.type) {
        const fromNode = activeLink.type === 'output' ? activeLink.nodeId : target.dataset.node;
        const fromPort = activeLink.type === 'output' ? activeLink.portId : target.dataset.port;
        const toNode = activeLink.type === 'input' ? activeLink.nodeId : target.dataset.node;
        const toPort = activeLink.type === 'input' ? activeLink.portId : target.dataset.port;

        const newLinks = links.filter((link) => !(link.toNode === toNode && link.toPort === toPort));
        newLinks.push({ fromNode, fromPort, toNode, toPort });
        graph.setLinks(newLinks);
      }
      setActiveLink(null);
    }

    setDraggingNodeId(null);
  };

  return (
    <div 
      className="flex-grow relative overflow-hidden bg-[#1e1e1e] cursor-crosshair"
      style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={onMouseDown}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((link, i) => {
          const start = getPortPos(link.fromNode, link.fromPort, 'output');
          const end = getPortPos(link.toNode, link.toPort, 'input');
          const cp1x = start.x + (end.x - start.x) / 2;
          const isSel = selectedNodeId === link.fromNode || selectedNodeId === link.toNode;
          return (
            <path 
              key={i}
              d={`M ${start.x} ${start.y} C ${cp1x} ${start.y}, ${cp1x} ${end.y}, ${end.x} ${end.y}`}
              stroke={isSel ? "#3b82f6" : "#888"}
              strokeWidth={isSel ? 4 : 2.5}
              fill="none"
            />
          );
        })}
        {activeLink && (() => {
          const start = getPortPos(activeLink.nodeId, activeLink.portId, activeLink.type);
          const isFromIn = activeLink.type === 'input';
          const x1 = isFromIn ? activeLink.mx : start.x;
          const y1 = isFromIn ? activeLink.my : start.y;
          const x2 = isFromIn ? start.x : activeLink.mx;
          const y2 = isFromIn ? start.y : activeLink.my;
          return (
            <path 
              d={`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`}
              stroke="#fbbf24" strokeWidth={3} strokeDasharray="5,5" fill="none"
            />
          );
        })()}
      </svg>
      {nodes.map(node => (
        <Node 
          key={node.id} 
          node={node} 
          isSelected={selectedNodeId === node.id}
          isViewOnly={isViewOnly}
          onSelect={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
            onStartDrag={(e) => {
              if (isViewOnly) return;
              e.stopPropagation();
              setSelectedNodeId(node.id);
              setDraggingNodeId(node.id);
              setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
            }}
          onStartLink={(e, nId, pId, type) => {
            if(isViewOnly) return;
            e.stopPropagation();
            setActiveLink({ nodeId: nId, portId: pId, type, mx: e.clientX, my: e.clientY });
          }}
        />
      ))}
    </div>
  );
};

export default Canvas;
