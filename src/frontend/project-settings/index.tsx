import React from "react";
import ForgeReconciler, {
  Box,
  ErrorMessage,
  Icon,
  Inline,
  Label,
  Link,
  Spinner,
  Stack,
  Text,
  Toggle,
} from "@forge/react";
import {
  AppSettingsContextProvider,
  useAppSettingsContext,
} from "../hooks/useAppSettingsContext";
import { JiraContextProvider, useJiraContext } from "../hooks/useJiraContext";
import {
  ProjectSettingsProvider,
  useProjectSettingsContext,
} from "../hooks/useProjectSettingsContext";
import EnvironmentSelect from "../configure/EnvironmentSelect";
import ProjectSelect from "../configure/ProjectSelect";

const App = () => {
  const {
    apiKey,
    loading: settingsLoading,
    error: settingsError,
  } = useAppSettingsContext();
  const {
    context: { localId, siteUrl },
    loading: contextLoading,
  } = useJiraContext();
  const { settings, updateSettings, loading, saving, error } =
    useProjectSettingsContext();

  if (settingsLoading || contextLoading || loading)
    return (
      <Inline>
        <Spinner />
        <Text>Loading...</Text>
      </Inline>
    );

  const [APP_ID, ENV_ID] = (localId || "").split("/").slice(1, 3);
  const configureLink = `${siteUrl}/jira/settings/apps/configure/${APP_ID}/${ENV_ID}`;
  if (settingsError || !apiKey)
    return (
      <ErrorMessage>
        Connect GrowthBook on the site-wide{" "}
        <Link openNewTab href={configureLink}>
          Configure page
        </Link>{" "}
        first.
      </ErrorMessage>
    );

  const overridesEnvironments = settings.visibleEnvironments !== undefined;

  return (
    <Stack space="space.300">
      <Text>
        These settings apply to issues in this Jira project and override the
        site-wide configuration.
      </Text>
      <Box>
        <Inline alignBlock="center" space="space.100">
          <Toggle
            id="gb-override-environments"
            isChecked={overridesEnvironments}
            onChange={() =>
              updateSettings({
                visibleEnvironments: overridesEnvironments ? undefined : [],
              })
            }
          />
          <Label labelFor="gb-override-environments">
            Customize which environments this project shows
          </Label>
        </Inline>
        {overridesEnvironments && (
          <EnvironmentSelect
            value={settings.visibleEnvironments || []}
            onChange={(ids) => updateSettings({ visibleEnvironments: ids })}
            helper="Leave empty to show every environment for this project."
          />
        )}
      </Box>
      <ProjectSelect
        value={settings.gbProjects || []}
        onChange={(ids) => updateSettings({ gbProjects: ids })}
      />
      <Box>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
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
      </Box>
    </Stack>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <JiraContextProvider>
      <AppSettingsContextProvider>
        <ProjectSettingsProvider>
          <App />
        </ProjectSettingsProvider>
      </AppSettingsContextProvider>
    </JiraContextProvider>
  </React.StrictMode>
);
