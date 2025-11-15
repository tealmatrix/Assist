import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import API_URL from '../config';

function Dashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    lists: 0,
    notes: 0,
    emails: 0,
    errands: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [appointments, lists, notes, emails, errands] = await Promise.all([
        axios.get(`${API_URL}/api/appointments`),
        axios.get(`${API_URL}/api/lists`),
        axios.get(`${API_URL}/api/notes`),
        axios.get(`${API_URL}/api/emails`),
        axios.get(`${API_URL}/api/errands`),
      ]);

      setStats({
        appointments: appointments.data.length,
        lists: lists.data.length,
        notes: notes.data.length,
        emails: emails.data.filter(e => e.status === 'unread').length,
        errands: errands.data.filter(e => e.status !== 'completed').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Appointments</h3>
          <p className="stat-number">{stats.appointments}</p>
          <span className="stat-label">Total Scheduled</span>
        </div>
        <div className="stat-card">
          <h3>Lists</h3>
          <p className="stat-number">{stats.lists}</p>
          <span className="stat-label">Active Lists</span>
        </div>
        <div className="stat-card">
          <h3>Notes</h3>
          <p className="stat-number">{stats.notes}</p>
          <span className="stat-label">Total Notes</span>
        </div>
        <div className="stat-card">
          <h3>Emails</h3>
          <p className="stat-number">{stats.emails}</p>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-card">
          <h3>Errands</h3>
          <p className="stat-number">{stats.errands}</p>
          <span className="stat-label">Pending/In Progress</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
