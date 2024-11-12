import React from 'react';
import styles from './contact.module.css'

const Contact = () => {
  return (
    <div>
<h1 >Contact Us</h1>

<p style={{margin: '15px'}}>We’d love to hear from you! At YStore, customer satisfaction is our top priority, and we’re here to assist you with any questions, feedback, or support you may need. Whether you’re looking for help with an order, have a suggestion for our team, or simply want to learn more about our services, feel free to get in touch. Our team is ready to provide you with prompt, friendly, and helpful assistance.</p>
<div className ={styles.contacts}>
<p><strong>Email</strong>: support@ystore.lk</p>
<p><strong>Phone</strong>: +94 77 123 4567</p>
<p><strong>Location</strong>: 123 Galle Road, Colombo 03, Sri Lanka.</p>
</div>
</div>
  );
};

export default Contact;