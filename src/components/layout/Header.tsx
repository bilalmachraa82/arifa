import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, LayoutDashboard, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import arifaLogo from "@/assets/arifa-logo.png";
import { cn } from "@/lib/utils";

// Brand Book: route-based accent colors
const getActiveColor = (pathname: string): string => {
  if (pathname === "/privado") return "bg-arifa-coral";
  if (pathname === "/empresas") return "bg-arifa-yellow";
  if (pathname === "/investidores") return "bg-arifa-blue";
  return "bg-arifa-blue";
};

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

      if (!isAdminUser.data) {
        query = query.eq("client_id", user.id);
      }

      const { count } = await query;
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

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
    { name: t("nav.aboutUs"), href: "/quem-somos" },
    { name: t("nav.private"), href: "/privado" },
    { name: t("nav.companies"), href: "/empresas" },
    { name: t("nav.investors"), href: "/investidores" },
    { name: t("nav.portfolio"), href: "/portfolio" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.insights"), href: "/insights" },
    { name: t("nav.contact"), href: "/contacto" },
  ];

  const activeColor = getActiveColor(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container-arifa flex items-center justify-between py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">ARIFA Studio</span>
            <img className="h-10 w-auto dark:brightness-0 dark:invert" src={arifaLogo} alt="ARIFA Studio" />
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
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative py-2 text-sm font-light tracking-wide transition-colors duration-300",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <span 
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-0.5 animate-nav-indicator",
                      activeColor
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3">
          <ThemeToggle />
          <LanguageSelector />
          
          {user ? (
            <>
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild className="gap-2 relative" aria-label={t("nav.adminPanel")}>
                  <Link to="/admin">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    Admin
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs" aria-label={`${unreadCount} ${t("nav.unreadMessages")}`}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild className="gap-2 relative" aria-label={t("nav.clientArea")}>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  {t("nav.clientArea")}
                  {!isAdmin && unreadCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs" aria-label={`${unreadCount} ${t("nav.unreadMessages")}`}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label={t("nav.accountSettings")}>
                <Link to="/dashboard/settings">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-2" aria-label={t("nav.signOut")}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" asChild className="gap-2" aria-label={t("nav.signIn")}>
              <Link to="/auth">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                {t("nav.login")}
              </Link>
            </Button>
          )}
          
          <Button variant="outline" size="sm" asChild aria-label={t("nav.getQuote")}>
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
              <img className="h-10 w-auto dark:brightness-0 dark:invert" src={arifaLogo} alt="ARIFA Studio" />
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
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-light transition-colors relative",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                      {isActive && (
                        <span 
                          className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r",
                            activeColor
                          )}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="py-6 space-y-3">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">{t("nav.theme")}</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">{t("nav.language")}</span>
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
                        {t("nav.clientArea")}
                        {!isAdmin && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-2 h-5 min-w-5 px-1 text-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/dashboard/settings" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        {t("nav.settings")}
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
                      {t("nav.logout")}
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
