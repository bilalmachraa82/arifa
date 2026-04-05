import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, FolderOpen, FileText, MessageSquare, Users, Mail, LayoutDashboard, History, Target, Receipt, Camera, Wallet, FileSignature } from "lucide-react";
import AdminProjects from "@/components/admin/AdminProjects";
import AdminBlogPosts from "@/components/admin/AdminBlogPosts";
import AdminDocuments from "@/components/admin/AdminDocuments";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminLeads from "@/components/admin/AdminLeads";
import AdminClients from "@/components/admin/AdminClients";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import AdminAuditLogs from "@/components/admin/AdminAuditLogs";
import AdminMilestones from "@/components/admin/AdminMilestones";
import AdminQuotes from "@/components/admin/AdminQuotes";
import AdminProjectPhotos from "@/components/admin/AdminProjectPhotos";
import AdminBudget from "@/components/admin/AdminBudget";
import AdminDashboardKPIs from "@/components/admin/AdminDashboardKPIs";
import { AdminContracts } from "@/components/admin/AdminContracts";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .rpc("has_role", { _user_id: user.id, _role: "admin" });

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
      setCheckingRole(false);
    };

    if (user) {
      checkAdminRole();
    }
  }, [user]);

  if (authLoading || checkingRole) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("admin.restricted")}</h1>
          <p className="text-muted-foreground">
            {t("admin.restrictedDesc")}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">{t("admin.title")}</h1>
              <p className="text-muted-foreground text-sm">
                {t("admin.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              {t("admin.tabs.dashboard")}
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              {t("admin.tabs.projects")}
            </TabsTrigger>
            <TabsTrigger value="milestones" className="gap-2">
              <Target className="h-4 w-4" />
              {t("admin.tabs.milestones")}
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="h-4 w-4" />
              {t("admin.tabs.blog")}
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              {t("admin.tabs.documents")}
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("admin.tabs.messages")}
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Mail className="h-4 w-4" />
              {t("admin.tabs.leads")}
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2">
              <Users className="h-4 w-4" />
              {t("admin.tabs.clients")}
            </TabsTrigger>
            <TabsTrigger value="quotes" className="gap-2">
              <Receipt className="h-4 w-4" />
              {t("admin.tabs.quotes")}
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2">
              <FileSignature className="h-4 w-4" />
              {t("admin.tabs.contracts")}
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-2">
              <Camera className="h-4 w-4" />
              {t("admin.tabs.photos")}
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <Wallet className="h-4 w-4" />
              {t("admin.tabs.budget")}
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <History className="h-4 w-4" />
              {t("admin.tabs.audit")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboardKPIs />
            <div className="mt-6">
              <AdminDashboardOverview />
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <AdminProjects />
          </TabsContent>

          <TabsContent value="milestones">
            <AdminMilestones />
          </TabsContent>

          <TabsContent value="blog">
            <AdminBlogPosts />
          </TabsContent>

          <TabsContent value="documents">
            <AdminDocuments />
          </TabsContent>

          <TabsContent value="messages">
            <AdminMessages />
          </TabsContent>

          <TabsContent value="leads">
            <AdminLeads />
          </TabsContent>

          <TabsContent value="clients">
            <AdminClients />
          </TabsContent>

          <TabsContent value="quotes">
            <AdminQuotes />
          </TabsContent>

          <TabsContent value="contracts">
            <AdminContracts />
          </TabsContent>

          <TabsContent value="photos">
            <AdminProjectPhotos />
          </TabsContent>

          <TabsContent value="budget">
            <AdminBudget />
          </TabsContent>

          <TabsContent value="audit">
            <AdminAuditLogs />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
