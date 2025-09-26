import { Card } from "./ui/card";

const MapLegend = () => {
  const legendItems = [
    { color: '#b30000', label: 'Very High' },
    { color: '#e34a33', label: 'High' },
    { color: '#fc8d59', label: 'Medium-High' },
    { color: '#fdbb84', label: 'Medium' },
    { color: '#fee8c8', label: 'Low' }
  ];

  return (
    <Card className="absolute bottom-4 right-4 p-3 bg-card/80 backdrop-blur-sm z-40 w-auto shadow-lg border">
      <h4 className="font-bold text-sm mb-2 text-center">Claim Volume</h4>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center my-1">
          <i style={{ background: item.color, width: '18px', height: '18px', marginRight: '8px', opacity: 0.7, borderRadius: '2px' }}></i>
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
      <p className="text-xs mt-2 text-muted-foreground text-center">Circle size also indicates volume.</p>
    </Card>
  );
};

export default MapLegend;