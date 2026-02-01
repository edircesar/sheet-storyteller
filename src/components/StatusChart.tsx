import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BlogTheme } from '@/types/theme';

interface StatusChartProps {
  themes: BlogTheme[];
}

export function StatusChart({ themes }: StatusChartProps) {
  const completedCount = themes.filter((t) => t.feito === 'SIM').length;
  const pendingCount = themes.filter((t) => t.feito === 'NÃO').length;

  const data = [
    { name: 'Concluídos (SIM)', value: completedCount, color: 'hsl(var(--chart-2))' },
    { name: 'Pendentes (NÃO)', value: pendingCount, color: 'hsl(var(--chart-1))' },
  ];

  if (themes.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center border-2 border-foreground bg-card">
        <p className="text-muted-foreground">Nenhum registro para exibir</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-foreground bg-card p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Status dos Temas</h2>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ name, value }) => `${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--foreground))" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              border: '2px solid hsl(var(--foreground))',
              backgroundColor: 'hsl(var(--background))'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-8 text-sm font-medium">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-foreground" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
          <span>Concluídos: {completedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 border-2 border-foreground" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
          <span>Pendentes: {pendingCount}</span>
        </div>
      </div>
    </div>
  );
}
