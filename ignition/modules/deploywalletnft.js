const { ethers } = require("hardhat");

async function main() {
    const NftWalletContract = await ethers.getContractFactory("NFTWallet");
    
    const nftWalletContract = await NftWalletContract.deploy('0x7F8CA9cb424CBd40545488A3B0402Bebbec39F82');

    await nftWalletContract.deployed;

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
