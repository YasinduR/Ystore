import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './product.module.css';
import DialogBox from '../dialogbox/dialogbox';
import {useNavigate} from 'react-router-dom';

function ProductItem({ product, isInCart, itemCount, updateQuantity}) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    const nextImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };
  
    const prevImage = () => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    };
  
    const selectImage = (index) => {
      setCurrentImageIndex(index);
    };
  
    return (
      <div className={styles.product} key={product.id}>
        <h2>{product.name}</h2>
  
  
      {/* Image Box with Navigation */}
          <div className={styles.imageBox}>
          <img src={product.images[currentImageIndex]} alt={product.name} className={styles.productImage} />
  
          <button className={styles.prevButton} onClick={prevImage}>❮</button>
          <button className={styles.nextButton} onClick={nextImage}>❯</button>
  
  
          {/* Navigation Dots */}
          <div className={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <span
                key={index}
                onClick={() => selectImage(index)}
                className={index === currentImageIndex ? styles.activeDot : styles.dot}
              />
            ))}
          </div>
  
        </div>
      
        <p>{product.description}</p>
        <p>Stock: {product.stock}</p>
  
        {!product.special_price ? (
          <p className="original-price">Price: ${product.price}</p>
        ) : (
          <p>
            Price: <s className={styles.strike}>${product.price}</s> ${product.special_price}
          </p>
        )}
        <p>{isInCart ? `Quantity: ${itemCount}` : '\u00A0'}</p>
      <div className={styles.buttonContainer}>
    <button className={isInCart ?`${styles.button} ${styles.redbutton}`:`${styles.button} ${styles.greenbutton}`} onClick={() => updateQuantity(product.id, isInCart ? 0 : 1)}>
      {isInCart ? "Remove from Cart" : "Add to Cart"}
    </button>
    {isInCart && (
      <>
        <button className={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(product.id, itemCount + 1)}>+</button>
        <button className={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(product.id, itemCount - 1)} disabled={itemCount <= 1}>-</button>
      </>
    )}
  </div>
      </div>
    );
  }


function ProductDetails({ userInfo,setuserInfo}) {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { productId } = useParams(); // Dynamically get productId from the URL
    const [product,setProduct] =useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [{ isInCart, itemCount }, setItem] = useState({ isInCart: false, itemCount: 0 });

    const showAlert = () => {
      console.log("Alert shown")
      setAlertVisible(true);
    };
  
    const closeAlert = (login_confirmed) => {
      console.log("Alert closed")
      setAlertVisible(false);
      if(login_confirmed){
        navigate('/login');// Navigate to the login page if user wants
      }
    };
  
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/ystore/items/${productId}` ); // Update the URL as needed
                setProduct(response.data);
        
              } catch (error) {
                setError('Error fetching product data');
              } finally {
                setLoading(false);
              }
            };
        fetchProduct();
      }, []);


      useEffect(() => {
        console.log('Product:', product);
        console.log('User Info:', userInfo);
        if (product && userInfo?.cart) {
          const cartItem = userInfo.cart.find((cartItem) => cartItem.itemid === product.id);
          setItem({ isInCart: cartItem !== undefined, itemCount: cartItem?.itemcount || 0 });
        }
        else if(!userInfo){
            console.log('logout');
            setItem({ isInCart: false, itemCount: 0 });
        }
      }, [userInfo, product]);

      const updateUserInfo = async () => {
        if(userInfo){
        console.log('id: '+userInfo.id)
        const updated_userinfo_res = await axios.get(`http://localhost:8000/ystore/users/${userInfo.id}`);
        console.log(updated_userinfo_res)
        if(updated_userinfo_res){
          setuserInfo(updated_userinfo_res.data)
        }}
      }
          // Function to handle quantity update in cart via API
          const updateQuantity = async (itemid,newQuantity) => {
            try {
              if (userInfo){
              await axios.post(`http://localhost:8000/ystore/users/cart`, {
                id: userInfo.id,
                itemid: itemid,
                itemcount: newQuantity
              });
               updateUserInfo()
            }
            else{
              showAlert(); // invoke the alert to force log-in
            }
          
            } catch (error) {
              console.error('Error updating quantity:', error);
            }
          };
    
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
    <ProductItem
          product={product}
          isInCart={isInCart}
          itemCount={itemCount}
          updateQuantity={updateQuantity}
        />
    <DialogBox 
    isOpen = {isAlertVisible} 
    onClose={closeAlert} 
    message="Please Log-in to your account to continue shopping. Do you want to log-in" />
    </div>
  );
}

export default ProductDetails;