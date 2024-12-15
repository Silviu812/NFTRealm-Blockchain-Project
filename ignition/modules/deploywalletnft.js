const { ethers } = require("hardhat");

async function main() {
    const NftWalletContract = await ethers.getContractFactory("NFTWallet");
    
    const nftWalletContract = await NftWalletContract.deploy('0xf9393A79D6B824B790B19b9cbC6F8206BbFc363d');

    await nftWalletContract.deployed;

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
