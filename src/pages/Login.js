import React, { useState } from 'react';
import { supabase } from '../config/client';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [action, setAction] = useState('Sign Up');

  const handleSignUp = async () => {
    try {
      // Sign up user with email and password
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
  
      if (!user) {
        throw new Error('User signup failed');
      }
  
      // Store user details in Supabase
      await addUserToDatabase(user.id, email, username);
  
      // You can add further logic here, such as redirecting the user to another page
      onLogin(); // Call onLogin to update the authentication state
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      // Sign in user with email and password
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      // You can add further logic here, such as redirecting the user to another page
      onLogin(); // Call onLogin to update the authentication state
    } catch (err) {
      console.error(err);
    }
  };

  // Function to add user details to Supabase
  const addUserToDatabase = async (userId, email, username) => {
    try {
      // Add user details to Supabase users table
      const { error } = await supabase
        .from('users')
        .insert([{ id: userId, email, username }]);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error adding user to database: ', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src="/person.png" alt="User Icon" />
            <input
              type="text"
              placeholder='User Name'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        
        <div className="input">
          <img src="/email.png" alt="Email Icon" />
          <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src="/password.png" alt="Password Icon" />
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {action === "Sign Up" ? null : (
          <div className="forgot-password"><span>Forgot Password?</span></div>
        )}
        
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={action === "Login" ? handleLogin : handleSignUp}
          >
            {action === "Login" ? "Login" : "Sign Up"}
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
