import React, { useState, useEffect } from 'react';
import { Trash2, Check } from 'lucide-react';

export default function MessageList({ token }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data);
      } else {
        setError(data.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentStatus }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setMessages(messages.filter((msg) => msg._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading messages...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
        Received Messages ({messages.length})
      </h3>

      {messages.length === 0 ? (
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem' }}>
          No messages received yet.
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} style={{ opacity: msg.read ? 0.6 : 1 }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{msg.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{msg.email}</div>
                  </td>
                  <td>{msg.subject || '(No Subject)'}</td>
                  <td>
                    <div style={{ maxH: '80px', overflowY: 'auto', whiteSpace: 'pre-wrap', maxW: '300px', fontSize: '0.9rem' }}>
                      {msg.message}
                    </div>
                  </td>
                  <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: msg.read ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.15)',
                      color: msg.read ? 'var(--text-secondary)' : '#34d399'
                    }}>
                      {msg.read ? 'Read' : 'New'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-btn-group">
                      <button
                        onClick={() => toggleReadStatus(msg._id, msg.read)}
                        className="admin-btn-edit"
                        title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                        style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="admin-btn-delete"
                        title="Delete Message"
                        style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
