// TODO: naming
import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Box, Button, ErrorMessage, Inline, Select, Text } from "@forge/react";
import useApi from "../hooks/useApi";
import { ApiFeature } from "../../utils/gbTypes";
import { invoke } from "@forge/bridge";
import { useIssueContext } from "../hooks/useIssueContext";

export default function UnlinkedIssue() {
  const {
    isLoading: featuresLoading,
    error: featuresError,
    data: featuresData,
  } = useApi<{ features: ApiFeature[] }>("/api/v1/features");
  const {
    issueId,
    setIssueData,
    loading: contextLoading,
    error: contextError,
  } = useIssueContext();

  const [selectedOption, setSelectedOption] = useState<
    { label: string; value: string } | undefined
  >(undefined);
  console.log("Selected id is", selectedOption);

  if (contextLoading || featuresLoading || !featuresData)
    return <LoadingSpinner />;

  if (featuresError)
    return <ErrorMessage>{featuresError.message}</ErrorMessage>;

  const unarchived = featuresData.features.filter((f) => !f.archived);
  const idSet = new Set(unarchived.map((f) => f.id));
  const idSelectOptions = unarchived.map((f) => ({ label: f.id, value: f.id }));
  const saveSelection = () => {
    invoke("setIssueData", {
      issueId,
      linkedObject: { type: "feature", id: selectedOption!.value },
    });
  };

  return (
    <Box>
      <Select
        options={idSelectOptions}
        onChange={setSelectedOption}
        value={selectedOption}
        isClearable
        placeholder="Select a feature to link to this issue"
      />
      <Inline>
        <Button
          isDisabled={!selectedOption}
          onClick={() => setSelectedOption(undefined)}
        >
          Cancel
        </Button>
        <Button
          isDisabled={!idSet.has(selectedOption?.value || "")}
          onClick={saveSelection}
        >
          Save
        </Button>
      </Inline>
      {contextError && <ErrorMessage>{contextError}</ErrorMessage>}
    </Box>
  );
}
