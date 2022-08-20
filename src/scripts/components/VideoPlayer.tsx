import { hlsConfig } from "../hlsConfig";
import { appendTimeStamp } from "../utils";
import { LogCategory } from "./App";
import { Box } from "@chakra-ui/react";
import Hls from "hls.js";
import React, { useEffect, useMemo, useRef } from "react";

const addErrorHandler = (
  hls: Hls,
  handleLogUpdate: (addedLogText: string, logCategory: LogCategory) => void
) => {
  hls.on(Hls.Events.ERROR, (event, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR: {
          const logText = appendTimeStamp(
            `Fatal network error ${data.details} occured, try to recover`
          );
          console.error(logText);
          handleLogUpdate(logText, LogCategory.Error);
          hls.startLoad();
          break;
        }
        case Hls.ErrorTypes.MEDIA_ERROR: {
          // Add hls.swapAudioCodec() if this error occurs too often. (Exclude first error)
          const logText = appendTimeStamp(
            `Fatal media error ${data.details} occured, try to recover`
          );
          console.error(logText);
          handleLogUpdate(logText, LogCategory.Error);
          hls.recoverMediaError();
          break;
        }
        default: {
          const logText = appendTimeStamp(`Destroy hls: ${data}`);
          console.error(logText);
          handleLogUpdate(logText, LogCategory.Error);
          hls.destroy();
          break;
        }
      }
    }
  });
};

const addBufferAppendedHandler = (
  hls: Hls,
  handleLogUpdate: (addedLogText: string, logCategory: LogCategory) => void
) => {
  hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
    const logText = appendTimeStamp(
      `${data.type} buffer appended ${data.frag.start.toFixed(
        3
      )}s to ${data.frag.end.toFixed(3)}s, total ${data.frag.duration.toFixed(
        3
      )} sec`
    );
    if (data.type === "video") {
      handleLogUpdate(logText, LogCategory.Buffer);
    }
  });
};

const addBufferFlushedHandler = (hls: Hls) => {
  hls.on(Hls.Events.BUFFER_FLUSHED, (event, data) => {
    if (data.type === "video") {
      console.log(appendTimeStamp(`${data.type} buffer flushed`));
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
  handleLogUpdate: (addedLogText: string, logCategory: LogCategory) => void;
}

export function VideoPlayer({ videoSrc, handleLogUpdate }: VideoPlayerProps) {
  const isSupported = useMemo(() => Hls.isSupported(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isSupported && videoRef.current) {
      const hls = new Hls(hlsConfig);
      addErrorHandler(hls, handleLogUpdate);
      addBufferAppendedHandler(hls, handleLogUpdate);
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
