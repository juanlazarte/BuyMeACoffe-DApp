const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const coffeeContract = await ethers.deployContract("BuyMeACoffee");
  console.log("Coffee Contract deployed to:", await coffeeContract.getAddress())

}

main().catch((error) => {
  console.error(error);
});
