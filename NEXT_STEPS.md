# Next Steps: Connect DEX UI to Your Deployed Contracts

You have deployed **DEXFactory** and **DEXRouter** and have their addresses. Here’s a clear path to wire the frontend to the real contracts.

---

## You are here

- **Seed done:** Liquidity added for TKA/TKB; pair: `0x35f4A919983e85a22a2B47f4D6758646a141eE65`
- **Swap (live):** With `dex-ui/.env` set (Router, Factory, `VITE_CHAIN_ID=80002`), the Swap page uses **getAmountsOut** for quotes and **swapExactTokensForTokens** on confirm. Connect wallet, switch to Polygon Amoy, then swap TKA ↔ TKB.
- **Liquidity (UI):** Add/remove liquidity in the UI is still mock; see Step 5 to wire **addLiquidity** / **removeLiquidity**.

**Run the UI:** In `dex-ui` copy `.env.example` to `.env`, fill in the Amoy addresses, then `npm run dev`. Connect wallet → switch to Amoy (80002) → try a swap.

---

## Current State

| Part | Status |
|------|--------|
| **dex-contracts** | Deployed; seed run; Router, Factory, Token A/B, Pair in `deployments/amoy.json` |
| **dex-ui** | Swap uses real Router (quote + execute); Liquidity/Pools still mock |
| **dex-api** | Auth only (email + wallet) |

---

## Step 1: Configure contract addresses in the frontend

1. **Copy env** from `dex-ui/.env.example` to `dex-ui/.env`. Example for your Amoy deployment:
   - `VITE_DEX_ROUTER_ADDRESS=0x13b17637a1c1929B61Ae557DF004932f5b246845`
   - `VITE_DEX_FACTORY_ADDRESS=0x535a2E57c43D87fccEaBF1f5E83d3B780B323220`
   - `VITE_CHAIN_ID=80002` (Amoy)

2. **Token A & B** are already set in `dex-ui/src/data/tokens.ts` as `TOKENS_AMOY` (addresses from your seed run). When the DEX is configured, Swap and Liquidity pages use **TKA** and **TKB** in the dropdowns.

3. **Optional:** If the seed script failed with "insufficient funds for gas", you can get Amoy MATIC from a faucet and re-run `npm run seed:amoy`, or add liquidity later from the UI once the contract layer (Step 3) is implemented.

---

## Step 2: Add token contract addresses

Your Router works with **token addresses**, not symbols. You need a token list that includes addresses for the **same chain** as your Router/Factory.

- If you used **dex-contracts** seed script: it deploys MockERC20 “Token A” and “Token B” and adds liquidity. Use those token addresses.
- For mainnet/testnet: add a proper list (e.g. USDC, WETH, DAI) with addresses for that chain.

**Change** `dex-ui/src/data/tokens.ts` (or a new `tokensByChain.ts`) to include an `address: string` field and optionally `chainId`, so the UI can pass token addresses into Router/Factory calls.

---

## Step 3: Add ethers (or viem) and a DEX contract layer

- **Install** in `dex-ui`: e.g. `npm i ethers` (v6) or `viem`.
- **Provider/Signer**: From the existing wallet (EIP-6963 / `window.ethereum`), create a provider and signer, e.g.:
  - `new ethers.BrowserProvider(ethereum)` and `provider.getSigner()`.
- **Contract layer**: Add a small module (e.g. `dex-ui/src/lib/contracts/dexRouter.ts`) that:
  - Reads `VITE_DEX_ROUTER_ADDRESS` and `VITE_DEX_FACTORY_ADDRESS` from config.
  - Uses the Router ABI (from `dex-contracts/typechain-types` or a minimal copy in the UI repo) to:
    - **getAmountsOut(amountIn, path)** – for swap quotes
    - **swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)** – execute swap (after user approves token spending)
    - **addLiquidity(...)** / **removeLiquidity(...)** – for liquidity flows
  - Uses Factory ABI for **getPair(tokenA, tokenB)** to resolve pair address.

Reuse the same wallet provider/signer you use for “Connect wallet” so the signer is the connected account.

---

## Step 4: Replace mock swap flow with real calls

In **Swap**:

1. **Quote**: When the user picks “from” amount and path, call `router.getAmountsOut(amountIn, path)` and show the expected “to” amount.
2. **Approve**: If “from” is an ERC20, call `token.approve(routerAddress, amountIn)` (or unlimited approval with proper UX).
3. **Swap**: Call `router.swapExactTokensForTokens(amountIn, amountOutMin, path, userAddress, deadline)`.
4. **UX**: Keep your existing steps (Confirm → Pending → Success) but drive “Pending”/“Success” from the real tx (submit → wait for receipt).

Handle native ETH only if your Router supports it (e.g. swapExactETHForTokens); the current contract is token–token, so use WETH address in the path if one side is ETH.

---

## Step 5: Replace mock liquidity flow with real calls

In **Liquidity**:

1. **Pair**: Use `factory.getPair(tokenA, tokenB)` to get the pair address (or “no pair”).
2. **Add liquidity**: `router.addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline)` after approving both tokens to the router.
3. **Remove liquidity**: Use the pair contract (or Router if it has `removeLiquidity`) with the user’s LP balance; then burn LP and receive tokenA + tokenB.

Reuse the same config (router/factory addresses, chainId) and token list with addresses.

---

## Step 6: Chain and network checks

- **ChainId**: Ensure the frontend only allows swaps/liquidity when `chainId === VITE_CHAIN_ID` (or show “Wrong network”).
- Use your existing wallet context to read `chainId` and optionally prompt the user to switch (e.g. `wallet_addEthereumChain` + `wallet_switchEthereumChain`).

---

## Step 7: Optional backend (dex-api)

- Keep auth as-is.
- Optionally add read-only or cached endpoints that use the same Router/Factory (e.g. “quote”, “pairs”, “volume”) by instantiating ethers with a public RPC and the same contract addresses, for faster or server-side data.

---

## Summary checklist

- [ ] Set `VITE_DEX_ROUTER_ADDRESS`, `VITE_DEX_FACTORY_ADDRESS`, `VITE_CHAIN_ID` in `dex-ui/.env`
- [ ] Extend token list with `address` (and optionally `chainId`) for the deployed chain
- [ ] Add ethers (or viem) to dex-ui and a small Router/Factory + token contract layer
- [ ] Swap page: getAmountsOut for quote; approve + swapExactTokensForTokens for execution
- [ ] Liquidity page: getPair, addLiquidity, removeLiquidity using router/factory
- [ ] Enforce correct chain and optional “wrong network” prompt

After these steps, your deployed DEX Router and Factory will drive the live swap and liquidity flows in the UI.
