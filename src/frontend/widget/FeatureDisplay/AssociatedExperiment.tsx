import React from "react";
import { Inline, Text, Tooltip } from "@forge/react";
import { Experiment } from "../../../utils/types";
import GrowthBookLink from "../GrowthBookLink";
import ExperimentStatusLozenge from "../ExperimentDisplay/ExperimentStatusLozenge";
import { formatDate, getWinningVariant } from "../../../utils";

export default function AssociatedExperiment({
  experiment,
}: {
  experiment: Experiment;
}) {
  const lastPhase = experiment.phases[experiment.phases.length - 1];
  const winningVariant = getWinningVariant(experiment);
  const tooltipContent = winningVariant
    ? `Winning Variant: ${winningVariant}`
    : lastPhase.dateEnded
    ? `Ran from ${formatDate(lastPhase.dateStarted)} - ${formatDate(
        lastPhase.dateEnded
      )}`
    : experiment.status === "draft"
    ? `Last Updated ${formatDate(experiment.dateUpdated)}`
    : `Phase Started ${formatDate(lastPhase.dateStarted)}`;

  return (
    <Inline alignBlock="center" space="space.100">
      <Inline alignBlock="center" space="space.050">
        <Text>Associated Experiment:</Text>
        <Tooltip content="View experiment in GrowthBook">
          <GrowthBookLink path={`/experiment/${experiment.id}`}>
            <Text weight="semibold">{experiment.name}</Text>
          </GrowthBookLink>
        </Tooltip>
      </Inline>
      <ExperimentStatusLozenge
        experiment={experiment}
        tooltipContent={tooltipContent}
      />
    </Inline>
  );
}
