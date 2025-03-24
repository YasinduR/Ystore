import React, { createContext, useState, useEffect } from 'react';
import api from '../api'; // Ensure you import your API utility
import { getAuthConfig,setLogoutFunction } from '../config/authConfig';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogmsg, setDialogmsg] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/items');
      setProducts(response.data);
    } catch (err) {
      console.log('Failed to load product data.');
    }
  };

  const fetchProductStock = async (id) => {
    try {
      const response = await api.get(`/items/stock/${id}`);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, stock: response.data.stock } : product
        )
      );
    } catch (err) {
      console.log('Failed to load stock data for product ID:', id);
    }
  };

  const updateCartDetails = async () => {
    let tempcart = userInfo ? userInfo.cart : cart;
    const updatedCart = tempcart
      .map((item) => {
        const productData = products.find((product) => product.id === item.itemid);
        return productData
          ? {
              ...item,
              name: productData.name,
              price: productData.price,
              stock: productData.stock,
              special_price: productData.special_price,
              images: productData.images,
            }
          : null;
      })
      .filter((item) => item !== null && item.itemcount >= 1);
    setCartDetails(updatedCart);
  };

  // Update quantity of an item in the cart
  const updateQuantity = async (itemid, newQuantity) => {
    try {
      const config = await getAuthConfig(); // Get auth config
      if (userInfo) {
        // For logged-in users, update via API
        const updatedCartRes = await api.put(
          `/users/${userInfo.id}/cart`,
          {
            itemid: itemid,
            itemcount: newQuantity,
          },
          config
        );
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          cart: updatedCartRes.data.cart,
        }));
      } else {

            const updatedCart = [...cart]; // Copy current cart
            const itemIndex = updatedCart.findIndex((item) => item.itemid === itemid);
      
            if (itemIndex !== -1) {
              if (newQuantity === 0) {
                // If the new quantity is 0, remove the item
                updatedCart.splice(itemIndex, 1);
              } else {
                updatedCart[itemIndex].itemcount = newQuantity; // Update quantity when item already there
              }
            } else if (newQuantity > 0) {
              // Add item if not found and quantity is greater than 0
              updatedCart.push({ itemid: itemid, itemcount: newQuantity });
            }
            // Update cart in the state
            setCart(updatedCart);
            saveCartToLocalStorage(updatedCart); //update local storage

      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const updateUserCart = async () => {
    if (userInfo) {
      try {
        const config = await getAuthConfig();
        const updatedCartRes = await api.get(`/users/${userInfo.id}/`,config);
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          cart: updatedCartRes.data.cart,
        }));
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  // Save the cart to localStorage for non users
  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart)); // Convert cart to JSON and save
  };

  // Load the cart from localStorage for non users
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart)); // Parse the JSON string and set the cart state
    }
  };

  // Remove the cart from localStorage
  const removeCartFromLocalStorage = () => {
    localStorage.removeItem('cart'); // Remove the cart from localStorage
  };



  const successfulPurchase = async (array_of_purchase_item_ids) => {
    for (const id of array_of_purchase_item_ids) {
      await fetchProductStock(id);
    }
    if (userInfo) {
      updateUserCart();
    } else {
      const updatedCart = cart.filter((item) => !array_of_purchase_item_ids.includes(item.itemid));
      saveCartToLocalStorage(updatedCart);
      setCart(updatedCart);
    }
  };

  const handleLogoutRequest = () => {
    setDialogmsg(`${userInfo.firstname}, are you sure to logout?`);
    setIsDialogOpen(true);
  };


  const handleLogoutConfirm = (confirm) => {
    setIsDialogOpen(false);
    if (confirm) {
      logout(); // Restore token and redirect to the login page 
    }
  };

  const logout =()=>{
    setUserInfo(null);
    setCart([]);
    setCartDetails([]);
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken"); // remove tokens
    localStorage.removeItem("refreshToken");//// remove tokens
    window.location.href = "#/login"; // Redirect to login page
  }

    useEffect(() => {
      fetchProducts();// Fetch all products on component mount
      setLogoutFunction(logout);  // sent log out fn to a global state to use in on authentication faliure
      loadCartFromLocalStorage(); // loadcart from local storage if exists
    }, []);
  
    // Update cart details when userInfo, cart, or products change
    useEffect(() => {
      updateCartDetails();
    }, [userInfo, cart, products]);

    useEffect(() => {
      if(isLoggedIn){
        removeCartFromLocalStorage();
      }
    }, [isLoggedIn]);
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userInfo,
        setUserInfo,
        cart,
        setCart,
        cartDetails,
        setCartDetails,
        isDialogOpen,
        setIsDialogOpen,
        dialogmsg,
        setDialogmsg,
        products,
        setProducts,
        fetchProducts,
        fetchProductStock,
        updateCartDetails,
        updateQuantity,
        updateUserCart,
        successfulPurchase,
        handleLogoutRequest,
        handleLogoutConfirm,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};