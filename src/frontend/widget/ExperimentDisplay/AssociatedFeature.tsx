import React from "react";
import { Feature } from "../../../utils/types";
import { Inline, Text, Tooltip } from "@forge/react";
import GrowthBookLink from "../GrowthBookLink";
import FeatureStatusLozenge from "../FeatureDisplay/FeatureStatusLozenge";
import { formatDate } from "../../../utils";

export default function AssociatedFeature({ feature }: { feature: Feature }) {
  return (
    <Inline alignBlock="center" space="space.100">
      <Inline alignBlock="center" space="space.050">
        <Text>Associated Feature:</Text>
        <Tooltip content="View feature in GrowthBook">
          <GrowthBookLink path={`/features/${feature.id}`}>
            <Text weight="medium">{feature.id}</Text>
          </GrowthBookLink>
        </Tooltip>
      </Inline>
      <FeatureStatusLozenge
        feature={feature}
        tooltipContent={`Last Published ${formatDate(feature.revision.date)}`}
      />
    </Inline>
  );
}
