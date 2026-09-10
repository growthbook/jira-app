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
import EnvironmentSelect from "./EnvironmentSelect";
import usePersistedState from "../hooks/usePersistedState";
import { VISIBLE_ENVIRONMENTS_KEY } from "../hooks/useVisibleEnvironments";

const App = () => {
  const { apiKey, setApiKey, error, loading, saving } = useAppSettingsContext();
  const [visibleEnvironments, setVisibleEnvironments] = usePersistedState<
    string[]
  >(VISIBLE_ENVIRONMENTS_KEY, []);

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
          <Inline alignBlock="center" space="space.050">
            <Text as="span">You can generate an API key at</Text>{" "}
            <GrowthBookLink path="/settings/keys">
              /settings/keys
            </GrowthBookLink>
            .
            <Text as="span">
              It's recommended to use the <Lozenge>readonly</Lozenge> role
            </Text>
          </Inline>
        </HelperMessage>
      </Box>
      {apiKey && (
        <Box paddingBlockStart="space.200">
          <EnvironmentSelect
            value={Array.isArray(visibleEnvironments) ? visibleEnvironments : []}
            onChange={setVisibleEnvironments}
          />
        </Box>
      )}
      <Box>
        {error ? (
          <Text>There was an error:</Text>
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
