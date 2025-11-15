import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lists.css';

function Lists() {
  const [lists, setLists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    items: [],
    category: 'other',
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axios.get('/api/lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/lists/${editingId}`, formData);
      } else {
        await axios.post('/api/lists', formData);
      }
      fetchLists();
      resetForm();
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  const handleEdit = (list) => {
    setEditingId(list._id);
    setFormData({
      title: list.title,
      items: list.items,
      category: list.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this list?')) {
      try {
        await axios.delete(`/api/lists/${id}`);
        fetchLists();
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        items: [...formData.items, { text: newItem, completed: false, priority: 'medium' }],
      });
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      items: [],
      category: 'other',
    });
    setEditingId(null);
    setShowForm(false);
    setNewItem('');
  };

  return (
    <div className="lists-container">
      <div className="header">
        <h2>Lists & Organization</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create List'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="list-form">
          <input
            type="text"
            placeholder="List Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="personal">Personal</option>
            <option value="family">Family</option>
            <option value="shopping">Shopping</option>
            <option value="household">Household</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
          
          <div className="items-input">
            <input
              type="text"
              placeholder="Add item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            />
            <button type="button" onClick={addItem} className="btn-secondary">Add Item</button>
          </div>

          <ul className="items-preview">
            {formData.items.map((item, index) => (
              <li key={index}>
                {item.text}
                <button type="button" onClick={() => removeItem(index)} className="btn-remove">×</button>
              </li>
            ))}
          </ul>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} List
          </button>
        </form>
      )}

      <div className="lists-grid">
        {lists.map((list) => (
          <div key={list._id} className="list-card">
            <div className="list-header">
              <h3>{list.title}</h3>
              <span className={`badge badge-${list.category}`}>{list.category}</span>
            </div>
            <ul className="list-items">
              {list.items.map((item, index) => (
                <li key={index} className={item.completed ? 'completed' : ''}>
                  {item.text}
                </li>
              ))}
            </ul>
            <div className="list-actions">
              <button onClick={() => handleEdit(list)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(list._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lists;
