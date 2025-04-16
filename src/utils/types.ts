export interface StoredAppSettings {
  apiKey: string;
  persistedState: Record<string, any>;
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
