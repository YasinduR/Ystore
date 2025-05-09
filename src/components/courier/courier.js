import React, { useState,useEffect } from 'react';
import styles from '../dialogbox/dialogbox.module.css';


const CourierDialogBox = ({ isOpen, onClose, message,setCourierDetails,courierDetails }) => {
  const [phoneNumber, setPhoneNumber] = useState(courierDetails?.phoneNumber || "");
  const [deliveryAddress, setDeliveryAddress] = useState(courierDetails?.deliveryAddress || "");
  const [error,setError] = useState({phoneNumber:false,deliveryAddress:false});
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Cash on delivary by defult
  const[isSet,setisSet] = useState(false); // ensure product is set
 
  useEffect(()=>{
    if (courierDetails) {
      setPhoneNumber(courierDetails.phoneNumber);
      setDeliveryAddress(courierDetails.deliveryAddress);
      setError({ phoneNumber: false, deliveryAddress: false });
      setisSet(false);
    }
   },[courierDetails]);

   useEffect(()=>{
    if (isSet){
      console.log(courierDetails);
      onClose(true); // exit the window with data
    }
   },[isSet]);

   const validatePhoneNumber = () => {
    if (!phoneNumber.trim()) {
      setError((prevState) => ({ ...prevState, phoneNumber: "Phone number cannot be empty." }));
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      setError((prevState) => ({ ...prevState, phoneNumber: "Phone number must be exactly 10 digits." }));
    } else {
      setError((prevState) => ({ ...prevState, phoneNumber: false }));
    }
  };

  const validateAddress = () => {
    if (!deliveryAddress.trim()) {
      setError((prevState) => ({ ...prevState, deliveryAddress: "Delivery address cannot be empty." }));
    } else {
      setError((prevState) => ({ ...prevState, deliveryAddress: false }));
    }
  };

  useEffect(()=>{
    validatePhoneNumber();
   },[phoneNumber]);

   useEffect(()=>{
    validateAddress();
   },[deliveryAddress]);

   

  const handleConfirm = (e) => {
    e.preventDefault(); // Prevent form submission
  
    // If errors exist, prevent submission
    if (error.phoneNumber || error.deliveryAddress) {
      console.log("Validation failed:", error);
      return;
    }
  
    //console.log()
    // Pass details to parent component
    setCourierDetails({
      phoneNumber: phoneNumber,
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod === "cash" ? "Cash-on-Delivery" : "Online",
    });
    setisSet(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
      <form className={styles.form}>
      <h2 className={styles.formTitle}>Enter the details to proceed</h2>
  <div className={styles.inputGroup} style={{ marginBottom: error.phoneNumber ? "2px" : "20px" }}>
    <label className={styles.label}>Phone Number</label>
    <input
      type="tel"
      placeholder="Enter your phone number"
      value={phoneNumber}
      onChange={(e) => {
        setPhoneNumber(e.target.value);
      }}
      className={styles.input}
    />
    
  </div>
  {error.phoneNumber && <small className={styles.error}>{error.phoneNumber}</small>}
  <div className={styles.inputGroup} style={{ marginBottom: error.deliveryAddress ? "2px" : "20px" }}>
    <label className={styles.label}>Delivery Address</label>
    <input
      type="text"
      placeholder="Enter your delivery address"
      value={deliveryAddress}
      onChange={(e) => {
        setDeliveryAddress(e.target.value);
      }}
      className={styles.input}
    />
  </div>
  {error.deliveryAddress && <small className={styles.error}>{error.deliveryAddress}</small>}

  <label className={styles.label}>Payment Method</label>
  <div className={styles.paymentOptions}>
    <label className={styles.paymentOption}>
      <input
        type="radio"
        name="payment"
        value="cash"
        checked={paymentMethod === "cash"}
        onChange={() => setPaymentMethod("cash")}
        className={styles.radioInput}
      />
      Cash on Delivery
    </label>
    <label className={styles.paymentOption}>
      <input
        type="radio"
        name="payment"
        value="online"
        checked={paymentMethod === "online"}
        onChange={() => setPaymentMethod("online")}
        className={styles.radioInput}
      />
      Online Payment
    </label>
    </div>
  <div className={styles.buttonContainer}>
    <button className={styles.button} onClick={handleConfirm} disabled={error.phoneNumber || error.deliveryAddress}>Confirm</button>
    <button className={styles.button} onClick={handleCancel}>Cancel</button>
  </div>
</form>
      </div>
      
    </div>
  );
};

export default CourierDialogBox;