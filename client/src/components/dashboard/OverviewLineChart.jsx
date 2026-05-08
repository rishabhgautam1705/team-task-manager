import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OverviewLineChart = ({ data, title = "Task Overview" }) => (
  <Card className="p-6">
    <CardHeader className="mb-6">
      <CardTitle>{title}</CardTitle>
      <div className="rounded-2xl border border-primary/10 px-4 py-2 text-sm text-muted-foreground">This Week</div>
    </CardHeader>
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3B82F6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default OverviewLineChart;
