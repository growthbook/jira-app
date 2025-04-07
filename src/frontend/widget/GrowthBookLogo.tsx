import React from "react";
import { Image } from "@forge/react";
import logo from "./logo128.png";
import { ImageSizes } from "@forge/react/out/types";

export default function GrowthBookLogo({ size }: { size?: ImageSizes }) {
  return <Image size={size} src={logo}></Image>;
}
