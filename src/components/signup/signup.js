// src/components/SignUp.js
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import AlertBox from '../alertbox/alertbox'
import styles from './signup.module.css'
// function to format input to sentence case
const toSentenceCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const validateEmail=(email)=> {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    hometown: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const [Pwerror, setPwError] = useState(false); //Password error
  const [N1error, setN1Error] = useState(false); //Fisrname  error
  const [N2error, setN2Error] = useState(false); //second name error
  const [emailerror, setemailError] = useState(true); //email  error
  

  // Effect to check if passwords match
  useEffect(() => {
      if (formData.password.length>0 && formData.confirmPassword.length>0) {
        setPwError(formData.password !== formData.confirmPassword);
      } else {
        setPwError(false);
      }
    }, [formData.password, formData.confirmPassword]); 

  // Effect to sanitize input fields
  useEffect(() => {
    if(formData.firstName.length<5){
      setN1Error(true) // first namelength is not suffient
    }
    else{
      setN1Error(false)
    }
    
    if(formData.lastName.length<5){
      setN2Error(true) // last name length is not suffient
    }
    else{
      setN2Error(false)
    }
    
    const sanitizedFirstName = formData.firstName.replace(/[^A-Za-z]/g, '');
    const sanitizedLastName = formData.lastName.replace(/[^A-Za-z]/g, '');
    
    // Update formData with sanitized values
    setFormData((prev) => ({
      ...prev,
      firstName: toSentenceCase(sanitizedFirstName),
      lastName: toSentenceCase(sanitizedLastName),
    }));
  }, [formData.firstName, formData.lastName]); // Run when firstName or lastName changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password === formData.confirmPassword) {
      setPwError(false);
    } else {
      setPwError(true);
    }

    if (validateEmail(formData.email)) {
      setemailError(false);
    } else {
      setemailError(true);
    }

    if(!emailerror && !Pwerror && !N1error && !N2error){ // No errors by email pwd and name fields

      const firstname = formData.firstName;
      const lastname = formData.lastName;
      const address = formData.address;
      const hometown = formData.hometown;
      const email = formData.email;
      const password = formData.password;

      try {
        const response = await axios.post('http://localhost:8000/ystore/users', {
          firstname,
          lastname,
          address,
          hometown,
          email,
          password,
        });
    // On success, alert and navigate to home
      if (response.status === 201) {
        alert('User created successfully!');
        navigate('/'); // Redirect to home page
      }
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          if (status === 409) {
            alert('Email already exists.');
          }
          // add other alerts
        } else {
          alert('Something went wrong. Try again.');
        }
      };
    }
    else{
      let msg = "";
  
      // Collect error messages based on specific errors
      if (emailerror) {
        msg += "Invalid email format. ";
      }
      if (Pwerror) {
        msg += "Password must meet the required criteria. ";
      }
      if (N1error) {
        msg += "First name is required. ";
      }
      if (N2error) {
        msg += "Last name is required. ";
      }
      
      // Show the error messages
      alert(msg.trim());
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroupRow}>
          <label htmlFor="firstName">First Name</label>
          <div className={styles.formGroup}>
          <input 
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            pattern="[A-Za-z]+"
            onChange={handleChange}
            required
          />
          {N1error && <small className={styles.errortext}>First name must be at least 5 characters.</small>}
          </div>
        </div>
        
        <div className={styles.formGroupRow}>
          <label htmlFor="lastName">Last Name</label>
          <div className={styles.formGroup}>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            pattern="[A-Za-z]+"
            onChange={handleChange}
            required
          />
          {N2error && <small className={styles.errortext}>Last name must be at least 5 characters.</small>}
        </div>
        </div>

        <div className={styles.formGroupRow}>
          <label htmlFor="address">Address</label>
          <div className={styles.formGroup}>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
    </div>
        </div>

        <div className={styles.formGroupRow}>
          <label htmlFor="hometown">Hometown</label>
          <div className={styles.formGroup}>
          <input
            type="text"
            name="hometown"
            id="hometown"
            value={formData.hometown}
            onChange={handleChange}
            required
          />
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <label htmlFor="email">Email</label>
          <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailerror && <small className={styles.errortext} >Enter a valid email</small>}
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <label htmlFor="password">Password</label>
          <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <div className={styles.formGroupRow}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={styles.formGroup}>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {Pwerror && <small className={styles.errortext} >Passwords do not match!</small>}
        </div> 
        </div> 

        

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;