import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  FileArchive, 
  FileCode, 
  File, 
  Download,
  ExternalLink
} from "lucide-react";

interface FallbackPreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
}

const getFileIcon = (fileType: string) => {
  const ext = fileType.toLowerCase();
  
  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return FileArchive;
  }
  
  // Code/CAD files
  if (["dwg", "dxf", "skp", "rvt", "ifc", "step", "stp"].includes(ext)) {
    return FileCode;
  }
  
  // Documents
  if (["txt", "rtf", "csv"].includes(ext)) {
    return FileText;
  }
  
  return File;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileTypeDescription = (fileType: string): string => {
  const ext = fileType.toLowerCase();
  
  const descriptions: Record<string, string> = {
    dwg: "Ficheiro AutoCAD",
    dxf: "Ficheiro DXF (CAD)",
    skp: "Ficheiro SketchUp",
    rvt: "Ficheiro Revit",
    ifc: "Ficheiro IFC (BIM)",
    step: "Ficheiro STEP (CAD)",
    stp: "Ficheiro STEP (CAD)",
    "3ds": "Ficheiro 3DS Max",
    fbx: "Ficheiro FBX",
    obj: "Ficheiro OBJ 3D",
    stl: "Ficheiro STL 3D",
    zip: "Arquivo ZIP",
    rar: "Arquivo RAR",
    "7z": "Arquivo 7-Zip",
    txt: "Ficheiro de Texto",
    csv: "Ficheiro CSV",
  };
  
  return descriptions[ext] || `Ficheiro .${ext.toUpperCase()}`;
};

const FallbackPreview = ({ 
  fileUrl, 
  fileName, 
  fileType,
  fileSize 
}: FallbackPreviewProps) => {
  const IconComponent = getFileIcon(fileType);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12 text-center">
      <div className="h-32 w-32 rounded-2xl bg-muted/50 flex items-center justify-center">
        <IconComponent className="h-16 w-16 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{fileName}</h3>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="uppercase">
            {fileType}
          </Badge>
          {fileSize && (
            <span className="text-sm text-muted-foreground">
              {formatFileSize(fileSize)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {getFileTypeDescription(fileType)}
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground max-w-md">
        A pré-visualização não está disponível para este tipo de ficheiro. 
        Pode descarregar o ficheiro para o visualizar no software apropriado.
      </p>
      
      <div className="flex items-center gap-3">
        <Button asChild>
          <a href={fileUrl} download={fileName}>
            <Download className="mr-2 h-4 w-4" />
            Descarregar
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir em Nova Aba
          </a>
        </Button>
      </div>
    </div>
  );
};

export default FallbackPreview;
