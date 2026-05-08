import { createContext, useContext, useMemo, useState } from "react";

const DashboardFilterContext = createContext(null);

export const DashboardFilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectStatus, setProjectStatus] = useState("All");
  const [projectManager, setProjectManager] = useState("All");
  const [memberRole, setMemberRole] = useState("All");
  const [memberDepartment, setMemberDepartment] = useState("All");

  const value = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      projectStatus,
      setProjectStatus,
      projectManager,
      setProjectManager,
      memberRole,
      setMemberRole,
      memberDepartment,
      setMemberDepartment,
    }),
    [
      searchTerm,
      projectStatus,
      projectManager,
      memberRole,
      memberDepartment,
    ],
  );

  return <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>;
};

export const useDashboardFilters = () => {
  const context = useContext(DashboardFilterContext);
  if (!context) {
    throw new Error("useDashboardFilters must be used within DashboardFilterProvider");
  }
  return context;
};
