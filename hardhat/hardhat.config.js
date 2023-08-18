require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()


const projectId = process.env.INFURA_API_KEY;
const sepoliaKey = process.env.SEPOLIA_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${projectId}`,
      accounts: [sepoliaKey]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
