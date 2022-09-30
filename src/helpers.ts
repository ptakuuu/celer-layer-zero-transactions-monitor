import { ethers, BigNumber } from "ethers";

export const formatAddressToShortVersion = (address: string) => {
  if (address?.length >= 8) {
    return `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;
  }
  return address;
};

export const formatUnitsToValue = (
  value: BigNumber,
  numberOfDecimals: number
) => {
  const formattedValue = Number(
    ethers.utils.formatUnits(value, numberOfDecimals)
  );

  const hasDecimal = formattedValue % 1 !== 0;

  return formattedValue.toFixed(hasDecimal ? 3 : 0);
};
