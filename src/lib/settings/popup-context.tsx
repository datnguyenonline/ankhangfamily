"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SettingsPopupContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SettingsPopupContext = createContext<SettingsPopupContextValue | null>(
  null
);

export function SettingsPopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle]
  );

  return (
    <SettingsPopupContext.Provider value={value}>
      {children}
    </SettingsPopupContext.Provider>
  );
}

export function useSettingsPopup() {
  const context = useContext(SettingsPopupContext);
  if (!context) {
    throw new Error("useSettingsPopup must be used within SettingsPopupProvider");
  }
  return context;
}
