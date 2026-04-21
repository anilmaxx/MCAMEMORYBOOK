'use client';

import { useState } from 'react';

export default function JourneyGallery({ photos, onAddPhoto }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <button className="btn" style={{width: 'auto', display: 'inline-block'}} onClick={onAddPhoto}>Add a Photo</button>
      </div>
      <div className="gallery-grid">
        {(!photos || photos.length === 0) ? (
          <div className="empty-state">No photos shared yet. Be the first!</div>
        ) : (
          photos.map(photo => (
            <div 
              key={photo.id} 
              className="gallery-item" 
              onClick={() => setSelectedPhoto(photo)}
              style={{cursor: 'pointer'}}
            >
              <img src={photo.url} alt={photo.caption || 'Journey Photo'} className="gallery-img" />
              {photo.caption && <div className="gallery-caption">{photo.caption}</div>}
            </div>
          ))
        )}
      </div>

      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" style={{maxWidth: '900px', backgroundColor: 'transparent', boxShadow: 'none', padding: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}} onClick={e => e.stopPropagation()}>
            <button className="close-btn" style={{position: 'absolute', top: '-40px', right: '0', color: 'white', fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}} onClick={() => setSelectedPhoto(null)}>✕</button>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption || 'Full size'} style={{maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
            {selectedPhoto.caption && (
              <div style={{color: 'white', marginTop: '1rem', fontFamily: 'var(--font-caveat)', fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
