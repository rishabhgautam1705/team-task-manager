import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/useDashboardData";

const CalendarPage = () => {
  const { data: tasks = [], isLoading, isError } = useTasks({ limit: 100 });

  if (isLoading) return <TableSkeleton columns={4} rows={6} />;
  if (isError) return <EmptyState title="Calendar unavailable" description="Task due dates could not be loaded." />;

  const events = tasks.map((task) => ({
    id: task._id,
    title: task.title,
    start: task.dueDate,
    color: task.status === "Completed" ? "#10B981" : new Date(task.dueDate) < new Date() ? "#F43F5E" : "#3B82F6",
  }));

  return (
    <Card className="overflow-x-auto p-4 sm:p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        events={events}
      />
    </Card>
  );
};

export default CalendarPage;
