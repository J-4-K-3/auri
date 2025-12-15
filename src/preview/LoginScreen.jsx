

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from './components/Input.jsx';
import { Button } from './components/Button';

const LoginScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState("you@auri.app");
  const [password, setPassword] = useState("AuriPass1");

  const handleLogin = () => {
    // Just navigate back to Home - no real authentication
    onNavigate('Home');
  };


  const handleForgot = () => {
    alert("Password reset link (mock) sent to your inbox.");
  };

  const handleSignup = () => {
    onNavigate('SignupCreds');
  };

  return (
    <div className="preview-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: 'white' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Your circle has been waiting.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@auri.app"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
          />
          <button 
            onClick={handleForgot}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'rgba(255, 255, 255, 0.7)', 
              textAlign: 'left',
              padding: 0,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Forgot password?
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Button 
            title="Sign in" 
            onPress={handleLogin} 
          />
          
          <div style={{ textAlign: 'left', color: 'rgba(255, 255, 255, 0.7)' }}>
            New here?{' '}
            <span 
              onClick={handleSignup}
              style={{ 
                color: 'white', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              Create account
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;