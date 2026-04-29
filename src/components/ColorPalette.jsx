import React, { useState } from 'react';

const ColorPalette = ({ color, onColorChange, isViewOnly }) => {
  const [showPicker, setShowPicker] = useState(false);
  const size = 200;

  // SVG ベースの円形カラーピッカー（複数の円環で構成）
  const generateColorWheel = () => {
    const slices = [];
    const rings = 5;
    
    for (let ring = 0; ring < rings; ring++) {
      const r1 = (ring / rings) * size / 2;
      const r2 = ((ring + 1) / rings) * size / 2;
      
      for (let i = 0; i < 360; i += 6) {
        const angle1 = (i - 90) * Math.PI / 180;
        const angle2 = (i + 6 - 90) * Math.PI / 180;
        const x1 = size / 2 + r1 * Math.cos(angle1);
        const y1 = size / 2 + r1 * Math.sin(angle1);
        const x2 = size / 2 + r1 * Math.cos(angle2);
        const y2 = size / 2 + r1 * Math.sin(angle2);
        const x3 = size / 2 + r2 * Math.cos(angle2);
        const y3 = size / 2 + r2 * Math.sin(angle2);
        const x4 = size / 2 + r2 * Math.cos(angle1);
        const y4 = size / 2 + r2 * Math.sin(angle1);

        // 明度は環の深さで変わる（外側が暗い）
        const light = 50 - (ring / rings) * 30;
        const hslColor = `hsl(${i}, 100%, ${light}%)`;
        
        slices.push(
          <path
            key={`${ring}-${i}`}
            d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} Z`}
            fill={hslColor}
            stroke="none"
            onClick={() => {
              onColorChange(hslToHex(i, 100, light));
              setShowPicker(false);
            }}
            className="cursor-pointer hover:brightness-110 transition-all"
          />
        );
      }
    }
    return slices;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
      onColorChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border-2 border-[#555] cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor: color || '#888' }}
          onClick={() => !isViewOnly && setShowPicker(!showPicker)}
        />
        <input 
          type="text" 
          value={color || ''}
          onChange={handleInputChange}
          disabled={isViewOnly}
          placeholder="#000000"
          className="flex-grow bg-[#2a2a2a] border border-[#444] rounded px-2 py-1.5 text-xs outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all disabled:opacity-50 font-mono"
        />
      </div>

      {showPicker && !isViewOnly && (
        <div className="bg-[#2a2a2a] border border-[#444] rounded p-3 space-y-2">
          <p className="text-[10px] text-[#888] uppercase font-semibold mb-2">Color Wheel</p>
          <svg width={size} height={size} className="rounded border border-[#333]">
            <defs>
              <filter id="hover-filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
              </filter>
            </defs>
            {generateColorWheel()}
          </svg>
          
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#333]">
            <p className="text-[10px] text-[#888] uppercase font-semibold">Quick</p>
            <div className="flex gap-2">
              {['#3b82f6','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#eab308'].map(p => (
                <button key={p} onClick={() => { onColorChange(p); setShowPicker(false); }} className="w-5 h-5 rounded border border-[#555] hover:scale-110 transition-transform" style={{ backgroundColor: p }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function hslToHex(h, s, l) {
  const c = ((1 - Math.abs(2 * l / 100 - 1)) * s) / 100;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`.toUpperCase();
}

export default ColorPalette;
