import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import DialogBox from '../dialogbox/dialogbox';
import styles from './product.module.css'

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, userInfo, cart, updateQuantity } = useContext(UserContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    // if (!foundProduct) {
    //   navigate('/products'); // Redirect if product not found
    //   return;
    // }
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) return <div>Loading...</div>;

  const cartItem = userInfo 
    ? userInfo.cart.find(item => item.itemid === product.id) 
    : cart.find(item => item.itemid === product.id);
  
  const isInCart = cartItem !== undefined;
  const itemCount = cartItem?.itemcount || 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = (login_confirmed) => {
    setAlertVisible(false);
    if (login_confirmed) {
      navigate('/login');
    }
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
      <DialogBox 
        isOpen={isAlertVisible} 
        onClose={closeAlert} 
        message="Please log in to add items to your cart. Would you like to log in now?" 
      />
    </div>
  );
}

export default ProductDetail;