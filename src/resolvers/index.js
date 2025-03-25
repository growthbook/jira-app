import Resolver from "@forge/resolver";
import { getAppSettings, updateAppSettings } from "../utils/storage";

const resolver = new Resolver();

resolver.define("getAppSettings", async () => {
  const settings = await getAppSettings();
  return settings;
});

resolver.define("updateAppSettings", async (req) => {
  const updates = req.payload || {};
  // TODO: validation
  await updateAppSettings(updates);
  return true;
});

export const handler = resolver.getDefinitions();
