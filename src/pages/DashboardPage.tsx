import { BossTimerTable } from "@/components/BossTimerTable";
import { AddBossTimerDialog } from "@/components/AddBossTimerDialog";
import { Timer } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Timer className="h-6 w-6 text-orange-400" />
            Boss Timers
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track world boss spawn times in real-time across all channels.
          </p>
        </div>
        <AddBossTimerDialog />
      </div>

      <BossTimerTable />
    </div>
  );
}
