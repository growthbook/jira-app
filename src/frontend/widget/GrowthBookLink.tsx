import React from "react";
import { Link, Icon, Inline } from "@forge/react";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";
import { ForgeChildren } from "@forge/react/out/types";

interface LinkProps {
  path?: string;
  children?: ForgeChildren | string;
  hideIcon?: boolean;
}

export default function GrowthBookLink({
  path,
  children,
  hideIcon,
}: LinkProps) {
  const { gbApp, loading } = useAppSettingsContext();
  if (loading) return <></>;
  return (
    <Link href={new URL(path || "", gbApp).toString()}>
      <Inline>
        {children}
        {!hideIcon && (
          <Icon size="small" label="link to growthbook" glyph="shortcut" />
        )}
      </Inline>
    </Link>
  );
}
