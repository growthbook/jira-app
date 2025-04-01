export interface StoredAppSettings {
  apiKey: string;
  isCloud: boolean;
  gbHost: string;
  gbApp: string;
}

export function isStoredAppSettings(
  value: unknown
): value is StoredAppSettings {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as StoredAppSettings;
  if (typeof typecast.apiKey !== "string") return false;
  if (typeof typecast.isCloud !== "boolean") return false;
  if (typeof typecast.gbHost !== "string") return false;
  if (typeof typecast.gbApp !== "string") return false;

  return true;
}

interface LinkedFeature {
  type: "feature";
  id: string;
}

interface LinkedExperiment {
  type: "experiment";
  id: string;
}

export type LinkedObject = LinkedFeature | LinkedExperiment;

export function isLinkedObject(value: unknown): value is LinkedObject {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as LinkedObject;
  if (!["feature", "experiment"].includes(typecast.type)) return false;
  if (typeof typecast.id !== "string") return false;
  return true;
}

export interface IssueData {
  linkedObject?: LinkedObject;
}

export function isIssueData(value: unknown): value is IssueData {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as IssueData;
  if (
    typeof typecast.linkedObject !== "undefined" &&
    !isLinkedObject(typecast.linkedObject)
  )
    return false;
  return true;
}
