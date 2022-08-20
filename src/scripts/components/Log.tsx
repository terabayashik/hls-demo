import { Box, Text, Textarea } from "@chakra-ui/react";
import React from "react";

interface LogProps {
  title: string;
  logText: string;
}

export const Log = ({ title, logText }: LogProps) => {
  return (
    <Box>
      <Text>{title}</Text>
      <Textarea isReadOnly value={logText} resize="none" h="3xs" />
    </Box>
  );
};
