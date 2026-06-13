import React, { useState } from 'react';
import { supabase } from '@/supabase';
import { Button, Input } from 'shadcn/ui';
import { showSuccess, showError } from '@/utils/toast';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      showError('Please fill all fields');
      return;
    }
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        name 
      } 
    });
    if (error) showError('Signup failed');
    else {
      showSuccess('Account created successfully');
      // Redirect to Login page
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <form className="mb-6">
        <Input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name"
          className="w-full mb-2"
        />
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
          onClick={handleSignup} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Sign up
        </Button>
      </form>
      <p className="text-sm text-gray-600 mt-2">
        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;