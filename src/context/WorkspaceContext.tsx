import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  setSelectedWorkspaceId: (id: string | null) => void;
  ecommerceId: number | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

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

  // Invalida tutte le query quando cambia l'ecommerce
  useEffect(() => {
    if (ecommerceId) {
      // Invalida tutte le query per ricaricare i dati del nuovo workspace
      queryClient.invalidateQueries();
      console.log(`🔄 Workspace cambiato: ecommerce ID ${ecommerceId} - Query invalidate`);
    }
  }, [ecommerceId, queryClient]);

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
