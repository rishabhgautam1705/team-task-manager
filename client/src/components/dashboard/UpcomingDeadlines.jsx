import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardFilters } from "@/context/dashboardFilterContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingDeadlines = ({ items, role = "ADMIN" }) => {
  const navigate = useNavigate();
  const { searchTerm } = useDashboardFilters();
  const targetPath = role === "ADMIN" ? "/admin/calendar" : "/member/calendar";

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const project = item.project?.toLowerCase() || "";
      const note = item.note?.toLowerCase() || "";
      return !query || [title, project, note].some((value) => value.includes(query));
    });
  }, [items, searchTerm]);

  return (
    <Card className="p-6">
      <CardHeader className="mb-5">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <button type="button" onClick={() => navigate(targetPath)} className="text-sm font-semibold text-primary">
          View Calendar
        </button>
      </CardHeader>
    <div className="space-y-4">
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-accent/70 p-3 dark:bg-slate-950/30">
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-primary text-white">
              <span className="text-[10px] uppercase tracking-[0.25em]">May</span>
              <span className="text-xl font-bold">{new Date(item.date).getDate()}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.project}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              {item.note}
            </span>
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-accent/70 p-6 text-center text-sm text-muted-foreground dark:bg-slate-950/30">
          No deadlines match the current search.
        </div>
      )}
    </div>
  </Card>
);
};

export default UpcomingDeadlines;
