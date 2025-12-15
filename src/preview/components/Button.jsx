


import React from 'react';

const colors = { white: '#FFFFFF' };
const gradients = { warm: ['#FF8A65', '#F76E8E'], subtle: ['#39B6B3', '#1E2336'] };
const spacing = { lg: 16, xl: 24, md: 12 };
const radii = { pill: 48 };

const gradientMap = {
  primary: gradients.warm,
  subtle: gradients.subtle,
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessory,
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const baseStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.lg}px ${spacing.xl}px`,
    borderRadius: `${radii.pill}px`,
    gap: `${spacing.md}px`,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    opacity: disabled ? 0.6 : (isPressed ? 0.9 : 1),
    width: '100%',
    ...style
  };

  const textStyle = {
    color: variant === 'ghost' ? colors.white : colors.white,
    fontWeight: '600',
    fontSize: '16px',
    margin: 0,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderTop: '2px solid #FFFFFF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      );
    }

    return (
      <>
        <span style={textStyle}>{title}</span>
        {accessory}
      </>
    );
  };

  const getButtonStyle = () => {
    if (variant === 'primary') {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${gradientMap.primary[0]} 0%, ${gradientMap.primary[1]} 100%)`,
      };
    } else if (variant === 'subtle') {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, ${gradientMap.subtle[0]} 0%, ${gradientMap.subtle[1]} 100%)`,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        border: `1px solid ${colors.white}20`,
      };
    }
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={getButtonStyle()}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderContent()}
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

