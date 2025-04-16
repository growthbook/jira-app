import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Box, ErrorMessage, Select } from "@forge/react";
import useApi from "../hooks/useApi";
import { useIssueContext } from "../hooks/useIssueContext";

export default function UnlinkedIssue() {
  const {
    isLoading: featuresLoading,
    error: featuresError,
    data: featureKeys,
  } = useApi<string[]>("/api/v1/feature-keys");
  const {
    isLoading: experimentsLoading,
    error: experimentsError,
    data: experimentsData,
  } = useApi<{ experiments: Array<{ id: string; name: string }> }>(
    "/api/v1/experiment-names"
  );

  const {
    setIssueData,
    loading: contextLoading,
    error: contextError,
  } = useIssueContext();

  if (contextLoading || featuresLoading || experimentsLoading)
    return (
      <LoadingSpinner
        text={
          contextLoading
            ? "Connecting to Jira..."
            : "Loading your features and experiments..."
        }
      />
    );

  if (!featureKeys || !experimentsData) {
    return (
      <ErrorMessage>
        Failed to load your features from GrowthBook. Please try again later.
      </ErrorMessage>
    );
  }
  if (featuresError)
    return <ErrorMessage>{featuresError.message}</ErrorMessage>;
  if (experimentsError)
    return <ErrorMessage>{experimentsError.message}</ErrorMessage>;

  const featOptions = featureKeys.map((key) => ({
    label: key,
    value: key,
  }));
  const expOptions = experimentsData.experiments.map((e) => ({
    label: e.name,
    value: e.id,
  }));

  const featureKeySet = new Set(featureKeys);

  return (
    <Box>
      <Select
        isSearchable
        options={[
          { options: featOptions, label: "Features" },
          { options: expOptions, label: "Experiments" },
        ]}
        onChange={(selectedOption) => {
          const type = featureKeySet.has(selectedOption.value)
            ? "feature"
            : "experiment";
          setIssueData({
            linkedObject: { type, id: selectedOption.value },
          });
        }}
        placeholder="Choose a feature or experiment to link to this issue"
      />
      {contextError && <ErrorMessage>{contextError}</ErrorMessage>}
    </Box>
  );
}
