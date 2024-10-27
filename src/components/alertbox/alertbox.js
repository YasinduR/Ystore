import React from 'react';
import styles from '../dialogbox/dialogbox.module.css';

const AlertBox = ({ isOpen, onClose, message }) => {
  const handleOk = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <p>{message}</p>
        <button className={styles.button} onClick={handleOk}>Ok</button>
      </div>
    </div>
  );
};

export default AlertBox;