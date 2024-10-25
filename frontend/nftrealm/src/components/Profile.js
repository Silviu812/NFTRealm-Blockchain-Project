import React, { useEffect, useState } from 'react'; // Import useState
import { ethers } from 'ethers';
import WalletEscrowABI from '../WalletEscrow.json';
import './Profile.css'; 
import { WALLETESCROW_ADDRESS, PROVIDERINFURA } from '../config.js';

const Profile = ({ isOpen, onClose, address }) => {
    const [escrowBalance, setEscrowBalance] = useState(0); 

    useEffect(() => {
        const fetchEscrowBalance = async () => {
            if (address) {
                const provider = new ethers.JsonRpcProvider(PROVIDERINFURA);
                const contract = new ethers.Contract(WALLETESCROW_ADDRESS, WalletEscrowABI.abi, provider);

                
                const balance = await contract.escrowadrese(address);
                setEscrowBalance(ethers.formatEther(balance));
            }
        };

        fetchEscrowBalance();
    }, [address]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Profile</h2>
                {address && <p>Address: {address}</p>} {/* Afișează adresa */}
                <p>Escrow Balance: {escrowBalance} ETH</p> {/* Afișează balanța escrow */}
                <p>Power to Bid: {escrowBalance * 10} ETH</p> {/* Display power */}
            </div>
        </div>
    );
};

export default Profile;
