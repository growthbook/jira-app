import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Box, Button, ErrorMessage, Inline, Stack } from "@forge/react";
import { useIssueContext } from "../hooks/useIssueContext";
import UnlinkedIssue from "./UnlinkedIssue";
import LinkedObjectInfo from "./LinkedObjectInfo";

export default function IssuePanel() {
  const {
    linkedObjects,
    setIssueData,
    removeLinkedObject,
    loading: issueDataLoading,
    error: issueDataError,
  } = useIssueContext();
  const [addingLink, setAddingLink] = useState(false);

  if (issueDataLoading)
    return <LoadingSpinner text="Loading your saved data..." />;

  if (issueDataError) {
    return (
      <Inline
        shouldWrap
        alignBlock="center"
        space="space.150"
        rowSpace="space.0"
      >
        <ErrorMessage>{issueDataError}</ErrorMessage>
        <Button onClick={() => setIssueData({})} spacing="compact">
          Clear Data
        </Button>
      </Inline>
    );
  }

  if (!linkedObjects.length) {
    return <UnlinkedIssue />;
  }

  return (
    <Stack space="space.200">
      {linkedObjects.map((linkedObject, i) => (
        <LinkedObjectInfo
          key={`${linkedObject.type}:${linkedObject.id}`}
          linkedObject={linkedObject}
          onRemove={() => removeLinkedObject(i)}
        />
      ))}
      {addingLink ? (
        <Box>
          <UnlinkedIssue onLinked={() => setAddingLink(false)} />
          <Button
            appearance="subtle"
            spacing="compact"
            onClick={() => setAddingLink(false)}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <Box>
          <Button
            iconBefore="link"
            appearance="subtle"
            spacing="compact"
            onClick={() => setAddingLink(true)}
          >
            Link another feature or experiment
          </Button>
        </Box>
      )}
    </Stack>
  );
}
