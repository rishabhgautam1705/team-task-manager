import { CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const BrandLogo = ({ subtitle = "Manage. Assign. Achieve.", href = "/" }) => (
  <Link to={href} className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-blue-500/25 dark:shadow-slate-950/40">
      <CheckSquare className="h-6 w-6" />
    </div>
    <div>
      <p className="text-2xl font-bold tracking-tight text-foreground dark:text-white">TeamTask</p>
      <p className="text-sm text-muted-foreground dark:text-slate-400">{subtitle}</p>
    </div>
  </Link>
);

export default BrandLogo;
