import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDashboardState } from "@/context/DashboardStateContext";

interface LayersPanelProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const LayersPanel = ({ isOpen, onOpenChange }: LayersPanelProps) => {
  const { state, dispatch } = useDashboardState();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Map Layers</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Overlays</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="claims-layer">FRA Claims</Label>
                <Switch
                  id="claims-layer"
                  checked={state.visibleLayers.claims}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_LAYER', payload: 'claims' })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="water-layer">Water Bodies</Label>
                <Switch
                  id="water-layer"
                  checked={state.visibleLayers.water}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_LAYER', payload: 'water' })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="agri-layer">Agricultural Land</Label>
                <Switch
                  id="agri-layer"
                  checked={state.visibleLayers.agri}
                  onCheckedChange={() => dispatch({ type: 'TOGGLE_LAYER', payload: 'agri' })}
                />
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Basemaps</h3>
            <p className="text-sm text-muted-foreground">
              Basemap can be changed using the control on the top-right of the map.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LayersPanel;