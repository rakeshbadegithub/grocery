import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">Grocery Delivery</Link>
            </h1>
            <ul>
                <li>
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/orders">My Orders</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
