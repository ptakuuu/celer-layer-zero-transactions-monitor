import { Flex, Text } from "@chakra-ui/react";

export default function TopBar() {
  return (
    <Flex
      px={8}
      py={4}
      alignItems="center"
      justifyContent="space-between"
      bgColor="basic.purple"
      h={20}
      boxShadow="0 0 10px rgba(255,255,255,0.6)"
    >
      <Text>Dashboard</Text>
    </Flex>
  );
}
