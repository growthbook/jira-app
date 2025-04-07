import { kvs } from "@forge/kvs";
import { CLOUD_API_HOST, CLOUD_APP_ORIGIN } from "./consts";
import { IssueData, StoredAppSettings } from "./types";

const APP_SETTINGS_KEY = "GB_APP_SETTINGS";
const APP_SETTINGS_DEFAULTS: StoredAppSettings = {
  apiKey: "",
  isCloud: true,
  gbHost: CLOUD_API_HOST,
  gbApp: CLOUD_APP_ORIGIN,
};

export async function getAppSettings() {
  return (await kvs.getSecret(APP_SETTINGS_KEY)) || APP_SETTINGS_DEFAULTS;
}

export async function updateAppSettings(
  partialSettings: Partial<StoredAppSettings>
) {
  const currentSettings = await getAppSettings();
  await kvs.setSecret(APP_SETTINGS_KEY, {
    ...currentSettings,
    ...partialSettings,
  });
  return true;
}

export async function getIssueData(issueKey: string) {
  return (await kvs.get(issueKey)) || {};
}

export async function setIssueData(issueKey: string, issueData: IssueData) {
  await kvs.set(issueKey, issueData);
  return true;
}
