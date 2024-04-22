import { RequirementType } from "requirements"
import oldTokenBuyerAbi from "static/abis/oldTokenBuyer"
import tokenBuyerAbi from "static/abis/tokenBuyer"
import { Abi, toBytes } from "viem"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"
import {
  UNIVERSAL_ROUTER_COMMANDS,
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
} from "./encoders"

export type TokenBuyerContractConfig = Partial<
  Record<
    Chain,
    {
      address: `0x${string}`
      abi: Abi
    }
  >
>

export const ZEROX_SUPPORTED_SOURCES = ["Uniswap_V2", "Uniswap_V3"] as const
export type ZeroXSupportedSources = (typeof ZEROX_SUPPORTED_SOURCES)[number]

export const GUILD_FEE_PERCENTAGE = 0.01

export const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
export const NULL_ADDRESS: `0x${string}` =
  "0x0000000000000000000000000000000000000000"

const DEFAULT_TOKEN_BUYER_CONTRACTS: TokenBuyerContractConfig = {
  ETHEREUM: {
    address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
    abi: tokenBuyerAbi,
  },
  POLYGON: {
    address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
    abi: tokenBuyerAbi,
  },
  ARBITRUM: {
    address: "0xe6e6b676f94a6207882ac92b6014a391766fa96e",
    abi: oldTokenBuyerAbi,
  },
  // BSC: {
  //   address: "0xde0d301c75779423d962c2e538d0f326004e7c83",
  //   abi: tokenBuyerAbi,
  // },
  GOERLI: {
    address: "0x1eeaab336061d64f1d271eed529991f7ae7cc478",
    abi: tokenBuyerAbi,
  },
  BASE_MAINNET: {
    address: "0x44f26a7b2b58621d97240b09350b66803faa1e1a",
    abi: tokenBuyerAbi,
  },
}

const SPECIAL_TOKEN_BUYER_CONTRACTS: Record<number, TokenBuyerContractConfig> = {
  // Alongside - TODO
  // 7635: {
  //   ...DEFAULT_TOKEN_BUYER_CONTRACTS,
  //   ETHEREUM: {
  //     address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
  //     abi: tokenBuyerAbi,
  //   },
  //   POLYGON: {
  //     address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
  //     abi: tokenBuyerAbi,
  //   },
  // },
}

export const getTokenBuyerContractData = (
  guildId?: number
): TokenBuyerContractConfig =>
  SPECIAL_TOKEN_BUYER_CONTRACTS[guildId] ?? DEFAULT_TOKEN_BUYER_CONTRACTS

export const ZEROX_API_URLS: Partial<
  Record<keyof typeof DEFAULT_TOKEN_BUYER_CONTRACTS, string>
> = {
  ETHEREUM: "https://api.0x.org",
  GOERLI: "https://goerli.api.0x.org",
  POLYGON: "https://polygon.api.0x.org",
  ARBITRUM: "https://arbitrum.api.0x.org",
  BASE_MAINNET: "https://base.api.0x.org",
}

export const RESERVOIR_API_URLS: Partial<Record<Chain, string>> = {
  // ETHEREUM: "https://api.reservoir.tools",
  // GOERLI: "https://api-goerli.reservoir.tools",
  // POLYGON: "https://api-polygon.reservoir.tools",
  // OPTIMISM: "https://api-optimism.reservoir.tools",
}

export const purchaseSupportedChains: Partial<Record<RequirementType, string[]>> = {
  ERC20: Object.keys(ZEROX_API_URLS),
  ERC721: Object.keys(RESERVOIR_API_URLS),
  ERC1155: Object.keys(RESERVOIR_API_URLS),
}

export const allPurchaseSupportedChains: Chain[] = [
  ...new Set(Object.values(purchaseSupportedChains).flat()),
] as Chain[]

export const PURCHASABLE_REQUIREMENT_TYPES: RequirementType[] = [
  "ERC20",
  "ERC721",
  "ERC1155",
]

export const SUPPORTED_CURRENCIES: { chainId: number; address: `0x${string}` }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: CHAIN_CONFIG[c].id,
    address: NULL_ADDRESS,
  })),
  /**
   * We'll be able to add ERC20 tokens here in the following format:
   *
   * { chainId: number, address: string (token address) }
   */
]

export type PurchaseAssetData = {
  chainId: number
  account: string
  tokenAddress: string
  amountIn: bigint // amount which we got back from the 0x API (in WEI)
  amountInWithFee: bigint // amount which we got back from the 0x API + Guild fee (in WEI)
  amountOut: bigint // token amount which we'd like to purchase (in WEI)
  source: ZeroXSupportedSources
  path: string
  tokenAddressPath: string[]
}

export type BuyTokenType = "COIN" | "ERC20"

// amount: bigint, expiration: bigint, nonce: bigint, spender: string, sigDeadline: bigint, data: Uint8Array
export const permit2PermitFakeParams = [
  BigInt("1461501637330902918203684832716283019655932542975"),
  BigInt("1706751423"),
  BigInt(0),
  "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5",
  BigInt("1704161223"),
  toBytes("0x00"),
] as const

const {
  WRAP_ETH,
  UNWRAP_WETH,
  V2_SWAP_EXACT_OUT,
  V3_SWAP_EXACT_OUT,
  PERMIT2_PERMIT,
} = UNIVERSAL_ROUTER_COMMANDS

export const getAssetsCallParams: Record<
  BuyTokenType,
  Record<
    ZeroXSupportedSources,
    {
      commands: string
      getEncodedParams: (data: PurchaseAssetData) => `0x${string}`[]
    }
  >
> = {
  COIN: {
    Uniswap_V2: {
      commands: WRAP_ETH + V2_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, tokenAddressPath }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
        encodeUnwrapEth(account, BigInt(0)),
      ],
    },
    Uniswap_V3: {
      commands: WRAP_ETH + V3_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, path }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV3SwapExactOut(account, amountOut, amountIn, toBytes(path), false),
        encodeUnwrapEth(account, BigInt(0)),
      ],
    },
  },
  ERC20: {
    Uniswap_V2: {
      commands: PERMIT2_PERMIT + V2_SWAP_EXACT_OUT,
      getEncodedParams: ({
        account,
        amountIn,
        amountOut,
        tokenAddress,
        tokenAddressPath,
      }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
      ],
    },
    Uniswap_V3: {
      commands: PERMIT2_PERMIT + V3_SWAP_EXACT_OUT,
      getEncodedParams: ({ account, amountIn, amountOut, path, tokenAddress }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV3SwapExactOut(account, amountOut, amountIn, toBytes(path), false),
      ],
    },
  },
}

export const FEE_COLLECTOR_CONTRACT: Partial<Record<Chain, string>> = {
  ETHEREUM: "0xe4b4c6a7c6b6396032096c12adf46b7f14a70f4d",
  OPTIMISM: "0xf7c2baa81feb6dd7bda0b3a03afbc1e13f955da5",
  POLYGON: "0xe4b4c6a7c6b6396032096c12adf46b7f14a70f4d",
  POLYGON_MUMBAI: "0xe4b4c6a7c6b6396032096c12adf46b7f14a70f4d",
}
export const paymentSupportedChains: Chain[] = Object.keys(
  FEE_COLLECTOR_CONTRACT
) as Chain[]

export const GUILD_PIN_CONTRACTS = {
  POLYGON: "0xff04820c36759c9f5203021fe051239ad2dcca8a",
  POLYGON_MUMBAI: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
  BASE_MAINNET: "0x326f14942f8899406e3224bd63e9f250d275a52e",
  ZKSYNC_ERA: "0xd1e4254fe7e56f58777ba624e7eeb3644f872b0d",
  BSC: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
  ARBITRUM: "0x0e6a14106497a7de36fba446628860c062e9e302",
  CRONOS: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
  OPTIMISM: "0x6c2c223b84724c4b8fd41ae0142c2369dfa7e319",
  MANTLE: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
  ONTOLOGY: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
  LINEA: "0x4205e56a69a0130a9e0828d45d0c84e45340a196",
} as const

export type GuildPinsSupportedChain = keyof typeof GUILD_PIN_CONTRACTS

export const openseaBaseUrl: Partial<Record<Chain, string>> = {
  POLYGON_MUMBAI: "https://testnets.opensea.io/assets/mumbai",
  ETHEREUM: "https://opensea.io/assets/ethereum",
  POLYGON: "https://opensea.io/assets/matic",
  BSC: "https://opensea.io/assets/bsc",
  ARBITRUM: "https://opensea.io/assets/arbitrum",
  OPTIMISM: "https://opensea.io/assets/optimism",
  AVALANCHE: "https://opensea.io/assets/avalanche",
  BASE_MAINNET: "https://opensea.io/assets/base",
}
