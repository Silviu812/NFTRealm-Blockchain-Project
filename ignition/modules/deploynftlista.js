const { ethers } = require("hardhat");

async function main() {
    const ListNFT = await ethers.getContractFactory("ListNFT");
    
    const listNFT = await ListNFT.deploy();
    await listNFT.deployed;

    console.log("ListNFT contract deployed to:", listNFT.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
