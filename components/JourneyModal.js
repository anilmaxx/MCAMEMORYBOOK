import { useState } from 'react';

export default function JourneyModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      if (caption) formData.append('caption', caption);

      const res = await fetch('/api/journey', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to add photo');
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
        <h2 style={{fontFamily: 'var(--font-caveat)', fontSize: '2.5rem', marginBottom: '0.5rem'}}>Add a Journey Photo</h2>
        <p style={{marginBottom: '1.5rem', color: '#666', fontStyle: 'italic'}}>Upload a memory from your computer.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image File</label>
            <input 
              type="file" 
              accept="image/*"
              className="form-control" 
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label>Caption (Optional)</label>
            <input 
              type="text" 
              className="form-control" 
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write a brief caption..."
            />
          </div>
          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add to Gallery'}
          </button>
        </form>
      </div>
    </div>
  );
}
