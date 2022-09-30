import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Transaction } from "../types";

const APIURL = "https://api.thegraph.com/subgraphs/name/goldennaim/stargate";

const tokensQuery = `
  query ($blockNumber:Int) {
    swaps (first: 40, where: {blockNumber_gt: $blockNumber}) {
        txHash
        dstChainId
        srcChainId
        recipientAddress
        amountLD
        pool {
          token
          localDecimals
          symbol
        }
        amountLD
        blockNumber
        timestamp
      }
  }
`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

const settings = {
  apiKey: "zSpRaW9x4qgur-hLKLrxgqNIA3bqcH1-",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export const useGetLayerZeroPastTransactions = () => {
  const [layerZeroTxsLoaded, setLayerZeroTxsLoaded] = useState<boolean>(false);
  const [layerZeroTxs, setLayerZeroTxs] = useState<Transaction[]>([]);

  const getLayerZeroContract = async () => {
    try {
      const latestBlock = await alchemy.core.getBlockNumber();

      const data: any = await client
        .query({
          query: gql(tokensQuery),
          variables: {
            blockNumber: latestBlock - 1000,
          },
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });

      const txs: Transaction[] = data.data.swaps.map((tx: any) => ({
        hash: tx.txHash,
        sender: tx.recipientAddress,
        sourceChain: Number(tx.srcChainId),
        destChain: Number(tx.dstChainId),
        amount: ethers.BigNumber.from(String(tx.amountLD)),
        tokenMetadata: {
          decimals: Number(tx.pool.localDecimals),
          symbol: tx.pool.symbol,
        },
        blockNumber: Number(tx.blockNumber),
        timestamp: Number(tx.timestamp),
      }));

      setLayerZeroTxs(txs);
      setLayerZeroTxsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLayerZeroContract();
  }, []);

  return { layerZeroTxsLoaded, layerZeroTxs };
};
