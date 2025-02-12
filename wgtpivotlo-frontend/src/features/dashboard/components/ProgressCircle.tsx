import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

interface ProgressCircleProps {
  percentage: number;
}

export const ProgressCircle = ({ percentage }: ProgressCircleProps) => {
  const chartData = [{ percentage: percentage }];

  const chartConfig = {
    percentage: {
      label: 'Percentage',
      color: 'hsl(var(--primary))', // Add a color for the chart
    },
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            startAngle={225}
            endAngle={-45}
            innerRadius="80%"
            outerRadius="100%"
            barSize={20}
            width={10}
            height={10}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <RadialBar background dataKey="percentage" cornerRadius={10} fill="var(--color-percentage)" />
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.5em" className="fill-foreground text-4xl font-bold">
                {`${percentage}%`}
              </tspan>
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-center font-semibold">You have completed {percentage}% of your career journey!</p>
    </>
  );
};
