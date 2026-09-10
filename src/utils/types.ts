export interface StoredAppSettings {
  apiKey: string;
  persistedState: Record<string, any>;
  customFieldId?: string;
}

export function isStoredAppSettings(
  value: unknown
): value is StoredAppSettings {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as StoredAppSettings;
  if (typeof typecast.apiKey !== "string") return false;
  if (
    typeof typecast.persistedState !== "object" ||
    typecast.persistedState === null
  )
    return false;
  if (
    typecast.customFieldId !== undefined &&
    typeof typecast.customFieldId !== "string"
  )
    return false;

  return true;
}

interface LinkedFeature {
  type: "feature";
  id: string;
  name?: string;
}

interface LinkedExperiment {
  type: "experiment";
  id: string;
  name?: string;
}

export type LinkedObject = LinkedFeature | LinkedExperiment;

export function isLinkedObject(value: unknown): value is LinkedObject {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as LinkedObject;
  if (!["feature", "experiment"].includes(typecast.type)) return false;
  if (typeof typecast.id !== "string") return false;
  return true;
}

type ValueType = "boolean" | "string" | "number" | "json";
interface SavedGroupTargeting {
  matchType: "all" | "any" | "none";
  savedGroups: string[];
}

export interface FeatureForceRule {
  type: "force";
  id: string;
  description: string;
  condition: string;
  enabled: boolean;
  value: string;
  savedGroupTargeting?: SavedGroupTargeting[];
}

export interface FeatureRolloutRule {
  type: "rollout";
  id: string;
  description: string;
  condition: string;
  enabled: boolean;
  value: string;
  coverage: number;
  hashAttribute: string;
}

export interface FeatureExperimentRule {
  type: "experiment";
  id: string;
  description: string;
  condition: string;
  enabled: boolean;
  trackingKey?: string;
  hashAttribute?: string;
  fallbackAttribute?: string;
  coverage?: number;
  value?: Array<{ value: string; weight: number; name?: string }>;
}

export interface FeatureExperimentRefRule {
  type: "experiment-ref";
  id: string;
  description: string;
  enabled: boolean;
  variations: Array<{ value: string; variationId: string }>;
  experimentId: string;
}

export type FeatureRule =
  | FeatureForceRule
  | FeatureRolloutRule
  | FeatureExperimentRule
  | FeatureExperimentRefRule;

export interface FeatureEnvironment {
  enabled: boolean;
  defaultValue: string;
  rules: FeatureRule[];
}

export interface FeatureRevision {
  version: number;
  comment: string;
  date: string;
  publishedBy: string;
}
export interface Feature {
  id: string;
  archived: boolean;
  description: string;
  dateCreated: string;
  dateUpdated: string;
  owner: string;
  project: string;
  tags: string[];
  environments: Record<string, FeatureEnvironment>;
  revision: FeatureRevision;
  valueType: ValueType;
  defaultValue: string;
  revisions?: Array<{
    baseVersion: number;
    version: number;
    comment: string;
    date: string;
    status: string;
    publishedBy?: string;
    rules: FeatureRule[];
  }>;
}

export interface FeatureResponse {
  feature: Feature;
}

interface ExperimentPhase {
  name: string;
  dateStarted: string;
  dateEnded: string;
  reasonForStopping: string;
  coverage: number;
  trafficSplit: Array<{ variationId: string; weight: number }>;
  targetingCondition: string;
  savedGroupTargeting?: SavedGroupTargeting;
}

export interface Experiment {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  archived: boolean;
  trackingKey: string;
  name: string;
  type: "standard" | "multi-armed-bandit";
  hashAttribute: string;
  owner: string;
  status: string;
  variations: Array<{
    variationId: string;
    key: string;
    name: string;
    description: string;
  }>;
  phases: ExperimentPhase[];
  resultSummary?: {
    status: string;
    winner: string;
    conclusions: string;
    releasedVariationId: string;
    excludeFromPayload: boolean;
  };
  linkedFeatures?: string[];
  hasVisualChangesets?: boolean;
  hasURLRedirects?: boolean;
  enhancedStatus?: {
    status: string;
    detailedStatus?: string;
  };
}
export interface ExperimentResponse {
  experiment: Experiment;
}

export interface IssueData {
  // Legacy single link; read via getLinkedObjects(), never written anymore.
  linkedObject?: LinkedObject;
  linkedObjects?: LinkedObject[];
}

export function getLinkedObjects(data: IssueData | undefined): LinkedObject[] {
  if (data?.linkedObjects) return data.linkedObjects;
  return data?.linkedObject ? [data.linkedObject] : [];
}

// Per-Jira-project overrides; an undefined key inherits the site-wide setting.
export interface ProjectSettings {
  visibleEnvironments?: string[];
  gbProjects?: string[];
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((s) => typeof s === "string");

export function isProjectSettings(value: unknown): value is ProjectSettings {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as ProjectSettings;
  if (
    typecast.visibleEnvironments !== undefined &&
    !isStringArray(typecast.visibleEnvironments)
  )
    return false;
  if (typecast.gbProjects !== undefined && !isStringArray(typecast.gbProjects))
    return false;
  return true;
}

export function isIssueData(value: unknown): value is IssueData {
  if (typeof value !== "object" || value === null) return false;
  const typecast = value as IssueData;
  if (
    typeof typecast.linkedObject !== "undefined" &&
    !isLinkedObject(typecast.linkedObject)
  )
    return false;
  if (typeof typecast.linkedObjects !== "undefined") {
    if (!Array.isArray(typecast.linkedObjects)) return false;
    if (!typecast.linkedObjects.every(isLinkedObject)) return false;
  }
  return true;
}
