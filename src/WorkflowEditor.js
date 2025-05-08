import React, { useState, useEffect, useRef } from 'react';

// 자유 이동 가능한 노드 (디자인 업그레이드됨)
const DraggableNode = ({ id, label, x, y, width, onDrag, onDoubleClick, onEdit, onDelete, onResize }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onDrag(id, x + dx, y + dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // 노드 수평 길이 조절 핸들
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;

    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(120, width + (moveEvent.clientX - startX));
      onResize(id, newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onDoubleClick={() => onDoubleClick(id)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        backgroundColor: '#d3d3d3',
        border: '2px solid black',
        color: 'black',
        padding: '40px 20px',
        borderRadius: '12px',
        cursor: 'grab',
        userSelect: 'none',
        minWidth: '120px',
        width: width,
        textAlign: 'center',
        fontSize: '16px',
        boxSizing: 'border-box',
      }}
    >
      {label}

      {/* 수정/삭제 버튼 */}
      <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '5px' }}>
        <button onClick={(e) => { e.stopPropagation(); onEdit(id); }} style={{ fontSize: '12px' }}>✏️</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(id); }} style={{ fontSize: '12px' }}>❌</button>
      </div>

      {/* 길이 조절 핸들 */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translate(50%, -50%)',
          width: '10px',
          height: '20px',
          backgroundColor: 'black',
          cursor: 'ew-resize',
        }}
      ></div>
    </div>
  );
};

const WorkflowEditor = () => {
  const [elements, setElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const canvasRef = useRef(null);

  // 노드 추가
  const addNode = () => {
    const newNode = {
      id: `task${elements.length + 1}`,
      label: `Task ${elements.length + 1}`,
      x: 50 + elements.length * 50,
      y: 50 + elements.length * 50,
      width: 120,
    };
    setElements([...elements, newNode]);
  };

  // 노드 이동
  const handleDrag = (id, newX, newY) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, x: newX, y: newY } : el
      )
    );
  };

  // 노드 길이 조절
  const handleResize = (id, newWidth) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id ? { ...el, width: newWidth } : el
      )
    );
  };

  // 더블 클릭으로 연결 만들기
  const handleDoubleClick = (id) => {
    if (selectedNode) {
      if (selectedNode !== id) {
        setConnections((prev) => [...prev, { from: selectedNode, to: id }]);
        setSelectedNode(null);
      }
    } else {
      setSelectedNode(id);
    }
  };

  // 텍스트 수정
  const handleEdit = (id) => {
    const newText = prompt('Enter new label:');
    if (newText) {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, label: newText } : el))
      );
    }
  };

  // 삭제
  const handleDelete = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setConnections((prev) => prev.filter((conn) => conn.from !== id && conn.to !== id));
  };

  // 선과 날짜선 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 날짜 기준선 (세로)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';

    for (let i = 0; i < canvas.width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();

      ctx.fillText(`Day ${i / 100 + 1}`, i + 5, 20);
    }

    // 연결 선
    connections.forEach((conn) => {
      const fromNode = elements.find((el) => el.id === conn.from);
      const toNode = elements.find((el) => el.id === conn.to);
      if (fromNode && toNode) {
        ctx.beginPath();

        const fromX = fromNode.x + fromNode.width;
        const fromY = fromNode.y + 50;

        const toX = toNode.x;
        const toY = toNode.y + 50;

        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, [connections, elements]);

  return (
    <div style={{ display: 'flex', padding: '20px', height: '100vh' }}>
      <aside
        style={{
          width: '200px',
          backgroundColor: '#f4f4f4',
          padding: '10px',
          marginRight: '20px',
          borderRadius: '8px',
        }}
      >
        <h2>Available Tasks</h2>
        <button
          onClick={addNode}
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add New Task
        </button>
        <p style={{ marginTop: '20px', color: 'gray' }}>
          1. 노드 더블 클릭 → 2. 연결할 다른 노드 더블 클릭
        </p>
      </aside>

      <main
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#fff',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          minHeight: '400px',
        }}
      >
        <h2>Workflow Editor</h2>

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        ></canvas>

        {elements.map((el) => (
          <DraggableNode
            key={el.id}
            id={el.id}
            label={el.label}
            x={el.x}
            y={el.y}
            width={el.width}
            onDrag={handleDrag}
            onDoubleClick={handleDoubleClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onResize={handleResize}
          />
        ))}
      </main>
    </div>
  );
};

export default WorkflowEditor;
