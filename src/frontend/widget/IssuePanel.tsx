import React from "react";
import { useJiraContext } from "../hooks/useJiraContext";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage } from "@forge/react";
import { useIssueData } from "../hooks/useIssueData";
import UnlinkedIssue from "./UnlinkedIssue";

export default function IssuePanel() {
  const {
    context: { extension },
    loading: contextLoading,
  } = useJiraContext();

  const issueId = extension?.issue?.id;

  const {
    issueData,
    loading: issueDataLoading,
    error: issueDataError,
  } = useIssueData(issueId);

  if (contextLoading || issueDataLoading) return <LoadingSpinner />;

  if (!issueId)
    // TODO: is this even possible
    return (
      <ErrorMessage>
        Failed to load GrowthBook integration. Unable to find a Jira issue to
        link with
      </ErrorMessage>
    );

  if (issueDataError) {
    return <ErrorMessage>{issueDataError}</ErrorMessage>;
  }

  if (!issueData.linkedObject) {
    return <UnlinkedIssue />;
  }
  return <></>;
}
