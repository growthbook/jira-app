import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage } from "@forge/react";
import { useIssueContext } from "../hooks/useIssueContext";
import UnlinkedIssue from "./UnlinkedIssue";
import LinkedObjectInfo from "./LinkedObjectInfo";

export default function IssuePanel() {
  const {
    issueId,
    issueData,
    loading: issueDataLoading,
    error: issueDataError,
  } = useIssueContext();

  if (issueDataLoading) return <LoadingSpinner />;

  if (issueDataError) {
    return <ErrorMessage>{issueDataError}</ErrorMessage>;
  }

  if (!issueData.linkedObject) {
    return <UnlinkedIssue />;
  }
  return <LinkedObjectInfo linkedObject={issueData.linkedObject} />;
}
