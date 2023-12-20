import { InjectedConnector } from "@web3-react/injected-connector";

export const POLLING_INTERVAL = 12000;

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97],
});

export const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org/",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  // 137: "https://rpc-mainnet.maticvigil.com/",
};
