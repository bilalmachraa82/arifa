import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Folder, FolderPlus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FolderBreadcrumb } from "./FolderBreadcrumb";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface DocumentFolder {
  id: string;
  name: string;
  parent_id: string | null;
  path: string;
  client_id: string;
}

interface FolderPath {
  id: string | null;
  name: string;
}

interface FolderNavigationProps {
  clientId: string;
  currentFolderId: string | null;
  onFolderChange: (folderId: string | null) => void;
  showCreateButton?: boolean;
}

export function FolderNavigation({
  clientId,
  currentFolderId,
  onFolderChange,
  showCreateButton = true,
}: FolderNavigationProps) {
  const { toast } = useToast();
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [breadcrumbPath, setBreadcrumbPath] = useState<FolderPath[]>([]);

  const fetchFolders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("document_folders")
      .select("*")
      .eq("client_id", clientId)
      .order("name");

    if (error) {
      console.error("Error fetching folders:", error);
    } else {
      setFolders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (clientId) {
      fetchFolders();
    }
  }, [clientId]);

  // Build breadcrumb path
  useEffect(() => {
    if (!currentFolderId) {
      setBreadcrumbPath([]);
      return;
    }

    const buildPath = (folderId: string): FolderPath[] => {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) return [];

      const parentPath = folder.parent_id
        ? buildPath(folder.parent_id)
        : [];

      return [...parentPath, { id: folder.id, name: folder.name }];
    };

    setBreadcrumbPath(buildPath(currentFolderId));
  }, [currentFolderId, folders]);

  const currentFolders = folders.filter((f) =>
    currentFolderId ? f.parent_id === currentFolderId : f.parent_id === null
  );

  const currentFolder = folders.find((f) => f.id === currentFolderId);
  const currentPath = currentFolder?.path || "/";

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Tem certeza que deseja eliminar a pasta "${folderName}"? Os documentos dentro serão movidos para a raiz.`)) {
      return;
    }

    const { error } = await supabase
      .from("document_folders")
      .delete()
      .eq("id", folderId);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Pasta eliminada" });
      if (currentFolderId === folderId) {
        onFolderChange(null);
      }
      fetchFolders();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <FolderBreadcrumb path={breadcrumbPath} onNavigate={onFolderChange} />

      {/* Folders Grid */}
      {currentFolders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {currentFolders.map((folder) => (
            <Card
              key={folder.id}
              className="group p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onFolderChange(folder.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {folder.name}
                  </span>
                </div>
                {showCreateButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id, folder.name);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Folder Button */}
      {showCreateButton && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          Nova Pasta
        </Button>
      )}

      <CreateFolderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        clientId={clientId}
        parentId={currentFolderId}
        parentPath={currentPath}
        onSuccess={fetchFolders}
      />
    </div>
  );
}
