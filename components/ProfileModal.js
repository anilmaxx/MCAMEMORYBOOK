import { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ProfileModal({ rollNumber, existingMember, onClose, onSuccess }) {
  const [name, setName] = useState(existingMember?.name || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const sigPad = useRef({});

  useEffect(() => {
    // Handle resizing width of signature canvas if on a small screen
    const handleResize = () => {
      if (sigPad.current && sigPad.current.getCanvas) {
         const canvas = sigPad.current.getCanvas();
         if (canvas) {
           canvas.width = Math.min(400, window.innerWidth - 80);
         }
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // call initially
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('roll_number', rollNumber);
      formData.append('name', name);
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      if (!sigPad.current.isEmpty()) {
        const signatureBase64 = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
        formData.append('signature', signatureBase64);
      } else if (existingMember?.signature_url) {
        formData.append('existing_signature_url', existingMember.signature_url);
      }

      if (existingMember?.photo_url) {
        formData.append('existing_photo_url', existingMember.photo_url);
      }

      const res = await fetch('/api/members', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  const clearSignature = () => {
    sigPad.current.clear();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>Editing 24VV1F00{String(rollNumber).padStart(2, '0')}</h2>
        <p style={{marginBottom: '0.5rem', color: '#666'}}>Update your personal profile wall card.</p>
        
        <div style={{backgroundColor: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffeeba', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '4px', fontSize: '0.9rem'}}>
          <strong>Reminder:</strong> Please verify your details. Once you save, this profile card will become locked and <strong>cannot be edited</strong> again.
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label>Profile Photo</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*"
              onChange={e => setPhotoFile(e.target.files[0])}
            />
            {existingMember?.photo_url && !photoFile && (
               <small style={{display: 'block', marginTop: '0.5rem', color: '#555'}}>You already have a photo uploaded. Uploading a new one will replace it.</small>
            )}
          </div>
          <div className="form-group">
            <label>Your Signature</label>
            <div className="canvas-container">
              <SignatureCanvas 
                penColor="black"
                canvasProps={{width: 400, height: 150, className: 'sigCanvas'}}
                ref={sigPad}
              />
            </div>
            <button type="button" onClick={clearSignature} className="btn btn-secondary" style={{padding: '0.5rem 1rem', width: 'auto', display: 'inline-block'}}>Clear</button>
            {existingMember?.signature_url && (
               <small style={{display: 'block', marginTop: '0.5rem', color: '#555'}}>You already have a signature. Drawing a new one will replace it.</small>
            )}
          </div>
          
          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          <button type="submit" className="btn" style={{marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
