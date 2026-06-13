import React, { useState } from 'react';
import { supabase } from '@/supabase';
import { Button, Input } from 'shadcn/ui';
import { showSuccess, showError } from '@/utils/toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Please enter email and password');
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showError('Login failed');
    else {
      showSuccess('Logged in successfully');
      // Redirect to Home page
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="mb-6">
        <Input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email"
          className="w-full mb-2"
        />
        <Input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password"
          className="w-full mb-2"
        />
        <Button 
          onClick={handleLogin} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Login
        </Button>
      </form>
      <p className="text-sm text-gray-600 mt-2">
        Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;