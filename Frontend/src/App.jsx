// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// necessary'/pages/' for paths
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register'; // --- ADDED: Register Import ---

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} /> {/* --- ADDED: Register Route --- */}
      </Routes>
    </Router>
  );
}

export default App;