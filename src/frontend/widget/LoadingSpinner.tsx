import React from "react";
import { Inline, Spinner, Text } from "@forge/react";

export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <Inline alignBlock="center" space="space.050">
      <Spinner />
      <Text>{text || "Loading..."}</Text>
    </Inline>
  );
}
