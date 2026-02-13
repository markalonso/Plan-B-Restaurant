import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleStart = () => {
      startLoading();
    };

    const handleStop = () => {
      stopLoading();
    };

    window.addEventListener("app:loading:start", handleStart);
    window.addEventListener("app:loading:stop", handleStop);

    return () => {
      window.removeEventListener("app:loading:start", handleStart);
      window.removeEventListener("app:loading:stop", handleStop);
    };
  }, [startLoading, stopLoading]);

  const value = useMemo(
    () => ({
      loadingCount,
      isLoading: loadingCount > 0,
      startLoading,
      stopLoading
    }),
    [loadingCount, startLoading, stopLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used inside LoadingProvider");
  }
  return context;
};
