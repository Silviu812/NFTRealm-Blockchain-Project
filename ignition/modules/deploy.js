const { ethers } = require("hardhat");

async function main() {
    const WalletEscrow = await ethers.getContractFactory("WalletEscrow");
    
    const walletEscrow = await WalletEscrow.deploy();
    await walletEscrow.deployed;

    console.log("Contract deployed to:", walletEscrow.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
