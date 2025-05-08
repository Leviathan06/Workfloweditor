// src/Sidebar.js
import React from 'react';

const nodeTypes = [
  { type: 'default', label: '기본 프로세스' },
  { type: 'approval', label: '승인 단계' },
  { type: 'file', label: '파일 첨부' },
  // 더 필요한 노드 타입을 여기에 추가
];

function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-1/5 bg-gray-100 p-4 space-y-2">
      <h3 className="font-bold mb-2">노드 추가하기</h3>
      {nodeTypes.map(({ type, label }) => (
        <div
          key={type}
          className="p-2 bg-white rounded shadow cursor-move hover:bg-gray-50"
          draggable
          onDragStart={(e) => onDragStart(e, type)}
        >
          {label}
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;