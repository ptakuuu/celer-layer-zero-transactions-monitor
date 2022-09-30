import { Button, Flex, Grid, Spinner, Text } from "@chakra-ui/react";

import { orderBy } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { formatAddressToShortVersion, formatUnitsToValue } from "../helpers";
import { useGetCelerPastTransactions } from "../hooks/useGetCelerPastTransactions";
import { useGetLayerZeroPastTransactions } from "../hooks/useGetLayerZeroPastTransactions";
import { Transaction } from "../types";
import { chainIds } from "../utils";

export default function Main() {
  const { celerTxsLoaded, celerTxs } = useGetCelerPastTransactions();
  const { layerZeroTxsLoaded, layerZeroTxs } =
    useGetLayerZeroPastTransactions();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [visibleTransactions, setVisibleTransactions] = useState(10);

  useEffect(() => {
    setTransactions(celerTxs.concat(layerZeroTxs));
  }, [celerTxs, layerZeroTxs]);

  if (!celerTxsLoaded || !layerZeroTxsLoaded) {
    return (
      <Flex
        h="calc(100vh - 80px)"
        justifyContent="center"
        flexDir="column"
        alignItems="center"
      >
        <Text>Celer & LayerZero Transactions Monitor</Text>
        <Flex justifyContent="center" py={4}>
          <Spinner mr={4} />
          Loading...
        </Flex>
      </Flex>
    );
  }

  return (
    <Grid p={10} pt={12}>
      <Flex mb={2}>
        <Text ml="auto" color="basic.yellow">
          Showing {visibleTransactions} transactions from last 1000 blocks
        </Text>
      </Flex>

      <Grid
        templateColumns="repeat(6, 17%)"
        mb={2}
        bgColor="basic.purple"
        py={2}
        px={4}
        borderRadius="lg"
      >
        <Text>Source Chain</Text>
        <Text>Sender address</Text>
        <Text>Tx hash</Text>
        <Text>Timestamp</Text>
        <Text>Destination Chain</Text>
        <Text>Asset</Text>
      </Grid>

      {transactions.length ? (
        <>
          {orderBy(transactions, "blockNumber", "desc")
            .splice(0, visibleTransactions)
            .map((transaction) => (
              <Grid
                key={transaction.hash}
                templateColumns="repeat(6, 17%)"
                my={1}
                py={3}
                px={4}
                border="1px solid rgba(255,255,255,0.1)"
                borderRadius="xl"
                transition="0.2s"
                cursor="pointer"
                _hover={{
                  bgColor: "bg.light",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 0 10px rgba(255,255,255,0.2)",
                }}
                onClick={() =>
                  window.open(`https://etherscan.io/tx/${transaction.hash}`)
                }
              >
                <Text textTransform="capitalize">
                  {chainIds.find(
                    (x) => x.id === Number(transaction.sourceChain)
                  )?.name ?? Number(transaction.sourceChain)}
                </Text>
                <Text>{formatAddressToShortVersion(transaction.sender)}</Text>
                <Text>{`${transaction.hash.slice(0, 12)}...`}</Text>
                <Text>
                  {transaction.timestamp
                    ? moment.unix(transaction.timestamp).fromNow()
                    : "-"}
                </Text>
                <Text textTransform="capitalize">
                  {chainIds.find((x) => x.id === Number(transaction.destChain))
                    ?.name ?? Number(transaction.destChain)}
                </Text>
                <Flex alignItems="center">
                  {formatUnitsToValue(
                    transaction.amount,
                    transaction.tokenMetadata?.decimals
                  )}{" "}
                  {transaction.tokenMetadata?.symbol}
                </Flex>
              </Grid>
            ))}
        </>
      ) : (
        <Text>No transactions</Text>
      )}
      {visibleTransactions < transactions.length && (
        <Flex justifyContent="center" my={4}>
          <Button
            variant="outline"
            onClick={() => setVisibleTransactions((state) => state + 10)}
          >
            Show more
          </Button>
        </Flex>
      )}
    </Grid>
  );
}
