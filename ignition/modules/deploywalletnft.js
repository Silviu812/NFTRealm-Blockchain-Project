const { ethers } = require("hardhat");

async function main() {
    const NftWalletContract = await ethers.getContractFactory("NFTWallet");
    
    const nftWalletContract = await NftWalletContract.deploy('0x8c72Ae09Cd37e061f57340aCAE48210B42c181f8');

    await nftWalletContract.deployed;

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
