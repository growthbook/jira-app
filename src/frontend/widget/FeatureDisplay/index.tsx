import {
  Box,
  Button,
  ErrorMessage,
  Inline,
  Stack,
  Text,
  Tooltip,
} from "@forge/react";
import React from "react";
import type {
  Experiment,
  FeatureExperimentRefRule,
  FeatureResponse,
} from "src/utils/types";
import GrowthBookLink from "../GrowthBookLink";
import { useIssueContext } from "../../hooks/useIssueContext";
import { formatDate } from "../../../utils";
import useApi from "../../hooks/useApi";
import LoadingSpinner from "../LoadingSpinner";
import MissingObject from "../MissingObject";
import FeatureStatusLozenge from "./FeatureStatusLozenge";
import AssociatedExperiment from "./AssociatedExperiment";

export default function FeatureDisplay({ featureId }: { featureId: string }) {
  const { setIssueData } = useIssueContext();

  const {
    isLoading: featureApiLoading,
    error: featureApiError,
    data: featureData,
  } = useApi<FeatureResponse>(
    `/api/v1/features/${featureId}?withRevisions=drafts`
  );

  const feature = featureData?.feature;

  let associatedExperiment: string | undefined;
  if (feature) {
    // Find the first experiment rule across all environments
    const expRule = Object.values(feature.environments)
      .map((featureEnv) =>
        featureEnv.rules.find((rule) => rule.type === "experiment-ref")
      )
      .find((ruleOrUndef) => ruleOrUndef);
    // Forge linting fails to infer this typing automatically. No actual casting is happening here
    associatedExperiment = (expRule as FeatureExperimentRefRule | undefined)
      ?.experimentId;
  }

  const {
    data: experimentData,
    isLoading: experimentApiLoading,
    error: experimentApiError,
  } = useApi<{ experiment: Experiment }>(
    associatedExperiment ? `/api/v1/experiments/${associatedExperiment}` : null
  );

  if (featureApiLoading)
    return <LoadingSpinner text="Fetching your feature..." />;
  if (featureApiError)
    return <ErrorMessage>{featureApiError.message}</ErrorMessage>;
  if (!feature) return <MissingObject objectType="feature" />;
  if (experimentApiLoading) {
    return <LoadingSpinner text="Loading associated experiment status..." />;
  }
  if (experimentApiError) {
    return <ErrorMessage>{experimentApiError.message}</ErrorMessage>;
  }

  const draft = (feature.revisions || []).find((rev) => rev.status === "draft");

  return (
    <Stack alignBlock="start" alignInline="start" space="space.050">
      <Inline grow="fill" alignBlock="center" spread="space-between">
        <Inline alignBlock="center" space="space.150">
          <Tooltip content="View feature in GrowthBook">
            <GrowthBookLink path={`/features/${feature.id}`}>
              <Text weight="semibold" size="large">
                {feature.id}
              </Text>
            </GrowthBookLink>
          </Tooltip>
          <FeatureStatusLozenge
            tooltipContent={
              draft ? `Draft Created ${formatDate(draft.date)}` : ""
            }
            feature={feature}
          />
        </Inline>

        <Button
          appearance="subtle"
          onClick={() => setIssueData({})}
          spacing="compact"
        >
          <Text
            weight="semibold"
            color="color.link"
            size="small"
            align="center"
          >
            Replace Linked Feature
          </Text>
        </Button>
      </Inline>
      <Inline>
        <Text>
          Last Published {formatDate(feature.revision.date)} by{" "}
          {feature.revision.publishedBy}
        </Text>
      </Inline>
      {/* <GrowthBookLink path={`/features/${feature.id}#test`} hideIcon>
        <Text size="small" weight="semibold">
          Preview as Archetype
        </Text>
      </GrowthBookLink> */}
      {experimentData?.experiment && (
        <Box paddingBlockStart="space.100">
          <AssociatedExperiment experiment={experimentData.experiment} />
        </Box>
      )}
    </Stack>
  );
}
