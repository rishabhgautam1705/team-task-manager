import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";

const colorMap = {
  blue: "from-blue-100 to-blue-50 text-blue-500",
  green: "from-emerald-100 to-emerald-50 text-emerald-500",
  purple: "from-violet-100 to-violet-50 text-violet-500",
  amber: "from-amber-100 to-amber-50 text-amber-500",
  rose: "from-rose-100 to-rose-50 text-rose-500",
};

const StatCard = ({ item }) => {
  const Icon = Icons[item.icon];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${colorMap[item.tone]}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <div className="mt-1 flex items-end gap-3">
            <p className="text-4xl font-bold tracking-tight">{item.value}</p>
            <p className="pb-1 text-sm font-semibold text-emerald-500">{item.delta} from last month</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
