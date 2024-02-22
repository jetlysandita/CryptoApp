// CurrencyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type
interface CurrencyContextType {
  selectedCurrency: string;
  changeCurrency: (currency: string) => void;
}

// Create the context with an initial undefined value
const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(''); // Set a default currency if needed

  const changeCurrency = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
