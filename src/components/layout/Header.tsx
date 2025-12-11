import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Shield, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import arifaLogo from "@/assets/arifa-logo.png";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(data === true);
    };
    checkAdminRole();
  }, [user]);

  // Fetch unread messages count
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      const isAdminUser = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      
      let query = supabase
        .from("client_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);

      // Admins see all unread, clients see their own
      if (!isAdminUser.data) {
        query = query.eq("client_id", user.id);
      }

      const { count } = await query;
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Realtime subscription for new messages
    const channel = supabase
      .channel("header-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_messages",
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/servicos" },
    { name: t("nav.private"), href: "/privado" },
    { name: t("nav.companies"), href: "/empresas" },
    { name: t("nav.investors"), href: "/investidores" },
    { name: t("nav.portfolio"), href: "/portfolio" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.contact"), href: "/contacto" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container-arifa flex items-center justify-between py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ARIFA Studio</span>
            <img className="h-10 w-auto" src={arifaLogo} alt="ARIFA Studio" />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">{t("nav.openMenu")}</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors link-underline",
                location.pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
          <ThemeToggle />
          <LanguageSelector />
          
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild className="gap-2 relative">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    Admin
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild className="gap-2 relative">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Área Cliente
                  {!isAdmin && unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                {t("nav.login")}
              </Link>
            </Button>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/contacto">{t("nav.quote")}</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">ARIFA Studio</span>
              <img className="h-10 w-auto" src={arifaLogo} alt="ARIFA Studio" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">{t("nav.closeMenu")}</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "-mx-3 block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                      location.pathname === item.href
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-3">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Idioma</span>
                  <LanguageSelector />
                </div>
                
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="default" className="w-full relative" asChild>
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                          {unreadCount > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full relative" asChild>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Área Cliente
                        {!isAdmin && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      {t("nav.login")}
                    </Link>
                  </Button>
                )}
                
                <Button className="w-full" asChild>
                  <Link to="/contacto" onClick={() => setMobileMenuOpen(false)}>
                    {t("nav.quote")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
