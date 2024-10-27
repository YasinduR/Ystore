import React from 'react';
import styles from './dialogbox.module.css';

const DialogBox = ({ isOpen, onClose, message }) => {
  const handleYes = () => {
    onClose(true);
  };

  const handleNo = () => {
    onClose(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <p>{message}</p>
        <button className={styles.button} onClick={handleYes}>Yes</button>
        <button className={styles.button} onClick={handleNo}>No</button>
      </div>
    </div>
  );
};

export default DialogBox;