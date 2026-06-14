import React, { useState, useEffect } from 'react';
import Node from './Node';

const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;

const Canvas = ({
  graph,
  isViewOnly,
  scale = 1,
  onScaleChange,
  offset = { x: 0, y: 0 },
  onOffsetChange,
  onMouseDown,
  onSpaceKeyPress,
  onFitAll
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

  const getPortPosWorld = (nodeId, portId, type) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    const ports = type === 'input' ? node.inputs : node.outputs;
    const index = ports.findIndex(p => p.id === portId);
    const safeIndex = index >= 0 ? index : 0;
    
    // Header (26) + flex py-2 (8 padding) + ports...
    // Center calculation matching Node.jsx exact height rules.
    const x = type === 'input' ? node.x : node.x + 200;
    const y = node.y + 46 + (safeIndex * 32); 
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

  // Robust Collision Checker for Rectangular Segments
  const isSegmentBlocked = (p1, p2, excludeIds) => {
    const margin = 10; // Clearance
    const xMin = Math.min(p1.x, p2.x) - margin;
    const xMax = Math.max(p1.x, p2.x) + margin;
    const yMin = Math.min(p1.y, p2.y) - margin;
    const yMax = Math.max(p1.y, p2.y) + margin;

    return nodes.some(node => {
      if (excludeIds.includes(node.id)) return false;
      const numPorts = Math.max(node.inputs.length, node.outputs.length);
      const h = 34 + (numPorts * 32); 
      return xMax > node.x && xMin < (node.x + 200) &&
             yMax > node.y && yMin < (node.y + h);
    });
  };

  const renderSmartPath = (start, end, isSelected, fromNodeId, toNodeId) => {
    const radius = 10;
    const hMargin = 40;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const sign = dy >= 0 ? 1 : -1;

    let midX = start.x + dx / 2;
    let foundPath = false;

    // Forward check
    if (dx > hMargin * 2) {
      const candidates = [
        start.x + dx / 2,
        start.x + hMargin,
        end.x - hMargin,
        start.x + dx * 0.25,
        start.x + dx * 0.75,
        start.x + dx * 0.1,
        start.x + dx * 0.9,
        start.x + 20,
        end.x - 20
      ];

      for (const cx of candidates) {
        if (!isSegmentBlocked(start, { x: cx, y: start.y }, [fromNodeId, toNodeId]) &&
            !isSegmentBlocked({ x: cx, y: start.y }, { x: cx, y: end.y }, [fromNodeId, toNodeId]) &&
            !isSegmentBlocked({ x: cx, y: end.y }, end, [fromNodeId, toNodeId])) {
          midX = cx;
          foundPath = true;
          break;
        }
      }
    }

    if (foundPath || dx > hMargin * 2) {
      const r = Math.min(radius, Math.abs(dy) / 2, Math.abs(midX - start.x), Math.abs(end.x - midX));
      const d = `M ${start.x} ${start.y} 
                 L ${midX - (midX > start.x ? r : -r)} ${start.y} 
                 Q ${midX} ${start.y}, ${midX} ${start.y + sign * r} 
                 L ${midX} ${end.y - sign * r} 
                 Q ${midX} ${end.y}, ${midX + (end.x > midX ? r : -r)} ${end.y} 
                 L ${end.x} ${end.y}`;
      return (
        <path 
          d={d}
          stroke={isSelected ? "#3b82f6" : "#888"}
          strokeWidth={isSelected ? 4 : 2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    } else {
      // Detour routing for backward or very tight connections
      const detour = 40;
      const x1 = start.x + detour;
      const x2 = end.x - detour;
      const midY = start.y + dy / 2;
      const d = `M ${start.x} ${start.y} 
                 C ${x1} ${start.y}, ${x1} ${midY}, ${start.x + dx/2} ${midY} 
                 S ${x2} ${end.y}, ${end.x} ${end.y}`;
      return (
        <path 
          d={d}
          stroke={isSelected ? "#3b82f6" : "#888"}
          strokeWidth={isSelected ? 4 : 2.5}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
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
        {/** Nodes rendered at zIndex 10 */}
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

        {/** SVG overlay for links - high z-index and absolute mask */}
        <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 1000 }}>
          <defs>
            <mask id="nodes-mask">
              <rect x="-100000" y="-100000" width="200000" height="200000" fill="white" />
              {nodes.map(node => {
                const numPorts = Math.max(node.inputs.length, node.outputs.length);
                const height = 34 + (numPorts * 32); 
                return (
                  <rect 
                    key={node.id}
                    x={node.x - 2} 
                    y={node.y - 2} 
                    width={204} 
                    height={height + 4} 
                    rx={10}
                    fill="black" 
                  />
                );
              })}
            </mask>
          </defs>
          <g mask="url(#nodes-mask)">
            {links.map((link, i) => {
              const start = getPortPosWorld(link.fromNode, link.fromPort, 'output');
              const end = getPortPosWorld(link.toNode, link.toPort, 'input');
              const isSel = selectedNodeId === link.fromNode || selectedNodeId === link.toNode;
              return <React.Fragment key={i}>{renderSmartPath(start, end, isSel, link.fromNode, link.toNode)}</React.Fragment>;
            })}
            {activeLink && (() => {
              const start = getPortPosWorld(activeLink.nodeId, activeLink.portId, activeLink.type);
              const isFromIn = activeLink.type === 'input';
              const s = isFromIn ? { x: activeLink.mx, y: activeLink.my } : start;
              const e = isFromIn ? start : { x: activeLink.mx, y: activeLink.my };
              const dx = e.x - s.x;
              const cp1x = s.x + Math.max(30, dx / 2);
              const cp2x = e.x - Math.max(30, dx / 2);
              return (
                <path 
                  d={`M ${s.x} ${s.y} C ${cp1x} ${s.y}, ${cp2x} ${e.y}, ${e.x} ${e.y}`}
                  stroke="#fbbf24" strokeWidth={3} strokeDasharray="5,5" fill="none"
                />
              );
            })()}
          </g>
        </svg>
      </div>
      
      <div className="absolute bottom-4 left-4 z-[2000] flex items-center gap-2 px-3 py-2 bg-black/55 border border-[#444] rounded text-[11px] text-[#cfcfcf] backdrop-blur-sm">
        <button
          className="px-2 h-6 rounded bg-[#2b2b2b] border border-[#555] hover:bg-[#3a3a3a] text-[10px]"
          onClick={() => onFitAll && onFitAll()}
          title="Fit All"
          type="button"
        >
          Fit
        </button>
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
