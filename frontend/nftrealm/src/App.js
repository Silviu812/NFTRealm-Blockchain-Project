import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListNFT from './components/ListNFT';
import { ethers, Wallet } from 'ethers';



// TREBUIE MODIFICATA BALANTA
// ACUM ARATA BALANTA CONTULUI
// TREBUIE SA ARATE PUTEREA DE BID (BALANTA PE CARE O ARE IN CONTRACT * 10)


function App() {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('0');

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('MetaMask not installed!');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
    };

    const fetchBalance = async () => {
        if (address) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balanceBig = await provider.getBalance(address);
            setBalance(ethers.formatEther(balanceBig));
        }
    };

    useEffect(() => {
        if (address) {
            fetchBalance();
            const interval = setInterval(fetchBalance, 10000);
            return () => clearInterval(interval);
        }
    }, [address]);

    return (
        <Router>
            <Navbar onConnect={connectWallet} address={address} balance={balance} />
            <Routes>
                <Route path="/" element={<div>Home</div>} />
                <Route path="/listnft" element={<ListNFT />} />
            </Routes>
        </Router>

    );
}

export default App;
