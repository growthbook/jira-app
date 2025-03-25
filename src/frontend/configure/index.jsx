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
  HelperMessage,
} from "@forge/react";
import {
  AppSettingsContextProvider,
  useAppSettingsContext,
} from "../AppSettingsContext";
import { CLOUD_API_HOST, CLOUD_APP_ORIGIN } from "../../utils/consts";
import { Icon } from "@forge/react";

const App = () => {
  const {
    apiKey,
    setApiKey,
    gbHost,
    setGbHost,
    isCloud,
    setIsCloud,
    gbApp,
    setGbApp,
    error,
    loading,
    saving,
  } = useAppSettingsContext();

  const getGbLink = (path) => {
    try {
      const url = new URL(path, gbApp);
      return (
        <Link target={null} href={url.toString()}>
          {path}
        </Link>
      );
    } catch {
      return path;
    }
  };

  if (loading) {
    return (
      <Inline>
        <Spinner />
        <Text>Loading...</Text>
      </Inline>
    );
  }

  return (
    <Box>
      <Box>
        <Inline>
          <Label labelFor="gb-cloud-input">Using GrowthBook Cloud?</Label>
          <Checkbox
            id="gb-cloud-input"
            isChecked={isCloud}
            onChange={(e) => {
              setIsCloud(e.target.checked);
              if (e.target.checked) {
                setGbHost(CLOUD_API_HOST);
                setGbApp(CLOUD_APP_ORIGIN);
              }
            }}
          />
        </Inline>
        <Label labelFor="gb-host-input">GrowthBook API Host</Label>
        <Textfield
          id="gb-host-input"
          value={gbHost}
          isDisabled={isCloud}
          onChange={(e) => setGbHost(e.target.value)}
        />
        <Label labelFor="gb-app-input">GrowthBook App Origin</Label>
        <Textfield
          id="gb-app-input"
          value={gbApp}
          isDisabled={isCloud}
          onChange={(e) => setGbApp(e.target.value)}
        />
      </Box>
      <Box>
        <Inline>
          <Label labelFor="gb-api-key-input">Personal Access Token</Label>
        </Inline>
        <Textfield
          autoFocus
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <HelperMessage>
          <Inline>
            <Text>
              You can generate an access token at{" "}
              {getGbLink("/account/personal-access-tokens")}
            </Text>
          </Inline>
        </HelperMessage>
      </Box>
      <Box>
        {error ? (
          <Text>
            <Icon glyph="cross" />
            There was an error:
          </Text>
        ) : saving ? (
          <Text>
            <Spinner />
            Saving changes...
          </Text>
        ) : (
          <Text>
            <Icon glyph="check" />
            Settings synced
          </Text>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
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
