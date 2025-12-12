import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  History, 
  Download, 
  Eye, 
  Upload,
  Loader2,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "./FileUpload";
import { cn } from "@/lib/utils";
import { FilePreviewDialog } from "@/components/preview";

interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  notes: string | null;
  created_at: string;
}

interface DocumentVersionHistoryProps {
  documentId: string;
  documentTitle: string;
  clientId: string;
  currentVersion: number;
  onVersionUploaded: () => void;
}

const DocumentVersionHistory = ({
  documentId,
  documentTitle,
  clientId,
  currentVersion,
  onVersionUploaded,
}: DocumentVersionHistoryProps) => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewVersion, setPreviewVersion] = useState<DocumentVersion | null>(null);
  
  const [newVersionData, setNewVersionData] = useState({
    file_url: "",
    file_type: "",
    file_size: "",
    notes: "",
  });

  useEffect(() => {
    fetchVersions();
  }, [documentId]);

  const fetchVersions = async () => {
    const { data, error } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", documentId)
      .order("version_number", { ascending: false });

    if (error) {
      console.error("Error fetching versions:", error);
    } else {
      setVersions(data || []);
    }
    setLoading(false);
  };

  const handleUploadVersion = async () => {
    if (!newVersionData.file_url) {
      toast({
        title: "Erro",
        description: "Por favor, carregue um ficheiro.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    const nextVersion = currentVersion + 1;

    // Insert new version
    const { error: versionError } = await supabase
      .from("document_versions")
      .insert({
        document_id: documentId,
        version_number: nextVersion,
        file_url: newVersionData.file_url,
        file_size: newVersionData.file_size ? parseInt(newVersionData.file_size) : null,
        file_type: newVersionData.file_type || null,
        notes: newVersionData.notes.trim() || null,
      });

    if (versionError) {
      toast({
        title: "Erro",
        description: versionError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    // Update main document with new version info
    const { error: docError } = await supabase
      .from("client_documents")
      .update({
        file_url: newVersionData.file_url,
        file_size: newVersionData.file_size ? parseInt(newVersionData.file_size) : null,
        file_type: newVersionData.file_type || null,
        current_version: nextVersion,
      })
      .eq("id", documentId);

    if (docError) {
      toast({
        title: "Aviso",
        description: "Versão guardada mas documento principal não atualizado.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Nova versão carregada",
        description: `Versão ${nextVersion} do documento foi carregada com sucesso.`,
      });
    }

    setUploadDialogOpen(false);
    setNewVersionData({ file_url: "", file_type: "", file_size: "", notes: "" });
    fetchVersions();
    onVersionUploaded();
    setUploading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      {/* Header with expand toggle and upload button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <History className="h-4 w-4" />
          <span>Histórico ({versions.length} versões)</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setUploadDialogOpen(true)}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Nova Versão
        </Button>
      </div>

      {/* Version History List */}
      {isExpanded && (
        <div className="border rounded-lg overflow-hidden animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Nenhuma versão anterior registada
            </div>
          ) : (
            <div className="divide-y">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={cn(
                    "p-3 flex items-center justify-between gap-4 transition-colors",
                    index === 0 && "bg-accent/5"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0",
                      index === 0 
                        ? "bg-accent text-accent-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      v{version.version_number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Versão {version.version_number}
                        </span>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">
                            Atual
                          </Badge>
                        )}
                        {version.file_type && (
                          <Badge variant="outline" className="text-xs">
                            {version.file_type.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(version.created_at)}</span>
                        {version.file_size && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(version.file_size)}</span>
                          </>
                        )}
                      </div>
                      {version.notes && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {version.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPreviewVersion(version)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={version.file_url} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload New Version Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Carregar Nova Versão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{documentTitle}</p>
              <p className="text-xs text-muted-foreground">
                Versão atual: v{currentVersion} → Nova versão: v{currentVersion + 1}
              </p>
            </div>

            <FileUpload
              bucket="client-documents"
              folder={`${clientId}/versions`}
              label="Novo Ficheiro *"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.jpg,.jpeg,.png"
              maxSize={50}
              currentUrl={newVersionData.file_url}
              onUploadComplete={(url, fileName, fileSize) => {
                const ext = fileName.split(".").pop()?.toLowerCase() || "";
                setNewVersionData({
                  ...newVersionData,
                  file_url: url,
                  file_type: ext,
                  file_size: fileSize.toString(),
                });
              }}
            />

            <div className="space-y-2">
              <Label>Notas da versão (opcional)</Label>
              <Textarea
                value={newVersionData.notes}
                onChange={(e) => setNewVersionData({ ...newVersionData, notes: e.target.value })}
                placeholder="Ex: Correções de projeto, revisão do cliente..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUploadVersion}
                disabled={uploading || !newVersionData.file_url}
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Carregar v{currentVersion + 1}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* File Preview Dialog */}
      <FilePreviewDialog
        isOpen={!!previewVersion}
        onClose={() => setPreviewVersion(null)}
        fileUrl={previewVersion?.file_url || ""}
        fileName={`${documentTitle} - v${previewVersion?.version_number || ""}`}
        fileType={previewVersion?.file_type || undefined}
        fileSize={previewVersion?.file_size || undefined}
      />
    </div>
  );
};

export default DocumentVersionHistory;
