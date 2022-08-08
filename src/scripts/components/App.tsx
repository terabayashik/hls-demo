import { Header } from "./Header";
import { UrlForm } from "./UrlForm";
import { VideoPlayer } from "./VideoPlayer";
import { Box, Center, ChakraProvider } from "@chakra-ui/react";
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
          <Header />
          <UrlForm handleStreamUrlUpdate={handleStreamUrlUpdate} />
          <VideoPlayer videoSrc={videoSrc}></VideoPlayer>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
