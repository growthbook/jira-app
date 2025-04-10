import {
  Box,
  Button,
  Inline,
  Lozenge,
  Select,
  Text,
  Tooltip,
} from "@forge/react";
import React from "react";
import type {
  Feature,
  FeatureEnvironment,
  FeatureRevision,
} from "src/utils/types";
import GrowthBookLink from "../GrowthBookLink";
import usePersistedState from "../../hooks/usePersistedState";
import { useIssueContext } from "../../hooks/useIssueContext";
import { formatDate } from "../../../utils";

function RevisionDisplay({
  revision: { version, comment: _comment, date, publishedBy },
}: {
  revision: FeatureRevision;
}) {
  return (
    <Tooltip content={`Published ${formatDate(date)} by ${publishedBy}`}>
      Published revision: <Lozenge>rev {version}</Lozenge>
    </Tooltip>
  );
}

function EnvironmentDisplay({
  featureEnv,
}: {
  featureEnv: FeatureEnvironment;
}) {
  const activeRules = featureEnv.rules.filter((rule) => rule.enabled);
  const experimentRules = featureEnv.rules.filter((rule) =>
    ["experiment", "experiment-ref"].includes(rule.type)
  );
  return (
    <Box>
      <Text>
        {featureEnv.enabled ? "Enabled" : "Disabled"} with {activeRules.length}{" "}
        rule{activeRules.length !== 1 && "s"}
        {experimentRules.length > 0 &&
          ` including ${experimentRules.length} experiment rule${
            experimentRules.length > 1 ? "s" : ""
          }`}
        .
      </Text>
    </Box>
  );
}

export default function FeatureDisplay({ feature }: { feature: Feature }) {
  const [selectedEnv, setSelectedEnv] = usePersistedState<
    { label: string; value: string } | undefined
  >("selectedEnv", undefined);
  const { setIssueData } = useIssueContext();

  return (
    <Box>
      <Inline alignBlock="center">
        <Text>
          Linked with feature <Lozenge>{feature.id}</Lozenge>
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
        <RevisionDisplay revision={feature.revision} />
        <Box xcss={{ width: "200px" }}>
          <Select
            options={Object.keys(feature.environments).map((env) => ({
              label: env,
              value: env,
            }))}
            value={selectedEnv}
            onChange={setSelectedEnv}
            spacing="compact"
          />
        </Box>
      </Inline>
      <Box>
        {selectedEnv && (
          <EnvironmentDisplay
            featureEnv={feature.environments[selectedEnv.value]}
          />
        )}
      </Box>
      <GrowthBookLink path={`/features/${feature.id}`}>
        Manage in GrowthBook
      </GrowthBookLink>
    </Box>
  );
}
