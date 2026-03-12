import '@nomicfoundation/hardhat-toolbox'
import type { HardhatUserConfig } from 'hardhat/config'
import { subtask } from 'hardhat/config'
import { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } from 'hardhat/builtin-tasks/task-names'

import fs from 'node:fs'
import path from 'node:path'

function loadDotEnv() {
  const envPath = path.join(__dirname, '.env')
  if (!fs.existsSync(envPath)) return

  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key && process.env[key] == null) process.env[key] = value
  }
}

loadDotEnv()

// Prefer `solc` from npm (solc-js) to avoid downloading compilers from solc-bin.
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(async (args: any, _hre, runSuper) => {
  const solcVersion = args?.solcVersion as string | undefined
  if (solcVersion !== '0.8.24') return runSuper(args)

  const compilerPath = require.resolve('solc/soljson.js')
  return {
    compilerPath,
    isSolcJs: true,
    version: solcVersion,
    longVersion: solcVersion,
  }
})

const privateKey = process.env.PRIVATE_KEY
const accounts = privateKey ? [privateKey] : []

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    // Polygon mainnet (chainId 137)
    polygon: {
      url: process.env.POLYGON_RPC_URL ?? '',
      chainId: 137,
      accounts,
    },
    // Polygon Amoy testnet (chainId 80002)
    amoy: {
      url: process.env.AMOY_RPC_URL ?? '',
      chainId: 80002,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY ?? '',
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? '',
    },
  },
}

export default config
