import React from 'react';

export const ChatsScreen = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      position: 'relative',
      paddingBottom: '80px' // Add padding to account for fixed bottom nav
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '200px' // Push text down from top
      }}>
        <h1 style={{ color: 'white', fontSize: '24px', margin: 0 }}>
          Chat's coming soon
        </h1>
      </div>
    </div>
  );
};

export default ChatsScreen;

