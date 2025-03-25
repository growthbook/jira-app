import React, { useState } from "react";
import ForgeReconciler, {
  Box,
  Checkbox,
  ErrorMessage,
  Inline,
  Label,
  Link,
  Spinner,
  Text,
  Textfield,
  Tooltip,
} from "@forge/react";
import {
  AppSettingsContextProvider,
  useAppSettingsContext,
} from "../AppSettingsContext";

const App = () => {
  const {
    apiKey,
    setApiKey,
    gbHost,
    setGbHost,
    isCloud,
    setIsCloud,
    error,
    loading,
    saving,
  } = useAppSettingsContext();

  const getGbLink = (path) => {
    try {
      const url = new URL(path, gbHost);
      return <Link href={url.toString()}>{path}</Link>;
    } catch {
      return path;
    }
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>
        <Label labelFor="gb-cloud-input">Using GrowthBook Cloud?</Label>
        <Checkbox
          id="gb-cloud-input"
          isChecked={isCloud}
          onChange={(e) => {
            setIsCloud(e.target.checked);
          }}
        />
        <Label labelFor="gb-host-input">GrowthBook Host</Label>
        <Textfield
          id="gb-host-input"
          value={gbHost}
          onChange={(e) => setGbHost(e.target.value)}
        />
      </Box>
      <Box>
        <Inline>
          <Label labelFor="gb-api-key-input">Personal Access Token</Label>
          {/* <Tooltip
            content={
              <>
                You can generate an access token at{" "}
                {getGbLink("/account/personal-access-tokens")}
              </>
            }
          >
            <Text>?</Text>
          </Tooltip> */}
        </Inline>
        <Textfield value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </Box>
    </Box>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <AppSettingsContextProvider>
      <App />
    </AppSettingsContextProvider>
  </React.StrictMode>
);
