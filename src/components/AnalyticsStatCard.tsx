import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

interface BreakdownItem {
  label: string;
  value: number;
}

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  breakdown?: BreakdownItem[];
  breakdownNote?: string;
}

const AnalyticsStatCard = ({ title, value, unit, icon: Icon, breakdown, breakdownNote }: AnalyticsStatCardProps) => {
  return (
    <Card>
      <Collapsible>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}</div>
          {breakdown && (
            <CollapsibleTrigger asChild>
              <button className="flex items-center text-xs text-muted-foreground mt-1 hover:text-foreground">
                Show breakdown <ChevronsUpDown className="ml-1 h-3 w-3" />
              </button>
            </CollapsibleTrigger>
          )}
        </CardContent>
        {breakdown && (
          <CollapsibleContent>
            <div className="px-6 pb-4 space-y-2">
              {breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value.toLocaleString()}</span>
                </div>
              ))}
              {breakdownNote && (
                <p className="text-xs text-muted-foreground pt-2 border-t mt-2">{breakdownNote}</p>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </Card>
  );
};

export default AnalyticsStatCard;