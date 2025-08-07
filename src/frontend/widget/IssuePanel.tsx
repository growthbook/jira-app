import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Button, ErrorMessage, Inline } from "@forge/react";
import { useIssueContext } from "../hooks/useIssueContext";
import UnlinkedIssue from "./UnlinkedIssue";
import LinkedObjectInfo from "./LinkedObjectInfo";

export default function IssuePanel() {
  const {
    issueData,
    setIssueData,
    loading: issueDataLoading,
    error: issueDataError,
  } = useIssueContext();

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

  if (!issueData.linkedObject) {
    return <UnlinkedIssue />;
  }
  return <LinkedObjectInfo linkedObject={issueData.linkedObject} />;
}
