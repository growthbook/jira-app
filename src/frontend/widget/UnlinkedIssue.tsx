import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Box, ErrorMessage, Select } from "@forge/react";
import useApi from "../hooks/useApi";
import { useIssueContext } from "../hooks/useIssueContext";
import { Experiment, Feature } from "../../utils/types";

export default function UnlinkedIssue() {
  const {
    isLoading: featuresLoading,
    error: featuresError,
    data: featuresData,
  } = useApi<{ features: Feature[] }>("/api/v1/features", {}, "features");
  const {
    isLoading: experimentsLoading,
    error: experimentsError,
    data: experimentsData,
  } = useApi<{ experiments: Experiment[] }>(
    "/api/v1/experiments",
    {},
    "experiments"
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

  if (!featuresData || !experimentsData) {
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

  const featureLabelMap = Object.fromEntries(
    featuresData.features.filter((f) => !f.archived).map((f) => [f.id, f.id])
  );
  const experimentLabelMap = Object.fromEntries(
    experimentsData.experiments
      .filter((e) => !e.archived)
      .map((e) => [e.id, e.name])
  );
  const featOptions = Object.entries(featureLabelMap).map(([value, label]) => ({
    label,
    value,
  }));
  const expOptions = Object.entries(experimentLabelMap).map(
    ([value, label]) => ({
      label,
      value,
    })
  );

  return (
    <Box>
      <Select
        isSearchable
        options={[
          { options: featOptions, label: "Features" },
          { options: expOptions, label: "Experiments" },
        ]}
        onChange={(selectedOption) => {
          const type = featureLabelMap[selectedOption.value]
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
