import React from "react";
import { LinkedObject } from "src/utils/types";
import ExperimentDisplay from "./ExperimentDisplay";
import FeatureDisplay from "./FeatureDisplay";
import MissingObject from "./MissingObject";

export default function LinkedObjectInfo({
  linkedObject,
}: {
  linkedObject: LinkedObject;
}) {
  const { type, id } = linkedObject;

  if (type === "feature") {
    return <FeatureDisplay featureId={id} />;
  }

  if (type === "experiment") {
    return <ExperimentDisplay experimentId={id} />;
  }

  return <MissingObject objectType={type} />;
}
