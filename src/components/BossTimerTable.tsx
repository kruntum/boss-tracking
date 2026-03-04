import { Skull, RotateCcw, Trash2, Loader2, MapPin, Radio, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBossTimers } from "@/hooks/useBossTimers";
import { useMaps } from "@/hooks/useMaps";
import { useChannels } from "@/hooks/useChannels";
import {
  updateBossDeathTime,
  resetBossTimer,
  deleteBossTimer,
} from "@/services/bossTimerService";
import { CountdownCell } from "./CountdownCell";
import { toast } from "sonner";
import type { BossTimer } from "@/types";

function getNextSpawnTime(timer: BossTimer): Date | null {
  if (!timer.monster_death_time) return null;
  const deathMs = timer.monster_death_time.toMillis();
  return new Date(deathMs + timer.respawn_countdown * 60 * 1000);
}

export function BossTimerTable() {
  const { bossTimers, loading } = useBossTimers();
  const { maps } = useMaps();
  const { channels } = useChannels();

  const mapLookup = new Map(maps.map((m) => [m.id, m.name]));
  const channelLookup = new Map(channels.map((c) => [c.id, c.name]));

  const handleKill = async (id: string) => {
    try {
      await updateBossDeathTime(id);
      toast.success("Boss killed! Timer started.");
    } catch {
      toast.error("Failed to update death time");
    }
  };

  const handleReset = async (id: string) => {
    try {
      await resetBossTimer(id);
      toast.success("Timer reset");
    } catch {
      toast.error("Failed to reset timer");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBossTimer(id);
      toast.success("Timer deleted");
    } catch {
      toast.error("Failed to delete timer");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (bossTimers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted/50 p-4 mb-4">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No boss timers yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Click "Add Boss Timer" to create your first entry.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Map</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Channel</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Respawn</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Death Time</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Countdown</TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bossTimers.map((timer) => {
            const nextSpawn = getNextSpawnTime(timer);
            return (
              <TableRow
                key={timer.id}
                className="border-border/30 hover:bg-accent/30 transition-colors"
              >
                <TableCell>
                  <Badge variant="outline" className="gap-1 border-emerald-500/30 text-emerald-400">
                    <MapPin className="h-3 w-3" />
                    {mapLookup.get(timer.map_id) ?? "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-400">
                    <Radio className="h-3 w-3" />
                    {channelLookup.get(timer.channel_id) ?? "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono text-muted-foreground">
                    {timer.respawn_countdown}m
                  </span>
                </TableCell>
                <TableCell>
                  {timer.monster_death_time ? (
                    <span className="text-sm font-mono text-muted-foreground">
                      {format(timer.monster_death_time.toDate(), "HH:mm:ss")}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <CountdownCell targetTime={nextSpawn} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {!timer.monster_death_time ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleKill(timer.id)}
                        className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 text-xs"
                      >
                        <Skull className="h-3.5 w-3.5" />
                        Kill
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReset(timer.id)}
                        className="gap-1.5 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 h-8 text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(timer.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
