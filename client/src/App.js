import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Calendar from './components/Calendar';
import Lists from './components/Lists';
import Notes from './components/Notes';
import Emails from './components/Emails';
import Errands from './components/Errands';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Personal Assistant</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/lists">Lists</Link></li>
            <li><Link to="/notes">Notes</Link></li>
            <li><Link to="/emails">Emails</Link></li>
            <li><Link to="/errands">Errands</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/emails" element={<Emails />} />
            <Route path="/errands" element={<Errands />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
