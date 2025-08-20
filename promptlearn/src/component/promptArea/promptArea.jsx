import { useState, useRef, useEffect } from 'react';
import '../../styles/promptArea.css';

const PromptArea = ({ isSidebarOpen, setIsSidebarOpen }) => {
  // Update the initial nodes state
  const [nodes, setNodes] = useState([
    { 
      id: 1, 
      text: 'Main Topic', 
      x: 400, 
      y: 300,
      connections: [],
      isMainTopic: true,
      prompt: 'Explain the core concepts and fundamentals of Object-Oriented Programming (OOP)',
      response: `Core Concepts

1. Encapsulation:
   • Definition: Bundling data (attributes) and methods (functions) that operate on the data into a single unit, an object.
   • Access Specifiers: public, private, protected
   • Example: Like a car's engine - use it without knowing internal workings 🚗

2. Abstraction:
   • Definition: Hiding complex implementation details, showing only essential features
   • Tools: Abstract classes and interfaces
   • Example: TV remote - simple buttons hide complex circuitry 📺

3. Inheritance:
   • Definition: New class inherits properties/behaviors from existing class
   • Types: Single, multiple, multilevel, hierarchical, hybrid
   • Example: Car class inherits from Vehicle class 🚗➡️🚙

4. Polymorphism:
   • Definition: Ability of object to take many forms
   • Types:
     - Compile-time (Static): Method overloading
     - Runtime (Dynamic): Method overriding
   • Example: Play button working for different media types ⏯️

Fundamental Building Blocks:
• Class: Blueprint for creating objects
• Object: Instance of a class 🏠
• Method: Function belonging to class
• Attribute: Variable holding object's state

Advanced Concepts:
• Constructor: Initializes object
• Destructor: Cleanup when object destroyed
• Association:
  - Aggregation: "has-a" relationship
  - Composition: Strong "has-a" relationship
• Interface: Contract defining required methods
• Static Members: Class-level variables/methods`
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
  const svgRef = useRef(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  // Add this state for tracking the board size
  const [boardSize, setBoardSize] = useState({
    width: 3000,  // Large initial width
    height: 3000  // Large initial height
  });

  // Update the handleWheel function
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    
    // Get mouse position relative to container
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    // Calculate new scale
    const newScale = scale * (delta > 0 ? 0.9 : 1.1);
    // Limit zoom scale between 0.1 and 3
    const clampedScale = Math.min(Math.max(0.1, newScale), 3);
    
    // Calculate position adjustment to zoom towards mouse position
    const scaleChange = clampedScale - scale;
    setPosition(prev => ({
      x: prev.x - mouseX * scaleChange,
      y: prev.y - mouseY * scaleChange
    }));
    
    setScale(clampedScale);
  };

  // Handle panning
  const handleMouseDown = (e) => {
    const isNode = e.target.closest('.node');
    
    // Left click for selection and dragging
    if (e.button === 0) {
      e.preventDefault();
      if (isNode) {
        // Handle node selection
        const nodeId = parseInt(isNode.dataset.nodeId);
        if (!e.shiftKey) {
          // Clear selection if shift isn't held
          if (!selectedNodes.includes(nodeId)) {
            setSelectedNodes([nodeId]);
          }
        } else {
          // Add to selection if shift is held
          if (!selectedNodes.includes(nodeId)) {
            setSelectedNodes([...selectedNodes, nodeId]);
          }
        }
        
        // Start dragging
        setIsDraggingNodes(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      } else {
        // Start selection box
        setSelecting(true);
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - position.x) / scale;
        const y = (e.clientY - rect.top - position.y) / scale;
        setSelectionStart({ x, y });
        setSelectionEnd({ x, y });
        setSelectedNodes([]); // Clear selection when starting new selection box
      }
    }
    
    // Right click (panning)
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

  // Add this new helper function to find connected nodes
  const findConnectedNodes = (nodeId) => {
    const connected = new Set();
    const traverse = (id) => {
      const node = nodes.find(n => n.id === id);
      if (!node) return;
      
      node.connections.forEach(connectedId => {
        if (!connected.has(connectedId)) {
          connected.add(connectedId);
          traverse(connectedId);
        }
      });
    };
    
    traverse(nodeId);
    return Array.from(connected);
  };

  const handleMouseMove = (e) => {
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
          return {
            ...node,
            x: node.x + dx,
            y: node.y + dy
          };
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
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = 'default';
    }
    
    if (isDraggingNodes) {
      setIsDraggingNodes(false);
      document.querySelectorAll('.node.dragging').forEach(node => {
        node.classList.remove('dragging');
      });
    }
    
    if (selecting) {
      setSelecting(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale]);

  const handleAddNode = (parentId, direction) => {
    const parentNode = nodes.find(n => n.id === parentId);
    
    // Calculate vertical spacing based on existing connections
    const existingConnections = parentNode.connections.length;
    const verticalGap = 80; // Increased gap between nodes
    const verticalOffset = (existingConnections * verticalGap) - 
                          (existingConnections > 0 ? verticalGap * (existingConnections - 1) / 2 : 0);
    
    const newNode = {
      id: Date.now(),
      text: `New node ${existingConnections + 1}`,
      x: parentNode.x + 200, // Fixed horizontal distance
      y: parentNode.y - verticalOffset,
      connections: [],
      isMainTopic: false
    };

    // Update parent's connections
    const updatedNodes = nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          connections: [...node.connections, newNode.id]
        };
      }
      return node;
    });

    setNodes([...updatedNodes, newNode]);
  };

  const handleNodeDoubleClick = (e, node) => {
    e.stopPropagation();
    const newText = prompt('Enter text:', node.text);
    if (newText) {
      setNodes(nodes.map(n => 
        n.id === node.id ? { ...n, text: newText } : n
      ));
    }
  };

  const handleDeleteNode = (e, nodeId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this node?')) {
      // Remove connections to this node
      const updatedNodes = nodes.map(node => ({
        ...node,
        connections: node.connections.filter(id => id !== nodeId)
      }));
      // Remove the node itself
      setNodes(updatedNodes.filter(node => node.id !== nodeId));
    }
  };

  const renderConnections = () => {
    return (
      <svg className="connections-layer">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>
        {nodes.map(node => {
          if (node.isMainTopic && node.connections.length > 0) {
            const connectedNodes = node.connections.map(id => 
              nodes.find(n => n.id === id)
            ).filter(Boolean);

            // Calculate positions
            const startX = node.x + 150;        // Right edge of main topic
            const verticalLineX = startX + 40;  // Vertical line position
            const mainCenterY = node.y + 25;    // Center of main topic

            return (
              <g key={`connections-${node.id}`}>
                {/* Main horizontal line from topic */}
                <path
                  d={`M ${startX} ${mainCenterY} H ${verticalLineX}`}
                  stroke="#666"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Vertical connection line */}
                {connectedNodes.length > 0 && (
                  <path
                    d={`M ${verticalLineX} ${Math.min(...connectedNodes.map(n => n.y + 25))} 
                       V ${Math.max(...connectedNodes.map(n => n.y + 25))}`}
                    stroke="#666"
                    strokeWidth="1.5"
                    fill="none"
                  />
                )}

                {/* Individual node connections */}
                {connectedNodes.map(targetNode => {
                  const targetY = targetNode.y + 25; // Center of target node
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
  };

  const handleSelectionStart = (e) => {
    const clickedNode = nodes.find(node => {
      const nodeRect = {
        left: node.x,
        right: node.x + 150, // Approximate node width
        top: node.y,
        bottom: node.y + 50  // Approximate node height
      };
      const clickX = (e.clientX - containerRef.current.getBoundingClientRect().left) / scale;
      const clickY = (e.clientY - containerRef.current.getBoundingClientRect().top) / scale;
      
      return clickX >= nodeRect.left && clickX <= nodeRect.right &&
             clickY >= nodeRect.top && clickY <= nodeRect.bottom;
    });

    if (clickedNode) {
      if (!selectedNodes.includes(clickedNode.id)) {
        setSelectedNodes([clickedNode.id]);
      }
      setIsDraggingNodes(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      e.stopPropagation();
    } else if (e.button === 0 && !e.ctrlKey && !e.shiftKey) {
      setSelecting(true);
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setSelectionStart({ x, y });
      setSelectionEnd({ x, y });
      setSelectedNodes([]);
    }
  };

  const handleNodeDrag = (e) => {
    if (isDraggingNodes && selectedNodes.length > 0) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

      setNodes(nodes.map(node => {
        if (selectedNodes.includes(node.id)) {
          return {
            ...node,
            x: node.x + dx,
            y: node.y + dy
          };
        }
        return node;
      }));

      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSelectionMove = (e) => {
    if (selecting) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setSelectionEnd({ x, y });

      // Check which nodes are in the selection
      const selectedIds = nodes.filter(node => {
        return isNodeInSelection(node, selectionStart, { x, y });
      }).map(node => node.id);
      
      setSelectedNodes(selectedIds);
    }
  };

  const handleSelectionEnd = () => {
    setSelecting(false);
  };

  const isNodeInSelection = (node, start, end) => {
    const selectionBounds = {
      left: Math.min(start.x, end.x),
      right: Math.max(start.x, end.x),
      top: Math.min(start.y, end.y),
      bottom: Math.max(start.y, end.y)
    };

    return (
      node.x >= selectionBounds.left &&
      node.x <= selectionBounds.right &&
      node.y >= selectionBounds.top &&
      node.y <= selectionBounds.bottom
    );
  };

  // Add this to prevent context menu
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const Node = ({ node, onUpdate }) => {
    // Add these states for prompt management
    const [prompt, setPrompt] = useState('');
    const [showPromptInput, setShowPromptInput] = useState(false);

    const handlePromptSubmit = async () => {
      if (!prompt.trim()) return;
      
      try {
        // Example response - replace with actual API call
        const response = "This is a sample response to your prompt...";
        
        onUpdate(node.id, {
          ...node,
          prompt: prompt,
          response: response
        });
        
        setPrompt('');
        setShowPromptInput(false);
      } catch (error) {
        console.error('Error processing prompt:', error);
      }
    };

    return (
      <div className={`node ${node.isMainTopic ? 'main-topic' : ''}`}
           style={{ left: node.x, top: node.y }}>
        {node.isMainTopic ? (
          <div className="main-topic-content">
            <div className="main-topic-title">{node.text}</div>
            
            {showPromptInput ? (
              <div className="node-prompt-section">
                <textarea
                  className="node-prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt..."
                  rows={2}
                />
                <div className="node-prompt-actions">
                  <button 
                    className="node-send-button"
                    onClick={handlePromptSubmit}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="node-send-button"
                onClick={() => setShowPromptInput(true)}
              >
                Add Prompt
              </button>
            )}
            
            {node.prompt && (
              <div className="main-topic-prompt">
                <strong>Prompt:</strong> {node.prompt}
              </div>
            )}
            
            {node.response && (
              <div className="main-topic-response">
                <strong>Response:</strong> {node.response}
              </div>
            )}
          </div>
        ) : (
          <div className="node-content">{node.text}</div>
        )}

        {/* Existing buttons */}
        <button className="add-node-btn add-right">+</button>
        {!node.isMainTopic && (
          <button className="delete-node-btn">×</button>
        )}
      </div>
    );
  };

  const renderNodeContent = (node) => {
    if (node.isMainTopic) {
      return (
        <div className="main-topic-content">
          <div className="main-topic-title">{node.text}</div>
          {node.prompt && (
            <div className="node-prompt">
              <strong>Prompt:</strong> {node.prompt}
            </div>
          )}
          {node.response && (
            <div className="node-response">
              <strong>Response:</strong>
              <pre>{node.response}</pre>
            </div>
          )}
        </div>
      );
    }
    return <div className="node-content">{node.text}</div>;
  };

  return (
    <div 
      ref={containerRef}
      className={`prompt-container ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
      onContextMenu={handleContextMenu}
    >
      {/* Add sidebar toggle button */}
      <button 
        className="toggle-sidebar-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
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
            {renderNodeContent(node)}
            <button 
              className="add-node-btn add-right"
              onClick={(e) => {
                e.stopPropagation();
                handleAddNode(node.id, 'right');
              }}
            >
              +
            </button>
            {!node.isMainTopic && (
              <button 
                className="delete-node-btn"
                onClick={(e) => handleDeleteNode(e, node.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Add zoom controls */}
      <div className="zoom-controls">
        <button onClick={() => setScale(s => Math.min(s * 1.2, 3))}>+</button>
        <button onClick={() => setScale(1)}>Reset</button>
        <button onClick={() => setScale(s => Math.max(s * 0.8, 0.1))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
      </div>

      {/* Selection box */}
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
        >
          <div className="selector-handle top-left" />
          <div className="selector-handle top-right" />
          <div className="selector-handle bottom-left" />
          <div className="selector-handle bottom-right" />
        </div>
      )}
    </div>
  );
};

export default PromptArea;