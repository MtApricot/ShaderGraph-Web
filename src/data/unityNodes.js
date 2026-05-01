/**
 * Unity Shader Graph ノード定義
 * CSVデータをそのまま埋め込み、起動時にパースして使う。
 */

const UNITY_PRESET_NODES_CSV = `Category,SubCategory,NodeName,Inputs,Outputs
Input,Basic,Float,,Out(1)
Input,Basic,Vector2,X(1)|Y(1),Out(2)
Input,Basic,Vector3,X(1)|Y(1)|Z(1),Out(3)
Input,Basic,Vector4,X(1)|Y(1)|Z(1)|W(1),Out(4)
Input,Basic,Color,,Out(4)
Input,Basic,Boolean,,Out(B)
Input,Geometry,Position,,Out(3)
Input,Geometry,Normal,,Out(3)
Input,Geometry,Tangent,,Out(3)
Input,Geometry,Bitangent,,Out(3)
Input,Geometry,Vertex Color,,Out(4)
Input,Geometry,Screen Position,,Out(2)
Input,Geometry,View Direction,,Out(3)
Input,Geometry,View Vector,,Out(3)
Input,Texture,Sample Texture 2D,Texture(T2)|UV(2)|Sampler(S),RGBA(4)|R(1)|G(1)|B(1)|A(1)
Input,Texture,Sample Texture 2D LOD,Texture(T2)|UV(2)|Sampler(S)|LOD(1),RGBA(4)|R(1)|G(1)|B(1)|A(1)
Input,Texture,Sample Texture 3D,Texture(T3)|UV(3)|Sampler(S),Out(4)
Input,Texture,Texel Size,Texture(T2),Vector4(4)
Input,UV,UV,,Out(2)
Input,UV,Tiling And Offset,UV(2)|Tiling(2)|Offset(2),Out(2)
Input,UV,Polar Coordinates,UV(2)|Center(2)|RadialScale(1)|LengthScale(1),Out(2)
Input,UV,Radial Shear,UV(2)|Center(2)|Strength(2)|Offset(2),Out(2)
Input,UV,Twirl,UV(2)|Center(2)|Strength(1)|Offset(2),Out(2)
Input,Constant,Time,,Time(1)|Sine(1)|Cosine(1)|Delta Time(1)|Smooth Delta(1)
Input,Constant,PI,,Out(1)
Input,Constant,TAU,,Out(1)
Input,Constant,E,,Out(1)
Math,Basic,Add,A|B,Out
Math,Basic,Subtract,A|B,Out
Math,Basic,Multiply,A|B,Out
Math,Basic,Divide,A|B,Out
Math,Basic,Power,Base|Exp,Out
Math,Basic,Square Root,In,Out
Math,Basic,Absolute,In,Out
Math,Advanced,Exponential,In,Out
Math,Advanced,Log,In,Out
Math,Advanced,Modulo,A|B,Out
Math,Advanced,Negate,In,Out
Math,Advanced,Reciprocal,In,Out
Math,Advanced,Reciprocal Square Root,In,Out
Math,Trigonometry,Sine,In,Out
Math,Trigonometry,Cosine,In,Out
Math,Trigonometry,Tangent,In,Out
Math,Trigonometry,Arcsine,In,Out
Math,Trigonometry,Arccosine,In,Out
Math,Trigonometry,Arctangent,In,Out
Math,Trigonometry,Arctangent2,A|B,Out
Math,Trigonometry,Degrees To Radians,In,Out
Math,Trigonometry,Radians To Degrees,In,Out
Math,Vector,Cross Product,A(3)|B(3),Out(3)
Math,Vector,Dot Product,A|B,Out(1)
Math,Vector,Distance,A|B,Out(1)
Math,Vector,Length,In,Out(1)
Math,Vector,Normalize,In,Out
Math,Vector,Reflect,In|Normal,Out
Math,Vector,Refract,In|Normal|Eta,Out
Math,Vector,Fresnel Effect,Normal|ViewDir|Power,Out(1)
Math,Vector,Projection,A|B,Out
Math,Vector,Rejection,A|B,Out
Math,Range,Lerp,A|B|T,Out
Math,Range,Clamp,In|Min|Max,Out
Math,Range,Remap,In|InMinMax(2)|OutMinMax(2),Out
Math,Range,Saturate,In,Out
Math,Range,Smoothstep,Edge1|Edge2|In,Out
Math,Range,Step,In|Edge,Out
Math,Rounding,Ceiling,In,Out
Math,Rounding,Floor,In,Out
Math,Rounding,Round,In,Out
Math,Rounding,Sign,In,Out
Math,Rounding,Truncate,In,Out
Artistic,Adjustment,Contrast,In|Contrast(1),Out
Artistic,Adjustment,Hue,In|Offset(1),Out
Artistic,Adjustment,Invert Colors,In,Out
Artistic,Adjustment,Replace Color,In|From|To|Range|Fuzziness,Out
Artistic,Adjustment,Saturation,In|Saturation(1),Out
Artistic,Adjustment,White Balance,In|Temperature|Tint,Out
Artistic,Blend,Blend,Base|Blend|Opacity(1),Out
Artistic,Filter,Dither,In|ScreenPos,Out
Artistic,Mask,Channel Mask,In,Out
Artistic,Mask,Color Mask,In|MaskColor|Range|Fuzziness,Out
Artistic,Normal,Normal Blend,A|B,Out
Artistic,Normal,Normal From Height,In,Out
Artistic,Normal,Normal Strength,In|Strength,Out
Artistic,Normal,Normal Unpack,In,Out
Channel,Operation,Combine,R(1)|G(1)|B(1)|A(1),Out(4)|RGB(3)|RG(2)
Channel,Operation,Split,In(4),R(1)|G(1)|B(1)|A(1)
Channel,Operation,Swizzle,In,Out
Channel,Operation,Flip,In|FlipX(B)|FlipY(B)|FlipZ(B)|FlipW(B),Out
Procedural,Noise,Gradient Noise,UV(2)|Scale(1),Out(1)
Procedural,Noise,Simple Noise,UV(2)|Scale(1),Out(1)
Procedural,Noise,Voronoi,UV(2)|AngleOffset(1)|CellDensity(1),Out(1)|Cells(1)
Procedural,Shapes,Rectangle,UV(2)|Width(1)|Height(1),Out(1)
Procedural,Shapes,Rounded Rectangle,UV(2)|Width(1)|Height(1)|Radius(1),Out(1)
Procedural,Shapes,Polygon,UV(2)|Sides(1)|Width(1)|Height(1),Out(1)
Procedural,Shapes,Ellipse,UV(2)|Width(1)|Height(1),Out(1)
Procedural,Checkerboard,Checkerboard,UV(2)|ColorA|ColorB|Frequency(2),Out(4)
Utility,Control,Branch,Predicate(B)|True|False,Out
Utility,Control,Comparison,A|B,Out(B)
Utility,Logic,And,A(B)|B(B),Out(B)
Utility,Logic,Or,A(B)|B(B),Out(B)
Utility,Logic,Not,In(B),Out(B)`;

const parsePortToken = (token, index, direction) => {
  const trimmed = token.trim();
  const typeMatch = trimmed.match(/^(.*)\(([^)]+)\)$/);

  if (typeMatch) {
    const [, name, valueType] = typeMatch;
    return {
      id: `${direction}${index}`,
      name: name.trim(),
      valueType: valueType.trim(),
      rawLabel: trimmed
    };
  }

  return {
    id: `${direction}${index}`,
    name: trimmed,
    valueType: null,
    rawLabel: trimmed
  };
};

const parsePortList = (value, direction) => {
  if (!value || !value.trim()) return [];
  return value.split('|').map((token, index) => parsePortToken(token, index, direction));
};

const parseUnityNodeCsv = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/);
  return lines.slice(1).map((line) => {
    const [category, subCategory, nodeName, inputs = '', outputs = ''] = line.split(',');
    return {
      category: category.trim(),
      subCategory: subCategory.trim(),
      name: nodeName.trim(),
      inputs: parsePortList(inputs, 'in'),
      outputs: parsePortList(outputs, 'out')
    };
  });
};

export const UNITY_PRESET_NODES = parseUnityNodeCsv(UNITY_PRESET_NODES_CSV);

/**
 * プリセットノードカラーマップ
 */
export const PRESET_NODE_COLORS = {
  'Input': '#3b82f6',      // blue
  'Math': '#d97706',       // amber
  'Artistic': '#6366f1',   // indigo
  'Channel': '#8b5cf6',    // purple
  'Procedural': '#ec4899', // pink
  'Utility': '#10b981',    // green
};

/**
 * ノード定義からノードオブジェクトを生成
 * @param {Object} nodeData - ノード定義
 * @param {number} x - X座標
 * @param {number} y - Y座標
 * @returns {Object} ノードオブジェクト
 */
export function createPresetNode(nodeData, x, y) {
  const id = `n${Date.now()}`;
  const baseColor = PRESET_NODE_COLORS[nodeData.category] || '#d97706';
  
  const inputs = nodeData.inputs.map((port, idx) => ({
    id: port.id || `in${idx}`,
    name: port.name,
    valueType: port.valueType || null,
    rawLabel: port.rawLabel || port.name
  }));
  
  const outputs = nodeData.outputs.map((port, idx) => ({
    id: port.id || `out${idx}`,
    name: port.name,
    valueType: port.valueType || null,
    rawLabel: port.rawLabel || port.name
  }));
  
  return {
    id,
    x,
    y,
    title: nodeData.name,
    cat: nodeData.category.toLowerCase(),
    color: baseColor,
    inputs,
    outputs,
    presetType: 'unity',
    originalNodeData: nodeData
  };
}
