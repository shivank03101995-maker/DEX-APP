/**
 * DEX contract configuration.
 * Set these in .env so the UI uses your deployed Router and Factory.
 */

const env = import.meta.env;

export const DEX_ROUTER_ADDRESS =
  (typeof env.VITE_DEX_ROUTER_ADDRESS === "string" && env.VITE_DEX_ROUTER_ADDRESS.trim()) || "";

export const DEX_FACTORY_ADDRESS =
  (typeof env.VITE_DEX_FACTORY_ADDRESS === "string" && env.VITE_DEX_FACTORY_ADDRESS.trim()) || "";

/** Chain ID where the Router/Factory are deployed (e.g. 80002 Amoy, 137 Polygon). */
export const DEX_CHAIN_ID =
  typeof env.VITE_CHAIN_ID === "string" && env.VITE_CHAIN_ID.trim()
    ? parseInt(env.VITE_CHAIN_ID.trim(), 10)
    : 0;

export const isDexConfigured =
  Boolean(DEX_ROUTER_ADDRESS && DEX_FACTORY_ADDRESS && DEX_CHAIN_ID > 0);

/** Block explorer tx URL for the configured DEX chain */
export function getExplorerTxUrl(txHash: string): string {
  if (DEX_CHAIN_ID === 80002) return `https://amoy.polygonscan.com/tx/${txHash}`;
  if (DEX_CHAIN_ID === 137) return `https://polygonscan.com/tx/${txHash}`;
  return `https://etherscan.io/tx/${txHash}`;
}
