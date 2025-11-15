import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Emails.css';

function Emails() {
  const [emails, setEmails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    from: '',
    to: '',
    body: '',
    account: '',
    status: 'unread',
    priority: 'medium',
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/emails');
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/emails/${editingId}`, formData);
      } else {
        await axios.post('/api/emails', formData);
      }
      fetchEmails();
      resetForm();
    } catch (error) {
      console.error('Error saving email:', error);
    }
  };

  const handleEdit = (email) => {
    setEditingId(email._id);
    setFormData({
      subject: email.subject,
      from: email.from,
      to: email.to,
      body: email.body,
      account: email.account,
      status: email.status,
      priority: email.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this email?')) {
      try {
        await axios.delete(`/api/emails/${id}`);
        fetchEmails();
      } catch (error) {
        console.error('Error deleting email:', error);
      }
    }
  };

  const handleSend = async (id) => {
    if (window.confirm('Are you sure you want to send this email?')) {
      try {
        const response = await axios.post(`/api/emails/send/${id}`);
        alert(response.data.message);
        fetchEmails();
      } catch (error) {
        console.error('Error sending email:', error);
        alert(error.response?.data?.message || 'Failed to send email. Check your email configuration.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      from: '',
      to: '',
      body: '',
      account: '',
      status: 'unread',
      priority: 'medium',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="emails-container">
      <div className="header">
        <h2>Email Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Email'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="email-form">
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="From"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="To"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Account"
            value={formData.account}
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            required
          />
          <textarea
            placeholder="Email Body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows="8"
            required
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="flagged">Flagged</option>
            <option value="responded">Responded</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Add'} Email
          </button>
        </form>
      )}

      <div className="emails-list">
        {emails.map((email) => (
          <div key={email._id} className={`email-card ${email.status}`}>
            <div className="email-header">
              <h3>{email.subject}</h3>
              <div className="email-badges">
                <span className={`badge badge-${email.status}`}>{email.status}</span>
                <span className={`badge badge-priority-${email.priority}`}>{email.priority}</span>
              </div>
            </div>
            <div className="email-meta">
              <p><strong>From:</strong> {email.from}</p>
              <p><strong>To:</strong> {email.to}</p>
              <p><strong>Account:</strong> {email.account}</p>
              <p><strong>Received:</strong> {new Date(email.receivedAt).toLocaleString()}</p>
            </div>
            <p className="email-body">{email.body}</p>
            <div className="email-actions">
              <button onClick={() => handleEdit(email)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(email._id)} className="btn-delete">Delete</button>
              {!email.isSent && (
                <button onClick={() => handleSend(email._id)} className="btn-send">Send Email</button>
              )}
              {email.isSent && (
                <span className="sent-badge">✓ Sent {new Date(email.sentAt).toLocaleString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Emails;
