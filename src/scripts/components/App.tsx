import { appendTimeStamp } from "../utils";
import { Header } from "./Header";
import { LogArea } from "./LogArea";
import { UrlForm } from "./UrlForm";
import { VideoPlayer } from "./VideoPlayer";
import { Box, Center, ChakraProvider } from "@chakra-ui/react";
import { BufferAppendedData, ErrorData } from "hls.js";
import React, { useState } from "react";

export const LogCategory = {
  Buffer: "buffer",
  Error: "error",
} as const;
export type LogCategory = typeof LogCategory[keyof typeof LogCategory];

export function App() {
  const [videoSrc, setVideoSrc] = useState("");
  const [bufferLogText, setBufferLogText] = useState("");
  const [totalBufferAppended, setTotalBufferAppended] = useState(0);
  const [totalBufferFlushed, setTotalBufferFlushed] = useState(0);
  const [errorLogText, setErrorLogText] = useState("");
  const handleStreamUrlUpdate = (videoSrc: string) => {
    console.log(`Set "${videoSrc}" to videoSrc`);
    setVideoSrc(videoSrc);
  };

  const handleData = (
    receivedData: BufferAppendedData | ErrorData | string,
    logCategory: LogCategory
  ) => {
    switch (logCategory) {
      case "buffer": {
        const data = receivedData as BufferAppendedData;
        if (data.type === "video") {
          const logText = appendTimeStamp(
            `${data.type} buffer #${
              data.frag.sn
            } appended ${data.frag.start.toFixed(
              3
            )}s to ${data.frag.end.toFixed(
              3
            )}s, total ${data.frag.duration.toFixed(3)} sec ${
              data.chunkMeta.size
            } bytes`
          );
          setBufferLogText((bufferLogText) => logText + "\n" + bufferLogText);
          setTotalBufferAppended(
            (totalBufferAppended) => totalBufferAppended + data.chunkMeta.size
          );
        }
        break;
      }
      case "error": {
        const data = receivedData as string;
        setErrorLogText((errorLogText) => data + "\n" + errorLogText);
        break;
      }
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
            onDataReceive={(addedLogText, logCategory) =>
              handleData(addedLogText, logCategory)
            }
          ></VideoPlayer>
          <LogArea
            bufferLogText={bufferLogText}
            totalBufferAppended={totalBufferAppended}
            totalBufferFlushed={totalBufferFlushed}
            errorLogText={errorLogText}
          />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
