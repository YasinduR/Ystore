import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import DialogBox from '../dialogbox/dialogbox';
import {useNavigate, Link} from 'react-router-dom';
import styles from './products.module.css'

// import api from '../../api'; // Import the Axios instance

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
   // <Link to={`/products/${product.id}`} className={styles.productLink}>
    <div className={styles.product} key={product.id}>
      <Link to={`/products/${product.id}`} className={styles.productLink}>
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
      </Link>
      <p>{product.description}</p>

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
      <button className={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(product.id, itemCount + 1)} disabled={itemCount >= product.stock}>+</button>
      <button className={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(product.id, itemCount - 1)} disabled={itemCount <= 1}>-</button>
    </>
  )}
</div>
    </div>
  // </Link>
  );
}

function Products(){
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { products, userInfo, cart, updateQuantity } = useContext(UserContext);
  //const [loading, setLoading] = useState(true);
 // const [error, setError] = useState(null);
  const [isAlertVisible, setAlertVisible] = useState(false);


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






  if (!products) return <div>Loading...</div>;

  return (
    <div className={styles.product_list}>
      {products
          .slice() // Make a shallow copy to avoid mutating the original array
          .sort((a, b) => a.id - b.id) // Sort by id in ascending order
      .map((product) => {
 
          const cartItem = userInfo? userInfo.cart.find((cartItem) => cartItem.itemid === product.id) : cart.find((cartItem) => cartItem.itemid === product.id);
          const isInCart = cartItem !== undefined; // Check if it's in the cart
          const itemCount = cartItem?.itemcount || 0; // Get the item count 
        
        return (
          <div>
           <ProductItem
          key={product.id}
          product={product}
          isInCart={isInCart}
          itemCount={itemCount}
          updateQuantity={updateQuantity}
          isAlertVisible={isAlertVisible}
          closeAlert={closeAlert}
        />
            <DialogBox isOpen = {isAlertVisible} onClose={closeAlert} message="Please Log-in to your account to continue shopping. Do you want to log-in" />
         
         
          </div>
          
        );
      })}
    </div>
  );
};

export default Products;