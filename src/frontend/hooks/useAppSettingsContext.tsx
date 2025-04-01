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
  isCloud: boolean;
  setIsCloud: (value: boolean) => void;
  gbHost: string;
  setGbHost: (value: string) => void;
  gbApp: string;
  setGbApp: (value: string) => void;
  saving: boolean;
}

const AppSettingsContext = createContext<AppSettings | null>(null);

export const AppSettingsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [apiKey, setApiKey] = useState("");
  const [isCloud, setIsCloud] = useState(true);
  const [gbHost, setGbHost] = useState("");
  const [gbApp, setGbApp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

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
        setIsCloud(settings.isCloud);
        setGbHost(settings.gbHost);
        setGbApp(settings.gbApp);
        setError(undefined);
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  const pushUpdates = useMemo(
    () =>
      debounce(
        (apiKey, isCloud, gbHost, gbApp) => {
          setSaving(true);
          setError(undefined);
          invoke("updateAppSettings", { apiKey, isCloud, gbHost, gbApp }).then(
            (result) => {
              if (result !== true) setError("Failed to save settings");
              setSaving(false);
            }
          );
        },
        1000,
        { immediate: false }
      ),
    []
  );

  useEffect(() => {
    if (loading) return;
    pushUpdates(apiKey, isCloud, gbHost, gbApp);
  }, [apiKey, isCloud, gbHost, gbApp]);

  return (
    <AppSettingsContext.Provider
      value={{
        loading,
        error,
        apiKey,
        setApiKey,
        isCloud,
        setIsCloud,
        gbHost,
        setGbHost,
        gbApp,
        setGbApp,
        saving,
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
