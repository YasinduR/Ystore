// src/components/Login.js
import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import AlertBox from '../alertbox/alertbox'
import styles from './login.module.css'



const validateEmail=(email)=> {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const Login = ({ setIsLoggedIn,setuserInfo }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [email, setEmail] = useState('saman.perera@example.com'); // For ease the test add defualt user acc user name and pwd
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [emailError,setemailError] =useState(false)
  const [isloginlocked,setloginlock] = useState(false)

  const showAlert = () => {
    console.log("Alert shown")
    setAlertVisible(true);
    
  };

  const closeAlert = () => {
    console.log("Alert closed")
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