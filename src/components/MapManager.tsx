import { useState } from "react";
import { Plus, Trash2, MapPin, Loader2, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMaps } from "@/hooks/useMaps";
import { addMap, deleteMap } from "@/services/mapService";
import { toast } from "sonner";

const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ", "ศักดิ์สิทธิ์", "ความมืด"];
const MONSTER_TYPES = ["Plant", "Devil", "Aberration", "Beast", "Insects"];

export function MapManager() {
  const { maps, loading } = useMaps();
  const [name, setName] = useState("");
  const [bossName, setBossName] = useState("");
  const [element, setElement] = useState("");
  const [monsterType, setMonsterType] = useState("");
  
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedBoss = bossName.trim();
    
    if (!trimmedName || !trimmedBoss || !element || !monsterType) {
      toast.error("Please fill in all map and boss details");
      return;
    }

    setIsAdding(true);
    try {
      await addMap({
        name: trimmedName,
        bossName: trimmedBoss,
        element,
        monsterType
      });
      setName("");
      setBossName("");
      setElement("");
      setMonsterType("");
      toast.success(`Map "${trimmedName}" added successfully`);
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-emerald-400" />
          Maps & Bosses
        </CardTitle>
        <CardDescription>
          Manage game maps and their specific boss details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4 rounded-md border border-border/50 bg-background/30 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="map-name">Map Name</Label>
              <Input
                id="map-name"
                placeholder="e.g. Prontera Field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="boss-name">Boss Name</Label>
              <Input
                id="boss-name"
                placeholder="e.g. Baphomet"
                value={bossName}
                onChange={(e) => setBossName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Element</Label>
              <Select value={element} onValueChange={setElement}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select element..." />
                </SelectTrigger>
                <SelectContent>
                  {ELEMENTS.map((el) => (
                    <SelectItem key={el} value={el}>{el}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Monster Type</Label>
              <Select value={monsterType} onValueChange={setMonsterType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {MONSTER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isAdding || !name.trim() || !bossName.trim() || !element || !monsterType}>
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Map
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Map Name</TableHead>
                <TableHead>Boss Name</TableHead>
                <TableHead>Element</TableHead>
                <TableHead>Monster Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : maps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No maps found. Add your first map above.
                  </TableCell>
                </TableRow>
              ) : (
                maps.map((map) => (
                  <TableRow key={map.id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-400" />
                        {map.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skull className="h-4 w-4 text-rose-400" />
                        {map.bossName || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {map.element && (
                        <span className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-500">
                          {map.element}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {map.monsterType && (
                        <span className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-500">
                          {map.monsterType}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(map.id, map.name)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
