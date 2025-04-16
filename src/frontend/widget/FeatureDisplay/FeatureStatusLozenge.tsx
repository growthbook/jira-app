import { Lozenge, Tooltip } from "@forge/react";
import React from "react";
import { Feature } from "../../../utils/types";
export default function FeatureStatusLozenge({
  feature,
  tooltipContent,
}: {
  feature: Feature;
  tooltipContent?: string;
}) {
  const hasDraft = (feature.revisions || []).length > 0;
  const lozenge = (
    <Lozenge appearance={hasDraft ? "inprogress" : "success"}>
      {hasDraft ? "draft" : "live"}
    </Lozenge>
  );

  if (tooltipContent) {
    return <Tooltip content={tooltipContent}>{lozenge}</Tooltip>;
  }
  return lozenge;
}
