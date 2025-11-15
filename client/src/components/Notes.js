import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notes.css';
import API_URL from '../config';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/notes/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/notes`, formData);
      }
      fetchNotes();
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setFormData({
      title: note.title,
      content: note.content,
      tags: note.tags || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${API_URL}/api/notes/${id}`);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: [],
    });
    setEditingId(null);
    setShowForm(false);
    setTagInput('');
  };

  return (
    <div className="notes-container">
      <div className="header">
        <h2>Notes</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Note'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            placeholder="Note Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Note Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="10"
            required
          />
          
          <div className="tags-input">
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button type="button" onClick={addTag} className="btn-secondary">Add Tag</button>
          </div>

          <div className="tags-list">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="tag-remove">×</button>
              </span>
            ))}
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Create'} Note
          </button>
        </form>
      )}

      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p className="note-content">{note.content}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="note-actions">
              <button onClick={() => handleEdit(note)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(note._id)} className="btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
