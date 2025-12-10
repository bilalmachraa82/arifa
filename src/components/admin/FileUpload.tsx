import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, File, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  bucket: "project-images" | "blog-images" | "client-documents";
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete: (url: string, fileName: string, fileSize: number) => void;
  label?: string;
  currentUrl?: string;
}

const FileUpload = ({
  bucket,
  folder = "",
  accept = "image/*",
  maxSize = 10,
  onUploadComplete,
  label = "Ficheiro",
  currentUrl,
}: FileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const isImage = accept.includes("image");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Ficheiro demasiado grande",
        description: `O tamanho máximo é ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;

      // Set preview for images
      if (isImage) {
        setPreview(publicUrl);
      }

      setProgress(100);
      onUploadComplete(publicUrl, file.name, file.size);

      toast({
        title: "Upload concluído",
        description: "O ficheiro foi carregado com sucesso.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível carregar o ficheiro.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const clearPreview = () => {
    setPreview(null);
    onUploadComplete("", "", 0);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {preview && isImage ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-48 rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : preview ? (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <File className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm truncate flex-1">{preview}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${bucket}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              A carregar...
            </>
          ) : (
            <>
              {isImage ? (
                <ImageIcon className="mr-2 h-4 w-4" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Selecionar {isImage ? "imagem" : "ficheiro"}
            </>
          )}
        </Button>
      </div>

      {uploading && progress > 0 && (
        <Progress value={progress} className="h-2" />
      )}

      <p className="text-xs text-muted-foreground">
        Tamanho máximo: {maxSize}MB
      </p>
    </div>
  );
};

export default FileUpload;
