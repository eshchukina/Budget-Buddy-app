import React, {createContext, useContext, useState, ReactNode} from 'react';

interface AppContextProps {
  triggerFunction: () => void;
  setTriggerFunction: (func: () => void) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [triggerFunction, setTriggerFunction] = useState<() => void>(() => {});

  return (
    <AppContext.Provider value={{triggerFunction, setTriggerFunction}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
