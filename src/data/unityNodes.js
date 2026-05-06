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

/**
 * Unity Shader Graph (.shadergraph ファイル) をインポート
 * 
 * Unity の .shadergraph ファイルは通常 JSON 形式ですが、
 * 複数の JSON オブジェクトが連続している Multi-JSON 形式である場合があります。
 * このメソッドは標準 JSON と Multi-JSON の両方に対応しています。
 * 
 * Multi-JSON 形式: { obj1 } { obj2 } ...
 * → 正規表現で変換: [ { obj1 }, { obj2 }, ... ]
 * 
 * @param {File} file - .shadergraph ファイル
 * @returns {Promise<{nodes: Array, links: Array, title: string}>} インポートされたノード、リンク、ファイル名
 */
export async function importShaderGraphFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result?.replace?.(/^\uFEFF/, '')?.trim?.() || '';
        const logPrefix = '[shadergraph-import]';
        
        if (!content) {
          reject(new Error('ファイルが空です。'));
          return;
        }
        
        const parsed = parseShaderGraphContent(content);
        const parsedObjectCount = parsed?.objectMap?.size || 0;
        console.log(`${logPrefix} file`, { name: file.name, size: file.size, type: file.type });
        console.log(`${logPrefix} parsed structure`, {
          objectCount: parsedObjectCount,
          graphType: parsed?.graphData?.m_Type || parsed?.graphData?.m_SGVersion || 'unknown',
          hasGraphData: !!parsed?.graphData
        });
        
        // Unity Shader Graph の JSON 構造を解析
        const importedNodes = convertUnityNodesToWebNodes(parsed.graphData, parsed.objectMap);
        const importedLinks = convertUnityEdgesToWebLinks(parsed.graphData, parsed.objectMap);
        const laidOutNodes = layoutImportedShaderGraphNodes(importedNodes, importedLinks);
        const title = file.name?.replace?.('.shadergraph', '') || 'Imported Shader';
        
        console.log(`${logPrefix} import result`, {
          nodes: laidOutNodes.length,
          links: importedLinks.length,
          title
        });
        
        resolve({ nodes: laidOutNodes, links: importedLinks, title });
      } catch (error) {
        console.error('[shadergraph-import] failed', error);
        reject(new Error(`.shadergraph ファイルの解析に失敗: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました。'));
    };
    
    reader.readAsText(file);
  });
}

const parseShaderGraphContent = (content) => {
  const jsonChunks = splitConcatenatedJsonObjects(content);

  if (jsonChunks.length > 0) {
    // parse each chunk into an object when possible
    const jsonObjects = jsonChunks.map((chunk, idx) => {
      try {
        return JSON.parse(chunk);
      } catch (e) {
        console.warn('[shadergraph-import] failed to parse chunk', { index: idx, error: e.message });
        return null;
      }
    }).filter(Boolean);

    if (jsonObjects.length === 0) {
      throw new Error('No valid JSON objects parsed from shadergraph content');
    }

    const mergedData = mergeShaderGraphObjects(jsonObjects);
    if (!mergedData) {
      throw new Error('shadergraph objects could not be merged');
    }

    return buildShaderGraphParseResult(jsonObjects, mergedData);
  }

  try {
    const graphData = JSON.parse(content);
    return buildShaderGraphParseResult([graphData]);
  } catch (jsonError) {
    throw jsonError;
  }
};

const buildShaderGraphParseResult = (jsonObjects, mergedGraphData = null) => {
  const objectMap = new Map();

  jsonObjects.forEach((obj) => {
    if (!obj || typeof obj !== 'object') return;
    // Index by all commonly used reference keys because Unity references may use
    // either m_Id or m_ObjectId depending on object kind and serialization path.
    const candidateIds = [obj.m_Id, obj.m_ObjectId, obj.m_GuidSerialized].filter(Boolean);
    candidateIds.forEach((id) => objectMap.set(id, obj));
  });

  const graphData = mergedGraphData || jsonObjects.find((obj) => obj?.m_Type === 'UnityEditor.ShaderGraph.GraphData' || (Array.isArray(obj?.m_Nodes) && Array.isArray(obj?.m_Edges))) || jsonObjects[0] || {};

  console.log('[shadergraph-import] parse summary', {
    objectCount: jsonObjects.length,
    objectMapCount: objectMap.size,
    graphType: graphData?.m_Type || 'unknown'
  });
  return { graphData, objectMap };
};

const splitConcatenatedJsonObjects = (content) => {
  const objects = [];
  let depth = 0;
  let startIndex = -1;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < content.length; index++) {
    const char = content[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      if (depth === 0) {
        startIndex = index;
      }
      depth++;
      continue;
    }

    if (char === '}') {
      depth--;
      if (depth === 0 && startIndex !== -1) {
        objects.push(content.slice(startIndex, index + 1));
        startIndex = -1;
      }
    }
  }

  return objects;
};

const mergeShaderGraphObjects = (jsonObjects) => {
  if (!jsonObjects.length) return null;

  const merged = { ...jsonObjects[0] };

  if (jsonObjects.length === 1) {
    return merged;
  }

  const collectArray = (source, primaryKey, fallbackKey) => source?.[primaryKey] || source?.[fallbackKey] || [];

  for (let index = 1; index < jsonObjects.length; index++) {
    const current = jsonObjects[index];

    const currentNodes = collectArray(current, 'm_SerializableNodes', 'm_Nodes');
    if (currentNodes.length) {
      if (!merged.m_SerializableNodes) merged.m_SerializableNodes = [];
      merged.m_SerializableNodes.push(...currentNodes);
    }

    const currentEdges = collectArray(current, 'm_SerializableEdges', 'm_Edges');
    if (currentEdges.length) {
      if (!merged.m_SerializableEdges) merged.m_SerializableEdges = [];
      merged.m_SerializableEdges.push(...currentEdges);
    }

    const currentSlots = collectArray(current, 'm_SerializableSlots', 'm_Slots');
    if (currentSlots.length) {
      if (!merged.m_SerializableSlots) merged.m_SerializableSlots = [];
      merged.m_SerializableSlots.push(...currentSlots);
    }
  }

  return merged;
};

const resolveShaderGraphReference = (reference, objectMap) => {
  if (!reference || typeof reference !== 'object') return reference;
  const referenceIds = [reference.m_Id, reference.m_ObjectId, reference.m_GuidSerialized].filter(Boolean);
  if (referenceIds.length === 0 || !objectMap) return reference;
  for (const id of referenceIds) {
    const resolved = objectMap.get(id);
    if (resolved) return resolved;
  }
  return reference;
};

const resolveUnityNodeStableId = (nodeLike) => {
  if (!nodeLike || typeof nodeLike !== 'object') return null;
  // Prefer m_Id first because many edge/node references point to m_Id.
  return nodeLike.m_Id || nodeLike.m_ObjectId || nodeLike.m_GuidSerialized || null;
};

const resolveUnitySlotStableId = (slotLike) => {
  if (!slotLike || typeof slotLike !== 'object') return null;
  // Edge structures in SG_Wave_02 use m_SlotId explicitly.
  return slotLike.m_SlotId ?? slotLike.m_SlotIndex ?? slotLike.slotIndex ?? slotLike.m_Id ?? null;
};

const findFirstArrayByKeys = (root, keys) => {
  const visited = new Set();
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);

    for (const key of keys) {
      const value = current[key];
      if (Array.isArray(value)) {
        return value;
      }
    }

    for (const value of Object.values(current)) {
      if (value && typeof value === 'object') {
        stack.push(value);
      }
    }
  }

  return [];
};

const getUnityNodes = (shaderGraphData, objectMap) => {
  const serializableNodes = findFirstArrayByKeys(shaderGraphData, ['m_SerializableNodes']);
  if (Array.isArray(serializableNodes) && serializableNodes.length > 0) {
    return serializableNodes.map((node) => resolveShaderGraphReference(node, objectMap));
  }

  const nodeRefs = findFirstArrayByKeys(shaderGraphData, ['m_Nodes']);
  if (Array.isArray(nodeRefs) && nodeRefs.length > 0) {
    return nodeRefs.map((nodeRef) => resolveShaderGraphReference(nodeRef, objectMap));
  }

  if (objectMap && objectMap.size > 0) {
    const fallbackNodes = [];
    for (const candidate of objectMap.values()) {
      const typeName = candidate?.m_Type || '';
      const hasNodeShape = candidate?.m_DrawState || Array.isArray(candidate?.m_Slots) || Array.isArray(candidate?.m_SerializableSlots);
      if (!typeName.includes('Slot') && hasNodeShape) {
        fallbackNodes.push(candidate);
      }
    }

    if (fallbackNodes.length > 0) {
      console.warn('[shadergraph-import] fallback node scan used', {
        fallbackNodeCount: fallbackNodes.length
      });
      return fallbackNodes;
    }
  }

  return [];
};

const getUnityEdges = (shaderGraphData) => {
  const serializableEdges = findFirstArrayByKeys(shaderGraphData, ['m_SerializableEdges']);
  if (Array.isArray(serializableEdges) && serializableEdges.length > 0) {
    return serializableEdges;
  }

  const edges = findFirstArrayByKeys(shaderGraphData, ['m_Edges']);
  return Array.isArray(edges) ? edges : [];
};

const getUnitySlots = (unityNode, objectMap) => {
  const serializableSlots = findFirstArrayByKeys(unityNode, ['m_SerializableSlots']);
  if (Array.isArray(serializableSlots) && serializableSlots.length > 0) {
    return serializableSlots.map((slot) => resolveShaderGraphReference(slot, objectMap));
  }

  const slots = findFirstArrayByKeys(unityNode, ['m_Slots']);
  if (Array.isArray(slots) && slots.length > 0) {
    return slots.map((slot) => resolveShaderGraphReference(slot, objectMap));
  }

  return [];
};

const estimateNodeHeight = (node) => {
  const inputCount = Array.isArray(node?.inputs) ? node.inputs.length : 0;
  const outputCount = Array.isArray(node?.outputs) ? node.outputs.length : 0;
  const rowCount = Math.max(inputCount, outputCount, 1);
  return 52 + rowCount * 32;
};

const nodesOverlap = (a, b, margin = 20) => {
  const width = 200;
  const ax1 = a.x - margin;
  const ay1 = a.y - margin;
  const ax2 = a.x + width + margin;
  const ay2 = a.y + estimateNodeHeight(a) + margin;

  const bx1 = b.x - margin;
  const by1 = b.y - margin;
  const bx2 = b.x + width + margin;
  const by2 = b.y + estimateNodeHeight(b) + margin;

  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
};

const spreadOverlappingNodes = (nodes) => {
  const placed = [];

  return nodes.map((node) => {
    const origin = { ...node };
    let candidate = { ...node };
    let attempts = 0;

    while (placed.some((p) => nodesOverlap(candidate, p)) && attempts < 240) {
      const ring = Math.floor(attempts / 12) + 1;
      const offsetIndex = attempts % 12;
      candidate = {
        ...candidate,
        x: origin.x + (offsetIndex - 6) * 42,
        y: origin.y + ring * 34
      };
      attempts += 1;
    }

    placed.push(candidate);
    return candidate;
  });
};

const isFinalOutputNode = (node) => {
  const title = node?.title || '';
  return title.startsWith('VertexDescription.') || title.startsWith('SurfaceDescription.');
};

const getOutputGroupName = (node) => {
  const title = node?.title || '';
  if (title.startsWith('VertexDescription.')) return 'vertex';
  if (title.startsWith('SurfaceDescription.')) return 'fragment';
  return null;
};

const layoutImportedShaderGraphNodes = (nodes, links) => {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes;

  const nodeById = new Map(nodes.map((node) => [node.id, { ...node }]));
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));

  links.forEach((link) => {
    if (!nodeById.has(link.fromNode) || !nodeById.has(link.toNode)) return;
    outgoing.get(link.fromNode)?.push(link.toNode);
    incoming.get(link.toNode)?.push(link.fromNode);
  });

  const levels = new Map(nodes.map((node) => [node.id, 0]));
  const maxPasses = Math.max(nodes.length * 2, 1);

  for (let pass = 0; pass < maxPasses; pass += 1) {
    let changed = false;

    links.forEach((link) => {
      if (!levels.has(link.fromNode) || !levels.has(link.toNode)) return;
      const nextLevel = levels.get(link.fromNode) + 1;
      if (levels.get(link.toNode) < nextLevel) {
        levels.set(link.toNode, nextLevel);
        changed = true;
      }
    });

    if (!changed) break;
  }

  const outputNodes = nodes.filter(isFinalOutputNode);
  const regularNodes = nodes.filter((node) => !isFinalOutputNode(node));
  const highestRegularLevel = Math.max(...regularNodes.map((node) => levels.get(node.id) ?? 0), 0);
  const finalOutputLevel = highestRegularLevel + 2;

  outputNodes.forEach((node) => {
    levels.set(node.id, finalOutputLevel);
  });

  const LAYER_X_GAP = 260;
  const LAYER_Y_GAP = 120;
  const BASE_X = 60;
  const BASE_Y = 60;
  const FINAL_X = BASE_X + finalOutputLevel * LAYER_X_GAP;
  const outputGroups = {
    vertex: [],
    fragment: [],
    other: []
  };

  outputNodes.forEach((node) => {
    const group = getOutputGroupName(node);
    if (group === 'vertex') outputGroups.vertex.push(node);
    else if (group === 'fragment') outputGroups.fragment.push(node);
    else outputGroups.other.push(node);
  });

  const laidOut = [];
  const regularByLevel = new Map();

  regularNodes.forEach((node) => {
    const level = levels.get(node.id) ?? 0;
    if (!regularByLevel.has(level)) regularByLevel.set(level, []);
    regularByLevel.get(level).push(node);
  });

  const placeRow = (items, x, startY, rowGap) => items
    .slice()
    .sort((a, b) => (a.y - b.y) || a.title.localeCompare(b.title))
    .forEach((node, index) => {
      laidOut.push({
        ...node,
        x,
        y: startY + index * rowGap
      });
    });

  [...regularByLevel.keys()].sort((a, b) => a - b).forEach((level) => {
    const items = regularByLevel.get(level) || [];
    placeRow(items, BASE_X + level * LAYER_X_GAP, BASE_Y, LAYER_Y_GAP);
  });

  const outputRowGap = 82;
  const outputX = FINAL_X;
  placeRow(outputGroups.vertex, outputX, BASE_Y, outputRowGap);
  placeRow(outputGroups.fragment, outputX, BASE_Y + 240, outputRowGap);
  placeRow(outputGroups.other, outputX, BASE_Y + 480, outputRowGap);

  // Keep a gentle anti-overlap pass as a last resort in case the input graph has cycles or dense layers.
  return spreadOverlappingNodes(laidOut);
};

/**
 * Unity ノードを WebEditor ノード形式に変換
 * Unity の m_SerializableNodes または m_Nodes を解析
 * @param {Object} shaderGraphData - .shadergraph JSON オブジェクト
 * @returns {Array} WebEditor ノード配列
 */
function convertUnityNodesToWebNodes(shaderGraphData, objectMap) {
  const nodes = [];
  
  // Unity Shader Graph のノード形式に対応
  // トップレベルだけでなく入れ子も探索して配列を回収する
  const unityNodes = getUnityNodes(shaderGraphData, objectMap);
  console.log('[shadergraph-import] node candidates', {
    count: unityNodes.length,
    sampleTypes: unityNodes.slice(0, 5).map((node) => node?.m_Type || node?.m_SerializableType || node?.m_Name || 'unknown')
  });
  
  unityNodes.forEach((unityNode, index) => {
    try {
      // ノードの座標を取得
      let x = 50 + (index % 5) * 250;
      let y = 50 + Math.floor(index / 5) * 150;
      
      if (unityNode?.m_DrawState && unityNode.m_DrawState.m_Position) {
        x = unityNode.m_DrawState.m_Position.x || x;
        y = unityNode.m_DrawState.m_Position.y || y;
      }
      
      // ノード名を取得
      const title = unityNode?.m_Name || unityNode?.m_DisplayName || unityNode?.m_Type?.split('.')?.pop() || `Node_${index}`;
      
      // ノードの type/category を判定
      const nodeType = unityNode?.m_Type || unityNode?.m_SerializableType || '';
      const category = detectUnityNodeCategory(nodeType);
      const color = PRESET_NODE_COLORS[category] || '#d97706';
      
      // ポート情報を抽出
      const inputs = extractUnityPorts(unityNode, 'inputs', objectMap);
      const outputs = extractUnityPorts(unityNode, 'outputs', objectMap);
      
      // WebEditor ノード形式に変換
      const stableNodeId = resolveUnityNodeStableId(unityNode);
      nodes.push({
        id: `n${stableNodeId || Date.now() + index}`,
        x,
        y,
        title,
        cat: category.toLowerCase(),
        color,
        inputs,
        outputs,
        unityNodeData: unityNode // オリジナルデータを保持
      });
    } catch (error) {
      console.warn(`ノード変換エラー:`, error);
    }
  });

  console.log('[shadergraph-import] converted nodes', {
    count: nodes.length,
    sampleTitles: nodes.slice(0, 5).map((node) => node.title)
  });

  if (nodes.length === 0) {
    console.warn('[shadergraph-import] no nodes were created', {
      graphType: shaderGraphData?.m_Type || 'unknown',
      objectCount: objectMap?.size || 0,
      graphKeys: Object.keys(shaderGraphData || {}).slice(0, 20)
    });
  }
  
  return spreadOverlappingNodes(nodes);
}

/**
 * Unity エッジ（接続線）を WebEditor リンク形式に変換
 * @param {Object} shaderGraphData - .shadergraph JSON オブジェクト
 * @returns {Array} WebEditor リンク配列
 */
function convertUnityEdgesToWebLinks(shaderGraphData, objectMap) {
  const links = [];
  
  // Unity Shader Graph のエッジ形式に対応
  const unityEdges = getUnityEdges(shaderGraphData);
  console.log('[shadergraph-import] edge candidates', {
    count: unityEdges.length,
    sampleTypes: unityEdges.slice(0, 3).map((edge) => edge?.m_Type || 'edge')
  });
  
  unityEdges.forEach((unityEdge) => {
    try {
      // source (出力) と target (入力) から接続情報を抽出
      const outputSlot = unityEdge?.m_OutputSlot || unityEdge?.source;
      const inputSlot = unityEdge?.m_InputSlot || unityEdge?.target;

      if (outputSlot && inputSlot) {
        const fromNodeRef = resolveShaderGraphReference(outputSlot.m_Node, objectMap);
        const toNodeRef = resolveShaderGraphReference(inputSlot.m_Node, objectMap);

        // Use the same node id resolver as convertUnityNodesToWebNodes().
        const nodeIdFor = (ref, fallbackRef) => {
          const stable = resolveUnityNodeStableId(ref) || resolveUnityNodeStableId(fallbackRef);
          return `n${stable || ''}`;
        };

        const fromNodeId = nodeIdFor(fromNodeRef, outputSlot?.m_Node);
        const toNodeId = nodeIdFor(toNodeRef, inputSlot?.m_Node);

        // Normalize slot id to m_SlotId first (matches Unity edge schema), then fallbacks.
        const normalizeSlotId = (slot) => {
          if (!slot) return '0';
          const resolvedSlot = resolveShaderGraphReference(slot, objectMap);
          const stable = resolveUnitySlotStableId(slot);
          const resolvedStable = resolveUnitySlotStableId(resolvedSlot);
          return (stable ?? resolvedStable ?? '0').toString();
        };

        const fromPortId = normalizeSlotId(outputSlot);
        const toPortId = normalizeSlotId(inputSlot);
        
        links.push({
          fromNode: fromNodeId,
          fromPort: `out${fromPortId}`,
          toNode: toNodeId,
          toPort: `in${toPortId}`
        });
      }
    } catch (error) {
      console.warn(`エッジ変換エラー:`, error);
    }
  });

  console.log('[shadergraph-import] converted links', {
    count: links.length,
    sample: links.slice(0, 5)
  });
  
  return links;
}

/**
 * Unity ノードのタイプから WebEditor カテゴリを判定
 * @param {string} nodeType - Unity ノードの SerializableType
 * @returns {string} WebEditor カテゴリ
 */
function detectUnityNodeCategory(nodeType) {
  // nodeType 例: "UnityEngine.ShaderGraph.FloatNode", "UnityEngine.ShaderGraph.AddNode"
  const typeLower = nodeType.toLowerCase();
  
  if (typeLower.includes('float') || typeLower.includes('vector') || typeLower.includes('color') || typeLower.includes('texture')) {
    return 'Input';
  } else if (typeLower.includes('add') || typeLower.includes('multiply') || typeLower.includes('subtract') || typeLower.includes('divide') || typeLower.includes('power') || typeLower.includes('sqrt')) {
    return 'Math';
  } else if (typeLower.includes('lerp') || typeLower.includes('clamp') || typeLower.includes('saturate')) {
    return 'Math';
  } else if (typeLower.includes('noise') || typeLower.includes('voronoi') || typeLower.includes('checkerboard')) {
    return 'Procedural';
  } else if (typeLower.includes('normal') || typeLower.includes('blend')) {
    return 'Artistic';
  } else if (typeLower.includes('split') || typeLower.includes('combine') || typeLower.includes('swizzle')) {
    return 'Channel';
  } else if (typeLower.includes('branch') || typeLower.includes('comparison') || typeLower.includes('logic')) {
    return 'Utility';
  }
  
  return 'Math';
}

/**
 * Unity ノードからポート情報を抽出
 * @param {Object} unityNode - Unity ノードオブジェクト
 * @param {string} direction - 'inputs' または 'outputs'
 * @returns {Array} ポート配列
 */
function extractUnityPorts(unityNode, direction, objectMap) {
  const ports = [];
  
  // Unity ノードの m_SerializableSlots または m_Slots 内を走査
  const slots = getUnitySlots(unityNode, objectMap);
  
  slots.forEach((slot, index) => {
    // slot.isInputSlot で入出力を判定
    const slotType = slot?.m_SlotType;
    const isInput = slot?.isInputSlot !== undefined ? slot.isInputSlot : slotType !== 1; // デフォルト: true（入力）
    const matchDirection = (direction === 'inputs' && isInput) || (direction === 'outputs' && !isInput);
    
    if (matchDirection) {
      // Normalize id: prefer m_SlotId to align with m_OutputSlot/m_InputSlot edge references.
      const slotUnique = slot?.m_SlotId ?? slot?.m_SlotIndex ?? slot?.slotIndex ?? slot?.m_Id ?? index;
      ports.push({
        id: `${direction === 'inputs' ? 'in' : 'out'}${slotUnique}`,
        name: slot?.m_DisplayName || slot?.displayName || slot?.name || `Port_${index}`,
        valueType: slot?.m_Type || slot?.valueType || null,
        rawLabel: slot?.m_DisplayName || slot?.displayName || slot?.name || `Port_${index}`
      });
    }
  });
  
  return ports;
}
