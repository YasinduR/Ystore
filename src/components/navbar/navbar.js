import React from "react";
import { Link } from "react-router-dom";
import styles from './navbar.module.css'


function Navbar({isLoggedIn,handleLogoutRequest}){
    return(
<nav className={styles.navbar}>
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
            <Link to="/cart">Cart</Link>
            </li>
            <li>
            <Link to="/signup">Sign-up</Link>
            </li>
          </ul>
</nav>
    );
}


export default Navbar;