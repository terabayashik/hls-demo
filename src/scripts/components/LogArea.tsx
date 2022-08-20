import { formatByteValue } from "../utils";
import { Log } from "./Log";
import { Box, Flex, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import React from "react";

interface LogAreaProps {
  bufferLogText: string;
  totalBufferAppended: number;
  totalBufferFlushed: number;
  errorLogText: string;
}

export const LogArea = ({
  bufferLogText,
  totalBufferAppended,
  totalBufferFlushed,
  errorLogText,
}: LogAreaProps) => {
  return (
    <Box>
      <Flex>
        <Box flex="1">
          <Log title="Buffer" logText={bufferLogText} />
        </Box>
        <Flex direction="column" mx={4}>
          <Stat>
            <StatLabel>Total Buffer Appended</StatLabel>
            <StatNumber>
              {formatByteValue(totalBufferAppended).sizeStr}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Buffer Flushed</StatLabel>
            <StatNumber>
              {formatByteValue(totalBufferFlushed).sizeStr}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Current Buffer Using</StatLabel>
            <StatNumber>
              {
                formatByteValue(totalBufferAppended - totalBufferFlushed)
                  .sizeStr
              }
            </StatNumber>
          </Stat>
        </Flex>
      </Flex>
      <Log title="Error" logText={errorLogText} />
    </Box>
  );
};
