import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Dashboard from './pages/Dashboard';
import Session from './pages/Session';

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session" element={<Session />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}

export default App;
