import React, { useCallback, useState, useEffect } from "react";
import {
  Heading,
  Form,
  Flex,
  TextInput,
  FormControl,
} from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";

const ConfigScreen = () => {
  const [parameters, setParameters] = useState({});
  const sdk = useSDK();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  function updateApiKey(e) {
    const value = e.target.value;
    setParameters({ apiKey: value });
  }

  useEffect(() => {
    sdk.app.onConfigure(onConfigure);
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="column" margin="spacingL">
      <Heading>App Config</Heading>
      <Form>
        <FormControl isRequired isInvalid={!parameters.apiKey}>
          <FormControl.Label>API endpoint</FormControl.Label>
          <TextInput
            value={parameters.apiKey || ""}
            type="password"
            name="apiKey"
            onChange={updateApiKey}
          />
          <FormControl.HelpText>
            Head on over to{" "}
            <a href="https://rawg.io/apidocs" target="_blank" rel="noreferrer">
              RAWG.io
            </a>{" "}
            to get your key.
          </FormControl.HelpText>
          {!parameters.apiKey && (
            <FormControl.ValidationMessage>
              Please provide a RAWG.io API key.
            </FormControl.ValidationMessage>
          )}
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
