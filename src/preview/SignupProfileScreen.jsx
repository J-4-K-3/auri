
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from './components/Input.jsx';
import { Button } from './components/Button';
import { Chip } from './components/Chip';

const interestOptions = [
  "Travel", "Food", "Photography", "Music", "Wellness", "Fashion",
  "Tech", "Outdoors", "Art", "Gaming", "Books", "Film", "Fitness"
];

const DEFAULT_AVATAR_URI = "/auri_logo.png";

const SignupProfileScreen = ({ onNavigate }) => {
  const [name, setName] = useState("You");
  const [age, setAge] = useState("24");
  const [avatar, setAvatar] = useState(null);
  const [location, setLocation] = useState("Lisbon, PT");
  const [interests, setInterests] = useState(["Travel", "Photography", "Music"]);
  const [bio, setBio] = useState("Staying close, softly.");
  const [status, setStatus] = useState("Available for cozy coffee chats.");
  const [donationLink, setDonationLink] = useState("");
  const [referral, setReferral] = useState("");
  const [saving, setSaving] = useState(false);


  // Toggle interest selection
  const toggleInterest = (option) => {
    setInterests((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      }
      return [...prev, option];
    });
  };

  // Handle avatar selection (just for preview - no upload)
  const handleAvatarPick = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission - just navigate back to Home
  const handleFinish = async () => {
    setSaving(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      onNavigate('Home');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="preview-screen" style={{ paddingTop: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
          Let people meet the real you
        </h1>

        {/* Avatar Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="preview-avatar" onClick={() => document.getElementById('avatar-input').click()}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="preview-avatar-image" />
            ) : (
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Add avatar</span>
            )}
          </div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarPick}
            style={{ display: 'none' }}
          />

          <Button
            title="Add Avatar"
            onPress={() => document.getElementById('avatar-input').click()}
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
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            placeholder="Your age"
          />


          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="Your city, country"
          />

          <Input
            label="Quick Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
          />

          <Input
            label="Status"
            value={status}
            onChangeText={setStatus}
            placeholder="What are you up to?"
          />

          <Input
            label="Donation Link (optional)"
            value={donationLink}
            onChangeText={setDonationLink}
            placeholder="https://paypal.me/aurisupport"
            autoCapitalize="none"
          />

          <Input
            label="Referral Code (optional)"
            value={referral}
            onChangeText={setReferral}
            placeholder="Enter a code"
          />
        </div>

        {/* Interests Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'white' }}>
            Pick your interests
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px', fontSize: '14px' }}>
            At least three so we can tune your feed.
          </p>
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

        <div style={{ marginTop: '32px' }}>
          <Button 
            title="Finish" 
            onPress={handleFinish} 
            loading={saving}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SignupProfileScreen