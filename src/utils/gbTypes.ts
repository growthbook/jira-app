export type ApiFeature = {
  archived: boolean;
  dateCreated: boolean;
  dateUpdated: boolean;
  defaultValue: string;
  valueType: "string" | "number" | "boolean" | "json";
  description: string;
  environments: Record<string, any>;
  id: string;
  owner: string;
  project: string;
  tags: string[];
  revision: {
    comment: string;
    date: string;
    publishedBy?: string;
    version?: number;
  };
};
