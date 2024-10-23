const { ethers } = require("hardhat");

async function main() {
    const TrimiteNFT = await ethers.getContractFactory("TrimiteNFT");
    
    const trimiteNFT = await TrimiteNFT.deploy();
    await trimiteNFT.deployed;

    console.log("Contract deployed to:", trimiteNFT.address);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
