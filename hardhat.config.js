require("@nomiclabs/hardhat-waffle")


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      
    },
    mumbai: {
      url: "", //removed for security reasons
      accounts: [""], //removed for security reasons
      gas: 2100000,
      gasPrice: 8000000000,
    },
    
    /*rinkeby: {
      url: "", //removed for security reasons
      accounts: [""], //removed for security reasons
      gas: 2100000,
      gasPrice: 8000000000,
    }*/
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}