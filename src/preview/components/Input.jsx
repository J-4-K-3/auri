
import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  style, 
  onChangeText, 
  keyboardType, 
  autoCapitalize, 
  secureTextEntry,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  // Filter out React Native specific props for HTML input
  const inputProps = { ...props };
  
  // Remove React Native props that shouldn't be passed to HTML
  delete inputProps.keyboardType;
  delete inputProps.autoCapitalize;
  delete inputProps.secureTextEntry;
  delete inputProps.onPress;
  delete inputProps.variant;

  // Map React Native keyboardType to HTML inputType
  let inputType = props.type || 'text';
  if (keyboardType === 'number-pad' || keyboardType === 'numeric') {
    inputType = 'number';
  }

  return (
    <div style={{ width: '100%' }}>
      {label ? (
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '8px',
          fontWeight: '500',
          fontSize: '14px'
        }}>
          {label}
        </div>
      ) : null}
      <input
        ref={ref}
        type={inputType}
        onChange={handleChange}
        autoCapitalize={autoCapitalize === 'none' ? 'none' : undefined}
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${error ? '#FF5A5F' : 'rgba(255, 255, 255, 0.2)'}`,
          color: '#FFFFFF',
          fontSize: '16px',
          outline: 'none',
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          boxSizing: 'border-box',
          ...style
        }}
        {...inputProps}
      />
      {error ? (
        <div style={{
          color: '#FF5A5F',
          marginTop: '4px',
          fontSize: '12px'
        }}>
          {error}
        </div>
      ) : null}
    </div>
  );

});

Input.displayName = 'Input';

export default Input;
