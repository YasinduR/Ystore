import { useEffect, useState } from "react";
import AlertBox from "../alertbox/alertbox";
//import DialogBox from "../dialogbox/dialogbox";
import CourierDialogBox from '../courier/courier'
import PaymentPage from "../payment/payment";
import styles from "./cart.module.css";
import api from "../../api";


function Cart({userInfo,cartDetails,updateCartInfo,updateQuantity,successfulPurchase}) {

  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [currentAlert, setAlert] = useState("");

  const [isPurchasingDialogVisible, setPurchasingDialogVisible] = useState(false);
  const [courierDetails, setCourierDetails] = useState({
    phoneNumber: '',
    deliveryAddress: userInfo ? userInfo.address : '',
    paymentMethod:"Cash-On-Delivery" // default payment method
  });

  const[isPaymentOpen,setPaymentWindow] =useState(false); // for payements only

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

  const showPaymentgateway = () => {
    setPaymentWindow(true); // Payment gateway
  };

  const closePurchasingDialog = (is_confirmed) => {
    setPurchasingDialogVisible(false);

    if(is_confirmed){
      console.log("data passed",courierDetails);
      console.log("Payment Method:", courierDetails.paymentMethod);
      if(courierDetails.paymentMethod === 'Cash-on-Delivery'){
        console.log("Cash payment")
        handleSuccessedPurchase(); //
      }
      else{
        console.log("online payment")
        showPaymentgateway();
      }
      
    }
  };


  const closePaymentGateway =(is_payed) =>{
    setPaymentWindow(false);
    if(is_payed){
      console.log("data passed",courierDetails);
      handleSuccessedPurchase();
      }
    else{
      setPurchasingDialogVisible(true);
    }
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
      const total = parseFloat(totalPrice);
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
          ...(userInfo && { userid: userInfo.id }), // Include only if userInfo exists
          amount: total,
          type:"ONLINE",
          cart: { items: cart_,
          },
        };
        const response = await api.post("/transaction", transactionData);
  
            // Step 2: Create courier using transactionId
        const courierData = {
          transactionid: response.data.id,
          customerid: userInfo? userInfo.id:"Not-Registered",
          courierserviceid: "Default",
          status: "Pending",
          paymentmethod: courierDetails.paymentMethod,
          cart: { items: cart_,
            phoneNumber: courierDetails.phoneNumber,
            deliveryAddress:courierDetails.deliveryAddress,
            amount:total
          },
    };
      const response_ =await api.post("/courier", courierData);
      console.log(response_.data)
      successfulPurchase(selectedItems);// call upon successful purchase to updatre cart userifo cart details and producut stock
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
      console.log("Cart Details:", cartDetails);
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

  if (cartDetails.length === 0) {
    return <div> 
      <p>
Your cart is empty.
    </p>
    <AlertBox isOpen = {isAlertVisible} onClose={closeAlert} message={currentAlert} />
      </div>;
  }
  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartHeader}>Greetings {userInfo? userInfo.firstname:''} ! Continue shopping with us</h2>
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
            </div>
            <div className={ styles.buttonContainer}>
            <button className ={`${styles.button} ${styles.redbutton}`} onClick={() => updateQuantity(item.itemid, 0)}>Remove from Cart</button>
            <button className ={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(item.itemid, item.itemcount + 1)} disabled={item.stock <= item.itemcount}>+</button>
            <button className ={`${styles.button} ${styles.purplebutton}`} onClick={() => updateQuantity(item.itemid, item.itemcount - 1)} disabled={item.itemcount <= 1}>-</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Total Price of Selected Items: ${totalPrice.toFixed(2)}</h3>
      <button className ={`${styles.button} ${styles.greenbutton}`} onClick={purchase}>Purchase</button>
      <AlertBox isOpen = {isAlertVisible} onClose={closeAlert} message={currentAlert} />
      <CourierDialogBox
        isOpen={isPurchasingDialogVisible}
        onClose={closePurchasingDialog}
        message="Please edit your delivery details and confirm the purchase"
        setCourierDetails ={setCourierDetails}
        courierDetails={courierDetails}
      /> 
      <PaymentPage isOpen={isPaymentOpen} onClose={closePaymentGateway}></PaymentPage>
    </div>
  );
}

export default Cart;