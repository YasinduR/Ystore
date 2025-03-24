// src/components/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AlertBox from '../alertbox/alertbox'
import DialogBox from '../dialogbox/dialogbox';
import styles from './login.module.css'
import api from '../../api'
import { UserContext } from '../../context/userContext';


const validateEmail=(email)=> {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const Login = () => {

  const { isLoggedIn, setIsLoggedIn, setUserInfo } = useContext(UserContext); // Consume UserCon
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [email, setEmail] = useState('YASINDU1@EXAMPLE.COM'); // For ease the test add defualt user acc user name and pwd
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [emailError,setemailError] =useState(false);
  const [isloginlocked,setloginlock] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
    
  };

  const closeAlert = () => {
    setAlertVisible(false);
    navigate('/');// Navigate to the home page
  };

  useEffect(()=>{
    if(!validateEmail(email)&&email.length>0){
      setError("Invalid email")
      setemailError(true)
    }
    else{
      setError(null)
      setemailError(false)
    }

  },[email])


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/users/login', { email, password });
      setIsLoggedIn(true);
      setUserInfo(response.data.user);
      console.log(response.data.user);
      // store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      
      showAlert();

    } catch (err) { 

      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError('Invalid email or password.');
          setloginlock(true) //lock login button
          setTimeout(() => {
            setloginlock(false) //unlock login button
            console.log("This message will appear after 2 seconds.");
          }, 2000);
        }
    }
    else{
      setError('Something went wrong. Try again.');
    }
  };
  };


  if(isLoggedIn && !isAlertVisible){ // Already logged in but alert not showing => when browse to login page throu url
    return(
      <div>
    <h2>You have already logged in</h2>
      </div>
  )
  }
  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroupRow}>
          <label>Email:</label>
          <div className={styles.formGroupRow}>
          <input 
            type="email"
            value={email}
            onChange={(mail) => setEmail(mail.target.value)}
            //placeholder=""  // add place holder later
            required
          />
          </div>
        </div>
        <div className={styles.formGroupRow}>
          <label>Password:</label>
          <div className={styles.formGroupRow}>
          <input 
            type="password"
            value={password}
            onChange={(pwd) => setPassword(pwd.target.value)}
           // placeholder=" "  // add place holder later
            required
          />
        </div>
        </div>
        {error && <div className={styles.errorText}>{error}</div>}
        <button disabled={emailError||isloginlocked} type="submit">Login</button>
      </form>
      
    <AlertBox isOpen = {isAlertVisible} onClose={closeAlert} message="You have logged in!" />
       
    </div>


  );
};

export default Login;