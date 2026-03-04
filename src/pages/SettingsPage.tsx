import { MapManager } from "@/components/MapManager";
import { ChannelManager } from "@/components/ChannelManager";
import { Settings } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings className="h-6 w-6 text-violet-400" />
          Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage maps and channels for boss timer tracking.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MapManager />
        <ChannelManager />
      </div>
    </div>
  );
}
