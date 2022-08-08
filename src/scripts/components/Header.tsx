import { Heading, HStack, Image } from "@chakra-ui/react";
import React from "react";

export function Header() {
  return (
    <HStack>
      <Image src="../assets/images/ME-F.png" maxH={8} />
      <Heading>HLS Demo</Heading>
    </HStack>
  );
}
