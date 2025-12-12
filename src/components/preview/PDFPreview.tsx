import { useEffect } from "react";

interface PDFPreviewProps {
  fileUrl: string;
  onLoad: () => void;
}

const PDFPreview = ({ fileUrl, onLoad }: PDFPreviewProps) => {
  useEffect(() => {
    // Consider loaded after a short delay as iframe onload isn't always reliable
    const timer = setTimeout(onLoad, 1000);
    return () => clearTimeout(timer);
  }, [onLoad]);

  // Use Google Docs Viewer for PDF preview
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div className="w-full h-full min-h-[70vh]">
      <iframe
        src={googleViewerUrl}
        className="w-full h-full rounded-lg border bg-white"
        title="PDF Preview"
        onLoad={onLoad}
      />
    </div>
  );
};

export default PDFPreview;
