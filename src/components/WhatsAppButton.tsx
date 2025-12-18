import { MessageCircle, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function WhatsAppButton() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const phoneNumber = "351928272198";
  const displayNumber = "+351 928 272 198";
  const message = encodeURIComponent(t("whatsapp.message"));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Detect if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Use native WhatsApp protocol on mobile
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    } else {
      // On desktop, try web.whatsapp.com (more reliable than api.whatsapp.com)
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank");
    }
  };

  const handleCopyNumber = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await navigator.clipboard.writeText(displayNumber);
      setCopied(true);
      toast({
        title: "Número copiado!",
        description: displayNumber,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Número WhatsApp",
        description: displayNumber,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25" />
        
        {/* Main Button */}
        <button
          onClick={handleClick}
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          aria-label={t("whatsapp.tooltip")}
          role="button"
        >
          <MessageCircle className="h-7 w-7 text-white" fill="white" aria-hidden="true" />
        </button>
        
        {/* Tooltip with copy option */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-foreground text-background text-sm px-3 py-2 rounded-sm whitespace-nowrap flex items-center gap-2">
            <span>{t("whatsapp.tooltip")}</span>
            <button
              onClick={handleCopyNumber}
              className="p-1 hover:bg-background/20 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-background/50"
              aria-label="Copiar número de telefone"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
