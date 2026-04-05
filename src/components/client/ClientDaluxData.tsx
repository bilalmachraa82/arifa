import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FileText, Box, ExternalLink, AlertCircle, Download } from "lucide-react";

interface ClientDaluxDataProps {
  projectId: string;
}

export function ClientDaluxData({ projectId }: ClientDaluxDataProps) {
  const { t } = useLanguage();

  const { data: documents, isLoading: loadingDocs } = useQuery({
    queryKey: ["dalux-documents", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dalux_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: models, isLoading: loadingModels } = useQuery({
    queryKey: ["dalux-models", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dalux_models")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (loadingDocs || loadingModels) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const hasData = (documents && documents.length > 0) || (models && models.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t("client.noDaluxData")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("client.daluxDataPending")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Technical Documents */}
      {documents && documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            {t("client.technicalDocuments")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {documents.map((doc: any) => (
              <Card key={doc.id} className="group hover:border-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {doc.thumbnail_url ? (
                      <img
                        src={doc.thumbnail_url}
                        alt={doc.title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {doc.document_type}
                        </Badge>
                        {doc.version && (
                          <span className="text-xs text-muted-foreground">v{doc.version}</span>
                        )}
                      </div>
                      {doc.file_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 px-2 text-xs"
                          asChild
                        >
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3D Models */}
      {models && models.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Box className="h-5 w-5 text-accent" />
            {t("client.models3d")}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {models.map((model: any) => (
              <Card key={model.id} className="group hover:border-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {model.thumbnail_url ? (
                      <img
                        src={model.thumbnail_url}
                        alt={model.name}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Box className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{model.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {model.model_type?.toUpperCase()}
                        </Badge>
                        {model.file_size && (
                          <span className="text-xs text-muted-foreground">
                            {(model.file_size / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {model.viewer_url && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                            <a href={model.viewer_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {t("client.viewModel")}
                            </a>
                          </Button>
                        )}
                        {model.file_url && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
                            <a href={model.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
