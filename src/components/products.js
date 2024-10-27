import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './Product.css';

const Products = ({ userInfo,setuserInfo, isLoggedIn,setCartDetails,cartDetails }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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


        //);
        }
        else{
          alert('Please log-in');
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
    <div className="product-list">
      {products.map((product) => {

          const cartItem = userInfo?.cart?.find((cartItem) => cartItem.itemid === product.id); // Check whether item is in the cart
          const isInCart = cartItem !== undefined; // Check if it's in the cart
          const itemCount = cartItem?.itemcount || 0; // Get the item count 
        
        return (
          <div className="product" key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Stock: {product.stock}</p>
            <p>Price: ${product.price}</p>

            
            {product.special_price && <p>Special Price: ${product.special_price}</p>}

            {isInCart ? (
              <div>
              <button onClick={() => updateQuantity(product.id, 0)}>Remove from Cart</button>
              <button onClick={() => updateQuantity(product.id, itemCount + 1)}>+</button>
              <button  onClick={() => updateQuantity(product.id, itemCount - 1)} disabled={itemCount <= 1}>-</button>
              <p>Quantity: {itemCount}</p>
              </div>
            ) : (
              <button onClick={() => updateQuantity(product.id, 1)}>Add to Cart</button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Products;