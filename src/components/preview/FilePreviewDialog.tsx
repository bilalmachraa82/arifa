import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Download, Loader2, ExternalLink } from "lucide-react";
import ImagePreview from "./ImagePreview";
import PDFPreview from "./PDFPreview";
import OfficePreview from "./OfficePreview";
import Model3DPreview from "./Model3DPreview";
import FallbackPreview from "./FallbackPreview";

export interface FilePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType?: string;
  fileSize?: number;
}

type PreviewType = "image" | "pdf" | "office" | "3d" | "fallback";

const getPreviewType = (fileType: string): PreviewType => {
  const ext = fileType.toLowerCase();
  
  // Images
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) {
    return "image";
  }
  
  // PDF
  if (ext === "pdf") {
    return "pdf";
  }
  
  // Office documents
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    return "office";
  }
  
  // 3D models
  if (["stl", "obj", "glb", "gltf", "3ds", "fbx"].includes(ext)) {
    return "3d";
  }
  
  return "fallback";
};

const getFileExtension = (fileName: string, fileType?: string): string => {
  if (fileType) return fileType.toLowerCase();
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FilePreviewDialog = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
  fileSize,
}: FilePreviewDialogProps) => {
  const [loading, setLoading] = useState(true);
  
  const ext = getFileExtension(fileName, fileType);
  const previewType = getPreviewType(ext);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, fileUrl]);

  const handleLoad = () => {
    setLoading(false);
  };

  const renderPreview = () => {
    switch (previewType) {
      case "image":
        return (
          <ImagePreview 
            fileUrl={fileUrl} 
            fileName={fileName} 
            onLoad={handleLoad}
          />
        );
      case "pdf":
        return (
          <PDFPreview 
            fileUrl={fileUrl} 
            onLoad={handleLoad}
          />
        );
      case "office":
        return (
          <OfficePreview 
            fileUrl={fileUrl} 
            onLoad={handleLoad}
          />
        );
      case "3d":
        return (
          <Model3DPreview 
            fileUrl={fileUrl} 
            fileType={ext}
            onLoad={handleLoad}
          />
        );
      default:
        return (
          <FallbackPreview 
            fileUrl={fileUrl}
            fileName={fileName}
            fileType={ext}
            fileSize={fileSize}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h3 className="font-medium truncate">{fileName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs uppercase">
                  {ext || "Ficheiro"}
                </Badge>
                {fileSize && <span>{formatFileSize(fileSize)}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={fileUrl} download={fileName}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative bg-muted/30 min-h-0">
          {loading && previewType !== "fallback" && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <div className="w-full h-full flex items-center justify-center p-4">
            {renderPreview()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;
