import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SoilCompositionChartProps {
  data: {
    subject: string;
    value: number;
    fullMark: number;
  }[];
}

const SoilCompositionChart = ({ data }: SoilCompositionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Tooltip />
        <Radar name="Value" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SoilCompositionChart;