
const hre = require("hardhat");

async function main() {

  const Podcasts = await hre.ethers.getContractFactory("Podcasts");
  const podcasts = await Podcasts.deploy();

  await podcasts.deployed();

  console.log("Podcasts deployed to:", podcasts.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
