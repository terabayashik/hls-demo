import { UrlForm } from "./UrlForm";
import { Video } from "./Video";
import {
  Box,
  Center,
  ChakraProvider,
  Heading,
  HStack,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";

export function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const handleStreamUrlUpdate = (videoSrc: string) => {
    console.log(`Set "${videoSrc}" to videoSrc`);
    setVideoSrc(videoSrc);
  };

  return (
    <ChakraProvider>
      <Center>
        <Box w="container.xl" p={4}>
          <HStack>
            <Image src="../assets/images/ME-F.png" maxH={8} />
            <Heading>HLS Demo</Heading>
          </HStack>
          <UrlForm handleStreamUrlUpdate={handleStreamUrlUpdate} />
          <Video videoSrc={videoSrc}></Video>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
