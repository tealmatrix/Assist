import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css';
import API_URL from '../config';

function Calendar() {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    startDate: '',
    endDate: '',
    location: '',
    attendees: [],
    status: 'scheduled',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('${API_URL}/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/appointments/${editingId}`, formData);
      } else {
        await axios.post('${API_URL}/api/appointments', formData);
      }
      fetchAppointments();
      resetForm();
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);
    setFormData({
      title: appointment.title,
      description: appointment.description || '',
      type: appointment.type,
      startDate: appointment.startDate.substring(0, 16),
      endDate: appointment.endDate.substring(0, 16),
      location: appointment.location || '',
      attendees: appointment.attendees || [],
      status: appointment.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${API_URL}/api/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'other',
      startDate: '',
      endDate: '',
      location: '',
      attendees: [],
      status: 'scheduled',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <h2>Calendar & Appointments</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Appointment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="appointment-form">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="doctor">Doctor</option>
            <option value="salon">Salon</option>
            <option value="kids-activity">Kids Activity</option>
            <option value="homeschool">Homeschool</option>
            <option value="meeting">Meeting</option>
            <option value="personal">Personal</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} Appointment
          </button>
        </form>
      )}

      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="appointment-card">
            <div className="appointment-header">
              <h3>{appointment.title}</h3>
              <span className={`badge badge-${appointment.type}`}>{appointment.type}</span>
            </div>
            <p>{appointment.description}</p>
            <div className="appointment-details">
              <p><strong>Start:</strong> {new Date(appointment.startDate).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(appointment.endDate).toLocaleString()}</p>
              {appointment.location && <p><strong>Location:</strong> {appointment.location}</p>}
              <p><strong>Status:</strong> <span className={`status-${appointment.status}`}>{appointment.status}</span></p>
            </div>
            <div className="appointment-actions">
              <button onClick={() => handleEdit(appointment)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(appointment._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
