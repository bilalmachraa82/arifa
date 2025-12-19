import { useState } from "react";
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
  Copy as CopyIcon, Clipboard, ClipboardCheck, Save, Undo, Redo
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
// COMPONENTS
// ============================================

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

const SectionNav = ({ sections }: { sections: { id: string; label: string; icon: React.ElementType }[] }) => (
  <nav className="sticky top-4 hidden lg:block">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Navegação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
          >
            <section.icon className="h-4 w-4" />
            {section.label}
          </a>
        ))}
      </CardContent>
    </Card>
  </nav>
);

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
  
  const sections = [
    { id: "colors", label: "Paleta de Cores", icon: Palette },
    { id: "typography", label: "Tipografia", icon: Type },
    { id: "icons", label: "Ícones", icon: LayoutGrid },
    { id: "buttons", label: "Botões", icon: Zap },
    { id: "components", label: "Componentes", icon: Layers },
    { id: "spacing", label: "Espaçamento", icon: Grid },
    { id: "animations", label: "Animações", icon: Zap },
    { id: "architecture", label: "Arquitectura", icon: Map },
    { id: "journeys", label: "User Journeys", icon: Users },
    { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
  ];
  
  const iconCategories = ["all", ...new Set(iconLibrary.map(i => i.category))];

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b print:static print:border-0">
        <div className="container-arifa py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ARIFA Design System</h1>
            <p className="text-sm text-muted-foreground">Relatório Completo para Rebrand</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </header>

      <div className="container-arifa py-8">
        <div className="flex gap-8">
          {/* Side Navigation */}
          <aside className="w-64 shrink-0 print:hidden">
            <SectionNav sections={sections} />
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
                <h2 className="text-2xl font-bold">Componentes UI</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Container principal para conteúdo agrupado.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      border-radius: 0.75rem (12px)
                    </code>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Input</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Placeholder text" />
                    <Textarea placeholder="Multi-line input" />
                    <code className="text-xs bg-muted p-2 rounded block">
                      border-radius: 0.5rem (8px)
                    </code>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tabs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="tab1">
                      <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* ====== SPACING ====== */}
            <section id="spacing" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Grid className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Espaçamento & Grid</h2>
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
              </div>
            </section>

            {/* ====== ANIMATIONS ====== */}
            <section id="animations" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Animações</h2>
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

            {/* ====== ARCHITECTURE ====== */}
            <section id="architecture" className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-6">
                <Map className="h-6 w-6 text-accent" />
                <h2 className="text-2xl font-bold">Arquitectura de Informação</h2>
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
                <h2 className="text-2xl font-bold">User Journeys</h2>
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
                <h2 className="text-2xl font-bold">Acessibilidade (WCAG 2.2)</h2>
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
    </div>
  );
}
