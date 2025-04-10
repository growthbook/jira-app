import { Box, Button, Text } from "@forge/react";
import React from "react";
import { useIssueContext } from "../hooks/useIssueContext";

export default function MissingObject({ objectType }: { objectType: string }) {
  const { setIssueData } = useIssueContext();
  return (
    <Box>
      <Text>
        Failed to load the linked {objectType}. It may have been deleted or
        there may be an issue loading the API.
      </Text>
      <Button
        iconBefore="unlink"
        appearance="subtle"
        onClick={() => setIssueData({})}
        spacing="compact"
      >
        Remove linked {objectType}
      </Button>
    </Box>
  );
}
