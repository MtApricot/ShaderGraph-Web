import React, { useState, useEffect } from 'react';
import Node from './Node';

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

const Canvas = ({
  graph,
  isViewOnly,
  scale = 1,
  onScaleChange,
  offset = { x: 0, y: 0 },
  onOffsetChange,
  onMouseDown,
  onSpaceKeyPress
}) => {
  const { nodes, links, selectedNodeId, setSelectedNodeId, activeLink, setActiveLink } = graph;
  const { draggingNodeId, setDraggingNodeId, setNodes } = graph;
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // スペースキーイベント
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isViewOnly) {
        e.preventDefault();
        onSpaceKeyPress?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewOnly, onSpaceKeyPress]);

  const toWorldPos = (clientX, clientY) => {
    const canvasEl = document.getElementById('graph-canvas');
    if (!canvasEl) return { x: clientX, y: clientY };
    const rect = canvasEl.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale
    };
  };

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
    const world = toWorldPos(e.clientX, e.clientY);

    if (draggingNodeId) {
      setNodes(nodes.map((node) => (
        node.id === draggingNodeId
          ? { ...node, x: world.x - dragOffset.x, y: world.y - dragOffset.y }
          : node
      )));
    }

    if (activeLink) {
      setActiveLink({ ...activeLink, mx: world.x, my: world.y });
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

  const handleWheel = (e) => {
    e.preventDefault();

    // Ctrl/Cmd+wheel: zoom, normal wheel: pan
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = -e.deltaY * 0.001;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + zoomDelta));
      onScaleChange?.(Number(next.toFixed(2)));
      return;
    }

    onOffsetChange?.({
      x: offset.x - e.deltaX,
      y: offset.y - e.deltaY
    });
  };

  const setScaleClamped = (nextScale) => {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    onScaleChange?.(Number(clamped.toFixed(2)));
  };

  const handleSliderChange = (e) => {
    setScaleClamped(Number(e.target.value));
  };

  return (
    <div 
      id="graph-canvas"
      className="flex-grow relative overflow-hidden bg-[#1e1e1e] cursor-crosshair"
      style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onMouseDown={onMouseDown}
    >
      <div
        className="absolute inset-0"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0' }}
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
              const world = toWorldPos(e.clientX, e.clientY);
              setSelectedNodeId(node.id);
              setDraggingNodeId(node.id);
              setDragOffset({ x: world.x - node.x, y: world.y - node.y });
            }}
          onStartLink={(e, nId, pId, type) => {
            if(isViewOnly) return;
            e.stopPropagation();
            const world = toWorldPos(e.clientX, e.clientY);
            setActiveLink({ nodeId: nId, portId: pId, type, mx: world.x, my: world.y });
          }}
        />
      ))}
      </div>
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-black/55 border border-[#444] rounded text-[11px] text-[#cfcfcf] backdrop-blur-sm">
        <button
          className="w-6 h-6 rounded bg-[#2b2b2b] border border-[#555] hover:bg-[#3a3a3a] text-xs"
          onClick={() => setScaleClamped(scale - 0.1)}
          title="Zoom Out"
          type="button"
        >
          -
        </button>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.05}
          value={scale}
          onChange={handleSliderChange}
          className="w-28 accent-blue-500"
          aria-label="Zoom"
        />
        <button
          className="w-6 h-6 rounded bg-[#2b2b2b] border border-[#555] hover:bg-[#3a3a3a] text-xs"
          onClick={() => setScaleClamped(scale + 0.1)}
          title="Zoom In"
          type="button"
        >
          +
        </button>
        <button
          className="px-2 h-6 rounded bg-[#2b2b2b] border border-[#555] hover:bg-[#3a3a3a] text-[10px]"
          onClick={() => setScaleClamped(1)}
          title="Reset Zoom"
          type="button"
        >
          100%
        </button>
        <span className="min-w-[44px] text-right">{Math.round(scale * 100)}%</span>
      </div>
    </div>
  );
};

export default Canvas;
