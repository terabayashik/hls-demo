import { Box } from "@chakra-ui/react";
import Hls from "hls.js";
import React, { useEffect, useMemo, useRef } from "react";

export function VideoPlayer({ videoSrc }: { videoSrc: string }) {
  const isSupported = useMemo(() => Hls.isSupported(), []);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isSupported && videoRef.current) {
      const hls = new Hls();
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
