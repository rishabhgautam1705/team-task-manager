import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const StatusDonutChart = ({ data, total }) => (
  <Card className="p-6">
    <CardHeader className="mb-6">
      <CardTitle>Tasks by Status</CardTitle>
      <div className="rounded-2xl border border-primary/10 px-4 py-2 text-sm text-muted-foreground">This Month</div>
    </CardHeader>
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={85} outerRadius={120} paddingAngle={4}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-5xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
      </div>
      <div className="space-y-5 pt-5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export default StatusDonutChart;
