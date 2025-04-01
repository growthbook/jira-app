import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  ErrorMessage,
  Link,
  Spinner,
  Text,
  Icon,
} from "@forge/react";
import {
  AppSettingsContextProvider,
  useAppSettingsContext,
} from "../hooks/useAppSettingsContext";
import { JiraContextProvider, useJiraContext } from "../hooks/useJiraContext";

const App = () => {
  const {
    apiKey,
    error: settingsError,
    loading: settingsLoading,
  } = useAppSettingsContext();

  const {
    context: { localId, siteUrl, extension },
    loading: contextLoading,
  } = useJiraContext();

  if (settingsLoading || contextLoading)
    return (
      <Text>
        <Spinner />
        Loading...
      </Text>
    );

  console.log("Got local id", localId);

  const [APP_ID, ENV_ID] = (localId || "").split("/").slice(1, 3);
  const configureLink = `${siteUrl}/jira/settings/apps/configure/${APP_ID}/${ENV_ID}`;

  if (settingsError)
    return (
      <ErrorMessage>
        Failed to load settings. Check the{" "}
        <Link openNewTab href={configureLink}>
          Configure page
        </Link>{" "}
        for more details.
      </ErrorMessage>
    );

  if (!apiKey) {
    return (
      <ErrorMessage>
        You must specify an access token to use this app.{" "}
        <Link openNewTab href={configureLink}>
          <Icon label="link to configuration" glyph="shortcut" />
        </Link>
      </ErrorMessage>
    );
  }

  // TODO: handle null
  const issueId = extension?.issue?.id;

  return (
    <>
      <Text>Test</Text>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <AppSettingsContextProvider>
      <JiraContextProvider>
        <App />
      </JiraContextProvider>
    </AppSettingsContextProvider>
  </React.StrictMode>
);
