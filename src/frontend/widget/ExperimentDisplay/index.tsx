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
import type { Experiment } from "src/utils/types";
import GrowthBookLink from "../GrowthBookLink";
import { useIssueContext } from "../../hooks/useIssueContext";

export default function ExperimentDisplay({
  experiment,
}: {
  experiment: Experiment;
}) {
  const { setIssueData } = useIssueContext();

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

      {/* <Inline alignBlock="center" space="space.100"> */}
      {/* <RevisionDisplay revision={feature.revision} /> */}
      {/* <Box xcss={{ width: "200px" }}>
            <Select
              options={Object.keys(feature.environments).map((env) => ({
                label: env,
                value: env,
              }))}
              value={selectedEnv}
              onChange={setSelectedEnv}
              spacing="compact"
            />
          </Box> */}
      {/* </Inline> */}
      {/* <Box>
          {selectedEnv && (
            <EnvironmentDisplay
              featureId={feature.id}
              featureEnv={feature.environments[selectedEnv.value]}
            />
          )}
        </Box> */}
    </Box>
  );
}
