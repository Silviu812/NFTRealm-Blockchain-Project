import React, { useState } from 'react'; 
import './Navbar.css'; 
import Profile from './Profile'; 

const Navbar = ({ onConnect, address, balance }) => {
    const [isProfileOpen, setProfileOpen] = useState(false); 

    const handleOpenProfile = () => {
        setProfileOpen(true);
    };

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
                        <div className="balance-container">
                            <span className="balance">
                                Power to bid: {parseFloat(balance).toFixed(2)} ETH
                            </span>
                            {parseFloat(balance) < 0.001 ? (
                                <button 
                                    className="connect-button" 
                                    onClick={handleOpenProfile} 
                                    style={{ backgroundColor: 'green', color: 'white' }}
                                >
                                    Add funds
                                </button>
                            ) : (
                                <button 
                                    className="connect-button" 
                                    onClick={handleOpenProfile}
                                    style={{ backgroundColor: 'blue', color: 'white' }}
                                >
                                    Manage
                                </button>
                            )}
                        </div>
                    ) : (
                        <button className="connect-button" onClick={onConnect}>
                            Connect MetaMask
                        </button>
                    )}
                </div>
            </div>
            <Profile isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
        </nav>
    );
};

export default Navbar;
