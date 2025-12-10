import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function WhatsAppButton() {
  const { t } = useLanguage();
  
  const phoneNumber = "351928272198";
  const message = encodeURIComponent(t("whatsapp.message"));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={t("whatsapp.tooltip")}
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25" />
        
        {/* Button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <MessageCircle className="h-7 w-7 text-white" fill="white" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-foreground text-background text-sm px-3 py-2 rounded-sm whitespace-nowrap">
            {t("whatsapp.tooltip")}
          </div>
        </div>
      </div>
    </a>
  );
}
