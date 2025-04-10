import { useAppSettingsContext } from "./useAppSettingsContext";

export default function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const { persistedState, updatePersistedState, loading } =
    useAppSettingsContext();

  const setState = (value: T) => updatePersistedState(key, value);
  if (loading || !Object.prototype.hasOwnProperty.call(persistedState, key))
    return [initialValue, setState];

  return [persistedState[key], setState];
}
