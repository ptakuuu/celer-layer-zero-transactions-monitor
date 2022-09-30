import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Token, Transaction } from "../types";
import { celerContractAbi, tokenAbi } from "../utils";

const settings = {
  apiKey: "zSpRaW9x4qgur-hLKLrxgqNIA3bqcH1-",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const provider = new ethers.providers.AlchemyProvider(
  1,
  "zSpRaW9x4qgur-hLKLrxgqNIA3bqcH1-"
);

const tokensData: Token[] = [];

const updateTxsTokensMetadata = (txs: Transaction[]) =>
  new Promise<Transaction[]>(async (resolve, reject) => {
    const newTxs = [...txs];

    for (let i = 0; i < newTxs.length; i++) {
      try {
        const timestamp = await provider
          .getBlock(newTxs[i].blockNumber)
          .then((data) => data.timestamp);

        const actualToken = tokensData.find(
          (x: Token) => x.id === newTxs[i].token
        );

        if (actualToken) {
          newTxs[i] = {
            ...newTxs[i],
            tokenMetadata: actualToken,
            timestamp,
          };
        } else {
          const contract = new ethers.Contract(
            newTxs[i].token!,
            tokenAbi,
            provider
          );

          const symbol = await contract.symbol();
          const decimals = await contract.decimals();

          tokensData.push({ id: newTxs[i].token!, symbol, decimals });

          newTxs[i] = {
            ...newTxs[i],
            tokenMetadata: { symbol, decimals },
            timestamp,
          };
        }

        if (i === newTxs.length - 1) {
          resolve(newTxs);
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }
  });

export const useGetCelerPastTransactions = () => {
  const [celerTxsLoaded, setCelerTxsLoaded] = useState<boolean>(false);
  const [celerTxs, setCelerTxs] = useState<Transaction[]>([]);

  const getCelerContract = async () => {
    try {
      const latestBlock = await alchemy.core.getBlockNumber();

      const contract = new ethers.Contract(
        "0xB37D31b2A74029B5951a2778F959282E2D518595",
        celerContractAbi,
        provider
      );

      let depositedTxs: any[] = await contract.queryFilter(
        "Deposited",
        latestBlock - 1000,
        latestBlock
      );

      depositedTxs = depositedTxs.map((tx: any) => ({
        hash: tx.transactionHash,
        token: tx.args.token,
        type: tx.event,
        sender: tx.args.depositor,
        blockNumber: tx.blockNumber,
        amount: tx.args.amount,
        destChain: Number(tx.args.mintChainId),
        sourceChain: 1,
      }));

      depositedTxs = await updateTxsTokensMetadata(depositedTxs);

      let widthdrawnTxs: any[] = await contract.queryFilter(
        "Withdrawn",
        latestBlock - 1000,
        latestBlock
      );

      widthdrawnTxs = widthdrawnTxs.map((tx: any) => ({
        hash: tx.transactionHash,
        token: tx.args.token,
        type: tx.event,
        sender: tx.args.receiver,
        blockNumber: tx.blockNumber,
        amount: tx.args.amount,
        destChain: 1,
        sourceChain: Number(tx.args.refChainId),
      }));

      widthdrawnTxs = await updateTxsTokensMetadata(widthdrawnTxs);

      const lastTxs = depositedTxs.concat(widthdrawnTxs);

      setCelerTxs(lastTxs);
      setCelerTxsLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCelerContract();
  }, []);

  return { celerTxsLoaded, celerTxs };
};
