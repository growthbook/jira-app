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

type ValueType = "boolean" | "string" | "number" | "json";
interface SavedGroupTargeting {
  matchType: "all" | "any" | "none";
  savedGroups: string[];
}

interface FeatureForceRule {
  type: "force";
  description: string;
  condition: string;
  enabled: boolean;
  value: string;
  savedGroupTargeting?: SavedGroupTargeting[];
}

interface FeatureRolloutRule {
  type: "rollout";
  description: string;
  condition: string;
  enabled: boolean;
  value: string;
  coverage: number;
  hashAttribute: string;
}

interface FeatureExperimentRule {
  type: "experiment";
  description: string;
  condition: string;
  enabled: boolean;
  trackingKey?: string;
  hashAttribute?: string;
  fallbackAttribute?: string;
  coverage?: number;
  value?: Array<{ value: string; weight: number; name?: string }>;
}

interface FeatureExperimentRefRule {
  type: "experiment-ref";
  description: string;
  enabled: boolean;
  variations: Array<{ value: string; variationId: string }>;
  experimentId: string;
}

type FeatureRule =
  | FeatureForceRule
  | FeatureRolloutRule
  | FeatureExperimentRule
  | FeatureExperimentRefRule;

interface FeatureEnvironment {
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
  environments: Record<string, FeatureEnvironment>;
  revision: FeatureRevision;
  valueType: ValueType;
  defaultValue: string;
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
}
export interface ExperimentResponse {
  experiment: Experiment;
}

export type LinkedObjectResponse = FeatureResponse | ExperimentResponse;

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
