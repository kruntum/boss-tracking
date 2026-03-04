import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaps } from "@/hooks/useMaps";
import { useChannels } from "@/hooks/useChannels";
import { addBossTimer } from "@/services/bossTimerService";
import { toast } from "sonner";

export function AddBossTimerDialog() {
  const { maps } = useMaps();
  const { channels } = useChannels();
  const [open, setOpen] = useState(false);
  const [mapId, setMapId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [respawn, setRespawn] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapId || !channelId || !respawn) return;

    setIsAdding(true);
    try {
      await addBossTimer({
        map_id: mapId,
        channel_id: channelId,
        respawn_countdown: parseInt(respawn, 10),
      });
      toast.success("Boss timer created!");
      setMapId("");
      setChannelId("");
      setRespawn("");
      setOpen(false);
    } catch {
      toast.error("Failed to create boss timer");
    } finally {
      setIsAdding(false);
    }
  };

  const canSubmit = mapId && channelId && respawn && parseInt(respawn, 10) > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-linear-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow border-0">
          <Plus className="h-4 w-4" />
          Add Boss Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>New Boss Timer</DialogTitle>
          <DialogDescription>
            Create a new boss spawn timer entry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Map</Label>
            <Select value={mapId} onValueChange={setMapId}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a map..." />
              </SelectTrigger>
              <SelectContent>
                {maps.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Channel</Label>
            <Select value={channelId} onValueChange={setChannelId}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a channel..." />
              </SelectTrigger>
              <SelectContent>
                {channels.map((ch) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    {ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Respawn Time (minutes)</Label>
            <Input
              type="number"
              min="1"
              placeholder="e.g. 120"
              value={respawn}
              onChange={(e) => setRespawn(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isAdding}>
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
