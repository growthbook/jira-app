import { useCallback } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { useAppSettingsContext } from "./useAppSettingsContext";
import { GB_API_HOST } from "../../utils/consts";

export async function apiCall(
  apiKey: string | null,
  url: string | null,
  options: Omit<RequestInit, "headers"> = {},
  unrollPaginationKey: string | undefined
) {
  if (!apiKey || typeof url !== "string") return;
  const init: RequestInit = { ...options };
  init.headers = {};
  init.headers["Authorization"] = `Bearer ${apiKey}`;
  init.credentials = "omit";
  if (init.body && !init.headers["Content-Type"]) {
    init.headers["Content-Type"] = "application/json";
  }
  const fetchUrl = new URL(url, GB_API_HOST);
  if (unrollPaginationKey) {
    fetchUrl.searchParams.set("limit", "100");
  }
  let response = await fetch(fetchUrl, init);
  let responseData = await response.json();
  if (unrollPaginationKey && Array.isArray(responseData[unrollPaginationKey])) {
    const collector = responseData[unrollPaginationKey];
    while (responseData.hasMore && responseData.nextOffset) {
      fetchUrl.searchParams.set("offset", responseData.nextOffset);
      response = await fetch(fetchUrl, init);
      responseData = await response.json();
      if (Array.isArray(responseData[unrollPaginationKey])) {
        collector.push(...responseData[unrollPaginationKey]);
      }
    }
    responseData[unrollPaginationKey] = collector;
  }

  if (responseData.status && responseData.status >= 400) {
    throw new Error(responseData.message || "There was an error");
  }

  return responseData;
}

type CurriedApiCallType<T> = (
  url: string | null,
  options?: RequestInit,
  unrollPaginationKey?: string
) => Promise<T>;

export default function useApi<Response = unknown>(
  path: string | null,
  useSwrSettings?: SWRConfiguration,
  unrollPaginationKey?: string
) {
  const { apiKey, loading } = useAppSettingsContext();
  const curriedApiCall: CurriedApiCallType<Response> = useCallback(
    async (
      url: string | null,
      options: Omit<RequestInit, "headers"> = {},
      unrollPaginationKey: string | undefined
    ) => {
      if (loading || !url || !apiKey) return;
      return await apiCall(apiKey, url, options, unrollPaginationKey);
    },
    [apiKey, loading]
  );

  return useSWR<Response, Error>(
    path && apiKey ? `${path}_${apiKey}_${unrollPaginationKey}` : null,
    async () => curriedApiCall(path, { method: "GET" }, unrollPaginationKey),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      refreshInterval: 10 * 60_000,
      ...useSwrSettings,
    }
  );
}
