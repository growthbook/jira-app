import { Lozenge, Tooltip } from "@forge/react";
import React from "react";
import type { ThemeAppearance } from "@atlaskit/lozenge";
import {
  Feature,
  FeatureEnvironment,
  FeatureRolloutRule,
} from "../../../utils/types";

function environmentStatus(env: FeatureEnvironment): {
  text: string;
  appearance: ThemeAppearance;
} {
  if (!env.enabled) return { text: "disabled", appearance: "default" };
  const active = env.rules.filter((rule) => rule.enabled);
  if (
    active.some(
      (rule) => rule.type === "experiment" || rule.type === "experiment-ref"
    )
  ) {
    return { text: "experiment", appearance: "inprogress" };
  }
  const rollout = active.find(
    (rule): rule is FeatureRolloutRule => rule.type === "rollout"
  );
  if (rollout) {
    return {
      text: `rolled out to ${Math.round(rollout.coverage * 100)}%`,
      appearance: "inprogress",
    };
  }
  return { text: "enabled", appearance: "success" };
}

// One lozenge per environment, plus draft/archived markers. Renders as a
// fragment so the parent Inline spaces them.
export default function FeatureStatusLozenge({
  feature,
  tooltipContent,
}: {
  feature: Feature;
  tooltipContent?: string;
}) {
  const hasDraft = (feature.revisions || []).length > 0;
  const draftLozenge = <Lozenge appearance="new">draft</Lozenge>;

  return (
    <>
      {feature.archived && <Lozenge appearance="removed">archived</Lozenge>}
      {Object.entries(feature.environments).map(([envId, env]) => {
        const { text, appearance } = environmentStatus(env);
        return (
          <Lozenge key={envId} appearance={appearance}>
            {`${envId}: ${text}`}
          </Lozenge>
        );
      })}
      {hasDraft &&
        (tooltipContent ? (
          <Tooltip content={tooltipContent}>{draftLozenge}</Tooltip>
        ) : (
          draftLozenge
        ))}
    </>
  );
}
