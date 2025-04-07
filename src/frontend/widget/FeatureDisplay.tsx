import { Box, Inline, Text, Tooltip } from "@forge/react";
import React from "react";
import { Feature, FeatureRevision } from "src/utils/types";

function RevisionDisplay({
  revision: { version, comment: _comment, date, publishedBy },
}: {
  revision: FeatureRevision;
}) {
  return (
    <Inline>
      <Tooltip content={`Published ${date} by ${publishedBy}`}>
        <Text>Version {version}</Text>
      </Tooltip>
    </Inline>
  );
}

export default function FeatureDisplay({ feature }: { feature: Feature }) {
  return (
    <Box>
      <RevisionDisplay revision={feature.revision} />
    </Box>
  );
}
