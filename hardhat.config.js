require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/302e5352e5f243cabc272d43832be4cf", // sau alt URL de provider
      accounts: [`0x74e17cec3d276f7e048991aa77027f66d569ea5495159ae9dc8ee51a74ae8dac`] // Cheia privată a contului tău
    }
  }
};
