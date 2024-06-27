require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    fraxtal: {
      url: "https://rpc.frax.com",
      chainId: 252,
      accounts: [process.env.PRIVATE_KEY],
      gas: "auto",
      gasPrice: "auto"
    },
  },
};
