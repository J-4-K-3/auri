
import React from 'react';

const fallbackBackgrounds = ['#FF8A65', '#F76E8E', '#FFC14D'];
const colors = { white: '#FFFFFF' };

const FallbackAvatar = ({ size }) => (
  <div
    style={{
      background: `linear-gradient(135deg, ${fallbackBackgrounds[0]} 0%, ${fallbackBackgrounds[1]} 50%, ${fallbackBackgrounds[2]} 100%)`,
      width: size,
      height: size,
      borderRadius: size / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      fontWeight: '700',
      fontSize: `${Math.floor(size * 0.4)}px`
    }}
  >
    A
  </div>
);

export const Avatar = ({ uri, size = 64, ring = false }) => {
  const innerSize = ring ? size - 6 : size;
  const hasUri = Boolean(uri);

  const core = hasUri ? (
    <img
      src={uri}
      style={{
        width: innerSize,
        height: innerSize,
        borderRadius: innerSize / 2,
        borderColor: '#000000',
        borderWidth: '1px',
        objectFit: 'cover'
      }}
      alt="Avatar"
    />
  ) : (
    <FallbackAvatar size={innerSize} />
  );

  if (!ring) {
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        {core}
      </div>
    );
  }

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${fallbackBackgrounds[0]} 0%, ${fallbackBackgrounds[1]} 50%, ${fallbackBackgrounds[2]} 100%)`,
        width: size,
        height: size,
        padding: '3px',
        borderRadius: size / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          overflow: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        {core}
      </div>
    </div>
  );
};

