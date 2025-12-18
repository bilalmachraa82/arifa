import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Calendar, Filter } from "lucide-react";
import { Lightbox } from "@/components/gallery/Lightbox";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface ProjectPhoto {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  phase: string | null;
  taken_at: string | null;
  created_at: string | null;
  is_featured: boolean | null;
}

interface ClientProjectPhotosProps {
  projectId: string;
  projectTitle: string;
}

const phaseLabels: Record<string, string> = {
  preparacao: "Preparação",
  conceito: "Conceito",
  coordenacao: "Coordenação",
  tecnico: "Técnico",
  construcao: "Construção",
  entrega: "Entrega",
  uso: "Uso",
};

const ClientProjectPhotos = ({ projectId, projectTitle }: ClientProjectPhotosProps) => {
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, [projectId]);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("project_photos")
      .select("*")
      .eq("project_id", projectId)
      .order("taken_at", { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
    setLoading(false);
  };

  const filteredPhotos = selectedPhase === "all" 
    ? photos 
    : photos.filter(p => p.phase === selectedPhase);

  const uniquePhases = [...new Set(photos.map(p => p.phase).filter(Boolean))];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          A carregar fotos...
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Camera className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem fotos de progresso</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Ainda não existem fotos de progresso para este projeto. As fotos aparecerão aqui à medida que o projeto avança.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Galeria de Progresso - {projectTitle}
          </CardTitle>
          
          {uniquePhases.length > 1 && (
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fases</SelectItem>
                {uniquePhases.map(phase => (
                  <SelectItem key={phase} value={phase!}>
                    {phaseLabels[phase!] || phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img 
                src={photo.image_url} 
                alt={photo.title || "Foto do projeto"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {photo.phase && (
                    <Badge variant="secondary" className="mb-2">
                      {phaseLabels[photo.phase] || photo.phase}
                    </Badge>
                  )}
                  {photo.title && (
                    <p className="text-white text-sm font-medium truncate">
                      {photo.title}
                    </p>
                  )}
                  {photo.taken_at && (
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(photo.taken_at), "d MMM yyyy", { locale: pt })}
                    </p>
                  )}
                </div>
              </div>
              {photo.is_featured && (
                <Badge className="absolute top-2 right-2 bg-primary">
                  Destaque
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      <Lightbox
        images={filteredPhotos.map(p => p.image_url)}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </Card>
  );
};

export default ClientProjectPhotos;
