// import { ethers } from 'hardhat'

// async function main() {
//   const [deployer] = await ethers.getSigners()
//   console.log('Deployer:', deployer.address)

//   const Factory = await ethers.getContractFactory('DEXFactory')
//   const factory = await Factory.deploy()
//   await factory.deployed()
//   console.log('DEXFactory:', factory.address)

//   const Router = await ethers.getContractFactory('DEXRouter')
//   const router = await Router.deploy(factory.address)
//   await router.deployed()
//   console.log('DEXRouter:', router.address)
// }

// main().catch((err) => {
//   console.error(err)
//   process.exitCode = 1
// })


import { ethers } from "hardhat";

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy Factory
  const Factory = await ethers.getContractFactory("DEXFactory");
  const factory = await Factory.deploy();

  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("DEXFactory:", factoryAddress);

  // Deploy Router
  const Router = await ethers.getContractFactory("DEXRouter");
  const router = await Router.deploy(factoryAddress);

  await router.waitForDeployment();

  const routerAddress = await router.getAddress();
  console.log("DEXRouter:", routerAddress);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});