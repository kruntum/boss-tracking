import { useState } from "react";
import { Plus, Trash2, MapPin, Loader2, Skull, Edit, Mountain, Droplets, Wind, Flame, Sun, Moon, Zap, Leaf, Ghost, Eye, PawPrint, Bug, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { addMap, updateMap, deleteMap } from "@/services/mapService";
import { toast } from "sonner";

const ELEMENTS = ["ดิน", "น้ำ", "ลม", "ไฟ", "ศักดิ์สิทธิ์", "ความมืด", "สายฟ้า"];
const MONSTER_TYPES = ["Plant", "Devil", "Aberration", "Beast", "Insects", "Transcendent"];

const getElementStyle = (el: string) => {
  switch (el) {
    case "ดิน": return { icon: <Mountain className="h-3 w-3" />, color: "text-amber-700 border-amber-700/20 bg-amber-700/10" };
    case "น้ำ": return { icon: <Droplets className="h-3 w-3" />, color: "text-blue-500 border-blue-500/20 bg-blue-500/10" };
    case "ลม": return { icon: <Wind className="h-3 w-3" />, color: "text-teal-400 border-teal-400/20 bg-teal-400/10" };
    case "ไฟ": return { icon: <Flame className="h-3 w-3" />, color: "text-red-500 border-red-500/20 bg-red-500/10" };
    case "ศักดิ์สิทธิ์": return { icon: <Sun className="h-3 w-3" />, color: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" };
    case "ความมืด": return { icon: <Moon className="h-3 w-3" />, color: "text-purple-500 border-purple-500/20 bg-purple-500/10" };
    case "สายฟ้า": return { icon: <Zap className="h-3 w-3" />, color: "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" };
    default: return { icon: null, color: "text-slate-400 border-slate-400/20 bg-slate-400/10" };
  }
};

const getMonsterStyle = (type: string) => {
  switch (type) {
    case "Plant": return { icon: <Leaf className="h-3 w-3" />, color: "text-green-500 border-green-500/20 bg-green-500/10" };
    case "Devil": return { icon: <Ghost className="h-3 w-3" />, color: "text-rose-500 border-rose-500/20 bg-rose-500/10" };
    case "Aberration": return { icon: <Eye className="h-3 w-3" />, color: "text-fuchsia-500 border-fuchsia-500/20 bg-fuchsia-500/10" };
    case "Beast": return { icon: <PawPrint className="h-3 w-3" />, color: "text-orange-500 border-orange-500/20 bg-orange-500/10" };
    case "Insects": return { icon: <Bug className="h-3 w-3" />, color: "text-lime-500 border-lime-500/20 bg-lime-500/10" };
    case "Transcendent": return { icon: <Crown className="h-3 w-3" />, color: "text-amber-500 border-amber-500/20 bg-amber-500/10" };
    default: return { icon: null, color: "text-slate-400 border-slate-400/20 bg-slate-400/10" };
  }
};

export function MapManager() {
  const { maps, loading } = useMaps();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [bossName, setBossName] = useState("");
  const [element, setElement] = useState("");
  const [monsterType, setMonsterType] = useState("");
  const [mapLevel, setMapLevel] = useState("");
  const [bossLevel, setBossLevel] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedBoss = bossName.trim();
    
    if (!trimmedName || !trimmedBoss || !element || !monsterType || !mapLevel || !bossLevel) {
      toast.error("Please fill in all map and boss details");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: trimmedName,
        bossName: trimmedBoss,
        element,
        monsterType,
        mapLevel: parseInt(mapLevel, 10) || 0,
        bossLevel: parseInt(bossLevel, 10) || 0,
      };

      if (editingId) {
        await updateMap(editingId, payload);
        toast.success(`Map "${trimmedName}" updated`);
      } else {
        await addMap(payload);
        toast.success(`Map "${trimmedName}" added`);
      }
      resetForm();
    } catch {
      toast.error(editingId ? "Failed to update map" : "Failed to add map");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBossName("");
    setElement("");
    setMonsterType("");
    setMapLevel("");
    setBossLevel("");
  };

  const startEdit = (map: any) => {
    setEditingId(map.id);
    setName(map.name);
    setBossName(map.bossName || "");
    setElement(map.element || "");
    setMonsterType(map.monsterType || "");
    setMapLevel(map.mapLevel?.toString() || "");
    setBossLevel(map.bossLevel?.toString() || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-border/50 bg-background/30 p-4 relative">
          {editingId && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border border-amber-500/20">Edit Mode</Badge>
            </div>
          )}
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

            <div className="space-y-2">
              <Label htmlFor="map-level">Map Level</Label>
              <Input
                id="map-level"
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={mapLevel}
                onChange={(e) => setMapLevel(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boss-level">Boss Level</Label>
              <Input
                id="boss-level"
                type="number"
                min="1"
                placeholder="e.g. 60"
                value={bossLevel}
                onChange={(e) => setBossLevel(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || !name.trim() || !bossName.trim() || !element || !monsterType || !mapLevel || !bossLevel}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingId ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {editingId ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingId ? "Update Map" : "Add Map"}
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
                <TableHead>Map Lv.</TableHead>
                <TableHead>Boss Lv.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : maps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                      {map.element && (() => {
                        const style = getElementStyle(map.element);
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.color}`}>
                            {style.icon}
                            {map.element}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {map.monsterType && (() => {
                        const style = getMonsterStyle(map.monsterType);
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.color}`}>
                            {style.icon}
                            {map.monsterType}
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-muted-foreground">
                        {map.mapLevel || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-muted-foreground">
                        {map.bossLevel || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(map)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-400"
                        title="Edit Map"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(map.id, map.name)}
                        className="opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground ml-1"
                        title="Delete Map"
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
