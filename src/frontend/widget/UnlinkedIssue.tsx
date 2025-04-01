// TODO: naming
import React from "react";
import { useJiraContext } from "../hooks/useJiraContext";
import LoadingSpinner from "./LoadingSpinner";
import { ErrorMessage, Text } from "@forge/react";
import { useIssueData } from "../hooks/useIssueData";
import useApi from "../hooks/useApi";
import { ApiFeature } from "../../utils/gbTypes";

export default function UnlinkedIssue() {
  const {
    isLoading: featuresLoading,
    error: featuresError,
    data: featuresData,
  } = useApi<{ features: ApiFeature[] }>("/api/v1/features");

  if (featuresLoading) return <LoadingSpinner />;

  if (featuresError)
    return <ErrorMessage>{featuresError.message}</ErrorMessage>;

  return <Text>{JSON.stringify(featuresData)}</Text>;
}
