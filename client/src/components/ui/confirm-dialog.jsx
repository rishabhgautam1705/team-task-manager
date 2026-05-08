import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirm", onCancel, onConfirm, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Cancel" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-background p-5 shadow-xl">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>{loading ? "Working..." : confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};
