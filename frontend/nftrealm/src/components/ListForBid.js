import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './ListForBid.css';
import NFTWalletABI from '../NFTWallet.json';
import { nftContractAddress } from '../config'; 

const ListForBid = ({ isOpen, onClose, nftId, nftName, nftImageUrl, nftadresa }) => {
    const [date, setDate] = useState('');
    const [minSaleEnabled, setMinSaleEnabled] = useState(false);
    const [minSale, setMinSale] = useState('');
    const [duration, setDuration] = useState('1');
    const [totalCost, setTotalCost] = useState(0.01);
    const [gasCostSetDatad, setGasCostSetDatad] = useState(null);
    const [gasCostTransfer, setGasCostTransfer] = useState(null);
    const [totalGasCost, setTotalGasCost] = useState(null);



    useEffect(() => {
        setTotalCost(minSaleEnabled ? 0.02 : 0.01);
    }, [minSaleEnabled]);



    
    const handleDurationChange = (e) => {
        const selectedDuration = e.target.value;
        setDuration(selectedDuration);
        
        const today = new Date();
        const newDate = new Date(today);

        if (selectedDuration === '1') {
            newDate.setMinutes(today.getMinutes() + 1);
        } else if (selectedDuration === '1d') {
            newDate.setDate(today.getDate() + 1);
        } else if (selectedDuration === '7') {
            newDate.setDate(today.getDate() + 7);
        } else if (selectedDuration === '30') {
            newDate.setDate(today.getDate() + 30);
        }

        setDate(newDate.toISOString().split('T')[0]);
    };

    
    
    const handleListForBid = async () => {
        if (!date) {
            alert("Please fill in all fields.");
            return;
        }
    
        if (minSaleEnabled && !minSale) {
            alert("Please specify a minimum sale price.");
            return;
        }
    
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
        
            const nftAddress = nftadresa; 
            const targetAddress = nftContractAddress; 
            const nftTokenId = nftId; 
        
            const nftContract = new ethers.Contract(nftAddress, [
                "function safeTransferFrom(address from, address to, uint256 tokenId) external",
                "function ownerOf(uint256 tokenId) external view returns (address)",
                "function setDataaleasa(uint256 _value) external"
            ], signer);

            const nftWContract = new ethers.Contract(targetAddress, NFTWalletABI.abi, signer);
        
            const senderAddress = await signer.getAddress();
        
            const owner = await nftContract.ownerOf(nftTokenId);
            if (owner !== senderAddress) {
                throw new Error("You do not own this NFT");
            }
    
            const selectedDuration = duration;
            let _value;

    
            if (selectedDuration === '2') {
                _value = 4;
                console.log(`Setting dataaleasa with value: ${_value}`);
                const setDataTx = await nftWContract.setDatad();
                await setDataTx.wait();
                console.log("setDataaleasa executed successfully!"); 
            } else if (selectedDuration === '1') {
                _value = 1;
                console.log(`Setting dataaleasa with value: ${_value}`);
                const setDataTx = await nftWContract.setDataa();
                await setDataTx.wait();
            } else if (selectedDuration === '7') {
                _value = 2;
                console.log(`Setting dataaleasa with value: ${_value}`);
                const setDataTx = await nftWContract.setDatab();
                await setDataTx.wait();
            } else if (selectedDuration === '30') {
                _value = 3;
                console.log(`Setting dataaleasa with value: ${_value}`);
                const setDataTx = await nftWContract.setDatac();
                await setDataTx.wait();
            }
            
            const currentDataValue = await nftWContract.data();
            console.log("Current dataaleasa value:", currentDataValue.toString());

            
            const transferTx = await nftContract.safeTransferFrom(
                senderAddress, 
                targetAddress, 
                nftTokenId,
            );
        
            await transferTx.wait();
            console.log(`NFT-ul a fost transferat la ${targetAddress}`);
            alert("NFT sent to wallet successfully!");
        
        } catch (error) {
            console.error("Error sending NFT:", error);
            alert("Failed to send NFT. Please check the console for details.");
        }
    };
    
    
    const estimateSetDatadGas = async () => {
        if (!window.ethereum) {
            alert("MetaMask not installed!");
            return;
        }
    
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(nftContractAddress, NFTWalletABI.abi, signer);
    

        try {
            const gasEstimate = await contract.runner.estimateGas({
                to: nftContractAddress,
                data: contract.interface.encodeFunctionData("setDatad", [])
            });
            setGasCostSetDatad(gasEstimate);      
        } catch (error) {
            console.error("Eroare:", error);
        }
    };

    const estimateTransferGas = async () => {
        if (!window.ethereum) {
            alert("MetaMask not installed!");
            return;
        }
    
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
        const senderAddress = await signer.getAddress();
        const recipientAddress = nftContractAddress;
        const tokenId = nftId; 
    

        const abi = [
            "function safeTransferFrom(address from, address to, uint256 tokenId)"
        ];
    
        const nftContract = new ethers.Contract(nftadresa, abi, signer);
    
        try {
    
            
            const data = nftContract.interface.encodeFunctionData("safeTransferFrom", [
                senderAddress,
                recipientAddress,
                tokenId
            ]);
    
            
            const gasEstimate = await provider.estimateGas({
                to: nftadresa,
                from: senderAddress,
                data: data
            });
    
            setGasCostTransfer(gasEstimate);
        } catch (error) {
            console.error("Error estimating gas for safeTransferFrom:", error);
        }
    };
    
    
    const estimateTotalGasCost = async () => {
        if (!gasCostSetDatad || !gasCostTransfer) return;
    
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            let gasPrice;
            gasPrice = (await provider.getFeeData()).gasPrice
            // eslint-disable-next-line no-undef
            const setDatadGas = BigInt(gasCostSetDatad.toString());
            // eslint-disable-next-line no-undef
            const transferGas = BigInt(gasCostTransfer.toString());
    
            const totalCost = (setDatadGas + transferGas) * gasPrice; 
            setTotalGasCost(totalCost);
        } catch (error) {
            console.error("Error calculating total gas cost:", error.message);
        }
    };
    

    useEffect(() => {
        const fetchGasEstimates = async () => {
            try {
                await estimateSetDatadGas();
                await estimateTransferGas();
                await estimateTotalGasCost();
            } catch (error) {
                console.error("Error fetching gas estimates:", error);
            }
        };
    
        fetchGasEstimates();
    
        const interval = setInterval(fetchGasEstimates, 5000);
        return () => clearInterval(interval);
    }, [gasCostSetDatad, gasCostTransfer]);
    
    


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose} style={{ position: 'absolute', right: '10px', top: '10px' }}>
                    ×
                </button>
                <h2>List NFT for Bid</h2>
                
                {nftImageUrl && (
                    <div className="nft-display">
                        <h3>{nftName} #{nftId}</h3>
                        <img src={nftImageUrl} alt={nftName} className="nft-image" />
                    </div>
                )}

                <div className="duration-options">
                    <h3>Select Duration:</h3>
                    <label>
                        <input
                            type="radio"
                            value="2"
                            checked={duration === '2'}
                            onChange={handleDurationChange}
                        />
                        1 Minute
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="1"
                            checked={duration === '1'}
                            onChange={handleDurationChange}
                        />
                        1 Day
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="7"
                            checked={duration === '7'}
                            onChange={handleDurationChange}
                        />
                        7 Days
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="30"
                            checked={duration === '30'}
                            onChange={handleDurationChange}
                        />
                        30 Days
                    </label>
                </div>

                <div className="min-sale-option">
                    <label>
                        <input
                            type="checkbox"
                            checked={minSaleEnabled}
                            onChange={(e) => setMinSaleEnabled(e.target.checked)}
                        />
                        Set Minimum Sale Price Protection
                    </label>
                </div>

                {minSaleEnabled && (
                    <input
                        type="text"
                        value={minSale}
                        onChange={(e) => setMinSale(e.target.value)} 
                        placeholder="Minimum Sale Price (ETH)"
                    />
                )}

                <h3>Total Cost: {totalCost} ETH</h3>
                <h3>
                    Estimated Gas Cost:{" "}
                    {totalGasCost
                        ? `${parseFloat(ethers.formatEther(totalGasCost)).toFixed(5)} ETH`
                        : "Calculating..."}
                </h3>

                <div className="button-container">
                    <button className="list-button" onClick={handleListForBid}>
                        List for Bid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListForBid;
