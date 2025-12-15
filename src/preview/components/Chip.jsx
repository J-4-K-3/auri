import React from 'react';
import { colors, spacing, radii } from '../../theme/tokens';

export const Chip = ({ label, active = false, onPress, style }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <button
      onClick={onPress}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        paddingLeft: `${spacing.lg}px`,
        paddingRight: `${spacing.lg}px`,
        paddingTop: `${spacing.sm}px`,
        paddingBottom: `${spacing.sm}px`,
        borderRadius: `${radii.chip}px`,
        backgroundColor: active ? colors.peach : colors.slate800,
        border: `1px solid ${active ? colors.blush : colors.slate700}`,
        opacity: isPressed ? 0.9 : 1,
        color: active ? colors.white : colors.white,
        fontWeight: active ? '600' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        ...style
      }}
    >
      {label}
    </button>
  );
};
