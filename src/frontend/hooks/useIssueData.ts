import { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { isIssueData, IssueData } from "../../utils/types";

export function useIssueData(issueId: string) {
  const [issueData, setIssueData] = useState<IssueData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    invoke("getIssueData", { issueId }).then((data) => {
      if (!isIssueData(data)) {
        setError(
          `Failed to load stored data. Got invalid result: ${JSON.stringify(
            data
          )}`
        );
      } else {
        setIssueData(data);
      }
      setLoading(false);
    });
  }, [issueId]);

  return {
    issueData,
    loading,
    error,
  };
}
