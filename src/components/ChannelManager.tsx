import { useState } from "react";
import { Plus, Trash2, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChannels } from "@/hooks/useChannels";
import { addChannel, deleteChannel } from "@/services/channelService";
import { toast } from "sonner";

export function ChannelManager() {
  const { channels, loading } = useChannels();
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsAdding(true);
    try {
      await addChannel(trimmed);
      setName("");
      toast.success(`Channel "${trimmed}" added successfully`);
    } catch {
      toast.error("Failed to add channel");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, channelName: string) => {
    try {
      await deleteChannel(id);
      toast.success(`Channel "${channelName}" deleted`);
    } catch {
      toast.error("Failed to delete channel");
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Radio className="h-5 w-5 text-blue-400" />
          Channels
        </CardTitle>
        <CardDescription>
          Manage game channels / servers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            placeholder="Enter channel name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background/50"
          />
          <Button type="submit" size="sm" disabled={isAdding || !name.trim()}>
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : channels.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No channels yet. Add one above!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {channels.map((ch) => (
              <Badge
                key={ch.id}
                variant="secondary"
                className="group flex items-center gap-1.5 py-1.5 px-3 text-sm transition-all hover:bg-destructive/10"
              >
                <Radio className="h-3 w-3 text-blue-400" />
                {ch.name}
                <button
                  onClick={() => handleDelete(ch.id, ch.name)}
                  className="ml-1 rounded-full p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/20"
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
