import { useState } from "react";

export const useGraph = (initialNodes = [], initialLinks = []) => {
    const [nodes, setNodes] = useState(initialNodes);
    const [links, setLinks] = useState(initialLinks);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [draggingNodeId, setDraggingNodeId] = useState(null);
    const[activeLink, setActiveLink] = useState(null);

    const addNode = (position = {}) => {
        const x = typeof position.x === 'number' ? position.x : 50;
        const y = typeof position.y === 'number' ? position.y : 50;
        const id = `n`+ Date.now();
        setNodes([...nodes, {
        id, x, y, title: 'New Node', cat: 'math', color: '#d97706',
        inputs: [{ id: 'in1', name: 'In' }],
        outputs: [{ id: 'out1', name: 'Out' }]
        }]);
        setSelectedNodeId(id);
    };

    const deleteNode = (id) => {
        setNodes(nodes.filter(n => n.id !== id));
        setLinks(links.filter(l => l.fromNode !== id && l.toNode !== id));
        if (selectedNodeId === id) setSelectedNodeId(null);
    };

    const updateNode = (id, data) => {
        setNodes(nodes.map(n => n.id === id ? { ...n, ...data } : n));
    };

    return {
        nodes,setNodes,
        links,setLinks, 
        selectedNodeId,setSelectedNodeId,
        draggingNodeId,setDraggingNodeId,
        activeLink,setActiveLink,
        addNode,deleteNode,updateNode
    };
};