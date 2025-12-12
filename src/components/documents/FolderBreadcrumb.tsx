import { ChevronRight, Folder, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderPath {
  id: string | null;
  name: string;
}

interface FolderBreadcrumbProps {
  path: FolderPath[];
  onNavigate: (folderId: string | null) => void;
}

export function FolderBreadcrumb({ path, onNavigate }: FolderBreadcrumbProps) {
  return (
    <div className="flex items-center gap-1 text-sm overflow-x-auto pb-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 shrink-0"
        onClick={() => onNavigate(null)}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {path.map((folder, index) => (
        <div key={folder.id || "root"} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={index === path.length - 1 ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2 gap-1"
            onClick={() => onNavigate(folder.id)}
          >
            <Folder className="h-4 w-4" />
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
