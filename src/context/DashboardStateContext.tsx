import { createContext, useReducer, useContext, ReactNode } from 'react';
import type { Claim } from '@/data/mockClaims';

// --- STATE & ACTIONS ---
type State = {
  visibleLayers: {
    claims: boolean;
    water: boolean;
    agri: boolean;
  };
  activeFilter: 'none' | 'low-water-index';
};

type Action =
  | { type: 'TOGGLE_LAYER'; payload: keyof State['visibleLayers'] }
  | { type: 'TOGGLE_LOW_WATER_FILTER' };

const initialState: State = {
  visibleLayers: {
    claims: true,
    water: true,
    agri: true,
  },
  activeFilter: 'none',
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
    case 'TOGGLE_LOW_WATER_FILTER':
      return {
        ...state,
        activeFilter: state.activeFilter === 'low-water-index' ? 'none' : 'low-water-index',
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
}

const DashboardStateContext = createContext<DashboardContextProps | undefined>(undefined);

// --- PROVIDER ---
export const DashboardStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const isLowWaterClaim = (claim: Claim) => {
    return state.activeFilter === 'low-water-index' && claim.waterAvailability === 'Low';
  };

  return (
    <DashboardStateContext.Provider value={{ state, dispatch, isLowWaterClaim }}>
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