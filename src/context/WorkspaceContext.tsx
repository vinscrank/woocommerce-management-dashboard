import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (id: string | null) => void;
  ecommerceId: number | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  // Carica l'ID del workspace salvato IMMEDIATAMENTE dal localStorage
  let savedIdFromStorage = localStorage.getItem('selectedWorkspaceId');

  const [selectedWorkspaceId, setSelectedWorkspaceIdState] = useState<string | null>(
    savedIdFromStorage
  );

  // Funzione per impostare l'ID del workspace e salvarlo nel localStorage
  const setSelectedWorkspaceId = (id: string | null) => {
    setSelectedWorkspaceIdState(id);
    if (id) {
      localStorage.setItem('selectedWorkspaceId', id);
    } else {
      localStorage.removeItem('selectedWorkspaceId');
    }
  };

  // Estrai l'ID dell'ecommerce dal workspace ID
  const ecommerceId = selectedWorkspaceId
    ? parseInt(selectedWorkspaceId.replace('ecommerce-', ''), 10)
    : null;

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspaceId,
        setSelectedWorkspaceId,
        ecommerceId,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
