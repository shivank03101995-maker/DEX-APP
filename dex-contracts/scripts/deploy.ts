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


// import { ethers } from "hardhat";

// async function main() {

//   const [deployer] = await ethers.getSigners();
//   console.log("Deployer:", deployer.address);

//   // Deploy Factory
//   const Factory = await ethers.getContractFactory("DEXFactory");
//   const factory = await Factory.deploy();

//   await factory.waitForDeployment();

//   const factoryAddress = await factory.getAddress();
//   console.log("DEXFactory:", factoryAddress);

//   // Deploy Router
//   const Router = await ethers.getContractFactory("DEXRouter");
//   const router = await Router.deploy(factoryAddress);

//   await router.waitForDeployment();

//   const routerAddress = await router.getAddress();
//   console.log("DEXRouter:", routerAddress);
// }

// main().catch((err) => {
//   console.error(err);
//   process.exitCode = 1;
// });
import { ethers, network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const providerNetwork = await ethers.provider.getNetwork();
  const chainId = Number(providerNetwork.chainId);

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentsPath = path.join(deploymentsDir, `${network.name}.json`);

  const readDeployments = (): any => {
    try {
      if (!fs.existsSync(deploymentsPath)) return {};
      return JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));
    } catch {
      return {};
    }
  };

  const prev = readDeployments();
  const envFactory = process.env.FACTORY_ADDRESS?.trim();
  const fileFactory = prev?.contracts?.DEXFactory as string | undefined;
  const factoryAddress = (envFactory || fileFactory || "").trim();

  let finalFactoryAddress = factoryAddress;
  if (finalFactoryAddress) {
    console.log("Using existing DEXFactory:", finalFactoryAddress);
  } else {
    const Factory = await ethers.getContractFactory("DEXFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();
    finalFactoryAddress = await factory.getAddress();
    console.log("DEXFactory deployed at:", finalFactoryAddress);
  }

  const Router = await ethers.getContractFactory("DEXRouter");
  const router = await Router.deploy(finalFactoryAddress);
  await router.waitForDeployment();

  const routerAddress = await router.getAddress();
  console.log("DEXRouter deployed at:", routerAddress);

  fs.mkdirSync(deploymentsDir, { recursive: true });
  const out = {
    network: network.name,
    chainId,
    deployer: deployer.address,
    updatedAt: new Date().toISOString(),
    contracts: {
      ...(prev?.contracts ?? {}),
      DEXFactory: finalFactoryAddress,
      DEXRouter: routerAddress,
    },
    tx: {
      ...(prev?.tx ?? {}),
      DEXRouter: router.deploymentTransaction()?.hash ?? null,
    },
  };
  fs.writeFileSync(deploymentsPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Wrote deployments file:", deploymentsPath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
