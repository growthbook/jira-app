import React from "react";
import { Box, HelperMessage, Inline, Label, Select } from "@forge/react";
import useApi from "../hooks/useApi";

interface Option {
  label: string;
  value: string;
}

export default function ProjectSelect({
  value: selectedIds,
  onChange,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const { data, isLoading, error } = useApi<{
    projects: Array<{ id: string; name: string }>;
  }>("/api/v1/projects", undefined, "projects");

  const options: Option[] = (data?.projects || []).map((p) => ({
    label: p.name,
    value: p.id,
  }));
  const value: Option[] = selectedIds.map(
    (id) => options.find((o) => o.value === id) || { label: id, value: id }
  );

  return (
    <Box>
      <Inline>
        <Label labelFor="gb-projects-select">GrowthBook projects</Label>
      </Inline>
      <Select
        inputId="gb-projects-select"
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
          onChange(list.map((o) => o.value));
        }}
        placeholder="All projects"
      />
      <HelperMessage>
        {error
          ? `Could not load projects: ${error.message}`
          : "Only features and experiments in these projects are offered when linking from this Jira project. Leave empty for all."}
      </HelperMessage>
    </Box>
  );
}
