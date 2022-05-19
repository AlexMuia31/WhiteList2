const hre = require("hardhat");

async function main() {
  const whitelistContract = await hre.ethers.getContractFactory("Whitelist");
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  await deployedWhitelistContract.deployed();

  console.log("Contract deployed to:", deployedWhitelistContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//Contract deployed to: 0x6A4272a785Fc098f5EC70C21dB1B1e7DAA178fB1
