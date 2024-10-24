import React from 'react';
import './Navbar.css'; 

const Navbar = ({ onConnect, address, balance }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="title">
                    <span className="title-text">NFT Realm</span>
                </div>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <a href="/" className="nav-links">Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="/wallet-escrow" className="nav-links">Payment</a>
                    </li>
                </ul>
                <div className="nav-right">
                    {address ? (
                        <span className="balance">Power to bid: {parseFloat(balance).toFixed(2)} ETH</span>
                    ) : (
                        <button className="connect-button" onClick={onConnect}>
                            Connect MetaMask
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
