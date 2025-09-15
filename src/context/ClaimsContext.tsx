import { createContext, useState, useContext, ReactNode } from 'react';
import { claims as initialClaims } from '@/data/mockClaims';
import type { Claim } from '@/data/mockClaims';

interface ClaimsContextProps {
  claims: Claim[];
  addClaim: (newClaimData: Omit<Claim, 'id' | 'soilType' | 'waterAvailability'>) => void;
}

const ClaimsContext = createContext<ClaimsContextProps | undefined>(undefined);

export const ClaimsProvider = ({ children }: { children: ReactNode }) => {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);

  const addClaim = (newClaimData: Omit<Claim, 'id' | 'soilType' | 'waterAvailability'>) => {
    const newClaim: Claim = {
      ...newClaimData,
      id: `C${String(claims.length + 1).padStart(3, '0')}`,
      soilType: 'Loamy', // Default value
      waterAvailability: 'Medium', // Default value
    };
    setClaims(prevClaims => [...prevClaims, newClaim]);
  };

  return (
    <ClaimsContext.Provider value={{ claims, addClaim }}>
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => {
  const context = useContext(ClaimsContext);
  if (context === undefined) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
};