import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
  onBackPress?: () => void;
  setOnBackPress: (callback: () => void) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LoginLayoutProvider({ children }: { children: React.ReactNode }) {
  const [showBackButton, setShowBackButton] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [onBackPress, setOnBackPress] = useState<(() => void) | undefined>();

  return (
    <LayoutContext.Provider value={{
      showBackButton,
      setShowBackButton,
      headerTitle,
      setHeaderTitle,
      onBackPress,
      setOnBackPress: (callback) => setOnBackPress(() => callback),
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLoginLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
}