import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";

interface ImagePreviewProps {
  fileUrl: string;
  fileName: string;
  onLoad: () => void;
}

const ImagePreview = ({ fileUrl, fileName, onLoad }: ImagePreviewProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* Controls */}
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur rounded-lg p-2 shadow-md">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.25}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 4}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border" />
        <Button variant="ghost" size="icon" onClick={handleRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Image */}
      <div className="flex-1 overflow-auto flex items-center justify-center w-full">
        <img
          src={fileUrl}
          alt={fileName}
          onLoad={onLoad}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease",
            maxWidth: zoom === 1 ? "100%" : "none",
            maxHeight: zoom === 1 ? "calc(95vh - 180px)" : "none",
          }}
          className="object-contain rounded-lg shadow-lg"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
