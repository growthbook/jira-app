import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { invoke } from "@forge/bridge";
import debounce from "debounce";
import { isProjectSettings, ProjectSettings } from "../../utils/types";
import { useJiraContext } from "./useJiraContext";

interface ProjectSettingsInfo {
  jiraProjectId: string;
  settings: ProjectSettings;
  updateSettings: (partial: ProjectSettings) => void;
  loading: boolean;
  saving: boolean;
  error: string | undefined;
}

// Default value lets pages without a Jira project (the site admin page) render as "no overrides".
const ProjectSettingsContext = createContext<ProjectSettingsInfo>({
  jiraProjectId: "",
  settings: {},
  updateSettings: () => {},
  loading: false,
  saving: false,
  error: undefined,
});

export const ProjectSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    context: { extension },
    loading: contextLoading,
  } = useJiraContext();
  const jiraProjectId: string = extension?.project?.id || "";

  const [settings, setSettings] = useState<ProjectSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (contextLoading) return;
    if (!jiraProjectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    invoke("getProjectSettings", { jiraProjectId })
      .then((data) => {
        if (isProjectSettings(data)) {
          setSettings(data);
        } else {
          setError(
            `Failed to load project settings. Got invalid result: ${JSON.stringify(
              data
            )}`
          );
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Error loading project settings. Please try again later");
        setLoading(false);
      });
  }, [jiraProjectId, contextLoading]);

  const pushUpdates = useMemo(
    () =>
      debounce(
        (settings: ProjectSettings) => {
          setSaving(true);
          setError(undefined);
          invoke("setProjectSettings", { jiraProjectId, settings }).then(
            (result) => {
              if (result !== true) setError("Failed to save project settings");
              setSaving(false);
            }
          );
        },
        1000,
        { immediate: false }
      ),
    [jiraProjectId]
  );

  // Only user edits save; loading alone must not write the record back.
  useEffect(() => {
    if (!dirty) return;
    pushUpdates(settings);
  }, [settings, dirty]);

  const updateSettings = (partial: ProjectSettings) => {
    setDirty(true);
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <ProjectSettingsContext.Provider
      value={{ jiraProjectId, settings, updateSettings, loading, saving, error }}
    >
      {children}
    </ProjectSettingsContext.Provider>
  );
};

export const useProjectSettingsContext = () =>
  useContext(ProjectSettingsContext);
