import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

export function UrlForm({
  handleStreamUrlUpdate,
}: {
  handleStreamUrlUpdate: (videoSrc: string) => void;
}) {
  const [input, setInput] = useState(
    "http://sirocco-test1.mediaedge.jp/live/01.m3u8"
  );
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const isError = input === "";

  const handleRadioChange = (value: string) => {
    switch (value) {
      case "Sirocco1":
        setIsInputDisabled(true);
        setInput("http://sirocco-test1.mediaedge.jp/live/01.m3u8");
        break;
      case "Sirocco2":
        setIsInputDisabled(true);
        setInput("http://sirocco-test2.mediaedge.jp:8080/live/01.m3u8");
        break;
      case "Custom":
        setIsInputDisabled(false);
        break;
      default:
        throw new Error("Invalid selection");
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);
  return (
    <Box my={4}>
      <Flex>
        <Formik
          initialValues={{ videoUrl: "" }}
          onSubmit={() => {
            handleStreamUrlUpdate(input);
          }}
        >
          {() => (
            <Form>
              <Field name="videoUrl">
                {() => (
                  <FormControl isInvalid={isError}>
                    <FormLabel>Stream URL</FormLabel>
                    <RadioGroup
                      defaultValue={"Sirocco1"}
                      onChange={handleRadioChange}
                    >
                      <HStack spacing={6}>
                        <Radio value="Sirocco1">Sirocco1</Radio>
                        <Radio value="Sirocco2">Sirocco2</Radio>
                        <Radio value="Custom">Custom</Radio>
                      </HStack>
                    </RadioGroup>
                    <Input
                      type="url"
                      value={input}
                      isDisabled={isInputDisabled}
                      onChange={handleInputChange}
                      w="lg"
                    />
                    {!isError ? (
                      <FormHelperText>
                        Watch stream from entered URL.
                      </FormHelperText>
                    ) : (
                      <FormErrorMessage>
                        Stream URL is required. e.g.
                        https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
                      </FormErrorMessage>
                    )}
                    <Button type="submit">Watch</Button>
                  </FormControl>
                )}
              </Field>
            </Form>
          )}
        </Formik>
      </Flex>
    </Box>
  );
}
