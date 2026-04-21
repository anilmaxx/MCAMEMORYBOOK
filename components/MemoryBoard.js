export default function MemoryBoard({ notes, onAddNote }) {
  return (
    <>
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <button className="btn" style={{width: 'auto', display: 'inline-block'}} onClick={onAddNote}>Add a Memory Note</button>
      </div>
      <div className="memory-board">
        {(!notes || notes.length === 0) ? (
          <div className="empty-state" style={{color: '#fff'}}>No memories shared yet. Be the first!</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="sticky-note">
              <div className="note-message">{note.message}</div>
              <div className="note-author">- {note.author_name}</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
