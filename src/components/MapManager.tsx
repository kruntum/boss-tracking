import { useState } from "react";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMaps } from "@/hooks/useMaps";
import { addMap, deleteMap } from "@/services/mapService";
import { toast } from "sonner";

export function MapManager() {
  const { maps, loading } = useMaps();
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsAdding(true);
    try {
      await addMap(trimmed);
      setName("");
      toast.success(`Map "${trimmed}" added successfully`);
    } catch {
      toast.error("Failed to add map");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, mapName: string) => {
    try {
      await deleteMap(id);
      toast.success(`Map "${mapName}" deleted`);
    } catch {
      toast.error("Failed to delete map");
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-emerald-400" />
          Maps
        </CardTitle>
        <CardDescription>
          Manage game maps where bosses spawn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            placeholder="Enter map name..."
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
        ) : maps.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No maps yet. Add one above!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {maps.map((map) => (
              <Badge
                key={map.id}
                variant="secondary"
                className="group flex items-center gap-1.5 py-1.5 px-3 text-sm transition-all hover:bg-destructive/10"
              >
                <MapPin className="h-3 w-3 text-emerald-400" />
                {map.name}
                <button
                  onClick={() => handleDelete(map.id, map.name)}
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
