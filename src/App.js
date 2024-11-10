import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import Products from './components/products/products';
import Login from './components/login/login';
import Cart from './components/cart/cart';
import Signup from './components/signup/signup';
import DialogBox from './components/dialogbox/dialogbox';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [userInfo,setuserInfo] =useState(null)
  const [cartDetails, setCartDetails] = useState([]); // Store fetched product details
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogmsg,SetDialogmsg] = useState(null);



  const handleSigninRequest = () => {
    if(isLoggedIn){
      SetDialogmsg(userInfo.firstname +", before Sign-up you have to log out from the current account. Are you sure to logout ?")
      setIsDialogOpen(true); // Open confirmation dialog
    }
  };

  const handleLogoutRequest = () => {
    SetDialogmsg(userInfo.firstname+", are you sure to logout ?")
    setIsDialogOpen(true); // Open confirmation dialog
  };

  const handleLogoutConfirm = (confirm) => {  // Yes on dialog box will give
    setIsDialogOpen(false);
    if (confirm) {
      setuserInfo(null);
      setCartDetails([]);
      setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li>{isLoggedIn ? 
            (<a onClick={handleLogoutRequest}>Logout</a>):
            (<Link to="/login">Login</Link>)}
            </li>
            <li>
            {isLoggedIn && <Link to="/cart">Cart</Link>}
            </li>
            <li>{isLoggedIn ? 
            (<a onClick={handleSigninRequest}>Sign-up</a>):
            (<Link to="/signup">Sign-up</Link>)}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products isLoggedIn={isLoggedIn} setuserInfo={setuserInfo} userInfo={userInfo} setCartDetails={setCartDetails} cartDetails ={cartDetails} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setuserInfo={setuserInfo}/>} />
          <Route path="/cart" element={<Cart isLoggedIn={isLoggedIn} setuserInfo={setuserInfo} userInfo={userInfo} setCartDetails={setCartDetails} cartDetails ={cartDetails}  />} />
          <Route path="/signup" element={<Signup/>} />    
        </Routes>
      
        {isDialogOpen && (
          <DialogBox isOpen = {true} onClose={handleLogoutConfirm} message= {dialogmsg} />
        )}

      </div>
    </Router>
  );
}
export default App;
