import React from "react";

import { Spinner, Text } from "@forge/react";
export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <Text>
      <Spinner />
      {text || "Loading..."}
    </Text>
  );
}
