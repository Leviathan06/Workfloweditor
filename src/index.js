import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement); // 변경된 부분

root.render(<App />);