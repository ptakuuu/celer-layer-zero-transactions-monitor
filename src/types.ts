import { BigNumber } from "ethers";

export type Transaction = {
  hash: string;
  sender: string;
  sourceChain: number;
  destChain: number;
  amount: BigNumber;
  tokenMetadata: {
    decimals: number;
    symbol: string;
  };
  blockNumber: number;
  timestamp: number;
  token?: string;
};

export type Token = {
  id: string;
  symbol: string;
  decimals: number;
};
