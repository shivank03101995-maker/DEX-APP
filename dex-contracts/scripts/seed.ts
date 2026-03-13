import { ethers, network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

function readJson(filePath: string): any {
  try {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function mustAddress(label: string, value: string | undefined): string {
  const v = (value ?? "").trim();
  if (!ethers.isAddress(v)) throw new Error(`Missing/invalid ${label} address: "${value ?? ""}"`);
  return v;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const providerNetwork = await ethers.provider.getNetwork();
  const chainId = Number(providerNetwork.chainId);

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentsPath = path.join(deploymentsDir, `${network.name}.json`);
  const prev = readJson(deploymentsPath);

  const routerAddress = mustAddress(
    "ROUTER_ADDRESS",
    process.env.ROUTER_ADDRESS?.trim() || prev?.contracts?.DEXRouter,
  );
  const router = await ethers.getContractAt("DEXRouter", routerAddress);

  const envFactory = process.env.FACTORY_ADDRESS?.trim();
  const factoryAddress = ethers.isAddress(envFactory ?? "") ? (envFactory as string) : await router.factory();
  console.log("Router:", routerAddress);
  console.log("Factory:", factoryAddress);

  // Reuse existing Token A/B from env or previous deployment so re-running seed only adds liquidity
  const envTokenA = process.env.TOKEN_A_ADDRESS?.trim();
  const envTokenB = process.env.TOKEN_B_ADDRESS?.trim();
  const prevTokenA = prev?.contracts?.TokenA;
  const prevTokenB = prev?.contracts?.TokenB;
  const existingTokenA = ethers.isAddress(envTokenA ?? "") ? envTokenA : (ethers.isAddress(prevTokenA ?? "") ? prevTokenA : null);
  const existingTokenB = ethers.isAddress(envTokenB ?? "") ? envTokenB : (ethers.isAddress(prevTokenB ?? "") ? prevTokenB : null);

  const mintA = ethers.parseUnits("100000", 18);
  const mintB = ethers.parseUnits("100000", 18);
  let tokenAAddress: string;
  let tokenBAddress: string;
  let tokenA: Awaited<ReturnType<typeof ethers.getContractAt>>;
  let tokenB: Awaited<ReturnType<typeof ethers.getContractAt>>;
  let tokenADeployTxHash: string | null = null;
  let tokenBDeployTxHash: string | null = null;

  if (existingTokenA && existingTokenB && existingTokenA !== existingTokenB) {
    console.log("Reusing existing TokenA:", existingTokenA);
    console.log("Reusing existing TokenB:", existingTokenB);
    tokenAAddress = existingTokenA;
    tokenBAddress = existingTokenB;
    tokenA = await ethers.getContractAt("MockERC20", tokenAAddress);
    tokenB = await ethers.getContractAt("MockERC20", tokenBAddress);
    await (await tokenA.mint(deployer.address, mintA)).wait();
    await (await tokenB.mint(deployer.address, mintB)).wait();
  } else {
    const Token = await ethers.getContractFactory("MockERC20");
    const tokenAContract = await Token.deploy("Token A", "TKA", 18);
    await tokenAContract.waitForDeployment();
    const tokenBContract = await Token.deploy("Token B", "TKB", 18);
    await tokenBContract.waitForDeployment();
    tokenAAddress = await tokenAContract.getAddress();
    tokenBAddress = await tokenBContract.getAddress();
    tokenA = tokenAContract;
    tokenB = tokenBContract;
    tokenADeployTxHash = tokenAContract.deploymentTransaction()?.hash ?? null;
    tokenBDeployTxHash = tokenBContract.deploymentTransaction()?.hash ?? null;
    console.log("TokenA:", tokenAAddress);
    console.log("TokenB:", tokenBAddress);
    await (await tokenA.mint(deployer.address, mintA)).wait();
    await (await tokenB.mint(deployer.address, mintB)).wait();
  }

  await (await tokenA.approve(routerAddress, mintA)).wait();
  await (await tokenB.approve(routerAddress, mintB)).wait();

  const amountADesired = ethers.parseUnits("10000", 18);
  const amountBDesired = ethers.parseUnits("10000", 18);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  const addTx = await router.addLiquidity(
    tokenAAddress,
    tokenBAddress,
    amountADesired,
    amountBDesired,
    0,
    0,
    deployer.address,
    deadline,
  );
  await addTx.wait();
  console.log("Liquidity added tx:", addTx.hash);

  const factory = await ethers.getContractAt("DEXFactory", factoryAddress);
  const pairAddress = await factory.getPair(tokenAAddress, tokenBAddress);
  console.log("Pair:", pairAddress);

  const amountIn = ethers.parseUnits("1", 18);
  await (await tokenA.approve(routerAddress, amountIn)).wait();
  const swapTx = await router.swapExactTokensForTokens(
    amountIn,
    0,
    [tokenAAddress, tokenBAddress],
    deployer.address,
    deadline,
  );
  await swapTx.wait();
  console.log("Swap tx:", swapTx.hash);

  fs.mkdirSync(deploymentsDir, { recursive: true });
  const out = {
    network: network.name,
    chainId,
    deployer: deployer.address,
    updatedAt: new Date().toISOString(),
    contracts: {
      ...(prev?.contracts ?? {}),
      DEXFactory: factoryAddress,
      DEXRouter: routerAddress,
      TokenA: tokenAAddress,
      TokenB: tokenBAddress,
      Pair: pairAddress,
    },
    tx: {
      ...(prev?.tx ?? {}),
      TokenA: tokenADeployTxHash,
      TokenB: tokenBDeployTxHash,
      AddLiquidity: addTx.hash,
      Swap: swapTx.hash,
    },
  };
  fs.writeFileSync(deploymentsPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Wrote deployments file:", deploymentsPath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

