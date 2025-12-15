import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiImage, FiMic, FiBarChart2, FiX, FiUsers, FiArrowUpRight } from 'react-icons/fi';
import { Button } from './components/Button';

const CreateScreen = ({ onClose, onPost }) => {
  const [tab, setTab] = useState('post');
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [hashtags, setHashtags] = useState('');
  const [visibility, setVisibility] = useState('friends');
  const [donations, setDonations] = useState(false);
  const [remix, setRemix] = useState(true);
  const [eligibleReels, setEligibleReels] = useState(false);
  const [warning, setWarning] = useState(null);
  const [publishing, setPublishing] = useState(false);

  const hasVideoSelected = media.some(item => 
    (item?.mimeType || item?.type || '').toLowerCase().includes('video')
  );

  const canPublish = tab === 'reel' 
    ? hasVideoSelected
    : tab === 'story'
    ? media.length > 0 || text.trim().length > 0
    : text.trim().length > 0 || media.length > 0;

  const handlePublish = async () => {
    setPublishing(true);
    // Simulate publishing
    setTimeout(() => {
      setPublishing(false);
      onClose();
    }, 2000);
  };

  const handleMediaPick = () => {
    // In a real app, this would open file picker
    console.log('Pick media for', tab);
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="preview-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
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
            <FiArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>
            Create
          </h2>
          <div style={{ width: '36px' }} />
        </div>

        {/* Tab Control */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '4px'
        }}>
          {['post', 'story', 'reel'].map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab === value ? '#ff8a65' : 'transparent',
                color: tab === value ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            color: 'white', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px' 
          }}>
            {tab === 'post' ? 'Post text' : tab === 'story' ? 'Story caption' : 'Reel caption'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`${tab === 'post' ? 'What\'s on your mind?' : `Share your ${tab}...`}`}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              resize: 'none',
              fontFamily: 'inherit'
            }}
            maxLength={500}
          />
        </div>

        {/* Add Media Button */}
        <Button
          title="Add media"
          onPress={handleMediaPick}
          variant="ghost"
          style={{ width: '100%', marginBottom: '24px' }}
        />

        {/* Media Preview */}
        {media.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '8px'
          }}>
            {media.map((asset, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={asset.uri}
                  alt={`media-${index}`}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => removeMedia(index)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '12px',
                    padding: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <FiX size={16} color="white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Post-specific Controls */}
        {tab === 'post' && (
          <>
            {/* Hashtags */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '8px' 
              }}>
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#auri #sunset"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white' }}>
                  Visibility: {visibility === 'friends' ? 'Friends & Family' : 'Public'}
                </span>
                <label style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.checked ? 'public' : 'friends')}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: visibility === 'public' ? '#ff8a65' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: visibility === 'public' ? '22px' : '2px',
                      transition: 'left 0.2s'
                    }} />
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white' }}>Allow Donations</span>
                <label style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    checked={donations}
                    onChange={(e) => setDonations(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: donations ? '#ffc14d' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: donations ? '22px' : '2px',
                      transition: 'left 0.2s'
                    }} />
                  </div>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white' }}>Allow Remix/Reshare</span>
                <label style={{ position: 'relative', display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    checked={remix}
                    onChange={(e) => setRemix(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: remix ? '#ff8a65' : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: remix ? '22px' : '2px',
                      transition: 'left 0.2s'
                    }} />
                  </div>
                </label>
              </div>
            </div>
          </>
        )}

        {/* Story-specific Controls */}
        {tab === 'story' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ color: 'white' }}>Also eligible for Reels</span>
            <label style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="checkbox"
                checked={eligibleReels}
                onChange={(e) => setEligibleReels(e.target.checked)}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '24px',
                backgroundColor: eligibleReels ? '#ff8a65' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: eligibleReels ? '22px' : '2px',
                  transition: 'left 0.2s'
                }} />
              </div>
            </label>
          </div>
        )}

        {/* Reel-specific Controls */}
        {tab === 'reel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white' }}>Allow Remix/Reshare</span>
              <label style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="checkbox"
                  checked={remix}
                  onChange={(e) => setRemix(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '44px',
                  height: '24px',
                  backgroundColor: remix ? '#ff8a65' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: remix ? '22px' : '2px',
                    transition: 'left 0.2s'
                  }} />
                </div>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white' }}>Allow Donations</span>
              <label style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="checkbox"
                  checked={donations}
                  onChange={(e) => setDonations(e.target.checked)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '44px',
                  height: '24px',
                  backgroundColor: donations ? '#ffc14d' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: donations ? '22px' : '2px',
                    transition: 'left 0.2s'
                  }} />
                </div>
              </label>
            </div>
            {!hasVideoSelected && (
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', margin: 0 }}>
                Pick a video clip to share as a reel.
              </p>
            )}
          </div>
        )}

        {/* Warning */}
        {warning && (
          <div style={{ 
            color: '#ff5b5b', 
            fontSize: '14px', 
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: 'rgba(255, 91, 91, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 91, 91, 0.3)'
          }}>
            {warning}
          </div>
        )}

        {/* Publish Button */}
        <Button
          title={publishing ? 'Publishing...' : 'Publish'}
          onPress={handlePublish}
          disabled={!canPublish || publishing}
          style={{ width: '100%' }}
        />

        {/* Preview Mode Notice */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '16px', 
          padding: '24px', 
          textAlign: 'center',
          marginTop: '32px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '12px' }}>Preview Mode</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Full posting features with images, videos, and circle sharing available in the app.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateScreen;

