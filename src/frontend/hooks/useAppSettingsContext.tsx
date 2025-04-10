import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import debounce from "debounce";
import { invoke } from "@forge/bridge";
import { isStoredAppSettings } from "../../utils/types";

interface AppSettings {
  loading: boolean;
  error: string | undefined;
  apiKey: string;
  setApiKey: (value: string) => void;
  saving: boolean;
  persistedState: Record<string, any>;
  updatePersistedState: (key: string, value: any) => void;
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
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  const pushUpdates = useMemo(
    () =>
      debounce(
        (apiKey, persistedState) => {
          setSaving(true);
          setError(undefined);
          invoke("updateAppSettings", {
            apiKey,
            persistedState,
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
    pushUpdates(apiKey, persistedState);
  }, [apiKey, persistedState]);

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
