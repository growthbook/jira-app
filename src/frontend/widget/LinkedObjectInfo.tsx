import { ErrorMessage } from "@forge/react";
import React from "react";
import {
  ExperimentResponse,
  FeatureResponse,
  LinkedObject,
  LinkedObjectResponse,
} from "src/utils/types";
import useApi from "../hooks/useApi";
import LoadingSpinner from "./LoadingSpinner";
import ExperimentDisplay from "./ExperimentDisplay";
import FeatureDisplay from "./FeatureDisplay";
import MissingObject from "./MissingObject";

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

  if (apiLoading) return <LoadingSpinner text={`Fetching your ${type}...`} />;
  if (apiError) return <ErrorMessage>{apiError.message}</ErrorMessage>;

  if (type === "feature") {
    const feature = (apiData as FeatureResponse).feature;
    if (!feature) return <MissingObject objectType="feature" />;
    return <FeatureDisplay feature={feature} />;
  }

  if (type === "experiment") {
    const experiment = (apiData as ExperimentResponse).experiment;
    if (!experiment) return <MissingObject objectType="experiment" />;
    return <ExperimentDisplay experiment={experiment} />;
  }

  return <MissingObject objectType={type} />;
}
