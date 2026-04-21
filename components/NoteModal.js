import { useState } from 'react';

export default function NoteModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) {
      setError('Name and message are required.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name: name, message })
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to post note');
      }
    } catch (err) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 style={{fontFamily: 'var(--font-caveat)', fontSize: '2.5rem', marginBottom: '0.5rem'}}>Add a Memory</h2>
        <p style={{marginBottom: '1.5rem', color: '#666', fontStyle: 'italic'}}>Don't worry, it will be secret and <strong>cannot be edited</strong> once posted.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="form-group">
            <label>Your Message</label>
            <textarea 
              className="form-control" 
              style={{height: '120px', resize: 'vertical'}}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write something memorable..."
            />
          </div>
          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post on Board'}
          </button>
        </form>
      </div>
    </div>
  );
}
