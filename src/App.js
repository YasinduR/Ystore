import logo from './logo.svg';
import './App.css';
import React, { useState,useEffect } from 'react';
import api from './api';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home/home';
import App2 from './components/test/test';
import About from './components/about/about';
import Contact from './components/contact/contact';
import Products from './components/products/products';
import Login from './components/login/login';
import Cart from './components/cart/cart';
import Signup from './components/signup/signup';
import DialogBox from './components/dialogbox/dialogbox';
import ProductDetails from './components/product/product';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userInfo,setuserInfo] =useState(null);
  const [cart,setCart] =useState([]); // track cart of anonymous users
  const [cartDetails, setCartDetails] = useState([]); // Store fetched product details
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogmsg,SetDialogmsg] = useState(null);
  const [products, setProducts] = useState([]);

  const handleLogoutRequest = () => {
    SetDialogmsg(userInfo.firstname+", are you sure to logout ?")
    setIsDialogOpen(true); // Open confirmation dialog
  };

  const handleLogoutConfirm = (confirm) => {  // Yes on dialog box will give
    setIsDialogOpen(false);
    if (confirm) {
      setuserInfo(null);
      setCart([]);
      setCartDetails([]);
      setIsLoggedIn(false);
    }
  };
  
  async function fetchProducts() {   
    try {
      const response = await api.get('/items');
      console.log('Request URL:', response.config.url); // Log the request URL
      setProducts(response.data);
    } catch (err) {
      console.log('Failed to load product data.');
    } 
  } 

  async function fetchProductStock(id) {   
    try {
        const response = await api.get(`/items/stock/${id}`);  // Corrected endpoint format
        // Update the specific product stock in the product array
        console.log(' 1 Stock updated', response.data.stock); 
        setProducts((prevProducts) => {
          const updatedProducts = prevProducts.map((product) =>
              product.id === id ? { ...product, stock: response.data.stock } : product
          );

          console.log(' 2 Stock updated', updatedProducts); 
          return updatedProducts;
      });
        //console.log('Stock updated', response.data.stock); // Log the request URL
        console.log('3 Stock updated',products); //
    } catch (err) {
        console.log('Failed to load stock data for product ID:', id);
    }
}

  useEffect(() => {
    fetchProducts(); // fetct all products on start of the app
  }, []);

  useEffect(() => { 
    console.log('Cart Details ')
    // Runs after either userinfo.cart or cart updated // call upon product data change
    updateCartDetails();
  }, [userInfo,cart,products]); 



  const updateCartDetails = async () => {
    let tempcart;
    if (userInfo && userInfo.cart) {
      tempcart = userInfo.cart; //  for registerd users
    }
    else{
      tempcart = cart; // anonymous users
    }
    const updatedCart = tempcart.map(item => {
      const productData = products.find(product => product.id === item.itemid); // Fetch from local data
      if (!productData) {
        console.log(`Product data not found for item ID ${item.itemid}`);
        return null;
      }
      return {
        ...item, // item id and item count
        name: productData.name,
        price: productData.price,
        stock: productData.stock,
        special_price: productData.special_price,
        images: productData.images
      };
    });
    // Filter out invalid items and items with count < 1
    const filteredCart = updatedCart.filter(item => item !== null && item.itemcount >= 1);
    setCartDetails(filteredCart); // Update state with product details
  };



const updateQuantity = async (itemid, newQuantity) => {
        try {
          if (userInfo) {
            // For logged-in users, update via API
            await api.post(`/users/cart`, {
              id: userInfo.id,
              itemid: itemid,
              itemcount: newQuantity,
            });
            updateUserCart(); // Update user information after the cart is updated
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
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      };

      const updateUserCart = async () => {  // Update only the cart of registererd user
        if (userInfo) {
          try {
            const updatedCartRes = await api.get(`/users/${userInfo.id}/cart`);
            console.log("Updated Cart:", updatedCartRes.data);
            
            if (updatedCartRes) {
              setuserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                cart: updatedCartRes.data.cart, // Update only the cart
              }));
            }
          } catch (error) {
            console.error("Error updating cart:", error);
          }
        }
      };
  
      const successfulPurchase = async(array_of_purchase_item_ids) =>{
        for(const id of array_of_purchase_item_ids){
          await fetchProductStock(id);
        }

        if(userInfo){
          updateUserCart();
        }
        else{
          const updatedCart = [...cart]; // Copy current cart
          for(const id of array_of_purchase_item_ids){
            const itemIndex = updatedCart.findIndex((item) => item.itemid === id);
            if (itemIndex !== -1) {
                updatedCart.splice(itemIndex, 1);
            //complete
        }
        }
        setCart(updatedCart);
        }
      }


  return (
    <Router>
      <div className="app-container">
      <Navbar isLoggedIn={isLoggedIn} handleLogoutRequest={handleLogoutRequest} />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<App2 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products products={products} userInfo={userInfo} cart ={cart} updateQuantity={updateQuantity}  />} />
          <Route path="/products/:productId" element={<ProductDetails setuserInfo={setuserInfo} userInfo={userInfo} />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setuserInfo={setuserInfo}/>} />
          <Route path="/cart" element={<Cart userInfo={userInfo}  cartDetails ={cartDetails} updateUserCart={updateUserCart} updateQuantity={updateQuantity} successfulPurchase={successfulPurchase}/>} />
          <Route path="/signup" element={<Signup isLoggedIn={isLoggedIn} userInfo={userInfo} setIsLoggedIn={setIsLoggedIn} setuserInfo={setuserInfo}/>} />    
        </Routes>
      </div>
        {isDialogOpen && (
          <DialogBox isOpen = {true} onClose={handleLogoutConfirm} message= {dialogmsg} />
        )}
        <Footer/>
      </div>

    </Router>
  );
}
export default App;
