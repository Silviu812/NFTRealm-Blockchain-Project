import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers'; 
import './Navbar.css'; 
import WalletEscrowABI from '../WalletEscrow.json';
import Profile from './Profile';
import { WALLETESCROW_ADDRESS, PROVIDERINFURA } from '../config.js';
 

const Navbar = ({ onConnect }) => {
    const [isProfileOpen, setProfileOpen] = useState(false); 
    const [address, setAddress] = useState('');
    const [escrowBalance, setEscrowBalance] = useState(0); 
    const [escrowPower, setEscrowPower] = useState(0);

    useEffect(() => {
        const fetchEscrowBalance = async () => {
            if (address) {
                const provider = new ethers.JsonRpcProvider(PROVIDERINFURA);
                const contract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, provider);
                
                const balance = await contract.escrowadrese(address);
                setEscrowBalance(ethers.formatEther(balance));
                const power = await contract.escrowpower(address);
                setEscrowPower(ethers.formatEther(power));

            }
        };

        fetchEscrowBalance();
    }, [address]);


    const handleOpenProfile = () => {
        setProfileOpen(true);
    };

    const handleConnect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        onConnect(); 
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="title">
                    <span className="title-text">NFT Realm</span>
                </div>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/mainpage" className="nav-links">Home</Link> 
                    </li>
                    <li className="nav-item">
                        <Link to="/listnft" className="nav-links">List Your NFT!</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/withdrawnft" className="nav-links">Withdraw NFT</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/paynft" className="nav-links">Pay NFT</Link>
                    </li>
                </ul>
                <div className="nav-right">
                    {address ? (
                        <div className="balance-container">
                            <span className="balance">
                                Power to bid: {parseFloat(escrowPower).toFixed(2)} ETH
                            </span>
                            {parseFloat(escrowBalance) < 0.001 ? (
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
                        <button className="connect-button" onClick={handleConnect}>
                            Connect MetaMask
                        </button>
                    )}
                </div>
            </div>
            <Profile isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} address={address} />
        </nav>
    );
};

export default Navbar;
