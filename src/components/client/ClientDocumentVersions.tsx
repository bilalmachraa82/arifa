import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Download, 
  Eye,
  Loader2,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  notes: string | null;
  created_at: string;
}

interface ClientDocumentVersionsProps {
  documentId: string;
  currentVersion: number;
}

const ClientDocumentVersions = ({
  documentId,
  currentVersion,
}: ClientDocumentVersionsProps) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Don't show if there are no previous versions
  if (!loading && versions.length <= 1) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="gap-2 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
      >
        <History className="h-3 w-3" />
        <span>
          {versions.length > 1 
            ? `${versions.length - 1} versões anteriores`
            : "Histórico de versões"
          }
        </span>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            versions.map((version, index) => (
              <div
                key={version.id}
                className={cn(
                  "flex items-center justify-between gap-3 p-2 rounded-lg text-sm",
                  index === 0 
                    ? "bg-accent/10 border border-accent/20" 
                    : "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge 
                    variant={index === 0 ? "default" : "secondary"} 
                    className="text-xs flex-shrink-0"
                  >
                    v{version.version_number}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{formatDate(version.created_at)}</span>
                    {version.file_size && (
                      <span className="flex-shrink-0">
                        • {formatFileSize(version.file_size)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    asChild
                  >
                    <a href={version.file_url} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-3 w-3" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    asChild
                  >
                    <a href={version.file_url} download>
                      <Download className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDocumentVersions;
