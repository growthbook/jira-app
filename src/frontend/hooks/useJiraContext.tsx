import { view } from "@forge/bridge";
import { FullContext } from "@forge/bridge/out/types";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface JiraContextInfo {
  context: Partial<FullContext>;
  loading: boolean;
}

const JiraContext = createContext<JiraContextInfo>({
  context: {},
  loading: true,
});

export const JiraContextProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState<Partial<FullContext>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    view.getContext().then((ctx) => {
      setContext(ctx);
      setLoading(false);
    });
  }, []);

  return (
    <JiraContext.Provider value={{ context, loading }}>
      {children}
    </JiraContext.Provider>
  );
};

export const useJiraContext = () => {
  const context = useContext(JiraContext);

  if (!context)
    throw new Error(
      "JiraContext must be called from within the JiraContextProvider"
    );

  return context;
};
