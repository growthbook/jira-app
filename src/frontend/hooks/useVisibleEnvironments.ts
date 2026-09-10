import usePersistedState from "./usePersistedState";
import { useProjectSettingsContext } from "./useProjectSettingsContext";

export const VISIBLE_ENVIRONMENTS_KEY = "visibleEnvironments";

// Project override when set, otherwise the site-wide setting. Empty = show all.
export default function useVisibleEnvironments(): string[] {
  const [siteDefault] = usePersistedState<string[]>(
    VISIBLE_ENVIRONMENTS_KEY,
    []
  );
  const { settings } = useProjectSettingsContext();
  const list = settings.visibleEnvironments ?? siteDefault;
  return Array.isArray(list) ? list : [];
}
