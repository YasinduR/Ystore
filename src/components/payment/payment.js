import React from "react";
import styles from "./payment.module.css";

const PaymentPage = ({ isOpen, onClose }) => {
  const handlePayment = () => {
    // Business logic here
    onClose(true); // Close modal/page
    // navigate("/");
  };
  const cancelPayement = () =>{
    onClose(false);
  }

  if (!isOpen) {
    return null;
  }

  return (// complete this with acrual buisness logic later
    <div className={styles.overlay}>
      <div className={styles.box}>
      <h2>Mock Payment Gateway</h2>
      <p>Proceed with your online payment.</p>
      
      <button className={styles.button} onClick={handlePayment}>
        Confirm 
      </button>
      <button className={styles.button} onClick={cancelPayement}>
        Cancel
      </button>
    </div>
    </div>
  );
};

export default PaymentPage;