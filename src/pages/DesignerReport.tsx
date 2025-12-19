import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Copy, Check, Printer, Download, Sun, Moon, Palette, Type, 
  LayoutGrid, Users, Map, Zap, Eye, Accessibility, ChevronRight,
  ChevronUp,
  // Navigation icons
  Menu, X, Home, Building2, Briefcase, TrendingUp, FolderOpen, 
  FileText, Mail, Settings, LogIn, LogOut, User, Bell,
  // Segment icons
  Users2, Building, Landmark, Crown,
  // Admin icons
  LayoutDashboard, MessageSquare, UserPlus, Send, FileCheck,
  Target, Activity, BarChart3, PieChart, Calendar, Clock,
  // Client icons
  Folder, Upload, Eye as EyeIcon, Lock, Shield,
  // Social icons
  Phone, MapPin, Linkedin, Instagram, Facebook, Youtube,
  // Lightbox icons
  ChevronLeft, ZoomIn, ZoomOut, Expand, Minimize,
  // Content icons
  Image, Video, File, Archive, Edit, Trash2, Plus, Minus,
  Search, Filter, SortAsc, SortDesc, RefreshCw, ExternalLink,
  // Status icons
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Loader2,
  // Misc icons
  Heart, Star, Bookmark, Share2, ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Quote, Tag, Hash, Globe, Wifi, WifiOff, Smartphone, Monitor, Tablet,
  Layers, Grid, List, MoreHorizontal, MoreVertical, Grip, Move,
  Copy as CopyIcon, Clipboard, ClipboardCheck, Save, Undo, Redo,
  FileJson, FileCode
} from "lucide-react";

// ============================================
// TYPES
// ============================================

interface ColorSwatch {
  name: string;
  variable: string;
  lightValue: string;
  darkValue: string;
  usage: string;
}

interface TypographyItem {
  name: string;
  className: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  usage: string;
}

interface IconItem {
  name: string;
  icon: React.ElementType;
  category: string;
}

// ============================================
// DATA
// ============================================

const colorPalette: ColorSwatch[] = [
  { name: "Background", variable: "--background", lightValue: "0 0% 100%", darkValue: "240 10% 4%", usage: "Fundo principal da aplicação" },
  { name: "Foreground", variable: "--foreground", lightValue: "0 0% 5%", darkValue: "0 0% 95%", usage: "Texto principal" },
  { name: "Primary", variable: "--primary", lightValue: "0 0% 8%", darkValue: "0 0% 98%", usage: "Cor principal da marca, CTAs" },
  { name: "Primary Foreground", variable: "--primary-foreground", lightValue: "0 0% 98%", darkValue: "0 0% 8%", usage: "Texto sobre primary" },
  { name: "Secondary", variable: "--secondary", lightValue: "60 5% 96%", darkValue: "240 5% 16%", usage: "Elementos secundários" },
  { name: "Accent", variable: "--accent", lightValue: "45 100% 51%", darkValue: "45 100% 51%", usage: "Destaques visuais (dourado)" },
  { name: "Muted", variable: "--muted", lightValue: "60 5% 96%", darkValue: "240 5% 16%", usage: "Fundos suaves" },
  { name: "Muted Foreground", variable: "--muted-foreground", lightValue: "0 0% 45%", darkValue: "0 0% 65%", usage: "Texto secundário" },
  { name: "Card", variable: "--card", lightValue: "0 0% 100%", darkValue: "240 6% 10%", usage: "Fundo de cards" },
  { name: "Border", variable: "--border", lightValue: "20 6% 90%", darkValue: "240 5% 20%", usage: "Bordas de elementos" },
  { name: "Ring", variable: "--ring", lightValue: "0 0% 8%", darkValue: "0 0% 83%", usage: "Focus rings" },
  { name: "Destructive", variable: "--destructive", lightValue: "0 84% 60%", darkValue: "0 62% 30%", usage: "Ações destrutivas, erros" },
  { name: "Coral", variable: "--coral", lightValue: "16 100% 66%", darkValue: "16 85% 55%", usage: "Accent alternativo (coral)" },
  { name: "Yellow", variable: "--yellow", lightValue: "48 96% 53%", darkValue: "48 86% 45%", usage: "Accent alternativo (amarelo)" },
];

const brandGradients = [
  { name: "Gradient Primary", value: "linear-gradient(135deg, hsl(0 0% 8%) 0%, hsl(0 0% 20%) 100%)", usage: "Hero sections, CTAs premium" },
  { name: "Gradient Accent", value: "linear-gradient(135deg, hsl(45 100% 51%) 0%, hsl(40 100% 45%) 100%)", usage: "Badges premium, destaques" },
  { name: "Gradient Coral", value: "linear-gradient(135deg, hsl(16 100% 66%) 0%, hsl(16 100% 55%) 100%)", usage: "Botões alternativos, alertas" },
  { name: "Gradient Subtle", value: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(60 5% 96%) 100%)", usage: "Secções com profundidade" },
];

const typography: TypographyItem[] = [
  { name: "H1", className: "h1", fontSize: "2.5rem - 4rem", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.03em", usage: "Títulos de página, hero sections" },
  { name: "H2", className: "h2", fontSize: "2rem - 3rem", fontWeight: "600", lineHeight: "1.2", letterSpacing: "-0.02em", usage: "Títulos de secção" },
  { name: "H3", className: "h3", fontSize: "1.5rem - 2rem", fontWeight: "600", lineHeight: "1.3", letterSpacing: "-0.015em", usage: "Subtítulos, cards" },
  { name: "H4", className: "h4", fontSize: "1.25rem - 1.5rem", fontWeight: "600", lineHeight: "1.4", letterSpacing: "-0.01em", usage: "Títulos menores" },
  { name: "Body", className: "text-base", fontSize: "1rem", fontWeight: "400", lineHeight: "1.7", letterSpacing: "0", usage: "Texto corrido" },
  { name: "Lead", className: "text-lead", fontSize: "1.125rem - 1.25rem", fontWeight: "400", lineHeight: "1.6", letterSpacing: "0", usage: "Parágrafos de destaque" },
  { name: "Small", className: "text-small", fontSize: "0.875rem", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0", usage: "Legendas, metadata" },
  { name: "Caption", className: "text-caption", fontSize: "0.75rem", fontWeight: "500", lineHeight: "1.4", letterSpacing: "0.05em", usage: "Labels, badges" },
  { name: "Quote", className: "quote", fontSize: "1.25rem - 1.5rem", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0", usage: "Citações, testemunhos" },
];

const iconLibrary: IconItem[] = [
  // Navigation
  { name: "Menu", icon: Menu, category: "Navigation" },
  { name: "X", icon: X, category: "Navigation" },
  { name: "Home", icon: Home, category: "Navigation" },
  { name: "ChevronRight", icon: ChevronRight, category: "Navigation" },
  { name: "ChevronLeft", icon: ChevronLeft, category: "Navigation" },
  { name: "ArrowRight", icon: ArrowRight, category: "Navigation" },
  { name: "ArrowLeft", icon: ArrowLeft, category: "Navigation" },
  { name: "ArrowUp", icon: ArrowUp, category: "Navigation" },
  { name: "ArrowDown", icon: ArrowDown, category: "Navigation" },
  { name: "ExternalLink", icon: ExternalLink, category: "Navigation" },
  // Segments
  { name: "Users2", icon: Users2, category: "Segments" },
  { name: "Building", icon: Building, category: "Segments" },
  { name: "Building2", icon: Building2, category: "Segments" },
  { name: "Landmark", icon: Landmark, category: "Segments" },
  { name: "Crown", icon: Crown, category: "Segments" },
  { name: "Briefcase", icon: Briefcase, category: "Segments" },
  { name: "TrendingUp", icon: TrendingUp, category: "Segments" },
  // Admin
  { name: "LayoutDashboard", icon: LayoutDashboard, category: "Admin" },
  { name: "MessageSquare", icon: MessageSquare, category: "Admin" },
  { name: "UserPlus", icon: UserPlus, category: "Admin" },
  { name: "Send", icon: Send, category: "Admin" },
  { name: "FileCheck", icon: FileCheck, category: "Admin" },
  { name: "Target", icon: Target, category: "Admin" },
  { name: "Activity", icon: Activity, category: "Admin" },
  { name: "BarChart3", icon: BarChart3, category: "Admin" },
  { name: "PieChart", icon: PieChart, category: "Admin" },
  { name: "Calendar", icon: Calendar, category: "Admin" },
  { name: "Clock", icon: Clock, category: "Admin" },
  // Client
  { name: "User", icon: User, category: "Client" },
  { name: "Users", icon: Users, category: "Client" },
  { name: "Settings", icon: Settings, category: "Client" },
  { name: "Bell", icon: Bell, category: "Client" },
  { name: "LogIn", icon: LogIn, category: "Client" },
  { name: "LogOut", icon: LogOut, category: "Client" },
  { name: "Lock", icon: Lock, category: "Client" },
  { name: "Shield", icon: Shield, category: "Client" },
  // Files
  { name: "Folder", icon: Folder, category: "Files" },
  { name: "FolderOpen", icon: FolderOpen, category: "Files" },
  { name: "FileText", icon: FileText, category: "Files" },
  { name: "File", icon: File, category: "Files" },
  { name: "Upload", icon: Upload, category: "Files" },
  { name: "Download", icon: Download, category: "Files" },
  { name: "Archive", icon: Archive, category: "Files" },
  { name: "Image", icon: Image, category: "Files" },
  { name: "Video", icon: Video, category: "Files" },
  // Actions
  { name: "Edit", icon: Edit, category: "Actions" },
  { name: "Trash2", icon: Trash2, category: "Actions" },
  { name: "Plus", icon: Plus, category: "Actions" },
  { name: "Minus", icon: Minus, category: "Actions" },
  { name: "Copy", icon: CopyIcon, category: "Actions" },
  { name: "Save", icon: Save, category: "Actions" },
  { name: "Undo", icon: Undo, category: "Actions" },
  { name: "Redo", icon: Redo, category: "Actions" },
  { name: "RefreshCw", icon: RefreshCw, category: "Actions" },
  // Search & Filter
  { name: "Search", icon: Search, category: "Search" },
  { name: "Filter", icon: Filter, category: "Search" },
  { name: "SortAsc", icon: SortAsc, category: "Search" },
  { name: "SortDesc", icon: SortDesc, category: "Search" },
  // Status
  { name: "CheckCircle", icon: CheckCircle, category: "Status" },
  { name: "XCircle", icon: XCircle, category: "Status" },
  { name: "AlertCircle", icon: AlertCircle, category: "Status" },
  { name: "Info", icon: Info, category: "Status" },
  { name: "HelpCircle", icon: HelpCircle, category: "Status" },
  { name: "Loader2", icon: Loader2, category: "Status" },
  // Social
  { name: "Mail", icon: Mail, category: "Social" },
  { name: "Phone", icon: Phone, category: "Social" },
  { name: "MapPin", icon: MapPin, category: "Social" },
  { name: "Linkedin", icon: Linkedin, category: "Social" },
  { name: "Instagram", icon: Instagram, category: "Social" },
  { name: "Facebook", icon: Facebook, category: "Social" },
  { name: "Youtube", icon: Youtube, category: "Social" },
  { name: "Globe", icon: Globe, category: "Social" },
  // Media
  { name: "ZoomIn", icon: ZoomIn, category: "Media" },
  { name: "ZoomOut", icon: ZoomOut, category: "Media" },
  { name: "Expand", icon: Expand, category: "Media" },
  { name: "Minimize", icon: Minimize, category: "Media" },
  { name: "Eye", icon: EyeIcon, category: "Media" },
  // Layout
  { name: "Layers", icon: Layers, category: "Layout" },
  { name: "Grid", icon: Grid, category: "Layout" },
  { name: "LayoutGrid", icon: LayoutGrid, category: "Layout" },
  { name: "List", icon: List, category: "Layout" },
  { name: "MoreHorizontal", icon: MoreHorizontal, category: "Layout" },
  { name: "MoreVertical", icon: MoreVertical, category: "Layout" },
  { name: "Grip", icon: Grip, category: "Layout" },
  { name: "Move", icon: Move, category: "Layout" },
  // Misc
  { name: "Heart", icon: Heart, category: "Misc" },
  { name: "Star", icon: Star, category: "Misc" },
  { name: "Bookmark", icon: Bookmark, category: "Misc" },
  { name: "Share2", icon: Share2, category: "Misc" },
  { name: "Quote", icon: Quote, category: "Misc" },
  { name: "Tag", icon: Tag, category: "Misc" },
  { name: "Hash", icon: Hash, category: "Misc" },
  // Devices
  { name: "Smartphone", icon: Smartphone, category: "Devices" },
  { name: "Monitor", icon: Monitor, category: "Devices" },
  { name: "Tablet", icon: Tablet, category: "Devices" },
  { name: "Wifi", icon: Wifi, category: "Devices" },
  { name: "WifiOff", icon: WifiOff, category: "Devices" },
];

const buttonVariants = [
  { name: "default", label: "Default", className: "" },
  { name: "hero", label: "Hero", className: "hero" },
  { name: "outline", label: "Outline", className: "outline" },
  { name: "ghost", label: "Ghost", className: "ghost" },
  { name: "link", label: "Link", className: "link" },
  { name: "accent", label: "Accent", className: "accent" },
  { name: "coral", label: "Coral", className: "coral" },
  { name: "yellow", label: "Yellow", className: "yellow" },
  { name: "destructive", label: "Destructive", className: "destructive" },
  { name: "minimal", label: "Minimal", className: "minimal" },
];

const buttonSizes = [
  { name: "sm", label: "Small" },
  { name: "default", label: "Default" },
  { name: "lg", label: "Large" },
  { name: "xl", label: "Extra Large" },
  { name: "icon", label: "Icon" },
];

const spacingScale = [
  { name: "xs", value: "0.25rem (4px)", usage: "Micro spacing" },
  { name: "sm", value: "0.5rem (8px)", usage: "Tight spacing" },
  { name: "md", value: "1rem (16px)", usage: "Default spacing" },
  { name: "lg", value: "1.5rem (24px)", usage: "Comfortable spacing" },
  { name: "xl", value: "2rem (32px)", usage: "Generous spacing" },
  { name: "2xl", value: "3rem (48px)", usage: "Section spacing" },
  { name: "3xl", value: "4rem (64px)", usage: "Large section spacing" },
  { name: "4xl", value: "6rem (96px)", usage: "Hero spacing" },
];

const breakpoints = [
  { name: "sm", value: "640px", description: "Smartphones paisagem" },
  { name: "md", value: "768px", description: "Tablets" },
  { name: "lg", value: "1024px", description: "Tablets paisagem / Laptops" },
  { name: "xl", value: "1280px", description: "Desktops" },
  { name: "2xl", value: "1536px", description: "Ecrãs grandes" },
];

const animations = [
  { name: "fade-in", duration: "0.3s", easing: "ease-out", usage: "Entrada de elementos" },
  { name: "fade-in-up", duration: "0.4s", easing: "ease-out", usage: "Entrada com movimento" },
  { name: "scale-in", duration: "0.2s", easing: "ease-out", usage: "Modais, popovers" },
  { name: "slide-in-right", duration: "0.3s", easing: "ease-out", usage: "Sidebars, drawers" },
  { name: "accordion-down", duration: "0.2s", easing: "ease-out", usage: "Accordions" },
  { name: "float", duration: "3s", easing: "ease-in-out", usage: "Elementos decorativos" },
  { name: "pulse-soft", duration: "2s", easing: "ease-in-out", usage: "Loading, atenção" },
];

// ============================================
// UTILITIES - Download Functions
// ============================================

const generateJSONTokens = () => {
  const tokens = {
    colors: {
      background: { light: "0 0% 93%", dark: "0 0% 6%" },
      foreground: { light: "0 0% 6%", dark: "0 0% 93%" },
      primary: { light: "0 0% 6%", dark: "0 0% 93%" },
      secondary: { light: "0 0% 93%", dark: "0 0% 15%" },
      accent: { light: "195 36% 37%", dark: "195 36% 45%" },
      muted: { light: "40 1% 75%", dark: "0 0% 20%" },
      destructive: { light: "0 84% 60%", dark: "0 62% 30%" },
      coral: "4 80% 66%",
      yellow: "44 83% 51%",
      blue: "195 36% 37%"
    },
    typography: {
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeights: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 },
      sizes: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "4xl": "2.5rem" }
    },
    spacing: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem", xl: "2rem", "2xl": "3rem", "3xl": "4rem" },
    borderRadius: { sm: "0.125rem", default: "0.25rem", md: "0.375rem", lg: "0.5rem", full: "9999px" },
    shadows: {
      soft: "0 4px 20px -2px hsla(0, 0%, 0%, 0.08)",
      card: "0 8px 30px -6px hsla(0, 0%, 0%, 0.1)",
      elevated: "0 20px 50px -12px hsla(0, 0%, 0%, 0.15)"
    }
  };
  return JSON.stringify(tokens, null, 2);
};

const generateCSSTokens = () => {
  return `:root {
  /* Colors */
  --background: 0 0% 93%;
  --foreground: 0 0% 6%;
  --primary: 0 0% 6%;
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 93%;
  --secondary-foreground: 0 0% 6%;
  --accent: 195 36% 37%;
  --accent-foreground: 0 0% 100%;
  --muted: 40 1% 75%;
  --muted-foreground: 0 0% 29%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 40 1% 75%;
  --ring: 195 36% 37%;
  
  /* Sub-brands */
  --arifa-coral: 4 80% 66%;
  --arifa-yellow: 44 83% 51%;
  --arifa-blue: 195 36% 37%;
  
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  
  /* Shadows */
  --shadow-soft: 0 4px 20px -2px hsla(0, 0%, 0%, 0.08);
  --shadow-card: 0 8px 30px -6px hsla(0, 0%, 0%, 0.1);
  --shadow-elevated: 0 20px 50px -12px hsla(0, 0%, 0%, 0.15);
  
  /* Border Radius */
  --radius: 0.25rem;
}

.dark {
  --background: 0 0% 6%;
  --foreground: 0 0% 93%;
  --primary: 0 0% 93%;
  --primary-foreground: 0 0% 6%;
  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 93%;
  --accent: 195 36% 45%;
  --muted: 0 0% 20%;
  --muted-foreground: 40 1% 75%;
  --border: 0 0% 20%;
}`;
};

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success(`${filename} transferido!`);
};

// ============================================
// COMPONENTS
// ============================================

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (!visible) return null;
  
  return (
    <Button
      onClick={scrollToTop}
      variant="default"
      size="icon"
      className="fixed bottom-6 right-6 z-50 shadow-lg print:hidden animate-fade-in"
    >
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
};

const ResponsivePreview = () => {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  
  const deviceWidths = {
    mobile: 375,
    tablet: 768,
    desktop: 1280
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant={activeDevice === "mobile" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveDevice("mobile")}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Mobile (375px)
        </Button>
        <Button 
          variant={activeDevice === "tablet" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveDevice("tablet")}
        >
          <Tablet className="h-4 w-4 mr-2" />
          Tablet (768px)
        </Button>
        <Button 
          variant={activeDevice === "desktop" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveDevice("desktop")}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Desktop (1280px)
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-muted/30">
        <div className="bg-muted/50 p-2 flex items-center gap-2 border-b">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground">
            {deviceWidths[activeDevice]}px
          </div>
        </div>
        <div 
          className="mx-auto transition-all duration-300 bg-background overflow-hidden"
          style={{ 
            width: `min(100%, ${deviceWidths[activeDevice]}px)`,
            minHeight: '400px'
          }}
        >
          {/* Sample Components at different sizes */}
          <div className="p-4 space-y-4">
            {/* Navigation Example */}
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-bold text-sm sm:text-base">ARIFA</span>
              {activeDevice === "mobile" ? (
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              ) : (
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Home</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Projetos</span>
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer">Contacto</span>
                </div>
              )}
            </div>
            
            {/* Hero Example */}
            <div className={`${activeDevice === "mobile" ? "text-center space-y-3" : "flex items-center gap-6"}`}>
              <div className={activeDevice === "mobile" ? "" : "flex-1"}>
                <h3 className={`font-bold ${activeDevice === "mobile" ? "text-xl" : "text-2xl"}`}>
                  Arquitectura Premium
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Transformamos visões em realidade.
                </p>
                <Button size={activeDevice === "mobile" ? "sm" : "default"} className="mt-4">
                  Ver Projetos
                </Button>
              </div>
              {activeDevice !== "mobile" && (
                <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Cards Grid Example */}
            <div className={`grid gap-3 ${
              activeDevice === "mobile" ? "grid-cols-1" : 
              activeDevice === "tablet" ? "grid-cols-2" : "grid-cols-3"
            }`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-3 bg-card">
                  <div className="w-full h-16 bg-muted rounded mb-2" />
                  <div className="font-medium text-sm">Projeto {i}</div>
                  <div className="text-xs text-muted-foreground">Lisboa</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Os componentes adaptam-se automaticamente aos diferentes breakpoints usando classes responsivas do Tailwind CSS.
      </p>
    </div>
  );
};

const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiado para clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      {label && <span className="ml-1 text-xs">{label}</span>}
    </Button>
  );
};

const SectionNav = ({ sections, activeSection }: { sections: { id: string; label: string; icon: React.ElementType }[]; activeSection: string }) => {
  const activeIndex = sections.findIndex(s => s.id === activeSection);
  const progressPercent = activeIndex >= 0 ? ((activeIndex + 1) / sections.length) * 100 : 0;
  
  return (
    <nav className="sticky top-20 hidden lg:block">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Navegação</CardTitle>
            <span className="text-xs text-muted-foreground">{activeIndex + 1}/{sections.length}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                )}
                <section.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                <span className="truncate">{section.label}</span>
              </a>
            );
          })}
        </CardContent>
      </Card>
    </nav>
  );
};

const ColorSwatchCard = ({ color }: { color: ColorSwatch }) => {
  const { theme } = useTheme();
  const value = theme === "dark" ? color.darkValue : color.lightValue;
  
  return (
    <div className="group relative">
      <div
        className="h-20 rounded-lg border shadow-sm mb-2"
        style={{ backgroundColor: `hsl(${value})` }}
      />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{color.name}</span>
          <CopyButton text={`hsl(${value})`} />
        </div>
        <code className="text-xs text-muted-foreground block">{color.variable}</code>
        <p className="text-xs text-muted-foreground">{color.usage}</p>
      </div>
    </div>
  );
};

const IconGrid = ({ icons, category }: { icons: IconItem[]; category: string }) => {
  const filteredIcons = category === "all" ? icons : icons.filter(i => i.category === category);
  
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
      {filteredIcons.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(`<${item.name} />`);
            toast.success(`${item.name} copiado!`);
          }}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs text-center text-muted-foreground group-hover:text-foreground truncate w-full">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DesignerReport() {
  const { theme, setTheme } = useTheme();
  const [iconCategory, setIconCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("colors");
  
  const sections = [
    { id: "colors", label: "1. Paleta de Cores", icon: Palette },
    { id: "typography", label: "2. Tipografia", icon: Type },
    { id: "icons", label: "3. Ícones", icon: LayoutGrid },
    { id: "buttons", label: "4. Botões", icon: Zap },
    { id: "spacing", label: "5. Espaçamento", icon: Grid },
    { id: "navigation", label: "6. Navegação", icon: Menu },
    { id: "components", label: "7. Componentes UI", icon: Layers },
    { id: "animations", label: "8. Animações", icon: Zap },
    { id: "responsive", label: "9. Responsividade", icon: Smartphone },
    { id: "darkmode", label: "10. Dark Mode", icon: Moon },
    { id: "architecture", label: "11. Arquitectura", icon: Map },
    { id: "journeys", label: "12. User Journeys", icon: Users },
    { id: "features", label: "13. Funcionalidades", icon: LayoutDashboard },
    { id: "brand", label: "14. Marca & Voz", icon: Crown },
    { id: "imagery", label: "15. Imagens & Logo", icon: Image },
    { id: "accessibility", label: "16. Acessibilidade", icon: Accessibility },
    { id: "assets", label: "17. Assets", icon: Download },
  ];
  
  // Intersection Observer for active section tracking
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  }, []);
  
  const iconCategories = ["all", ...new Set(iconLibrary.map(i => i.category))];

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-72 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out lg:hidden print:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-bold">Navegação</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="space-y-1">
            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors relative ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                  )}
                  <section.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                  <span>{section.label}</span>
                </a>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b print:static print:border-0">
        <div className="container-arifa py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Back to Site Link */}
            <a 
              href="/" 
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Site</span>
            </a>
          </div>
          
          <div className="flex-1 text-center lg:text-left lg:ml-8">
            <h1 className="text-lg sm:text-2xl font-bold">ARIFA Design System</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Relatório Completo para Rebrand</p>
          </div>
          
          <div className="flex items-center gap-2 print:hidden">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden sm:flex">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="icon" onClick={() => window.print()} className="sm:hidden">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container-arifa py-8">
        <div className="flex gap-8">
          {/* Side Navigation - Desktop */}
          <aside className="w-64 shrink-0 hidden lg:block print:hidden">
            <SectionNav sections={sections} activeSection={activeSection} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-16">
            {/* ====== COLORS ====== */}
            <section id="colors" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Paleta de Cores</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cores Base</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {colorPalette.map((color) => (
                      <ColorSwatchCard key={color.variable} color={color} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Gradientes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brandGradients.map((gradient) => (
                      <div key={gradient.name} className="group">
                        <div
                          className="h-24 rounded-lg border shadow-sm mb-2"
                          style={{ background: gradient.value }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{gradient.name}</span>
                          <CopyButton text={gradient.value} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{gradient.usage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ====== TYPOGRAPHY ====== */}
            <section id="typography" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Type className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Tipografia</h2>
              </div>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline">Font Family</Badge>
                    <span className="font-semibold">Inter</span>
                    <CopyButton text="font-family: 'Inter', system-ui, sans-serif;" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inter é uma família tipográfica otimizada para UI/UX, com excelente legibilidade em todos os tamanhos.
                  </p>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                {typography.map((item) => (
                  <Card key={item.name}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1">
                          <div className={item.className}>
                            {item.name === "H1" && <h1>Arquitectura de Excelência</h1>}
                            {item.name === "H2" && <h2>Projectos Premium</h2>}
                            {item.name === "H3" && <h3>Design & Construção</h3>}
                            {item.name === "H4" && <h4>Serviços Personalizados</h4>}
                            {item.name === "Body" && <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>}
                            {item.name === "Lead" && <p className="text-lead">Transformamos visões em espaços extraordinários com atenção meticulosa aos detalhes.</p>}
                            {item.name === "Small" && <p className="text-small">Publicado há 3 dias • 5 min leitura</p>}
                            {item.name === "Caption" && <p className="text-caption uppercase">Projecto em Destaque</p>}
                            {item.name === "Quote" && <blockquote className="quote">"A equipa ARIFA superou todas as expectativas."</blockquote>}
                          </div>
                        </div>
                        <div className="lg:w-80 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Class:</span>
                            <code className="bg-muted px-2 py-0.5 rounded">{item.className}</code>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{item.fontSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span>{item.fontWeight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Line Height:</span>
                            <span>{item.lineHeight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Letter Spacing:</span>
                            <span>{item.letterSpacing}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pt-2 border-t">{item.usage}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* ====== ICONS ====== */}
            <section id="icons" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <LayoutGrid className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Biblioteca de Ícones</h2>
                <Badge>{iconLibrary.length} ícones</Badge>
              </div>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Biblioteca:</span>
                    <Badge variant="outline">Lucide React</Badge>
                    <CopyButton text="npm install lucide-react" label="Instalar" />
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex-wrap h-auto gap-1 mb-6">
                  {iconCategories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">
                      {cat === "all" ? "Todos" : cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {iconCategories.map((cat) => (
                  <TabsContent key={cat} value={cat}>
                    <IconGrid icons={iconLibrary} category={cat} />
                  </TabsContent>
                ))}
              </Tabs>
              
              <p className="text-sm text-muted-foreground mt-4">
                Clique em qualquer ícone para copiar o código JSX.
              </p>
            </section>

            {/* ====== BUTTONS ====== */}
            <section id="buttons" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Sistema de Botões</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Variantes</h3>
                  <div className="flex flex-wrap gap-4">
                    {buttonVariants.map((variant) => (
                      <div key={variant.name} className="text-center">
                        <Button variant={variant.name as any} className="mb-2">
                          {variant.label}
                        </Button>
                        <p className="text-xs text-muted-foreground">{variant.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tamanhos</h3>
                  <div className="flex flex-wrap items-end gap-4">
                    {buttonSizes.map((size) => (
                      <div key={size.name} className="text-center">
                        <Button size={size.name as any} className="mb-2">
                          {size.name === "icon" ? <Star className="h-4 w-4" /> : size.label}
                        </Button>
                        <p className="text-xs text-muted-foreground">{size.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Estados</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>Normal</Button>
                    <Button className="hover:scale-105">Hover</Button>
                    <Button disabled>Disabled</Button>
                    <Button>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* ====== COMPONENTS ====== */}
            <section id="components" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">7. Componentes UI</h2>
              </div>
              
              <p className="text-muted-foreground mb-8">
                Biblioteca completa de componentes reutilizáveis baseados em shadcn/ui + Radix UI.
                Todos os componentes são acessíveis, personalizáveis e seguem o design system.
              </p>
              
              {/* Cards */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">1</span>
                    Cards
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Default</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Container padrão com header e content.</p>
                      </CardContent>
                    </Card>
                    <Card className="border-accent">
                      <CardHeader>
                        <CardTitle className="text-accent">Card Accent</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Card com borda de destaque.</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted">
                      <CardHeader>
                        <CardTitle>Card Muted</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Card com fundo suave.</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">border-radius: 0.75rem (12px) | padding: 1.5rem | border: 1px solid hsl(var(--border))</code>
                  </div>
                </div>

                {/* Inputs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">2</span>
                    Inputs & Forms
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input Default</label>
                        <Input placeholder="Digite algo..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input Disabled</label>
                        <Input placeholder="Desabilitado" disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Input com Erro</label>
                        <Input placeholder="Erro" className="border-destructive focus-visible:ring-destructive" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Textarea</label>
                        <Textarea placeholder="Escreva uma mensagem..." rows={4} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">height: 2.5rem (40px) | border-radius: 0.5rem (8px) | padding: 0.75rem | focus-ring: 2px</code>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">3</span>
                    Badges
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-accent text-accent-foreground">Accent</Badge>
                    <Badge className="bg-coral text-white">Coral</Badge>
                    <Badge className="bg-yellow text-primary">Yellow</Badge>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-xs">border-radius: 9999px (full) | padding: 0.125rem 0.625rem | font-size: 0.75rem | font-weight: 600</code>
                  </div>
                </div>

                {/* Tabs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">4</span>
                    Tabs
                  </h3>
                  <Tabs defaultValue="tab1" className="w-full">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="tab1">Visão Geral</TabsTrigger>
                      <TabsTrigger value="tab2">Documentos</TabsTrigger>
                      <TabsTrigger value="tab3">Mensagens</TabsTrigger>
                      <TabsTrigger value="tab4" disabled>Desabilitado</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="p-4 border rounded-lg mt-2">
                      <p className="text-sm text-muted-foreground">Conteúdo da tab Visão Geral</p>
                    </TabsContent>
                    <TabsContent value="tab2" className="p-4 border rounded-lg mt-2">
                      <p className="text-sm text-muted-foreground">Conteúdo da tab Documentos</p>
                    </TabsContent>
                    <TabsContent value="tab3" className="p-4 border rounded-lg mt-2">
                      <p className="text-sm text-muted-foreground">Conteúdo da tab Mensagens</p>
                    </TabsContent>
                  </Tabs>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">TabsList: bg-muted, rounded-lg | TabsTrigger: padding 0.375rem 0.75rem, active: bg-background shadow</code>
                  </div>
                </div>

                {/* Avatars */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">5</span>
                    Avatars
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">SM</div>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">MD</div>
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-medium">LG</div>
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-medium">XL</div>
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">JD</div>
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">AR</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-xs">Sizes: 32px, 40px, 48px, 64px | border-radius: 9999px (full) | font-weight: 500-700</code>
                  </div>
                </div>

                {/* Skeleton */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">6</span>
                    Skeleton Loading
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                      <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                    </div>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                          </div>
                        </div>
                        <div className="h-32 bg-muted animate-pulse rounded" />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite | background: hsl(var(--muted))</code>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">7</span>
                    Progress Bars
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso 25%</span>
                        <span className="text-muted-foreground">25%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso 60%</span>
                        <span className="text-muted-foreground">60%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso 100%</span>
                        <span className="text-muted-foreground">100%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">height: 8px, 12px | border-radius: 9999px | transition: width 0.3s ease</code>
                  </div>
                </div>

                {/* Alerts & Toasts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">8</span>
                    Alerts & Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                      <Info className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Informação</p>
                        <p className="text-sm text-muted-foreground">Mensagem informativa neutra.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm text-green-800 dark:text-green-200">Sucesso</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Operação concluída com sucesso.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">Aviso</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Atenção a este detalhe importante.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm text-red-800 dark:text-red-200">Erro</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Algo correu mal. Tente novamente.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">padding: 1rem | border-radius: 0.5rem | icon-size: 20px | Toast usa Sonner library</code>
                  </div>
                </div>

                {/* Tables */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">9</span>
                    Tables
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium">Nome</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Email</th>
                          <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                          <th className="text-right px-4 py-3 text-sm font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">João Silva</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">joao@email.com</td>
                          <td className="px-4 py-3"><Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Ativo</Badge></td>
                          <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></td>
                        </tr>
                        <tr className="border-t hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">Maria Santos</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">maria@email.com</td>
                          <td className="px-4 py-3"><Badge variant="outline">Pendente</Badge></td>
                          <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></td>
                        </tr>
                        <tr className="border-t hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">Pedro Costa</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">pedro@email.com</td>
                          <td className="px-4 py-3"><Badge variant="destructive">Inativo</Badge></td>
                          <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">header: bg-muted, font-weight 500 | row-hover: bg-muted/50 | padding: 0.75rem 1rem</code>
                  </div>
                </div>

                {/* Dialogs & Modals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">10</span>
                    Dialogs & Modals
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Confirmar Ação</h4>
                          <p className="text-sm text-muted-foreground mt-1">Tem a certeza que deseja continuar? Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Cancelar</Button>
                          <Button size="sm">Confirmar</Button>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-destructive flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Eliminar Projecto
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">Esta ação é permanente e irá eliminar todos os dados associados.</p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">Cancelar</Button>
                          <Button variant="destructive" size="sm">Eliminar</Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">max-width: 425px (sm), 600px (md), 800px (lg) | padding: 1.5rem | backdrop: bg-black/80 | animation: scale-in 0.2s</code>
                  </div>
                </div>

                {/* Empty States */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">11</span>
                    Empty States
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-12 pb-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <FolderOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-semibold mb-2">Sem documentos</h4>
                        <p className="text-sm text-muted-foreground mb-4">Ainda não existem documentos nesta pasta.</p>
                        <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Adicionar Documento</Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-12 pb-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h4 className="font-semibold mb-2">Sem mensagens</h4>
                        <p className="text-sm text-muted-foreground mb-4">Inicie uma conversa com a equipa ARIFA.</p>
                        <Button variant="outline" size="sm"><Send className="h-4 w-4 mr-2" /> Nova Mensagem</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Component Specs Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">★</span>
                    Especificações Globais
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="text-left py-3 px-4 font-medium">Componente</th>
                          <th className="text-left py-3 px-4 font-medium">Border Radius</th>
                          <th className="text-left py-3 px-4 font-medium">Padding</th>
                          <th className="text-left py-3 px-4 font-medium">Shadow</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Card</td>
                          <td className="py-3 px-4"><code>0.75rem</code></td>
                          <td className="py-3 px-4"><code>1.5rem</code></td>
                          <td className="py-3 px-4"><code>sm</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Button</td>
                          <td className="py-3 px-4"><code>0.5rem</code></td>
                          <td className="py-3 px-4"><code>1rem 1.5rem</code></td>
                          <td className="py-3 px-4"><code>none</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Input</td>
                          <td className="py-3 px-4"><code>0.5rem</code></td>
                          <td className="py-3 px-4"><code>0.5rem 0.75rem</code></td>
                          <td className="py-3 px-4"><code>none</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Badge</td>
                          <td className="py-3 px-4"><code>9999px</code></td>
                          <td className="py-3 px-4"><code>0.125rem 0.625rem</code></td>
                          <td className="py-3 px-4"><code>none</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Dialog</td>
                          <td className="py-3 px-4"><code>0.75rem</code></td>
                          <td className="py-3 px-4"><code>1.5rem</code></td>
                          <td className="py-3 px-4"><code>xl</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Avatar</td>
                          <td className="py-3 px-4"><code>9999px</code></td>
                          <td className="py-3 px-4"><code>-</code></td>
                          <td className="py-3 px-4"><code>none</code></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium">Tooltip</td>
                          <td className="py-3 px-4"><code>0.375rem</code></td>
                          <td className="py-3 px-4"><code>0.5rem 0.75rem</code></td>
                          <td className="py-3 px-4"><code>md</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* ====== SPACING ====== */}
            <section id="spacing" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Grid className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">5. Espaçamento & Grid</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Escala de Espaçamento</h3>
                  <div className="space-y-3">
                    {spacingScale.map((space) => (
                      <div key={space.name} className="flex items-center gap-4">
                        <code className="w-12 text-sm font-mono">{space.name}</code>
                        <div 
                          className="bg-accent h-4 rounded"
                          style={{ width: space.value.split(' ')[0] }}
                        />
                        <span className="text-sm text-muted-foreground flex-1">{space.value}</span>
                        <span className="text-xs text-muted-foreground">{space.usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Breakpoints Responsivos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Breakpoint</th>
                          <th className="text-left py-2">Min-Width</th>
                          <th className="text-left py-2">Dispositivo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakpoints.map((bp) => (
                          <tr key={bp.name} className="border-b">
                            <td className="py-2"><code>{bp.name}</code></td>
                            <td className="py-2">{bp.value}</td>
                            <td className="py-2 text-muted-foreground">{bp.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Container & Grid</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">Container Principal</h4>
                        <code className="text-xs bg-muted p-2 rounded block mb-2">.container-arifa</code>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>max-width: 1280px</li>
                          <li>padding: 1rem (mobile) → 2rem (desktop)</li>
                          <li>margin: 0 auto</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">Grid System</h4>
                        <code className="text-xs bg-muted p-2 rounded block mb-2">grid-cols-1 → grid-cols-3</code>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>gap: 1rem (sm) → 2rem (lg)</li>
                          <li>Flexível: 1, 2, 3, 4 colunas</li>
                          <li>Responsivo por breakpoint</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* ====== NAVIGATION ====== */}
            <section id="navigation" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Menu className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">6. Padrões de Navegação</h2>
              </div>
              
              <div className="space-y-8">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Header Principal</h3>
                  <Card className="overflow-hidden">
                    <div className="bg-background border-b p-4 flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="font-bold text-xl">ARIFA</div>
                        <nav className="hidden md:flex gap-6 text-sm">
                          <span className="text-muted-foreground hover:text-foreground cursor-pointer">Privado</span>
                          <span className="text-muted-foreground hover:text-foreground cursor-pointer">Empresas</span>
                          <span className="text-muted-foreground hover:text-foreground cursor-pointer">Investidores</span>
                          <span className="text-foreground font-medium cursor-pointer">Portfólio</span>
                          <span className="text-muted-foreground hover:text-foreground cursor-pointer">Blog</span>
                        </nav>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon"><Sun className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Globe className="h-4 w-4" /></Button>
                        <Button size="sm">Contacto</Button>
                        <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium mb-2">Logo</h4>
                          <p className="text-muted-foreground">Font-weight: 700, Size: 1.25rem</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Links</h4>
                          <p className="text-muted-foreground">Gap: 1.5rem, Hover: foreground, Active: font-medium</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Height</h4>
                          <p className="text-muted-foreground">64px desktop, 56px mobile, sticky top-0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mobile Menu */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Menu Mobile</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="max-w-sm">
                      <CardContent className="pt-0 px-0">
                        <div className="bg-background border-b p-4 flex items-center justify-between">
                          <span className="font-bold">ARIFA</span>
                          <X className="h-5 w-5" />
                        </div>
                        <nav className="p-4 space-y-1">
                          <div className="p-3 rounded-lg hover:bg-muted flex items-center gap-3"><Home className="h-4 w-4" /> Homepage</div>
                          <div className="p-3 rounded-lg bg-muted flex items-center gap-3 font-medium"><FolderOpen className="h-4 w-4" /> Portfólio</div>
                          <div className="p-3 rounded-lg hover:bg-muted flex items-center gap-3"><FileText className="h-4 w-4" /> Blog</div>
                          <div className="p-3 rounded-lg hover:bg-muted flex items-center gap-3"><Mail className="h-4 w-4" /> Contacto</div>
                        </nav>
                      </CardContent>
                    </Card>
                    <div>
                      <h4 className="font-medium mb-2">Especificações</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• Slide-in da direita (slide-in-right)</li>
                        <li>• Overlay: bg-black/50</li>
                        <li>• Width: 80vw max 320px</li>
                        <li>• Item padding: 0.75rem</li>
                        <li>• Active: bg-muted, font-medium</li>
                        <li>• Focus trap enabled</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Breadcrumbs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Breadcrumbs</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer">Portfólio</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer">Residencial</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">Villa Cascais</span>
                      </div>
                      <code className="text-xs bg-muted p-2 rounded block">
                        Separator: ChevronRight 16px | Links: text-muted-foreground | Current: font-medium
                      </code>
                    </CardContent>
                  </Card>
                </div>

                {/* Footer */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Footer</h3>
                  <Card className="bg-primary text-primary-foreground">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div>
                          <h4 className="font-bold mb-3">ARIFA</h4>
                          <p className="text-sm opacity-80">Arquitectura & Design de excelência.</p>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Navegação</h5>
                          <ul className="text-sm opacity-80 space-y-1">
                            <li>Portfólio</li>
                            <li>Serviços</li>
                            <li>Blog</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Contacto</h5>
                          <ul className="text-sm opacity-80 space-y-1">
                            <li>info@arifa.pt</li>
                            <li>+351 XXX XXX XXX</li>
                            <li>Lisboa, Portugal</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Social</h5>
                          <div className="flex gap-3">
                            <Instagram className="h-5 w-5 opacity-80" />
                            <Linkedin className="h-5 w-5 opacity-80" />
                            <Facebook className="h-5 w-5 opacity-80" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">Background: hsl(var(--primary)) | Text opacity: 80% | Padding: 3rem 2rem | Grid: 4 cols desktop, 1 col mobile</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Insert 7. Componentes UI section here - already exists */}

            {/* ====== ANIMATIONS ====== */}
            <section id="animations" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">8. Animações & Motion</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {animations.map((anim) => (
                  <Card key={anim.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 bg-accent rounded-lg animate-${anim.name}`} />
                        <div>
                          <code className="font-semibold">{anim.name}</code>
                          <p className="text-xs text-muted-foreground">{anim.duration} • {anim.easing}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{anim.usage}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* ====== RESPONSIVE ====== */}
            <section id="responsive" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">9. Responsividade</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Breakpoints</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {breakpoints.map((bp) => (
                      <Card key={bp.name}>
                        <CardContent className="pt-4 text-center">
                          <code className="text-lg font-bold">{bp.name}</code>
                          <p className="text-sm text-muted-foreground mt-1">{bp.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{bp.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preview Responsivo</h3>
                  <ResponsivePreview />
                </div>
              </div>
            </section>

            {/* ====== ARCHITECTURE ====== */}
            <section id="architecture" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Map className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">11. Arquitectura de Informação</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Site Público
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Home className="h-4 w-4" /> Homepage</li>
                      <li className="flex items-center gap-2"><Users2 className="h-4 w-4" /> Privado</li>
                      <li className="flex items-center gap-2"><Building className="h-4 w-4" /> Empresas</li>
                      <li className="flex items-center gap-2"><Landmark className="h-4 w-4" /> Investidores</li>
                      <li className="flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Portfólio</li>
                      <li className="flex items-center gap-2"><FileText className="h-4 w-4" /> Blog</li>
                      <li className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Serviços</li>
                      <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> Contacto</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Portal Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</li>
                      <li className="flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Projectos</li>
                      <li className="flex items-center gap-2"><FileText className="h-4 w-4" /> Documentos</li>
                      <li className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Mensagens</li>
                      <li className="flex items-center gap-2"><FileCheck className="h-4 w-4" /> Orçamentos</li>
                      <li className="flex items-center gap-2"><Settings className="h-4 w-4" /> Definições</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Admin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Dashboard KPIs</li>
                      <li className="flex items-center gap-2"><Target className="h-4 w-4" /> Leads (Kanban)</li>
                      <li className="flex items-center gap-2"><Users className="h-4 w-4" /> Clientes</li>
                      <li className="flex items-center gap-2"><FolderOpen className="h-4 w-4" /> Projectos</li>
                      <li className="flex items-center gap-2"><FileText className="h-4 w-4" /> Blog Posts</li>
                      <li className="flex items-center gap-2"><FileCheck className="h-4 w-4" /> Orçamentos</li>
                      <li className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Mensagens</li>
                      <li className="flex items-center gap-2"><Activity className="h-4 w-4" /> Audit Logs</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ====== USER JOURNEYS ====== */}
            <section id="journeys" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">12. User Journeys</h2>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      Visitante Público
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <Badge variant="outline">Homepage</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Segmento</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Portfólio</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Projecto</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Contacto</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge className="bg-green-500">Lead Capturado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Objectivo:</strong> Converter visitante em lead qualificado através de conteúdo inspirador e CTAs estratégicos.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-500" />
                      Cliente Registado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <Badge variant="outline">Login</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Dashboard</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Projecto</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Timeline</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Documentos</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge className="bg-purple-500">Aprovar Milestone</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Objectivo:</strong> Acompanhar progresso do projecto, comunicar com equipa, e aprovar entregas.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Administrador
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <Badge variant="outline">Login</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Dashboard KPIs</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Leads Kanban</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Qualificar Lead</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Criar Orçamento</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Badge className="bg-red-500">Converter Cliente</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Objectivo:</strong> Gerir pipeline comercial, converter leads em clientes, e monitorizar KPIs do negócio.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ====== ACCESSIBILITY ====== */}
            <section id="accessibility" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Accessibility className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">16. Acessibilidade (WCAG 2.2)</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contraste de Cores</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded">
                      <span>Primary / Primary Foreground</span>
                      <Badge className="bg-green-500">AAA</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background text-foreground rounded border">
                      <span>Background / Foreground</span>
                      <Badge className="bg-green-500">AAA</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted text-muted-foreground rounded">
                      <span>Muted / Muted Foreground</span>
                      <Badge className="bg-yellow-500">AA</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Touch Targets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent rounded flex items-center justify-center text-xs">48×48</div>
                      <span className="text-sm">Mínimo recomendado para touch</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-muted rounded flex items-center justify-center text-xs">44×44</div>
                      <span className="text-sm">Mínimo WCAG (Level AAA)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Todos os botões e links interactivos respeitam o tamanho mínimo de 44×44px.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Focus States</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        Tab para focar
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Todos os elementos interactivos têm estados de focus visíveis com ring de 2px.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Screen Reader</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Skip to main content link
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        ARIA labels em todos os ícones
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Hierarquia de headings correcta
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Alt text em todas as imagens
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Focus trap em modais
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ====== DARK MODE ====== */}
            <section id="darkmode" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Moon className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">10. Dark Mode</h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                O sistema suporta dark mode completo através de variáveis CSS e next-themes. A transição é suave e respeita as preferências do sistema.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="bg-white text-gray-900 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      Light Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white text-gray-900 rounded-b-lg pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(0,0%,100%)] border" />
                      <span className="text-sm">Background: hsl(0 0% 100%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(0,0%,5%)]" />
                      <span className="text-sm">Foreground: hsl(0 0% 5%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(0,0%,8%)]" />
                      <span className="text-sm">Primary: hsl(0 0% 8%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(45,100%,51%)]" />
                      <span className="text-sm">Accent: hsl(45 100% 51%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(60,5%,96%)] border" />
                      <span className="text-sm">Muted: hsl(60 5% 96%)</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-[hsl(240,10%,4%)] text-gray-100 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      Dark Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-[hsl(240,10%,4%)] text-gray-100 rounded-b-lg pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(240,10%,4%)] border border-gray-700" />
                      <span className="text-sm">Background: hsl(240 10% 4%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(0,0%,95%)]" />
                      <span className="text-sm">Foreground: hsl(0 0% 95%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(0,0%,98%)]" />
                      <span className="text-sm">Primary: hsl(0 0% 98%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(45,100%,51%)]" />
                      <span className="text-sm">Accent: hsl(45 100% 51%)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[hsl(240,5%,16%)] border border-gray-700" />
                      <span className="text-sm">Muted: hsl(240 5% 16%)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Implementação</h4>
                <code className="text-xs block">
                  next-themes provider | class="dark" no &lt;html&gt; | Variáveis CSS :root e .dark | Transição: transition-colors 0.3s
                </code>
              </div>
            </section>

            {/* ====== FEATURES ====== */}
            <section id="features" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <LayoutDashboard className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">13. Funcionalidades por Perfil</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-3 font-medium border-b">Funcionalidade</th>
                      <th className="text-center p-3 font-medium border-b">Visitante</th>
                      <th className="text-center p-3 font-medium border-b">Cliente</th>
                      <th className="text-center p-3 font-medium border-b">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3 font-medium" colSpan={4}>📱 Site Público</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Homepage</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Portfólio</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Blog</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Enviar Contacto (Lead)</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Subscrever Newsletter</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    
                    <tr className="border-b"><td className="p-3 font-medium" colSpan={4}>👤 Portal Cliente</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Dashboard</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Projectos Próprios</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Timeline & Milestones</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver/Download Documentos</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Enviar Mensagens</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Orçamentos</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Assinar Contratos</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">❌</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver AI Weekly Updates</td><td className="text-center">❌</td><td className="text-center">✅</td><td className="text-center">✅</td></tr>
                    
                    <tr className="border-b"><td className="p-3 font-medium" colSpan={4}>🛡️ Admin</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Dashboard KPIs</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Gerir Leads (Kanban)</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Gerir Clientes</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Gerir Projectos</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Criar/Editar Blog Posts</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Criar Orçamentos</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Enviar Convites</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Ver Audit Logs</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                    <tr className="border-b hover:bg-muted/50"><td className="p-3">Upload Documentos</td><td className="text-center">❌</td><td className="text-center">❌</td><td className="text-center">✅</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ====== BRAND & TONE ====== */}
            <section id="brand" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">14. Marca & Tone of Voice</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalidade da Marca</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent text-accent-foreground">Premium</Badge>
                      <span className="text-sm">Excelência, qualidade, atenção ao detalhe</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Confiável</Badge>
                      <span className="text-sm">Transparência, profissionalismo, expertise</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Inovador</Badge>
                      <span className="text-sm">Tecnologia, modernidade, visão de futuro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Personalizado</Badge>
                      <span className="text-sm">Soluções à medida, relacionamento próximo</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tom de Comunicação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">✅ Usar</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Linguagem clara e directa</li>
                        <li>• Terminologia técnica quando relevante</li>
                        <li>• Tom confiante mas não arrogante</li>
                        <li>• Foco nos benefícios para o cliente</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">❌ Evitar</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Jargão desnecessário</li>
                        <li>• Promessas vagas ou exageradas</li>
                        <li>• Tom informal demais</li>
                        <li>• Linguagem negativa ou comparativa</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Exemplos de Copywriting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-green-600">✅ Bom</h4>
                        <div className="space-y-3 text-sm">
                          <p className="p-3 bg-muted rounded">"Transformamos visões em espaços extraordinários."</p>
                          <p className="p-3 bg-muted rounded">"Cada projecto é único. Tal como os nossos clientes."</p>
                          <p className="p-3 bg-muted rounded">"Acompanhe o progresso do seu projecto em tempo real."</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-600">❌ Mau</h4>
                        <div className="space-y-3 text-sm">
                          <p className="p-3 bg-muted rounded line-through">"Somos os melhores arquitectos do mercado!"</p>
                          <p className="p-3 bg-muted rounded line-through">"Casas fixes a preços imbatíveis!"</p>
                          <p className="p-3 bg-muted rounded line-through">"Não perca esta oportunidade única!"</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ====== IMAGERY & LOGO ====== */}
            <section id="imagery" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Image className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">15. Imagens & Logo</h2>
              </div>
              
              <div className="space-y-8">
                {/* Logo */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Logo</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6 flex flex-col items-center">
                        <div className="bg-background border rounded-lg p-8 mb-4 w-full flex items-center justify-center">
                          <span className="text-3xl font-bold tracking-tight">ARIFA</span>
                        </div>
                        <Badge>Logo Principal (Light)</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 flex flex-col items-center">
                        <div className="bg-primary rounded-lg p-8 mb-4 w-full flex items-center justify-center">
                          <span className="text-3xl font-bold tracking-tight text-primary-foreground">ARIFA</span>
                        </div>
                        <Badge>Logo Principal (Dark)</Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 flex flex-col items-center">
                        <div className="bg-accent rounded-lg p-8 mb-4 w-full flex items-center justify-center">
                          <span className="text-3xl font-bold tracking-tight text-accent-foreground">A</span>
                        </div>
                        <Badge>Logo Mark</Badge>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <code className="text-xs">
                      Font: Inter Bold (700) | Tracking: -0.02em | Clear space: 1x altura do logo | Min size: 24px
                    </code>
                  </div>
                </div>
                
                {/* Photo Guidelines */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Estilo Fotográfico</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">✅ Recomendado</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <li>Luz natural, tons quentes</li>
                        <li>Arquitectura limpa, linhas definidas</li>
                        <li>Perspectivas dramáticas</li>
                        <li>Detalhes de materiais nobres</li>
                        <li>Espaços habitados (com pessoas)</li>
                        <li>Ratio: 16:9 (hero), 4:3 (cards), 1:1 (thumbs)</li>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">❌ Evitar</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <li>Filtros excessivos ou saturação</li>
                        <li>Fotos stock genéricas</li>
                        <li>Iluminação artificial dura</li>
                        <li>Distorção de lentes</li>
                        <li>Renders hiper-realistas sem identificação</li>
                        <li>Imagens de baixa resolução (&lt;1920px)</li>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Image Treatments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tratamentos de Imagem</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="aspect-video bg-gradient-to-b from-black/0 to-black/60 rounded-lg mb-2" />
                      <span className="text-sm">Gradient Overlay</span>
                    </div>
                    <div className="text-center">
                      <div className="aspect-video bg-muted rounded-lg mb-2 flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-background rounded shadow-lg" />
                      </div>
                      <span className="text-sm">Card com Sombra</span>
                    </div>
                    <div className="text-center">
                      <div className="aspect-video bg-muted rounded-lg mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-accent/20" />
                      </div>
                      <span className="text-sm">Accent Tint</span>
                    </div>
                    <div className="text-center">
                      <div className="aspect-video bg-muted rounded-lg mb-2 grayscale" />
                      <span className="text-sm">B&W (hover)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ====== ASSETS ====== */}
            <section id="assets" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Download className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">17. Assets Exportáveis</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Image className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Logo Pack</h4>
                        <p className="text-sm text-muted-foreground">SVG, PNG (1x, 2x, 3x)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Palette className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Color Tokens</h4>
                        <p className="text-sm text-muted-foreground">CSS, JSON</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadFile(generateJSONTokens(), 'arifa-tokens.json', 'application/json')}>
                        <FileJson className="h-4 w-4 mr-2" /> JSON
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => downloadFile(generateCSSTokens(), 'arifa-tokens.css', 'text/css')}>
                        <FileCode className="h-4 w-4 mr-2" /> CSS
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <LayoutGrid className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Icon Set</h4>
                        <p className="text-sm text-muted-foreground">90+ Lucide Icons SVG</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Type className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Typography</h4>
                        <p className="text-sm text-muted-foreground">Inter Font Family</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('https://fonts.google.com/specimen/Inter', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Google Fonts
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Layers className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">UI Components</h4>
                        <p className="text-sm text-muted-foreground">shadcn/ui + Custom</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('https://ui.shadcn.com', '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" /> shadcn/ui
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">Este Relatório</h4>
                        <p className="text-sm text-muted-foreground">PDF Print-Ready</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                      <Printer className="h-4 w-4 mr-2" /> Exportar PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 p-6 border-2 border-dashed rounded-lg text-center">
                <h4 className="font-medium mb-2">Precisa de Assets Adicionais?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Entre em contacto para obter ficheiros fonte, templates Figma, ou outros materiais.
                </p>
                <Button variant="accent">
                  <Mail className="h-4 w-4 mr-2" /> Contactar Equipa
                </Button>
              </div>
            </section>

            {/* ====== FOOTER ====== */}
            <footer className="border-t pt-8 mt-16 print:mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">ARIFA Design System</h3>
                  <p className="text-sm text-muted-foreground">
                    Gerado em {new Date().toLocaleDateString('pt-PT')} • v1.0
                  </p>
                </div>
                <div className="flex gap-4 print:hidden">
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
      
      {/* Print styles */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:static { position: static !important; }
          .print\\:border-0 { border: 0 !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:mt-8 { margin-top: 2rem !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
