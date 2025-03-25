import { kvs } from "@forge/kvs";

const APP_SETTINGS = "GB_APP_SETTINGS";

export async function getAppSettings() {
  return (await kvs.getSecret(APP_SETTINGS)) || {};
}

export async function updateAppSettings(partialSettings) {
  const currentSettings = await getAppSettings();
  await kvs.setSecret(APP_SETTINGS, { ...currentSettings, ...partialSettings });
  return true;
}
