import React, {createContext, useState, ReactNode, FC} from 'react';

interface BooleanContextProps {
  booleanValue: boolean;
  setBooleanValue: (value: boolean) => void;
}

export const BooleanContext = createContext<BooleanContextProps | undefined>(
  undefined,
);

interface BooleanProviderProps {
  children: ReactNode;
}

export const BooleanProvider: FC<BooleanProviderProps> = ({children}) => {
  const [booleanValue, setBooleanValue] = useState<boolean>(false);

  return (
    <BooleanContext.Provider value={{booleanValue, setBooleanValue}}>
      {children}
    </BooleanContext.Provider>
  );
};
