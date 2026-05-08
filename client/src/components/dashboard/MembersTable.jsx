import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboardFilters } from "@/context/dashboardFilterContext";

const MembersTable = ({ rows }) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const {
    searchTerm,
    memberRole,
    setMemberRole,
    memberDepartment,
    setMemberDepartment,
  } = useDashboardFilters();

  const availableRoles = useMemo(
    () => ["All", ...new Set(rows.map((row) => row.role || "Member"))],
    [rows],
  );

  const availableDepartments = useMemo(
    () => ["All", ...new Set(rows.map((row) => row.department || "General"))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const name = (row.name || "").toLowerCase();
      const role = (row.role || "").toLowerCase();
      const department = (row.department || "").toLowerCase();

      const matchesSearch =
        !query || [name, role, department].some((value) => value.includes(query));
      const matchesRole = memberRole === "All" || row.role === memberRole;
      const matchesDepartment =
        memberDepartment === "All" || row.department === memberDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [rows, searchTerm, memberRole, memberDepartment]);

  return (
    <Card className="p-6">
      <CardHeader className="mb-6">
        <CardTitle>Team Members ({filteredRows.length}/{rows.length})</CardTitle>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? "Hide Filters" : "Filter"}
          </Button>
          <Button size="sm" onClick={() => navigate("/member/signup")}>Invite Member</Button>
        </div>
      </CardHeader>
      {showFilters && (
        <div className="mb-6 grid gap-4 rounded-2xl border border-border bg-accent/70 p-4 dark:bg-slate-950/30">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Role</label>
            <select
              className="mt-2 h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm"
              value={memberRole}
              onChange={(event) => setMemberRole(event.target.value)}
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Department</label>
            <select
              className="mt-2 h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm"
              value={memberDepartment}
              onChange={(event) => setMemberDepartment(event.target.value)}
            >
              {availableDepartments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th className="py-4">Member Name</th>
            <th className="py-4">Role</th>
            <th className="py-4">Department</th>
            <th className="py-4">Status</th>
            <th className="py-4">Joined On</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => (
              <tr key={row._id || row.id} className="border-b border-border/70">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{row.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{row.name}</span>
                  </div>
                </td>
                <td className="py-4 text-muted-foreground">{row.role}</td>
                <td className="py-4 text-muted-foreground">{row.department}</td>
                <td className="py-4"><Badge>{row.status}</Badge></td>
                <td className="py-4 text-muted-foreground">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : row.joined || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                No members found for the current search and filter selection.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);
};

export default MembersTable;
