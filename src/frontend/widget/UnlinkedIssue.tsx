import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Box, ErrorMessage, Select } from "@forge/react";
import useApi from "../hooks/useApi";
import { useIssueContext } from "../hooks/useIssueContext";

export default function UnlinkedIssue({
  onLinked,
}: {
  onLinked?: () => void;
}) {
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
    linkedObjects,
    addLinkedObject,
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

  const alreadyLinked = new Set(linkedObjects.map((o) => `${o.type}:${o.id}`));
  const featOptions = featureKeys
    .filter((key) => !alreadyLinked.has(`feature:${key}`))
    .map((key) => ({ label: key, value: key }));
  const expOptions = experimentsData.experiments
    .filter((e) => !alreadyLinked.has(`experiment:${e.id}`))
    .map((e) => ({ label: e.name, value: e.id }));

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
          addLinkedObject({
            type,
            id: selectedOption.value,
            name: selectedOption.label,
          });
          onLinked?.();
        }}
        placeholder="Choose a feature or experiment to link to this issue"
      />
      {contextError && <ErrorMessage>{contextError}</ErrorMessage>}
    </Box>
  );
}
