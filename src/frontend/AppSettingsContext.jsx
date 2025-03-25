import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import debounce from "debounce";
import { invoke } from "@forge/bridge";

const AppSettingsContext = createContext(null);

function isStoredAppSettings(value) {
  if (typeof value !== "object") return false;
  if (typeof value?.apiKey !== "string") return false;
  if (typeof value?.isCloud !== "boolean") return false;
  if (typeof value?.gbHost !== "string") return false;
  if (typeof value?.gbApp !== "string") return false;

  return true;
}

export const AppSettingsContextProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState("");
  const [isCloud, setIsCloud] = useState(true);
  const [gbHost, setGbHost] = useState("");
  const [gbApp, setGbApp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
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
