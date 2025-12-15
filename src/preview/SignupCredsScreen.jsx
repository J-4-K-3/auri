
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from './components/Input.jsx';

import { Button } from './components/Button.jsx';

const SignupCredsScreen = ({ onNavigate }) => {
  const [email, setEmail] = useState("you@auri.app");
  const [password, setPassword] = useState("AuriPass1");
  const [confirm, setConfirm] = useState("AuriPass1");

  const handleContinue = () => {
    // Just navigate to profile setup - no real authentication
    onNavigate('SignupProfile');
  };

  const handleLogin = () => {
    onNavigate('Login');
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
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '8px', color: 'white' }}>
            Secure your space
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)' }}>
            We keep Auri safe for you and your circle.
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
            placeholder="Create a secure password"
          />
          <Input
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="Confirm your password"
          />

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <Button 
            title="Continue" 
            onPress={handleContinue} 
          />
        </div>

        <div style={{ textAlign: 'left', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '20px' }}>
          Already have an account?{' '}
          <span 
            onClick={handleLogin}
            style={{ 
              color: 'white', 
              fontWeight: '600', 
              cursor: 'pointer' 
            }}
          >
            Login
          </span>
        </div>

        <div style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.6)', 
          fontSize: '16px',
          marginTop: 'auto'
        }}>
          By creating an account, you agree to our{' '}
          <span style={{ color: 'white', fontWeight: '600', cursor: 'pointer' }}>
            Terms of Service
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupCredsScreen;