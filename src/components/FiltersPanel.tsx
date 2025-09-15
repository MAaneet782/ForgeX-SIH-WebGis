import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDashboardState } from "@/context/DashboardStateContext";

const FiltersPanel = () => {
  const { state, dispatch } = useDashboardState();
  const { activeFilters } = state;

  const handleToggle = (filterName: keyof typeof activeFilters) => {
    dispatch({ type: 'TOGGLE_FILTER', payload: filterName });
  };

  return (
    <div className="p-4 space-y-4">
       <div className="font-bold mb-2">Apply Data Filters</div>
      <div className="flex items-center justify-between">
        <Label htmlFor="low-water-filter" className="pr-4">Low Water Index</Label>
        <Switch
          id="low-water-filter"
          checked={activeFilters.lowWater}
          onCheckedChange={() => handleToggle('lowWater')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="pending-filter" className="pr-4">Pending Claims</Label>
        <Switch
          id="pending-filter"
          checked={activeFilters.pending}
          onCheckedChange={() => handleToggle('pending')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="mgnrega-filter" className="pr-4">MGNREGA Eligible</Label>
        <Switch
          id="mgnrega-filter"
          checked={activeFilters.mgnrega}
          onCheckedChange={() => handleToggle('mgnrega')}
        />
      </div>
    </div>
  );
};

export default FiltersPanel;