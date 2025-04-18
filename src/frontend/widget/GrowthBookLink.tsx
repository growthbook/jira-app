import React from "react";
import { Link, Icon, Inline } from "@forge/react";
import { ForgeNode } from "@forge/react/out/types";
import { GB_APP_ORIGIN } from "../../utils/consts";

interface LinkProps {
  path?: string;
  children?: string | number | ForgeNode | (string | number | ForgeNode)[];
  hideIcon?: boolean;
}

export default function GrowthBookLink({
  path,
  children,
  hideIcon,
}: LinkProps) {
  return (
    <Link openNewTab href={new URL(path || "", GB_APP_ORIGIN).toString()}>
      <Inline shouldWrap={false} alignBlock="center" space="space.025">
        {children}
        {!hideIcon && (
          <Icon size="small" label="link to growthbook" glyph="shortcut" />
        )}
      </Inline>
    </Link>
  );
}
