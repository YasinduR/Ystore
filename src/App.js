import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/home';
import About from './components/about';
import Contact from './components/contact';
import Products from './components/products';
import Login from './components/login';
import Cart from './components/cart'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const handleLogout = () => {
    setIsLoggedIn(false); // Set the user as logged out
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
            (<a onClick={handleLogout}>Logout</a>):
            (<Link to="/login">Login</Link>)}
            </li>
            <li>{isLoggedIn ? 
            (<Link to="/cart">Cart</Link>):
            (<a></a>)}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/cart" element={<Cart setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
