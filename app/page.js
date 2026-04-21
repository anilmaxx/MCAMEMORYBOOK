'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import JourneyGallery from '@/components/JourneyGallery';
import MemberWall from '@/components/MemberWall';
import MemoryBoard from '@/components/MemoryBoard';
import AuthModal from '@/components/AuthModal';
import ProfileModal from '@/components/ProfileModal';
import NoteModal from '@/components/NoteModal';
import JourneyModal from '@/components/JourneyModal';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRollNumber, setSelectedRollNumber] = useState(null);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);

  const [members, setMembers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, notesRes, journeyRes] = await Promise.all([
        fetch('/api/members').then(res => res.json()),
        fetch('/api/notes').then(res => res.json()),
        fetch('/api/journey').then(res => res.json())
      ]);
      if (membersRes.success) setMembers(membersRes.members);
      if (notesRes.success) setNotes(notesRes.notes);
      if (journeyRes.success) setPhotos(journeyRes.photos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const requireAuth = (callback) => {
    if (isAuthenticated) {
      callback();
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleMemberClick = (rollNumber) => {
    requireAuth(() => {
      setSelectedRollNumber(rollNumber);
      setProfileModalOpen(true);
    });
  };

  const handleAddNote = () => {
    requireAuth(() => setNoteModalOpen(true));
  };

  const handleAddPhoto = () => {
    requireAuth(() => setJourneyModalOpen(true));
  };

  return (
    <>
      <Hero />
      <main className="container">

      <div className="section" id="journey">
        <h2 className="section-title">Our Journey</h2>
        <JourneyGallery photos={photos} onAddPhoto={handleAddPhoto} />
      </div>

      <div className="section" id="members">
        <h2 className="section-title">Our People</h2>
        <MemberWall members={members} onMemberClick={handleMemberClick} />
      </div>

      <div className="section" id="memory-board">
        <h2 className="section-title">Memory Board</h2>
        <MemoryBoard notes={notes} onAddNote={handleAddNote} />
      </div>

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setAuthModalOpen(false);
          }}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          rollNumber={selectedRollNumber}
          existingMember={members.find(m => m.roll_number === selectedRollNumber)}
          onClose={() => setProfileModalOpen(false)}
          onSuccess={() => {
            setProfileModalOpen(false);
            fetchData();
          }}
        />
      )}

      {noteModalOpen && (
        <NoteModal
          onClose={() => setNoteModalOpen(false)}
          onSuccess={() => {
            setNoteModalOpen(false);
            fetchData();
          }}
        />
      )}

      {journeyModalOpen && (
        <JourneyModal
          onClose={() => setJourneyModalOpen(false)}
          onSuccess={() => {
            setJourneyModalOpen(false);
            fetchData();
          }}
        />
      )}
    </main>
    </>
  );
}
