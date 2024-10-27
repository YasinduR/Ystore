import { useEffect, useState } from "react";
import axios from 'axios';

function Cart({ setuserInfo,userInfo, isLoggedIn,setCartDetails,cartDetails}) {

  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


    // Handle checkbox change
    const handleCheckboxChange = (itemId, isChecked) => {
      if (isChecked) {
        // Add item to selectedItems if checked
        setSelectedItems((prevSelectedItems) => [...prevSelectedItems, itemId]);
      } else {
        // Remove item from selectedItems if unchecked
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => id !== itemId)
        );
      }
    };


    // Calculate total price when selectedItems change
    useEffect(() => {
      let total = 0; 
      const selectedItemsInCart = cartDetails.filter((item) => selectedItems.includes(item.itemid));
      console.log("SelectedItems Updated",selectedItemsInCart,selectedItems)
      selectedItemsInCart.forEach((item) => {
      const itemPrice = item.special_price ? item.special_price : item.price;
      total += itemPrice * item.itemcount;
      console.log("total Updated",total)
      });
      setTotalPrice(total);
    }, [selectedItems, cartDetails]);

  useEffect(() => { // Runs after userinfo.cart updated
    console.log('Component initialized');
    updateCartDetails();
  }, [userInfo]); 

// Function to handle quantity update via API
  const updateQuantity = async (itemid,newQuantity) => {
      try {
        await axios.post(`http://localhost:8000/ystore/users/cart`, {
          id: userInfo.id,
          itemid: itemid,
          itemcount: newQuantity
        });

      // If the new quantity exceeds stock, uncheck the item
      const updatedItem = cartDetails.find((item) => item.itemid === itemid);
      if (updatedItem && newQuantity > updatedItem.stock) {
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => id !== itemid)
        );
      }

        //console.log('Quantity updated:', response.data);

        //setCartDetails((CartDetails) =>
        ///  CartDetails.map((item) => 
        ///      item.itemid === itemid ? { ...item, itemcount: newQuantity } : item
        //  ).filter(item => item.itemcount >= 1));
          //updateCartDetails();
          updateUserInfo();
      
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    };

    const updateUserInfo = async () => {  // Update Cart
      console.log('Cart changed');
      if(userInfo){
      console.log('id: '+userInfo.id)
      const updated_userinfo_res = await axios.get(`http://localhost:8000/ystore/users/${userInfo.id}`);
      console.log(updated_userinfo_res)
      if(updated_userinfo_res){
        setuserInfo(updated_userinfo_res.data)
      }}
    }

    const updateCartDetails = async () => {
      if (userInfo && userInfo.cart) {
        const updatedCart = await Promise.all(
          userInfo.cart.map(async (item) => {
            try {
              const response = await fetch(`http://localhost:8000/ystore/items/${item.itemid}`); 
              const productData = await response.json();
              return {
                ...item,
                name: productData.name,
                price: productData.price,
                stock: productData.stock,
                special_price:productData.special_price,
              };
            } catch (error) {
              console.error(`Error fetching product data for item ID ${item.itemid}:`, error);
              return null;
            }
          })
        );
        // Filter out qll half fetched details
        const filteredCart = updatedCart.filter(item => item !== null).filter(item => item.itemcount >= 1);
        setCartDetails(filteredCart); // Update state with product details
      }
    };
  ///updateCartDetails(); // Update Cartonce loaded
  if (!isLoggedIn) {
    return <div>Please create an account to start shopping.</div>;
  }

  if (!userInfo || !userInfo.cart || userInfo.cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }
  
  return (
    <div>
      <h2>Greetings {userInfo.firstname} ! Continue shopping with us</h2>
      <h2>Your Cart</h2>
      <ul>
        {cartDetails.map((item, index) => (
          <li key={index}>
            <input
              type="checkbox"
              onChange={(e) => handleCheckboxChange(item.itemid, e.target.checked)}
              checked={selectedItems.includes(item.itemid)} // Check if the item is selected
              disabled = {item.stock < item.itemcount} // Disable checking out if stock is less than item count
            />
            <p>Product Name: {item.name}</p>
            <p>Product id: {item.itemid}</p>
            <p>Quantity: {item.itemcount}</p>
            <p>Price: {item.price}</p>
            <p>Special Price: {item.special_price}</p>
            <p>stock: {item.stock}</p>
            <button onClick={() => updateQuantity(item.itemid, 0)}>delete</button>
            <button onClick={() => updateQuantity(item.itemid, item.itemcount + 1)}>+</button>
            <button  onClick={() => updateQuantity(item.itemid, item.itemcount - 1)} disabled={item.itemcount <= 1}>-</button>
          </li>
        ))}
      </ul>
      <h3>Total Price of Selected Items: ${totalPrice.toFixed(2)}</h3>
      <button>Purchase</button>
    </div>
  );
}

export default Cart;