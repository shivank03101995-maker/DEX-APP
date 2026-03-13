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

function fmt(amount: bigint, decimals: number) {
  return ethers.formatUnits(amount, decimals);
}

async function main() {
  const [signer] = await ethers.getSigners();
  const addressToCheck = (process.env.ADDRESS?.trim() || signer.address).trim();
  if (!ethers.isAddress(addressToCheck)) throw new Error(`Invalid ADDRESS: "${process.env.ADDRESS ?? ""}"`);

  const deploymentsPath = path.join(__dirname, "..", "deployments", `${network.name}.json`);
  const deployments = readJson(deploymentsPath);
  const c = deployments?.contracts ?? {};

  const tokenAAddr = c.TokenA as string | undefined;
  const tokenBAddr = c.TokenB as string | undefined;
  const pairAddr = c.Pair as string | undefined;

  if (!ethers.isAddress(tokenAAddr ?? "")) throw new Error(`Missing TokenA in ${deploymentsPath}`);
  if (!ethers.isAddress(tokenBAddr ?? "")) throw new Error(`Missing TokenB in ${deploymentsPath}`);
  if (!ethers.isAddress(pairAddr ?? "")) throw new Error(`Missing Pair in ${deploymentsPath}`);

  console.log("Network:", network.name);
  console.log("Checking:", addressToCheck);

  const tokenA = await ethers.getContractAt("MockERC20", tokenAAddr);
  const tokenB = await ethers.getContractAt("MockERC20", tokenBAddr);
  const pair = await ethers.getContractAt("DEXPair", pairAddr);

  const [
    symA,
    decA,
    balA,
    symB,
    decB,
    balB,
    lpBal,
    lpTotal,
    token0,
    token1,
    reserves,
  ] = await Promise.all([
    tokenA.symbol(),
    tokenA.decimals(),
    tokenA.balanceOf(addressToCheck),
    tokenB.symbol(),
    tokenB.decimals(),
    tokenB.balanceOf(addressToCheck),
    pair.balanceOf(addressToCheck),
    pair.totalSupply(),
    pair.token0(),
    pair.token1(),
    pair.getReserves(),
  ]);

  console.log(`${symA} balance:`, fmt(balA, Number(decA)));
  console.log(`${symB} balance:`, fmt(balB, Number(decB)));
  console.log(`LP (DLP) balance:`, fmt(lpBal, 18));

  const reserve0 = BigInt(reserves[0]);
  const reserve1 = BigInt(reserves[1]);

  const token0Contract = await ethers.getContractAt("MockERC20", token0);
  const token1Contract = await ethers.getContractAt("MockERC20", token1);
  const [sym0, dec0, sym1, dec1] = await Promise.all([
    token0Contract.symbol(),
    token0Contract.decimals(),
    token1Contract.symbol(),
    token1Contract.decimals(),
  ]);

  console.log("Pair token0:", token0, `(${sym0})`);
  console.log("Pair token1:", token1, `(${sym1})`);
  console.log(`Reserves ${sym0}:`, fmt(reserve0, Number(dec0)));
  console.log(`Reserves ${sym1}:`, fmt(reserve1, Number(dec1)));

  if (lpTotal > 0n) {
    const shareBps = (lpBal * 10_000n) / lpTotal;
    console.log("Your pool share (bps):", shareBps.toString());

    const underlying0 = (reserve0 * lpBal) / lpTotal;
    const underlying1 = (reserve1 * lpBal) / lpTotal;
    console.log(`Underlying ${sym0}:`, fmt(underlying0, Number(dec0)));
    console.log(`Underlying ${sym1}:`, fmt(underlying1, Number(dec1)));
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
