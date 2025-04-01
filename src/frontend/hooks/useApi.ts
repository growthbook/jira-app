import { useCallback } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useAppSettingsContext } from "./useAppSettingsContext";

export async function apiCall(
  gbHost: string | null,
  apiKey: string | null,
  url: string | null,
  options: Omit<RequestInit, "headers"> = {}
) {
  if (!gbHost || !apiKey || typeof url !== "string") return;
  const init: RequestInit = { ...options };
  init.headers = {};
  init.headers["Authorization"] = `Bearer ${apiKey}`;
  init.credentials = "omit";
  if (init.body && !init.headers["Content-Type"]) {
    init.headers["Content-Type"] = "application/json";
  }
  const response = await fetch(gbHost + url, init);
  const responseData = await response.json();

  if (responseData.status && responseData.status >= 400) {
    throw new Error(responseData.message || "There was an error");
  }

  return responseData;
}

type CurriedApiCallType<T> = (
  url: string | null,
  options?: RequestInit
) => Promise<T>;

export default function useApi<Response = unknown>(
  path: string | null,
  useSwrSettings?: SWRConfiguration
) {
  const { gbHost, apiKey, loading } = useAppSettingsContext();
  const curriedApiCall: CurriedApiCallType<Response> = useCallback(
    async (url: string | null, options: Omit<RequestInit, "headers"> = {}) => {
      if (loading || !url || !apiKey || !gbHost) return;
      return await apiCall(gbHost, apiKey, url, options);
    },
    [gbHost, apiKey, loading]
  );

  return useSWR<Response, Error>(
    path && gbHost && apiKey ? `${path}_${gbHost}_${apiKey}` : null,
    async () => curriedApiCall(path, { method: "GET" }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      refreshInterval: 10 * 60_000,
      ...useSwrSettings,
    }
  );
}
