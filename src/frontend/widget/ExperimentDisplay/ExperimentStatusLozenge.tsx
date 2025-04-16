import React from "react";
import { Lozenge, Tooltip } from "@forge/react";
import { Experiment } from "../../../utils/types";
import type { ThemeAppearance } from "@atlaskit/lozenge";

export default function ExperimentStatusLozenge({
  experiment,
  tooltipContent,
}: {
  experiment: Experiment;
  tooltipContent?: string;
}) {
  let appearance: ThemeAppearance = "default";
  let additionalInfo = "";
  switch (experiment.status) {
    case "draft":
      appearance = "new";
      break;
    case "running":
      appearance = "inprogress";
      // TODO: pull run length from api
      break;
    case "stopped":
      if (experiment.resultSummary) {
        if (experiment.resultSummary.status === "won") appearance = "success";
        if (experiment.resultSummary.status === "lost") appearance = "removed";
        // Inconclusive/did not finish remain default appearance
        additionalInfo = experiment.resultSummary.status;
      }
      break;
  }
  let lozengeText = experiment.status;
  if (additionalInfo) lozengeText += `: ${additionalInfo}`;
  if (tooltipContent) {
    return (
      <Tooltip content={tooltipContent}>
        <Lozenge appearance={appearance}>{lozengeText}</Lozenge>
      </Tooltip>
    );
  }
  return <Lozenge appearance={appearance}>{lozengeText}</Lozenge>;
}
