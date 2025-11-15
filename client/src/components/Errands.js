import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Errands.css';
import API_URL from '../config';

function Errands() {
  const [errands, setErrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other',
    status: 'pending',
    dueDate: '',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    fetchErrands();
  }, []);

  const fetchErrands = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/errands`);
      setErrands(response.data);
    } catch (error) {
      console.error('Error fetching errands:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/errands/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/errands`, formData);
      }
      fetchErrands();
      resetForm();
    } catch (error) {
      console.error('Error saving errand:', error);
    }
  };

  const handleEdit = (errand) => {
    setEditingId(errand._id);
    setFormData({
      title: errand.title,
      description: errand.description || '',
      type: errand.type,
      status: errand.status,
      dueDate: errand.dueDate ? errand.dueDate.substring(0, 10) : '',
      priority: errand.priority,
      notes: errand.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this errand?')) {
      try {
        await axios.delete(`${API_URL}/api/errands/${id}`);
        fetchErrands();
      } catch (error) {
        console.error('Error deleting errand:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'other',
      status: 'pending',
      dueDate: '',
      priority: 'medium',
      notes: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="errands-container">
      <div className="header">
        <h2>Research & Errands</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Errand'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="errand-form">
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
            rows="3"
          />
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="research">Research</option>
            <option value="shopping">Shopping</option>
            <option value="gift">Gift</option>
            <option value="booking">Booking</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} Errand
          </button>
        </form>
      )}

      <div className="errands-grid">
        {errands.map((errand) => (
          <div key={errand._id} className="errand-card">
            <div className="errand-header">
              <h3>{errand.title}</h3>
              <div className="errand-badges">
                <span className={`badge badge-${errand.type}`}>{errand.type}</span>
                <span className={`badge badge-priority-${errand.priority}`}>{errand.priority}</span>
              </div>
            </div>
            <p className="errand-description">{errand.description}</p>
            <div className="errand-meta">
              <p><strong>Status:</strong> <span className={`status-${errand.status}`}>{errand.status}</span></p>
              {errand.dueDate && (
                <p><strong>Due:</strong> {new Date(errand.dueDate).toLocaleDateString()}</p>
              )}
            </div>
            {errand.notes && (
              <p className="errand-notes"><strong>Notes:</strong> {errand.notes}</p>
            )}
            <div className="errand-actions">
              <button onClick={() => handleEdit(errand)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(errand._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Errands;
