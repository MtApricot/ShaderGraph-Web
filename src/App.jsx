import React, { useState, useEffect, useMemo } from 'react';
import { db, auth } from './api/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { useGraph } from './hooks/useGraph';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import ShareModal from './components/ShareModal';
import CategoryManager from './components/CategoryManager';
import NodeSearchModal from './components/NodeSearchModal';
import { createPresetNode } from './data/unityNodes';

export default function App() {
  const graph = useGraph();
  const [user, setUser] = useState(null);
  const [graphId, setGraphId] = useState(null);
  const [title, setTitle] = useState("名称未設定のシェーダー");
  const [allowEdit, setAllowEdit] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showNodeSearchModal, setShowNodeSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [forceViewOnly, setForceViewOnly] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [presetType, setPresetType] = useState('normal');
  const [categories, setCategories] = useState({
    input: '#3b82f6',
    math: '#d97706',
    effect: '#6366f1',
    master: '#10b981'
  });

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, setUser);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const editParam = params.get('edit');
    setForceViewOnly(editParam === 'false');
    if (id) {
      setGraphId(id);
      getDoc(doc(db, 'graphs', id)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          graph.setNodes(data.nodes);
          graph.setLinks(data.links);
          setTitle(data.title || "名称未設定のシェーダー");
          setAllowEdit(data.allowEdit ?? true);
          setOwnerId(data.ownerId);
          if (data.categories) {
            setCategories(data.categories);
          }
        }
        setIsLoading(false);
      }).catch((err) => {
        console.error('Error loading graph:', err);
        setIsLoading(false);
      });
    } else {
      setAllowEdit(true);
      setOwnerId(null);
      setIsLoading(false);
    }
  }, []);

  const handleSave = async () => {
    if (!user) return;

    if (graphId) {
      const graphRef = doc(db, 'graphs', graphId);
      const latestSnap = await getDoc(graphRef);
      if (!latestSnap.exists()) {
        alert('グラフが見つかりませんでした。');
        return;
      }

      const latest = latestSnap.data();
      const latestOwnerId = latest.ownerId || null;
      const latestAllowEdit = latest.allowEdit ?? true;
      const isOwnerNow = latestOwnerId === user.uid;
      const canEditNow = isOwnerNow || latestAllowEdit;

      if (!canEditNow || forceViewOnly) {
        alert('このグラフを編集する権限がありません。');
        return;
      }

      const data = {
        nodes: graph.nodes,
        links: graph.links,
        title,
        categories,
        // 共有設定はオーナーだけが変更できる
        allowEdit: isOwnerNow ? allowEdit : latestAllowEdit,
        ownerId: latestOwnerId,
        updatedAt: Date.now()
      };

      await setDoc(graphRef, data);
    } else {
      const data = {
        nodes: graph.nodes,
        links: graph.links,
        title,
        categories,
        allowEdit,
        ownerId: user.uid,
        updatedAt: Date.now()
      };

      const ref = await addDoc(collection(db, 'graphs'), data);
      setGraphId(ref.id);
      setOwnerId(user.uid);
      window.history.pushState({}, '', `?id=${ref.id}`);
    }
    alert("Saved!");
  };

  const handleAllowEditChange = async (nextAllowEdit) => {
    setAllowEdit(nextAllowEdit);

    if (!graphId || !user || user.uid !== ownerId) return;

    try {
      await setDoc(
        doc(db, 'graphs', graphId),
        { allowEdit: nextAllowEdit, updatedAt: Date.now() },
        { merge: true }
      );
    } catch (err) {
      console.error('Error updating share setting:', err);
      alert('共有設定の保存に失敗しました。');
    }
  };

  const isViewOnly = useMemo(() => {
    if (forceViewOnly) return true;
    if (!graphId) return false;
    if (user?.uid === ownerId) return false;
    return !allowEdit;
  }, [forceViewOnly, graphId, user, ownerId, allowEdit]);

  const updatePort = (nodeId, type, index, value) => {
    graph.setNodes(graph.nodes.map((node) => {
      if (node.id !== nodeId) return node;
      const ports = [...node[type]];
      ports[index] = { ...ports[index], name: value };
      return { ...node, [type]: ports };
    }));
  };

  const addPort = (nodeId, type) => {
    graph.setNodes(graph.nodes.map((node) => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        [type]: [...node[type], { id: `p${Date.now()}`, name: 'New Port' }]
      };
    }));
  };

  const removePort = (nodeId, type, index) => {
    const targetNode = graph.nodes.find((node) => node.id === nodeId);
    if (!targetNode || !targetNode[type][index]) return;
    const removedPort = targetNode[type][index];

    graph.setNodes(graph.nodes.map((node) => {
      if (node.id !== nodeId) return node;
      return {
        ...node,
        [type]: node[type].filter((_, portIndex) => portIndex !== index)
      };
    }));

    graph.setLinks(graph.links.filter((link) => {
      if (type === 'inputs') {
        return !(link.toNode === nodeId && link.toPort === removedPort.id);
      }
      return !(link.fromNode === nodeId && link.fromPort === removedPort.id);
    }));
  };

  const handleAddNodeAtCenter = () => {
    const canvasEl = document.getElementById('graph-canvas');
    if (!canvasEl) {
      graph.addNode();
      return;
    }

    const rect = canvasEl.getBoundingClientRect();
    const centerX = (rect.width / 2 - canvasOffset.x) / canvasScale;
    const centerY = (rect.height / 2 - canvasOffset.y) / canvasScale;

    graph.addNode({
      x: centerX - 100,
      y: centerY - 40
    });
  };

  const handleSelectPresetNode = (nodeData) => {
    const canvasEl = document.getElementById('graph-canvas');
    if (!canvasEl) {
      return;
    }

    const rect = canvasEl.getBoundingClientRect();
    const centerX = (rect.width / 2 - canvasOffset.x) / canvasScale;
    const centerY = (rect.height / 2 - canvasOffset.y) / canvasScale;

    const newNode = createPresetNode(nodeData, centerX - 100, centerY - 40);
    graph.setNodes([...graph.nodes, newNode]);
    graph.setSelectedNodeId(newNode.id);
    setShowNodeSearchModal(false);
  };

  if (isLoading) {
    return <div className="h-screen w-screen bg-[#2b2b2b] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-[#e0e0e0]">
      <Toolbar 
        title={title} setTitle={setTitle} 
        onAdd={handleAddNodeAtCenter} onSave={handleSave} onShare={() => setShowShare(true)}
        isViewOnly={isViewOnly}
        onCategoriesClick={() => setShowCategoryManager(true)}
        presetType={presetType}
        onPresetTypeChange={setPresetType}
      />
      <Canvas
        graph={graph}
        isViewOnly={isViewOnly}
        scale={canvasScale}
        onScaleChange={setCanvasScale}
        offset={canvasOffset}
        onOffsetChange={setCanvasOffset}
        onMouseDown={() => graph.setSelectedNodeId(null)}
        onSpaceKeyPress={() => setShowNodeSearchModal(true)}
      />
      <Inspector 
        selectedNode={graph.nodes.find(n => n.id === graph.selectedNodeId)}
        updateNode={graph.updateNode} deleteNode={graph.deleteNode}
        updatePort={updatePort}
        addPort={addPort}
        removePort={removePort}
        isViewOnly={isViewOnly} onClose={() => graph.setSelectedNodeId(null)}
        categories={categories}
        onCategoriesChange={setCategories}
        onOpenCategories={() => setShowCategoryManager(true)}
      />
      {showShare && (
        <ShareModal
          graphId={graphId}
          allowEdit={allowEdit}
          setAllowEdit={handleAllowEditChange}
          ownerId={ownerId}
          user={user}
          onClose={() => setShowShare(false)}
        />
      )}
      <CategoryManager
        categories={categories}
        onCategoriesChange={setCategories}
        isViewOnly={isViewOnly}
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
      {showNodeSearchModal && (
        <NodeSearchModal
          onSelectNode={handleSelectPresetNode}
          onClose={() => setShowNodeSearchModal(false)}
          presetType={presetType}
        />
      )}
    </div>
    );
}