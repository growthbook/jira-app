import { Box, Button, Inline, Lozenge, Text, Tooltip } from "@forge/react";
import React from "react";
import type { Experiment } from "src/utils/types";
import GrowthBookLink from "../GrowthBookLink";
import { useIssueContext } from "../../hooks/useIssueContext";
import { formatDate } from "../../../utils";

function ExperimentResultSummary({ experiment }: { experiment: Experiment }) {
  if (!experiment.resultSummary) return null;
  const winningVariant = experiment.variations.find(
    (variation) => variation.variationId === experiment.resultSummary!.winner
  );
  return (
    <Inline alignBlock="center" space="space.050">
      <Text>Result:</Text>
      <Tooltip
        content={
          winningVariant ? `Winning variant: ${winningVariant.name}` : ""
        }
      >
        <Lozenge>{experiment.resultSummary.status}</Lozenge>
      </Tooltip>
    </Inline>
  );
}

export default function ExperimentDisplay({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { setIssueData } = useIssueContext();
  const lastPhase = experiment.phases[experiment.phases.length - 1];

  return (
    <Box>
      <Inline alignBlock="center">
        <Text>
          Linked with experiment <Lozenge>{experiment.name}</Lozenge>
        </Text>
        <Button
          iconBefore="unlink"
          appearance="subtle"
          onClick={() => setIssueData({})}
          spacing="compact"
        >
          unlink
        </Button>
      </Inline>
      <Inline alignBlock="center" space="space.100">
        <Text>Status:</Text>
        <Tooltip
          content={
            lastPhase
              ? `Phase started: ${formatDate(lastPhase.dateStarted)}${
                  lastPhase.dateEnded
                    ? // TODO: find a way to get this to split to a newline every time
                      ` Phase ended: ${formatDate(lastPhase.dateEnded)}`
                    : ""
                }`
              : ""
          }
        >
          <Lozenge>{experiment.status}</Lozenge>
        </Tooltip>
      </Inline>
      <ExperimentResultSummary experiment={experiment} />
      <Inline alignBlock="center" space="space.050">
        <Text>
          {experiment.variations.length} variation
          {experiment.variations.length === 1 ? "" : "s"}
        </Text>
      </Inline>
      <GrowthBookLink path={`/experiment/${experiment.id}`}>
        Manage in GrowthBook
      </GrowthBookLink>
    </Box>
  );
}
