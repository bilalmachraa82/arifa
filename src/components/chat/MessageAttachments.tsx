import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paperclip, X, FileText, Image, File, Loader2, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilePreviewDialog } from "@/components/preview";

export interface Attachment {
  url: string;
  name: string;
  size: number;
  type: string;
  path?: string; // Storage path for regenerating signed URLs
}

interface MessageAttachmentUploadProps {
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export const MessageAttachmentUpload = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: MessageAttachmentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxFiles} ficheiros permitidos.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "Ficheiro muito grande",
          description: `${file.name} excede o limite de ${maxSizeMB}MB.`,
          variant: "destructive",
        });
        continue;
      }

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Include user_id in path for RLS policy compliance
        const userId = user?.id || 'anonymous';
        const filePath = `message-attachments/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("client-documents")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Use signed URL for private bucket (valid for 1 year)
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("client-documents")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365);

        if (signedUrlError) throw signedUrlError;

        newAttachments.push({
          url: signedUrlData.signedUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath, // Store path for future signed URL generation
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Erro no upload",
          description: `Não foi possível carregar ${file.name}.`,
          variant: "destructive",
        });
      }
    }

    onAttachmentsChange([...attachments, ...newAttachments]);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    const updated = [...attachments];
    updated.splice(index, 1);
    onAttachmentsChange(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    return File;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || attachments.length >= maxFiles}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="mr-2 h-4 w-4" />
          )}
          Anexar ficheiros
        </Button>
        <span className="text-xs text-muted-foreground">
          {attachments.length}/{maxFiles} • Máx. {maxSizeMB}MB cada
        </span>
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => {
            const IconComponent = getFileIcon(attachment.type);
            return (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2 py-1.5 px-3"
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span className="max-w-[150px] truncate">{attachment.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(attachment.size)})
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface MessageAttachmentDisplayProps {
  attachments: Attachment[];
}

export const MessageAttachmentDisplay = ({ attachments }: MessageAttachmentDisplayProps) => {
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  
  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    return File;
  };

  const getFileExtension = (name: string, type: string): string => {
    const parts = name.split(".");
    if (parts.length > 1) return parts.pop()!.toLowerCase();
    if (type.includes("pdf")) return "pdf";
    if (type.startsWith("image/")) return type.split("/")[1];
    return "";
  };

  return (
    <>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm font-medium mb-2 flex items-center gap-2">
          <Paperclip className="h-4 w-4" />
          Anexos ({attachments.length})
        </p>
        <div className="space-y-2">
          {attachments.map((attachment, index) => {
            const IconComponent = getFileIcon(attachment.type);
            const isImage = attachment.type.startsWith("image/");

            return (
              <div key={index} className="flex items-center gap-3">
                {isImage ? (
                  <button
                    onClick={() => setPreviewAttachment(attachment)}
                    className="block cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="h-16 w-16 object-cover rounded border"
                    />
                  </button>
                ) : (
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setPreviewAttachment(attachment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={attachment.url} download={attachment.name} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* File Preview Dialog */}
      <FilePreviewDialog
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        fileUrl={previewAttachment?.url || ""}
        fileName={previewAttachment?.name || ""}
        fileType={previewAttachment ? getFileExtension(previewAttachment.name, previewAttachment.type) : undefined}
        fileSize={previewAttachment?.size}
      />
    </>
  );
};
