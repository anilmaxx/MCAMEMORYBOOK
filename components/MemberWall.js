import { User } from 'lucide-react';

export default function MemberWall({ members, onMemberClick }) {
  if (!members || members.length === 0) return null;

  return (
    <div className="member-grid">
      {members.map(member => {
        const isProfileComplete = member.name && member.name.trim() !== '';
        return (
          <div 
            key={member.id} 
            className="member-card" 
            onClick={() => !isProfileComplete && onMemberClick(member.roll_number)}
            style={isProfileComplete ? { cursor: 'default' } : {}}
            title={isProfileComplete ? "This profile is locked" : "Click to setup profile"}
          >
            {member.photo_url ? (
               <img src={member.photo_url} alt={member.name} className="member-photo" />
            ) : (
               <div className="member-photo-placeholder"><User size={40} /></div>
            )}
          <div className="member-name">{member.name || `24VV1F00${String(member.roll_number).padStart(2, '0')}`}</div>
          {member.signature_url && (
            <img src={member.signature_url} alt="Signature" className="member-signature" />
          )}
        </div>
        );
      })}
    </div>
  );
}
