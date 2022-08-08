import { Video } from "./Video";
import { ChakraProvider, Heading } from "@chakra-ui/react";
import React from "react";

export function App() {
  return (
    <ChakraProvider>
      <Heading>HLS Demo</Heading>
      <Video videoSrc="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></Video>
    </ChakraProvider>
  );
}
