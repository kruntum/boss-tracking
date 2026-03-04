import { useState } from "react";
import { Skull, RotateCcw, Trash2, Loader2, MapPin, Radio, Clock, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBossTimers } from "@/hooks/useBossTimers";
import { useMaps } from "@/hooks/useMaps";
import { useChannels } from "@/hooks/useChannels";
import {
  updateBossDeathTime,
  resetBossTimer,
  deleteBossTimer,
  updateBossTimer,
} from "@/services/bossTimerService";
import { CountdownCell } from "./CountdownCell";
import { toast } from "sonner";
import type { BossTimer } from "@/types";
import { Timestamp } from "firebase/firestore";

function getNextSpawnTime(timer: BossTimer): Date | null {
  if (!timer.monster_death_time) return null;
  const deathMs = timer.monster_death_time.toMillis();
  return new Date(deathMs + timer.respawn_countdown * 60 * 1000);
}

const getElementColor = (el: string) => {
  switch (el) {
    case "ดิน": return "text-amber-700 bg-amber-700/10 border-amber-700/20";
    case "น้ำ": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "ลม": return "text-teal-400 bg-teal-400/10 border-teal-400/20";
    case "ไฟ": return "text-red-500 bg-red-500/10 border-red-500/20";
    case "ศักดิ์สิทธิ์": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "ความมืด": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    case "สายฟ้า": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};

const getMonsterTypeColor = (type: string) => {
  switch (type) {
    case "Plant": return "text-green-500 bg-green-500/10 border-green-500/20";
    case "Devil": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    case "Aberration": return "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20";
    case "Beast": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "Insects": return "text-lime-500 bg-lime-500/10 border-lime-500/20";
    case "Transcendent": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
};

export function BossTimerTable() {
  const { bossTimers, loading } = useBossTimers();
  const { maps } = useMaps();
  const { channels } = useChannels();

  const [editingTimer, setEditingTimer] = useState<BossTimer | null>(null);
  const [editRespawn, setEditRespawn] = useState("");
  const [editDeathTime, setEditDeathTime] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Use Maps not just to read the name, but to access bossName, element, and monsterType too
  const mapLookup = new Map(maps.map((m) => [m.id, m]));
  const channelLookup = new Map(channels.map((c) => [c.id, c.name]));

  // Sorting logic
  const sortedTimers = [...bossTimers].sort((a, b) => {
    const nextSpawnA = getNextSpawnTime(a);
    const nextSpawnB = getNextSpawnTime(b);

    if (nextSpawnA && nextSpawnB) {
      return nextSpawnA.getTime() - nextSpawnB.getTime(); // Nearest first
    }
    if (nextSpawnA) return -1; // Spawning items float to top
    if (nextSpawnB) return 1;  // Unkilled items drop to bottom

    // If neither has spawned, sort alphabetically by Map name
    const mapA = mapLookup.get(a.map_id)?.name || "";
    const mapB = mapLookup.get(b.map_id)?.name || "";
    return mapA.localeCompare(mapB);
  });

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

  const openEditDialog = (timer: BossTimer) => {
    setEditingTimer(timer);
    setEditRespawn(timer.respawn_countdown.toString());
    
    if (timer.monster_death_time) {
      // Convert to local datetime-local string format: "yyyy-MM-ddThh:mm"
      const date = timer.monster_death_time.toDate();
      const localString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEditDeathTime(localString);
    } else {
      setEditDeathTime("");
    }
  };

  const saveEdit = async () => {
    if (!editingTimer) return;
    
    setIsUpdating(true);
    try {
      const respawnNumber = parseInt(editRespawn);
      let deathTimestamp: Timestamp | null = null;
      
      if (editDeathTime) {
         deathTimestamp = Timestamp.fromDate(new Date(editDeathTime));
      }

      await updateBossTimer(editingTimer.id, {
        respawn_countdown: isNaN(respawnNumber) ? editingTimer.respawn_countdown : respawnNumber,
        monster_death_time: deathTimestamp,
      });

      toast.success("Timer updated");
      setEditingTimer(null);
    } catch {
      toast.error("Failed to update timer");
    } finally {
      setIsUpdating(false);
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
    <>
      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground py-2">Map & Boss</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground py-2">Channel</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground py-2">Respawn</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground py-2">Death Time</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground py-2">Countdown</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTimers.map((timer) => {
              const nextSpawn = getNextSpawnTime(timer);
              const mapInfo = mapLookup.get(timer.map_id);

              return (
                <TableRow
                  key={timer.id}
                  className="border-border/30 hover:bg-accent/30 transition-colors"
                >
                  <TableCell className="py-2 align-middle">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-medium text-sm">{mapInfo?.name || "Unknown"}</span>
                      </div>
                      
                      {mapInfo && (mapInfo.bossName || mapInfo.element || mapInfo.monsterType) && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {mapInfo.bossName && (
                            <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                              <Skull className="h-3 w-3" />
                              {mapInfo.bossName}
                            </span>
                          )}
                          {mapInfo.element && (
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${getElementColor(mapInfo.element)}`}>
                              {mapInfo.element}
                            </Badge>
                          )}
                          {mapInfo.monsterType && (
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border ${getMonsterTypeColor(mapInfo.monsterType)}`}>
                              {mapInfo.monsterType}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-400">
                      <Radio className="h-3 w-3" />
                      {channelLookup.get(timer.channel_id) ?? "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {timer.respawn_countdown}m
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    {timer.monster_death_time ? (
                      <span className="text-sm font-mono text-muted-foreground">
                        {format(timer.monster_death_time.toDate(), "HH:mm:ss")}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2 min-w-[120px]">
                    <CountdownCell targetTime={nextSpawn} />
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(timer)}
                        className="text-muted-foreground hover:text-blue-400 h-8 w-8 p-0"
                        title="Edit Timer"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {!timer.monster_death_time ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleKill(timer.id)}
                          className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 text-xs px-2"
                        >
                          <Skull className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Kill</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReset(timer.id)}
                          className="gap-1.5 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 h-8 text-xs px-2"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Reset</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(timer.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                        title="Delete Timer"
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

      <Dialog open={!!editingTimer} onOpenChange={(open) => !open && setEditingTimer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Boss Timer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="respawn">Respawn Interval (minutes)</Label>
              <Input
                id="respawn"
                type="number"
                value={editRespawn}
                onChange={(e) => setEditRespawn(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deathtime">Last Kill Time (Optional)</Label>
              <Input
                id="deathtime"
                type="datetime-local"
                value={editDeathTime}
                onChange={(e) => setEditDeathTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTimer(null)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
