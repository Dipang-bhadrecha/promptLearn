import { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/canvas.css';

export default function CanvasBoard() {
  const boardRef = useRef(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // main prompt input
  const [input, setInput] = useState('');

  // additional draggable prompt cards
  const [cards, setCards] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // main prompt bar position (make it draggable)
  const [mainBarPos, setMainBarPos] = useState({ x: 0, y: 0 });
  const [isDraggingMainBar, setIsDraggingMainBar] = useState(false);
  const [mainBarDragOffset, setMainBarDragOffset] = useState({ x: 0, y: 0 });

  const viewportToBoard = useCallback((clientX, clientY) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / zoom - pan.x;
    const y = (clientY - rect.top) / zoom - pan.y;
    return { x, y };
  }, [pan, zoom]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const { clientX, clientY, deltaY } = e;
      const factor = 1 + (deltaY > 0 ? -0.1 : 0.1);
      const before = viewportToBoard(clientX, clientY);
      const nextZoom = Math.min(3, Math.max(0.25, zoom * factor));
      const rect = boardRef.current.getBoundingClientRect();
      const nx = (clientX - rect.left) / nextZoom - before.x;
      const ny = (clientY - rect.top) / nextZoom - before.y;
      setPan({ x: -nx, y: -ny });
      setZoom(nextZoom);
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX / zoom, y: prev.y - e.deltaY / zoom }));
    }
  }, [viewportToBoard, zoom]);

  const onMouseDown = useCallback((e) => {
    // only pan with right click
    if (e.button === 2) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      e.preventDefault();
    }
  }, []);

  const onMouseMove = useCallback((e) => {
    if (isPanning) {
      const dx = (e.clientX - panStart.x) / zoom;
      const dy = (e.clientY - panStart.y) / zoom;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isDraggingMainBar) {
      setMainBarPos(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (draggingId) {
      const { x, y } = viewportToBoard(e.clientX, e.clientY);
      setCards(prev => prev.map(c => c.id === draggingId ? { ...c, x: x - dragOffset.x, y: y - dragOffset.y } : c));
    }
  }, [isPanning, panStart, zoom, isDraggingMainBar, draggingId, dragOffset, viewportToBoard]);

  const onMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDraggingMainBar(false);
    setDraggingId(null);
  }, []);

  const onContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // double click to add a new empty prompt card
  const onDoubleClick = useCallback((e) => {
    const { x, y } = viewportToBoard(e.clientX, e.clientY);
    const id = `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setCards(prev => [...prev, { id, x, y, prompt: 'Ask anything', response: '', w: 280 }]);
    setSelectedId(id);
  }, [viewportToBoard]);

  const startDragCard = (e, id) => {
    const { x, y } = viewportToBoard(e.clientX, e.clientY);
    const card = cards.find(c => c.id === id);
    setDraggingId(id);
    setDragOffset({ x: x - card.x, y: y - card.y });
  };

  const startDragMainBar = (e) => {
    setIsDraggingMainBar(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const promptText = input.trim();
    setInput('');

    // place new card at the center of the current viewport
    const rect = boardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 - 80;
    const { x, y } = viewportToBoard(centerX, centerY);

    const id = `card_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newCard = { id, x, y, prompt: promptText, response: 'Thinking…', w: 320 };
    setCards(prev => [...prev, newCard]);
    setSelectedId(id);

    // simulate response; replace with real API
    setTimeout(() => {
      setCards(prev => prev.map(c => c.id === id ? { ...c, response: `This is a response to: ${promptText}` } : c));
    }, 700);
  };

  return (
    <div className="cb-root" onContextMenu={onContextMenu}>
      {/* Non-deletable floating main prompt bar */}
      <div 
        className="cb-mainbar"
        style={{ 
          left: `${mainBarPos.x}px`, 
          top: `${mainBarPos.y}px`,
          transform: 'none'
        }}
        onMouseDown={startDragMainBar}
      >
        <form className="cb-mainbar-inner" onSubmit={sendMessage}>
          <button type="button" className="cb-plus" title="New">+</button>
          <input
            className="cb-input"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="cb-actions">
            <button type="button" className="cb-voice" title="Voice">🎤</button>
            <button type="submit" className="cb-send" title="Send">↵</button>
          </div>
        </form>
      </div>

      {/* Grey board */}
      <div
        ref={boardRef}
        className={`cb-board ${isPanning ? 'panning' : ''}`}
        style={{ transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px) scale(${zoom})` }}
        onWheel={handleWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      >
        {cards.map(card => (
          <div
            key={card.id}
            className={`cb-card ${selectedId === card.id ? 'selected' : ''}`}
            style={{ left: card.x, top: card.y, width: card.w }}
            onMouseDown={(e) => {
              // Left click to select
              setSelectedId(card.id);
            }}
            onDoubleClick={(e) => {
              // Double click to edit prompt
              if (e.target.classList.contains('cb-card-textarea')) {
                e.target.focus();
              }
            }}
          >
            <div 
              className="cb-card-header" 
              onMouseDown={(e) => {
                // Left click on header to start dragging
                startDragCard(e, card.id);
              }}
            >
              Prompt Card
            </div>
            <div className="cb-card-section prompt">
              <div className="cb-card-label">Prompt</div>
              <textarea
                className="cb-card-textarea"
                value={card.prompt}
                onChange={(e) => setCards(prev => prev.map(c => c.id === card.id ? { ...c, prompt: e.target.value } : c))}
                placeholder="Type your prompt here..."
              />
            </div>
            <div className="cb-card-section response">
              <div className="cb-card-label">Response</div>
              <div className="cb-card-response">{card.response}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom-right zoom */}
      <div className="cb-zoom">
        <button onClick={() => setZoom(z => Math.min(3, z * 1.2))}>+</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.max(0.25, z * 0.8))}>-</button>
      </div>
    </div>
  );
}


