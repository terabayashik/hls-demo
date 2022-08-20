import { hlsConfig } from "../hlsConfig";
import { appendTimeStamp } from "../utils";
import { LogCategory } from "./App";
import { Box } from "@chakra-ui/react";
import Hls, { BufferAppendedData, ErrorData } from "hls.js";
import React, { useEffect, useMemo, useRef } from "react";

const addErrorHandler = (
  hls: Hls,
  handleData: (addedLogText: string, logCategory: LogCategory) => void
) => {
  hls.on(Hls.Events.ERROR, (_, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR: {
          const logText = appendTimeStamp(
            `Fatal network error ${data.details} occured, try to recover`
          );
          console.error(logText);
          handleData(logText, LogCategory.Error);
          hls.startLoad();
          break;
        }
        case Hls.ErrorTypes.MEDIA_ERROR: {
          // Add hls.swapAudioCodec() if this error occurs too often. (Exclude first error)
          const logText = appendTimeStamp(
            `Fatal media error ${data.details} occured, try to recover`
          );
          console.error(logText);
          handleData(logText, LogCategory.Error);
          hls.recoverMediaError();
          break;
        }
        default: {
          const logText = appendTimeStamp(`Destroy hls: ${data}`);
          console.error(logText);
          handleData(logText, LogCategory.Error);
          hls.destroy();
          break;
        }
      }
    }
  });
};

const addBufferAppendedHandler = (
  hls: Hls,
  handleData: (data: BufferAppendedData, logCategory: LogCategory) => void
) => {
  hls.on(Hls.Events.BUFFER_APPENDED, (_, data) => {
    handleData(data, LogCategory.Buffer);
  });
};

const addBufferFlushedHandler = (hls: Hls) => {
  hls.on(Hls.Events.BUFFER_FLUSHED, (_, data) => {
    if (data.type === "video") {
      const logText = appendTimeStamp(`${data.type} buffer flushed`);
      console.log(logText);
    }
  });
};

const addMediaAttachedHandler = (hls: Hls) => {
  hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    console.log(appendTimeStamp("media attaced"));
  });
};

const addMediaDetachedHandler = (hls: Hls) => {
  hls.on(Hls.Events.MEDIA_DETACHED, () => {
    console.log(appendTimeStamp("media detached"));
  });
};

interface VideoPlayerProps {
  videoSrc: string;
  onDataReceive: (
    receivedData: BufferAppendedData | ErrorData | string,
    logCategory: LogCategory
  ) => void;
}

export function VideoPlayer({
  videoSrc,
  onDataReceive: handleData,
}: VideoPlayerProps) {
  const isSupported = useMemo(() => Hls.isSupported(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isSupported && videoRef.current) {
      const hls = new Hls(hlsConfig);
      addErrorHandler(hls, handleData);
      addBufferAppendedHandler(hls, handleData);
      addBufferFlushedHandler(hls);
      addMediaAttachedHandler(hls);
      addMediaDetachedHandler(hls);
      hls.loadSource(videoSrc);
      hls.attachMedia(videoRef.current);
      videoRef.current.play();
      return () => {
        hls.removeAllListeners();
        hls.stopLoad();
      };
    }
  }, [videoSrc]);
  return (
    <Box
      className="content"
      visibility={videoSrc === "" ? "hidden" : "visible"}
    >
      {isSupported ? (
        <Box className="video-container">
          <video ref={videoRef} className="video" controls></video>
        </Box>
      ) : (
        <Box className="not-supported">This browser is not supported.</Box>
      )}
    </Box>
  );
}
