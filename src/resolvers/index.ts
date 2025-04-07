import Resolver from "@forge/resolver";
import {
  getAppSettings,
  getIssueData,
  setIssueData,
  updateAppSettings,
} from "../utils/storage";

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

resolver.define("getIssueData", async (req) => {
  // TODO: validation
  return getIssueData(req.payload.issueId);
});

resolver.define("setIssueData", async (req) => {
  return setIssueData(req.payload.issueId, {
    linkedObject: req.payload.linkedObject,
  });
});

export const handler = resolver.getDefinitions();
