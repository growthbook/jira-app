import React, {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { invoke } from "@forge/bridge";
import {
  getLinkedObjects,
  isIssueData,
  IssueData,
  LinkedObject,
} from "../../utils/types";
import debounce from "debounce";
import { useJiraContext } from "./useJiraContext";

interface IssueContextInfo {
  issueId: string;
  issueData: IssueData;
  setIssueData: (value: IssueData) => void;
  linkedObjects: LinkedObject[];
  addLinkedObject: (obj: LinkedObject) => void;
  removeLinkedObject: (index: number) => void;
  loading: boolean;
  error: string | undefined;
  saving: boolean;
}

const IssueContext = createContext<IssueContextInfo | null>(null);

export const IssueContextProvider = ({ children }: { children: ReactNode }) => {
  const [issueData, setIssueData] = useState<IssueData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const {
    context: { extension },
    loading: contextLoading,
  } = useJiraContext();

  const issueId = extension?.issue?.id || "";

  useEffect(() => {
    if (contextLoading) return;
    setLoading(true);
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
  }, [issueId, contextLoading]);

  const pushUpdates = useMemo(
    () =>
      debounce(
        (issueData) => {
          setSaving(true);
          setError(undefined);
          invoke("setIssueData", { issueId, issueData }).then((result) => {
            if (result !== true) setError("Failed to save issue data");
            setSaving(false);
          });
        },
        1000,
        // Trailing edge: a leading-edge debounce drops link/unlink clicks made within the window.
        { immediate: false }
      ),
    [issueId]
  );

  useEffect(() => {
    if (loading || contextLoading) return;
    pushUpdates(issueData);
  }, [issueData]);

  // Functional updates so rapid link/unlink clicks can't clobber each other.
  const addLinkedObject = (obj: LinkedObject) =>
    setIssueData((prev) => ({
      linkedObjects: [...getLinkedObjects(prev), obj],
    }));
  const removeLinkedObject = (index: number) =>
    setIssueData((prev) => ({
      linkedObjects: getLinkedObjects(prev).filter((_, i) => i !== index),
    }));

  return (
    <IssueContext.Provider
      value={{
        issueId,
        issueData,
        setIssueData,
        linkedObjects: getLinkedObjects(issueData),
        addLinkedObject,
        removeLinkedObject,
        loading,
        error,
        saving,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssueContext = () => {
  const context = useContext(IssueContext);

  if (!context)
    throw new Error(
      "IssueContext must be called from within the IssueContextProvider"
    );

  return context;
};
