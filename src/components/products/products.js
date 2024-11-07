import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import AlertBox from './alertbox/alertbox';
import DialogBox from '../dialogbox/dialogbox';
import {useNavigate} from 'react-router-dom';
import styles from './products.module.css'
//import './Product.css';


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
















function Products({ userInfo,setuserInfo, isLoggedIn,setCartDetails,cartDetails }){
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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


  const updateUserInfo = async () => {
    console.log('Cart changed');
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
          //console.log('Quantity updated:', response.data);
          //
          //setCartDetails((CartDetails) =>
           // CartDetails.map((item) => 
            //    item.itemid === itemid ? { ...item, itemcount: newQuantity } : item
           // ).filter(item => item.itemcount > 0)
           updateUserInfo()
        }
        else{
          showAlert(); // invoke the alert to force log-in
        }
      
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/ystore/items'); // Update the URL as needed
        setProducts(response.data);

      } catch (error) {
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.product_list}>
      {products
          .slice() // Make a shallow copy to avoid mutating the original array
          .sort((a, b) => a.id - b.id) // Sort by id in ascending order
      .map((product) => {

          const cartItem = userInfo?.cart?.find((cartItem) => cartItem.itemid === product.id); // Check whether item is in the cart
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