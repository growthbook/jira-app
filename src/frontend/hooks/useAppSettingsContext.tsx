import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import debounce from "debounce";
import { invoke, requestJira } from "@forge/bridge";
import { isStoredAppSettings } from "../../utils/types";
import { useJiraContext } from "./useJiraContext";

interface AppSettings {
  loading: boolean;
  error: string | undefined;
  apiKey: string;
  setApiKey: (value: string) => void;
  saving: boolean;
  persistedState: Record<string, any>;
  updatePersistedState: (key: string, value: any) => void;
  customFieldId: string | undefined;
  setCustomFieldId: (value: string) => void;
}

const AppSettingsContext = createContext<AppSettings | null>(null);

export const AppSettingsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [persistedState, setPersistedState] = useState({});
  const [customFieldId, setCustomFieldId] = useState<string | undefined>("");

  const {
    context: { localId },
    loading: contextLoading,
  } = useJiraContext();

  useEffect(() => {
    setLoading(true);
    invoke("getAppSettings", {})
      .then((settings) => {
        if (!isStoredAppSettings(settings)) {
          setError(
            `Failed to load settings. Got invalid result: ${JSON.stringify(
              settings
            )}`
          );
          setLoading(false);
          return;
        }
        setApiKey(settings.apiKey);
        setError(undefined);
        setPersistedState(settings.persistedState);
        setCustomFieldId(settings.customFieldId);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(
          "Error initializing GrowthBook integration. Please try again later"
        );
      });
  }, []);

  useEffect(() => {
    if (loading || contextLoading || error || customFieldId || !localId) return;
    const fetchCustomFieldId = async () => {
      setLoading(true);
      try {
        const response = await requestJira(`/rest/api/2/field`, {
          headers: {
            Accept: "application/json",
          },
        });
        const fieldsList = await response.json();
        const customField = fieldsList.find(
          (field: any) =>
            field.schema?.custom ===
            localId.split("/").slice(0, 4).join("/") +
              "/growthbook-custom-field"
        );
        setCustomFieldId(customField.id);
      } catch (e) {
        console.error(e);
        setError(
          "Unable to find the `GrowthBook Link` Custom Field. Please ensure an admin has added it to this project."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomFieldId();
  }, [customFieldId, loading, contextLoading, error, localId]);

  const pushUpdates = useMemo(
    () =>
      debounce(
        (apiKey, persistedState, customFieldId) => {
          setSaving(true);
          setError(undefined);
          invoke("updateAppSettings", {
            apiKey,
            persistedState,
            customFieldId,
          }).then((result) => {
            if (result !== true) setError("Failed to save settings");
            setSaving(false);
          });
        },
        1000,
        { immediate: false }
      ),
    []
  );

  useEffect(() => {
    if (loading) return;
    pushUpdates(apiKey, persistedState, customFieldId);
  }, [apiKey, persistedState, customFieldId, loading]);

  const updatePersistedState = (key: string, value: any) => {
    setPersistedState({ ...persistedState, [key]: value });
  };

  return (
    <AppSettingsContext.Provider
      value={{
        loading,
        error,
        apiKey,
        setApiKey,
        saving,
        persistedState,
        updatePersistedState,
        customFieldId,
        setCustomFieldId,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettingsContext = () => {
  const context = useContext(AppSettingsContext);

  if (!context)
    throw new Error(
      "AppSettingsContext must be called from within the AppSettingsContextProvider"
    );

  return context;
};
