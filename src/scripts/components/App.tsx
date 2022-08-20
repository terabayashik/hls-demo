import { Header } from "./Header";
import { LogArea } from "./LogArea";
import { UrlForm } from "./UrlForm";
import { VideoPlayer } from "./VideoPlayer";
import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import React, { useState } from "react";

export const LogCategory = {
  Buffer: "buffer",
  Error: "error",
} as const;
export type LogCategory = typeof LogCategory[keyof typeof LogCategory];

export function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [bufferLogText, setBufferLogText] = useState("");
  const [errorLogText, setErrorLogText] = useState("");
  const handleStreamUrlUpdate = (videoSrc: string) => {
    console.log(`Set "${videoSrc}" to videoSrc`);
    setVideoSrc(videoSrc);
  };

  const handleLogUpdate = (addedLogText: string, logCategory: LogCategory) => {
    switch (logCategory) {
      case "buffer":
        setBufferLogText(
          (bufferLogText) => addedLogText + "\n" + bufferLogText
        );
        break;
      case "error":
        setErrorLogText((errorLogText) => addedLogText + "\n" + errorLogText);
        break;
      default:
        break;
    }
  };

  return (
    <ChakraProvider>
      <Center>
        <Box w="container.xl" p={4}>
          <Header />
          <UrlForm handleStreamUrlUpdate={handleStreamUrlUpdate} />
          <VideoPlayer
            videoSrc={videoSrc}
            handleLogUpdate={(addedLogText, logCategory) =>
              handleLogUpdate(addedLogText, logCategory)
            }
          ></VideoPlayer>
          <LogArea bufferLogText={bufferLogText} errorLogText={errorLogText} />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
