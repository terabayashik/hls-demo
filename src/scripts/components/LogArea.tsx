import { Log } from "./Log";
import { Box } from "@chakra-ui/react";
import React from "react";

interface LogAreaProps {
  bufferLogText: string;
  errorLogText: string;
}

export const LogArea = ({ bufferLogText, errorLogText }: LogAreaProps) => {
  return (
    // TODO: Add layout
    <Box>
      <Log title="Buffer" logText={bufferLogText} />
      <Log title="Error" logText={errorLogText} />
    </Box>
  );
};
