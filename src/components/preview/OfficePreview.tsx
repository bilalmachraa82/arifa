import { useEffect } from "react";

interface OfficePreviewProps {
  fileUrl: string;
  onLoad: () => void;
}

const OfficePreview = ({ fileUrl, onLoad }: OfficePreviewProps) => {
  useEffect(() => {
    // Consider loaded after a short delay as iframe onload isn't always reliable
    const timer = setTimeout(onLoad, 1500);
    return () => clearTimeout(timer);
  }, [onLoad]);

  // Use Microsoft Office Online Viewer
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

  return (
    <div className="w-full h-full min-h-[70vh]">
      <iframe
        src={officeViewerUrl}
        className="w-full h-full rounded-lg border bg-white"
        title="Office Document Preview"
        onLoad={onLoad}
      />
    </div>
  );
};

export default OfficePreview;
