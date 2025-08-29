import { useState, useRef, useEffect } from 'react';
import '../../styles/promptArea.css';

const PromptArea = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [nodes, setNodes] = useState([
    {
      id: 1,
      text: "Main Topic",
      x: 300,
      y: 200,
      connections: [],
      isMainTopic: true
    }
  ]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selecting, setSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isDraggingNodes, setIsDraggingNodes] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanPosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [boardSize] = useState({ width: 3000, height: 3000 });

  // === Zoom handler ===
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;
    const newScale = scale * (delta > 0 ? 0.9 : 1.1);
    const clampedScale = Math.min(Math.max(0.1, newScale), 3);
    const scaleChange = clampedScale - scale;
    setPosition(prev => ({
      x: prev.x - mouseX * scaleChange,
      y: prev.y - mouseY * scaleChange
    }));
    setScale(clampedScale);
  };

  // === Mouse Handlers ===
  const handleMouseDown = (e) => {
    if (["textarea", "input", "button"].includes(e.target.tagName.toLowerCase())) {
      return;
    }

    const isNode = e.target.closest('.node');
    if (e.button === 0) {
      e.preventDefault();
      if (isNode) {
        const nodeId = parseInt(isNode.dataset.nodeId);
        if (!e.shiftKey) {
          if (!selectedNodes.includes(nodeId)) {
            setSelectedNodes([nodeId]);
          }
        } else {
          if (!selectedNodes.includes(nodeId)) {
            setSelectedNodes([...selectedNodes, nodeId]);
          }
        }
        setIsDraggingNodes(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      } else {
        setSelecting(true);
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
        setSelectedNodes([]);
      }
    }
    if (e.button === 2) {
      if (!isNode) {
        setIsPanning(true);
        document.body.style.cursor = 'grabbing';
        startPanPosition.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y
        };
      }
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (["textarea", "input", "button"].includes(e.target.tagName.toLowerCase())) {
      return;
    }

    if (isPanning) {
      setPosition({
        x: e.clientX - startPanPosition.current.x,
        y: e.clientY - startPanPosition.current.y
      });
    } else if (isDraggingNodes && selectedNodes.length > 0) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      setNodes(nodes.map(node => {
        if (selectedNodes.includes(node.id)) {
          return { ...node, x: node.x + dx, y: node.y + dy };
        }
        return node;
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (selecting) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setSelectionEnd({ x, y });
    }
  };

  const handleMouseUp = (e) => {
    if (["textarea", "input", "button"].includes(e.target.tagName.toLowerCase())) {
      return;
    }

    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = 'default';
    }
    if (isDraggingNodes) {
      setIsDraggingNodes(false);
    }
    if (selecting) {
      setSelecting(false);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale]);

  // === Add Node Handler ===
  const handleAddNode = (parentId) => {
    const parentNode = nodes.find(n => n.id === parentId);
    const existingConnections = parentNode.connections.length;
    const verticalGap = 80;
    const verticalOffset = (existingConnections * verticalGap) -
      (existingConnections > 0 ? verticalGap * (existingConnections - 1) / 2 : 0);
    const newNode = {
      id: Date.now(),
      text: `New node ${existingConnections + 1}`,
      x: parentNode.x + 200,
      y: parentNode.y - verticalOffset,
      connections: [],
      isMainTopic: false
    };
    const updatedNodes = nodes.map(node => {
      if (node.id === parentId) {
        return { ...node, connections: [...node.connections, newNode.id] };
      }
      return node;
    });
    setNodes([...updatedNodes, newNode]);
  };

  const handleNodeDoubleClick = (e, node) => {
    if (e.target.tagName.toLowerCase() === 'textarea') return;

    e.stopPropagation();
    const newText = prompt('Enter text:', node.text);
    if (newText) {
      setNodes(nodes.map(n => n.id === node.id ? { ...n, text: newText } : n));
    }
  };

  const handleDeleteNode = (e, nodeId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
      const updatedNodes = nodes.map(node => ({
        ...node,
        connections: node.connections.filter(id => id !== nodeId)
      }));
      setNodes(updatedNodes.filter(node => node.id !== nodeId));
    }
  };

  // === Node Component ===
  const Node = ({ node }) => {
    const [prompt, setPrompt] = useState(node.prompt || '');

    const handlePromptSubmit = async () => {
      try {
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, prompt } : n));
        const res = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, response: data.reply } : n));
      } catch (err) {
        console.error("Error:", err.message);
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, response: "⚠️ Failed to fetch AI response" } : n));
      }
    };

    return (
      <div className="node-content">
        <div className="node-prompt-section">
          <textarea
            className="node-prompt-input"
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <div className="node-prompt-actions">
            <button className="node-send-button" onClick={handlePromptSubmit}>
              Submit
            </button>
          </div>
        </div>
        {node.response && (
          <div className="node-response">
            <pre>{node.response}</pre>
          </div>
        )}
      </div>
    );
  };

  // === Connections ===
  const renderConnections = () => (
    <svg className="connections-layer">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>
      {nodes.map(node => {
        if (node.isMainTopic && node.connections.length > 0) {
          const connectedNodes = node.connections.map(id => nodes.find(n => n.id === id)).filter(Boolean);
          const startX = node.x + 150;
          const verticalLineX = startX + 40;
          const mainCenterY = node.y + 25;
          return (
            <g key={`connections-${node.id}`}>
              <path d={`M ${startX} ${mainCenterY} H ${verticalLineX}`} stroke="#666" strokeWidth="1.5" fill="none" />
              {connectedNodes.length > 0 && (
                <path
                  d={`M ${verticalLineX} ${Math.min(...connectedNodes.map(n => n.y + 25))}
                     V ${Math.max(...connectedNodes.map(n => n.y + 25))}`}
                  stroke="#666"
                  strokeWidth="1.5"
                  fill="none"
                />
              )}
              {connectedNodes.map(targetNode => {
                const targetY = targetNode.y + 25;
                return (
                  <path
                    key={`connection-${node.id}-${targetNode.id}`}
                    d={`M ${verticalLineX} ${targetY} H ${targetNode.x}`}
                    stroke="#666"
                    strokeWidth="1.5"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </g>
          );
        }
        return null;
      })}
    </svg>
  );

  const handleContextMenu = (e) => e.preventDefault();

  // === MAIN RETURN ===
  return (
    <div ref={containerRef} className={`prompt-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`} onContextMenu={handleContextMenu}>
      <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? '◀' : '▶'}
      </button>
      <div
        className="mindmap-area"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '0 0',
          width: boardSize.width,
          height: boardSize.height
        }}
      >
        {renderConnections()}
        {nodes.map(node => (
          <div
            key={node.id}
            data-node-id={node.id}
            className={`node ${node.isMainTopic ? 'main-topic' : ''}
              ${selectedNodes.includes(node.id) ? 'selected' : ''}
              ${isDraggingNodes && selectedNodes.includes(node.id) ? 'dragging' : ''}`}
            style={{ left: node.x, top: node.y }}
            onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
            onDragStart={(e) => e.preventDefault()}
          >
            <Node node={node} />
            <button className="add-node-btn add-right" onClick={(e) => { e.stopPropagation(); handleAddNode(node.id); }}>+</button>
            {!node.isMainTopic && (
              <button className="delete-node-btn" onClick={(e) => handleDeleteNode(e, node.id)}>×</button>
            )}
          </div>
        ))}
      </div>
      <div className="zoom-controls">
        <button onClick={() => setScale(s => Math.min(s * 1.2, 3))}>+</button>
        <button onClick={() => setScale(1)}>Reset</button>
        <button onClick={() => setScale(s => Math.max(s * 0.8, 0.1))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
      </div>
      {selecting && (
        <div
          className="selector"
          style={{
            left: Math.min(selectionStart.x, selectionEnd.x),
            top: Math.min(selectionStart.y, selectionEnd.y),
            width: Math.abs(selectionEnd.x - selectionStart.x),
            height: Math.abs(selectionEnd.y - selectionStart.y),
            transform: `scale(${scale})`
          }}
        />
      )}
    </div>
  );
};

export default PromptArea;
