import { kvs } from "@forge/kvs";
import { CLOUD_API_HOST, CLOUD_APP_ORIGIN } from "./consts";

const APP_SETTINGS = "GB_APP_SETTINGS";
const APP_SETTINGS_DEFAULTS = {
  apiKey: "",
  isCloud: true,
  gbHost: CLOUD_API_HOST,
  gbApp: CLOUD_APP_ORIGIN,
};

export async function getAppSettings() {
  return (await kvs.getSecret(APP_SETTINGS)) || APP_SETTINGS_DEFAULTS;
}

export async function updateAppSettings(partialSettings) {
  const currentSettings = await getAppSettings();
  await kvs.setSecret(APP_SETTINGS, { ...currentSettings, ...partialSettings });
  return true;
}
