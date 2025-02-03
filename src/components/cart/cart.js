import { useEffect, useState } from "react";
import axios from 'axios';
import AlertBox from "../alertbox/alertbox";
import DialogBox from "../dialogbox/dialogbox";
import styles from "./cart.module.css";
import api from "../../api";


function Cart({ setuserInfo,userInfo, isLoggedIn,setCartDetails,cartDetails}) {

  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [currentAlert, setAlert] = useState("");
  const [isPurchasingDialogVisible, setPurchasingDialogVisible] = useState(false);

  const showAlert = (Alert) => {
    setAlert(Alert);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const showPurchasingDialog = () => {
    setPurchasingDialogVisible(true);
  };

  const closePurchasingDialog = (is_confirmed) => {
    setPurchasingDialogVisible(false);
    if(is_confirmed){
      handleSuccessedPurchase();
    }
  };

  const handleSuccessedPurchase_=async ()=>{
    //showAlert("Thank you for shopping with us");
    const removeItems = cartDetails.filter((item) => selectedItems.includes(item.itemid));
    // Map to get only the item IDs
    const removeItemIds = removeItems.map(item => item.itemid);

    console.log(removeItemIds)
    await api.put(`/users/cart/removeitems`, {
      id: userInfo.id,
      itemids: removeItemIds,
    }
    );
    await updateUserInfo();
    setSelectedItems([]);
    showAlert("Thank you for shopping with us");
  }

    const purchase =()=>{
      if(totalPrice==0){
        showAlert("Please Select items to Purchase");
      }
      else{
        showPurchasingDialog();
      }
    }


    const handleSuccessedPurchase = async () => {
      const removeItems = cartDetails.filter((item) => selectedItems.includes(item.itemid));
      console.log(removeItems);
      // Map to get only the item IDs
      const removeItemIds = removeItems.map(item => item.itemid);
      try {
        if (removeItems.length === 0) {
          throw new Error("No items are selected"); // Create and throw a new error with a message
        }
        let cart_ = [];
        for (const item of removeItems) {
          cart_.push({
            id: item.itemid,
            quantity: item.itemcount,
            price: item.itemcount * item.special_price
          });
        }
        console.log(cart_);
        const transactionData = {
          userid: userInfo.id,
          amount: parseFloat(totalPrice),
          type:"ONLINE",
          cart: { items: cart_},
        };
        const response = await api.post("/transaction", transactionData);
  
        await updateUserInfo();
        setSelectedItems([]);
        showAlert("Thank you for shopping with us");
      } catch (err) {
        showAlert('Failed to log transaction.','ok');
      }
    };





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
    console.log('Cart Update....');
    updateCartDetails();
  }, [userInfo]); 

// Function to handle quantity update via API
  const updateQuantity = async (itemid,newQuantity) => {
      try {
        await api.post(`/users/cart`, {
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
          updateUserInfo();
      
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    };

    const updateUserInfo = async () => {  // Update Cart
      console.log('Cart changed');
      if(userInfo){
      console.log('id: '+userInfo.id)
      const updated_userinfo_res = await api.get(`/users/${userInfo.id}`);
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
              const response = await api.get(`/items/${item.itemid}`); 
              const productData = response.data;
              return {
                ...item,
                name: productData.name,
                price: productData.price,
                stock: productData.stock,
                special_price:productData.special_price,
                images:productData.images
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
    
    <div className={styles.cartContainer}>
      <h2 className={styles.cartHeader}>Greetings {userInfo.firstname} ! Continue shopping with us</h2>
      <h2 className={styles.cartHeader}>Your Cart</h2>
      <ul className={styles.cartList}>
        {cartDetails.map((item, index) => (
          <li className={styles.cartItem} key={index}>
            <input
            className={styles.checkbox}
              type="checkbox"
              onChange={(e) => handleCheckboxChange(item.itemid, e.target.checked)}
              checked={selectedItems.includes(item.itemid)} // Check if the item is selected
              disabled = {item.stock < item.itemcount} // Disable checking out if stock is less than item count
            />

            <p>{item.name}</p>
            <img src={item.images[0]} alt={item.name} className={styles.productImage} />
            <div className={ styles.productText}>
            <p>Quantity: {item.itemcount}</p>
            {!item.special_price ? (
            <p>Price: ${item.price}</p>
                ) : (
            <p>
            Price: <s className={styles.strike}>${item.price}</s> ${item.special_price}
          </p>
          
          )}
            <p>stock: {item.stock}</p>
            </div>
            <div className={ styles.buttonContainer}>
            <button className ={`${styles.button} ${styles.redbutton}`} onClick={() => updateQuantity(item.itemid, 0)}>Remove from Cart</button>
            <button className ={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(item.itemid, item.itemcount + 1)}>+</button>
            <button className ={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(item.itemid, item.itemcount - 1)} disabled={item.itemcount <= 1}>-</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total Price of Selected Items: ${totalPrice.toFixed(2)}</h3>
      <button className ={`${styles.button} ${styles.greenbutton}`} onClick={purchase}>Purchase</button>
      <AlertBox isOpen = {isAlertVisible} onClose={closeAlert} message={currentAlert}/>
      <DialogBox isOpen = {isPurchasingDialogVisible} onClose={closePurchasingDialog} message="Are you sure to proceed to purchasing ?" />
    </div>
  );
}

export default Cart;