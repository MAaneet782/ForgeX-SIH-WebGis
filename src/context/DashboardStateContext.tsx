import { createContext, useReducer, useContext, ReactNode } from 'react';
import type { Claim } from '@/types'; // Updated import

// --- STATE & ACTIONS ---
type State = {
  visibleLayers: {
    claims: boolean;
    water: boolean;
    agri: boolean;
  };
  activeFilters: {
    lowWater: boolean;
    pending: boolean;
    mgnrega: boolean;
  };
};

type Action =
  | { type: 'TOGGLE_LAYER'; payload: keyof State['visibleLayers'] }
  | { type: 'TOGGLE_FILTER'; payload: keyof State['activeFilters'] };

const initialState: State = {
  visibleLayers: {
    claims: true,
    water: true,
    agri: true,
  },
  activeFilters: {
    lowWater: false,
    pending: false,
    mgnrega: false,
  },
};

// --- REDUCER ---
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_LAYER':
      return {
        ...state,
        visibleLayers: {
          ...state.visibleLayers,
          [action.payload]: !state.visibleLayers[action.payload],
        },
      };
    case 'TOGGLE_FILTER':
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.payload]: !state.activeFilters[action.payload],
        },
      };
    default:
      return state;
  }
};

// --- CONTEXT ---
interface DashboardContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
  isLowWaterClaim: (claim: Claim) => boolean;
  isPendingClaim: (claim: Claim) => boolean;
  isMgnregaEligible: (claim: Claim) => boolean;
}

const DashboardStateContext = createContext<DashboardContextProps | undefined>(undefined);

// --- PROVIDER ---
export const DashboardStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const isLowWaterClaim = (claim: Claim) => {
    return state.activeFilters.lowWater && claim.waterAvailability === 'Low';
  };

  const isPendingClaim = (claim: Claim) => {
    return state.activeFilters.pending && claim.status === 'Pending';
  };

  const isMgnregaEligible = (claim: Claim) => {
    // Mock logic: approved claims on small plots
    return state.activeFilters.mgnrega && claim.status === 'Approved' && claim.area < 4;
  };

  return (
    <DashboardStateContext.Provider value={{ state, dispatch, isLowWaterClaim, isPendingClaim, isMgnregaEligible }}>
      {children}
    </DashboardStateContext.Provider>
  );
};

// --- HOOK ---
export const useDashboardState = () => {
  const context = useContext(DashboardStateContext);
  if (context === undefined) {
    throw new Error('useDashboardState must be used within a DashboardStateProvider');
  }
  return context;
};