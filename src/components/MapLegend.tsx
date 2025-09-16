import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
    <span className="text-sm">{label}</span>
  </div>
);

const MapLegend = () => {
  const soilColors = {
    Alluvial: '#a67c52',
    Clay: '#8c564b',
    Loamy: '#7c6c5c',
    Laterite: '#d6616b',
  };

  const waterColors = {
    High: '#1f77b4',
    Medium: '#aec7e8',
    Low: '#ff7f0e',
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-3">
          <CardTitle className="text-base">Map Legend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">Soil Type</h4>
            {Object.entries(soilColors).map(([label, color]) => (
              <LegendItem key={label} color={color} label={label} />
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Water Availability</h4>
            {Object.entries(waterColors).map(([label, color]) => (
              <LegendItem key={label} color={color} label={label} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapLegend;