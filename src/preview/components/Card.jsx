
import React from 'react';

const colors = { slate800: '#161A2A', slate700: '#1E2336' };
const spacing = { xl: 24 };
const radii = { card: 24 };

export const Card = ({ children, style }) => {
  return (
    <div
      style={[
        {
          backgroundColor: colors.slate800,
          borderRadius: `${radii.card}px`,
          padding: `${spacing.xl}px`,
          border: `1px solid ${colors.slate700}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        style,
      ]}
    >
      {children}
    </div>
  );
};
