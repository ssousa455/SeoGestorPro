import React, { createContext, useState, useContext, ReactNode } from 'react';

// Context para compartilhar estado da aplicação
type AppContextType = {
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ selectedProjectId, setSelectedProjectId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};
