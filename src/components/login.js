// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/ystore/users/login', {
        email,
        password
      });

      console.log(response.data); // Handle the login success response here
      alert('Login successful!');
      setIsLoggedIn(true);  // Set user as logged in (to update nav bar)
      navigate('/');        // Navigate to the home page
    } catch (err) { 
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError('Invalid username or password.');
        }
    }
    else{
      setError('Something went wrong. Try again.');
    }
  };
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(mail) => setEmail(mail.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(pwd) => setPassword(pwd.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;