import { ChakraProvider, Heading } from "@chakra-ui/react";
import React from "react";

export function App() {
  return (
    <ChakraProvider>
      <Heading>HLS Demo</Heading>
    </ChakraProvider>
  );
}
