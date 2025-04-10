import React from "react";
import ForgeReconciler, {
  Box,
  ErrorMessage,
  Inline,
  Label,
  Spinner,
  Text,
  Textfield,
  HelperMessage,
  Lozenge,
} from "@forge/react";
import {
  AppSettingsContextProvider,
  useAppSettingsContext,
} from "../hooks/useAppSettingsContext";
import { Icon } from "@forge/react";
import GrowthBookLink from "../widget/GrowthBookLink";

const App = () => {
  const { apiKey, setApiKey, error, loading, saving } = useAppSettingsContext();

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
          <Label labelFor="gb-api-key-input">API Key</Label>
        </Inline>
        <Textfield
          autoFocus
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <HelperMessage>
          <Inline>
            <Text>
              You can generate an API key at{" "}
              <GrowthBookLink path="/settings/keys">
                /settings/keys
              </GrowthBookLink>
              . It's recommended to use the <Lozenge>readonly</Lozenge> role
            </Text>
          </Inline>
        </HelperMessage>
      </Box>
      <Box>
        {error ? (
          <Text>
            <Icon label="" glyph="cross" />
            There was an error:
          </Text>
        ) : saving ? (
          <Text>
            <Spinner />
            Saving changes...
          </Text>
        ) : (
          <Text>
            <Icon label="checkmark" glyph="check" />
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
