import React from 'react';
import WorkflowEditor from './WorkflowEditor.js';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <main style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center', paddingTop: '20px' }}>워크플로우 에디터</h1>
        <WorkflowEditor />
      </main>
    </div>
  );
}

export default App;