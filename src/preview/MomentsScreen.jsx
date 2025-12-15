import React, { useMemo } from 'react';
import { FiLock, FiUsers, FiImage, FiMic, FiBarChart2, FiArrowUpRight } from 'react-icons/fi';

const messages = [
  "You'll have your moment soon - the universe is almost ready.",
  "We're still teaching this feature how to be iconic.",
  "Even stars wait before they shine.",
  "Hang tight - your vibe deserves the perfect timing.",
];

const moods = [
  {
    id: "calm",
    label: "Calm",
    tint: "rgba(57,182,179,0.18)",
    emoji: "😌",
  },
  {
    id: "excited",
    label: "Excited",
    tint: "rgba(255,138,101,0.18)",
    emoji: "😂",
  },
  {
    id: "angry",
    label: "Angry",
    tint: "rgba(255,91,91,0.18)",
    emoji: "😠",
  },
  {
    id: "thinking",
    label: "Reflective",
    tint: "rgba(247,110,142,0.18)",
    emoji: "🤔",
  },
  {
    id: "grateful",
    label: "Grateful",
    tint: "rgba(255,193,77,0.2)",
    emoji: "🙏",
  },
  {
    id: "focused",
    label: "Focused",
    tint: "rgba(77,156,255,0.18)",
    emoji: "🎯",
  },
];

const composerActions = [
  { id: "image", icon: FiImage, label: "Image" },
  { id: "voice", icon: FiMic, label: "Voice" },
  { id: "poll", icon: FiBarChart2, label: "Poll" },
];

const interestGroups = [
  { id: "golden-hour", label: "Golden Hour", colors: ["#FFC14D", "#FF8A65"] },
  { id: "quiet-wins", label: "Quiet Wins", colors: ["#39B6B3", "#4D9CFF"] },
  { id: "night-owls", label: "Night Owls", colors: ["#F76E8E", "#0F1220"] },
];

const utilityGroups = [
  { id: "explore", label: "Explore More", variant: "gradient", colors: ["#39B6B3", "#FF8A65"] },
  { id: "search", label: "Search Groups", variant: "surface" },
  { id: "create", label: "Create Group", variant: "surfaceAccent" },
];

export const MomentsScreen = () => {
  const message = useMemo(() => {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }, []);

  const moodRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < moods.length; i += 2) {
      rows.push(moods.slice(i, i + 2));
    }
    return rows;
  }, []);


  const LockedOverlay = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '80px', // Don't cover the bottom navigation
      backgroundColor: 'rgba(4, 6, 12, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      zIndex: 5
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <FiLock size={48} color="white" />
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>

      <div style={{
        padding: '20px 16px 100px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        height: '100%',
        overflowY: 'auto'
      }}>
        {/* Composer Card */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Text Area */}
          <div style={{
            minHeight: '120px',
            backgroundColor: '#000',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px' }}>
              Share a moment...
            </span>
          </div>

          {/* Mood Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {moodRows.map((row, rowIndex) => (
              <div key={`mood-row-${rowIndex}`} style={{ display: 'flex', gap: '8px', marginBottom: rowIndex < moodRows.length - 1 ? '8px' : '0' }}>
                {row.map((mood, index) => (
                  <div
                    key={mood.id}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: mood.tint,
                      borderRadius: '50px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                      {mood.label}
                    </span>
                  </div>
                ))}
                {/* Fillers for odd number of moods */}
                {row.length < 2 && (
                  <div style={{ flex: 1 }} />
                )}
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {composerActions.map((action) => (
              <div
                key={action.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'transparent'
                }}
              >
                <action.icon size={16} color="white" />
                <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                  {action.label}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#000'
              }}
            >
              <FiUsers size={16} color="rgba(255, 255, 255, 0.5)" />
              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px', fontWeight: '600' }}>
                Choose space
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ff8a65',
              padding: '12px 20px',
              borderRadius: '50px'
            }}>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
                Send
              </span>
              <FiArrowUpRight size={16} color="white" />
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>
            Suggested spaces
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', margin: 0 }}>
            Picked from your interests
          </p>
        </div>

        {/* Interest Groups */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {interestGroups.map((group) => (
            <div
              key={group.id}
              style={{
                flex: 1,
                borderRadius: '16px',
                padding: '20px',
                background: `linear-gradient(135deg, ${group.colors[0]}, ${group.colors[1]})`,
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0' }}>
                  {group.label}
                </h4>
                <p style={{ color: 'white', opacity: 0.8, fontSize: '12px', margin: 0 }}>
                  Launching soon
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Utility Groups */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {utilityGroups.map((group) => {
            if (group.variant === 'gradient') {
              return (
                <div
                  key={group.id}
                  style={{
                    flex: 1,
                    borderRadius: '16px',
                    padding: '20px',
                    background: `linear-gradient(135deg, ${group.colors[0]}, ${group.colors[1]})`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  }}
                >
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '700' }}>
                    {group.label}
                  </span>
                </div>
              );
            }
            return (
              <div
                key={group.id}
                style={{
                  flex: 1,
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: group.variant === 'surfaceAccent' ? '#000' : '#111',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <span style={{ 
                  color: 'white', 
                  fontSize: '14px', 
                  fontWeight: '700' 
                }}>
                  {group.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <p style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '13px',
          lineHeight: '20px',
          textAlign: 'center',
          margin: '20px 0 0 0'
        }}>
          Moments are disabled at the "moment". Soon you'll post with moods, voices and polls
        </p>
      </div>
      
      <LockedOverlay />
    </div>
  );
};

export default MomentsScreen;

