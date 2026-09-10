import React from "react";
import { Box, HelperMessage, Inline, Label, Select } from "@forge/react";
import useApi from "../hooks/useApi";
import usePersistedState from "../hooks/usePersistedState";
import { VISIBLE_ENVIRONMENTS_KEY } from "../widget/FeatureDisplay/FeatureStatusLozenge";

interface Option {
  label: string;
  value: string;
}

export default function EnvironmentSelect() {
  const { data, isLoading, error } = useApi<{
    environments: Array<{ id: string; description?: string }>;
  }>("/api/v1/environments");
  const [visible, setVisible] = usePersistedState<string[]>(
    VISIBLE_ENVIRONMENTS_KEY,
    []
  );

  const options: Option[] = (data?.environments || []).map((env) => ({
    label: env.id,
    value: env.id,
  }));
  // Keep ids that no longer exist selectable so they can be removed.
  const value: Option[] = visible.map(
    (id) => options.find((o) => o.value === id) || { label: id, value: id }
  );

  return (
    <Box>
      <Inline>
        <Label labelFor="gb-environments-select">Environments to show</Label>
      </Inline>
      <Select
        inputId="gb-environments-select"
        isMulti
        isSearchable
        isLoading={isLoading}
        isDisabled={!!error}
        options={options}
        value={value}
        onChange={(selected) => {
          const list = Array.isArray(selected)
            ? (selected as Option[])
            : selected
            ? [selected as Option]
            : [];
          setVisible(list.map((o) => o.value));
        }}
        placeholder="All environments"
      />
      <HelperMessage>
        {error
          ? `Could not load environments: ${error.message}`
          : "Leave empty to show every environment on linked features."}
      </HelperMessage>
    </Box>
  );
}
