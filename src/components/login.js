// src/components/Login.js
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AlertBox from './alertbox/alertbox'



const Login = ({ setIsLoggedIn,setuserInfo }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [email, setEmail] = useState('saman.perera@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    console.log("Alert shown")
    setAlertVisible(true);
  };

  const closeAlert = () => {
    console.log("Alert closed")
    setAlertVisible(false);
    navigate('/');// Navigate to the home page
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/ystore/users/login', {
        email,
        password
      });
      console.log(response.data); // Handle the login success response here
      //alert('Login successful!');
      //Send user info to the app
      // Set user as logged in (to update nav bar)
      setIsLoggedIn(true);
      setuserInfo(response.data)
      showAlert();

              
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
            //placeholder=""  // add place holder later
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(pwd) => setPassword(pwd.target.value)}
           // placeholder=" "  // add place holder later
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    <AlertBox isOpen = {isAlertVisible} onClose={closeAlert} message="You have logged in!" />
       
    </div>
    
  );
};

export default Login;