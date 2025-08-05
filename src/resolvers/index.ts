import Resolver from "@forge/resolver";
import {
  getAppSettings,
  getIssueData,
  setIssueData,
  updateAppSettings,
} from "../utils/storage";
import { route, asApp } from "@forge/api";
import { getGbLink } from "../utils";
import { isIssueData, isLinkedObject } from "../utils/types";

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
  const { issueId, issueData } = req.payload;
  const { customFieldId } = await getAppSettings();
  if (!customFieldId || !isIssueData(issueData)) return false;
  const obj = issueData.linkedObject;
  const response = await asApp().requestJira(
    route`/rest/api/2/app/field/value`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updates: [
          {
            customField: customFieldId,
            issueIds: [issueId],
            value: isLinkedObject(obj)
              ? {
                  objectType: obj.type,
                  objectId: obj.id,
                  objectName: obj.name,
                  gbLink: getGbLink(
                    `/${obj.type === "feature" ? obj.type + "s" : obj.type}/${
                      obj.id
                    }`
                  ),
                }
              : null,
          },
        ],
      }),
    }
  );
  if (response.status >= 300) return false;
  return await setIssueData(issueId, issueData);
});

export const handler = resolver.getDefinitions();
