import React, { useState } from 'react';
import { motion } from 'framer-motion';

import Input from './components/Input.jsx';
import { Button } from './components/Button';
import { Chip } from './components/Chip';

const interestOptions = [
  "Travel", "Food", "Photography", "Music", "Wellness", "Fashion",
  "Tech", "Outdoors", "Art", "Gaming", "Books", "Film", "Fitness"
];

const EditProfileScreen = ({ user, onClose, onSave }) => {
  const profile = user?.profile || {
    name: user?.name || 'Preview User',
    avatarUri: '/auri_logo.png',
    bio: 'Staying close, softly.',
    location: 'Lisbon, PT',
    interests: ['Travel', 'Photography', 'Music']
  };

  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [interests, setInterests] = useState(profile.interests);
  const [isSaving, setIsSaving] = useState(false);

  const toggleInterest = (option) => {
    setInterests((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }
      return [...prev, option];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    setTimeout(() => {
      if (onSave) {
        onSave({
          ...profile,
          name: name.trim(),
          bio: bio.trim(),
          location: location.trim(),
          interests: interests
        });
      }
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="preview-screen" style={{ paddingTop: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '18px',
              marginRight: '16px',
              cursor: 'pointer'
            }}
          >
            ←
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>
            Edit Profile
          </h2>
        </div>

        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="preview-avatar">
            <img src={profile.avatarUri} alt="Avatar" className="preview-avatar-image" />
          </div>
          <Button
            title="Change Avatar"
            onPress={() => {/* In full app, this would open image picker */}}
            variant="ghost"
            style={{ marginTop: '16px' }}
          />
        </div>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
          />

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Your city, country"
          />
        </div>

        {/* Interests Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'white' }}>
            Interests
          </h3>
          <div className="preview-chips">
            {interestOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                active={interests.includes(option)}
                onPress={() => toggleInterest(option)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <Button 
            title={isSaving ? "Saving..." : "Save Changes"}
            onPress={handleSave}
            disabled={!name.trim() || isSaving}
            style={{ flex: 1 }}
          />
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '16px', 
          padding: '24px', 
          textAlign: 'center',
          marginTop: '32px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '12px' }}>Preview Mode</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Full profile editing features available in the app.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileScreen;