export default function JourneyGallery({ photos, onAddPhoto }) {
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
            <div key={photo.id} className="gallery-item">
              <img src={photo.url} alt={photo.caption || 'Journey Photo'} className="gallery-img" />
              {photo.caption && <div className="gallery-caption">{photo.caption}</div>}
            </div>
          ))
        )}
      </div>
    </>
  );
}
