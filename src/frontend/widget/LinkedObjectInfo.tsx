import { Box, ErrorMessage, Inline, Text } from "@forge/react";
import React, { ReactNode } from "react";
import {
  ExperimentResponse,
  FeatureResponse,
  LinkedObject,
  LinkedObjectResponse,
} from "src/utils/types";
import GrowthBookLink from "./GrowthBookLink";
import useApi from "../hooks/useApi";
import LoadingSpinner from "./LoadingSpinner";
import ExperimentDisplay from "./ExperimentDisplay";
import FeatureDisplay from "./FeatureDisplay";

export default function LinkedObjectInfo({
  linkedObject,
}: {
  linkedObject: LinkedObject;
}) {
  const { type, id } = linkedObject;
  const objectPath = `${type}s/${id}`;

  const {
    isLoading: apiLoading,
    error: apiError,
    data: apiData,
  } = useApi<LinkedObjectResponse>(`/api/v1/${objectPath}`);

  if (apiLoading) return <LoadingSpinner />;
  if (apiError) return <ErrorMessage>{apiError.message}</ErrorMessage>;
  let itemDisplay: ReactNode = null;
  switch (type) {
    case "feature":
      itemDisplay = (
        <FeatureDisplay feature={(apiData as FeatureResponse).feature} />
      );
      break;
    case "experiment":
      itemDisplay = (
        <ExperimentDisplay
          experiment={(apiData as ExperimentResponse).experiment}
        />
      );
      break;
  }
  return (
    <Box>
      <Inline>
        <GrowthBookLink path={objectPath}>{id}</GrowthBookLink>
      </Inline>
      <Box>{itemDisplay}</Box>
    </Box>
  );
}
