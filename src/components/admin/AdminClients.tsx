import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, UserPlus, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  created_at: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface Project {
  id: string;
  title: string;
  client_id: string | null;
}

const AdminClients = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [profilesRes, rolesRes, projectsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("projects").select("id, title, client_id"),
    ]);

    setProfiles(profilesRes.data || []);
    setUserRoles(rolesRes.data || []);
    setProjects(projectsRes.data || []);
    setLoading(false);
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || "client";
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter(p => p.client_id === clientId);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-PT");
  };

  const handleAssignProject = async () => {
    if (!selectedProfile || !selectedProjectId) return;

    const { error } = await supabase
      .from("projects")
      .update({ client_id: selectedProfile.id })
      .eq("id", selectedProjectId);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Projeto atribuído",
        description: "O projeto foi atribuído ao cliente.",
      });
      setAssignDialogOpen(false);
      setSelectedProjectId("");
      fetchData();
    }
  };

  const handleRemoveProjectAssignment = async (projectId: string) => {
    const { error } = await supabase
      .from("projects")
      .update({ client_id: null })
      .eq("id", projectId);

    if (!error) {
      fetchData();
    }
  };

  const unassignedProjects = projects.filter(p => !p.client_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes / Utilizadores</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum utilizador registado.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Clients List */}
            <div className="lg:col-span-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Projetos</TableHead>
                    <TableHead>Registado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow 
                      key={profile.id}
                      className={`cursor-pointer ${selectedProfile?.id === profile.id ? "bg-muted" : ""}`}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getUserRole(profile.id) === "admin" ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          {profile.full_name || "Sem nome"}
                        </div>
                      </TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={getUserRole(profile.id) === "admin" ? "default" : "outline"}>
                          {getUserRole(profile.id) === "admin" ? "Admin" : "Cliente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getClientProjects(profile.id).length}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(profile.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Client Detail */}
            <div className="lg:col-span-1">
              {selectedProfile ? (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                      {getUserRole(selectedProfile.id) === "admin" ? (
                        <Shield className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-lg">
                        {selectedProfile.full_name || "Sem nome"}
                      </CardTitle>
                    </div>
                    <Badge variant={getUserRole(selectedProfile.id) === "admin" ? "default" : "outline"}>
                      {getUserRole(selectedProfile.id) === "admin" ? "Administrador" : "Cliente"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p>{selectedProfile.email}</p>
                      </div>
                      {selectedProfile.phone && (
                        <div>
                          <span className="text-muted-foreground">Telefone:</span>
                          <p>{selectedProfile.phone}</p>
                        </div>
                      )}
                      {selectedProfile.company && (
                        <div>
                          <span className="text-muted-foreground">Empresa:</span>
                          <p>{selectedProfile.company}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Registado em:</span>
                        <p>{formatDate(selectedProfile.created_at)}</p>
                      </div>
                    </div>

                    {getUserRole(selectedProfile.id) !== "admin" && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">Projetos atribuídos:</p>
                            {unassignedProjects.length > 0 && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setAssignDialogOpen(true)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Atribuir
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {getClientProjects(selectedProfile.id).length === 0 ? (
                              <p className="text-sm text-muted-foreground">Nenhum projeto atribuído</p>
                            ) : (
                              getClientProjects(selectedProfile.id).map((project) => (
                                <div 
                                  key={project.id}
                                  className="flex items-center justify-between bg-muted p-2 rounded text-sm"
                                >
                                  <span>{project.title}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveProjectAssignment(project.id)}
                                  >
                                    Remover
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Selecione um utilizador para ver os detalhes
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Assign Project Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Atribuir Projeto a {selectedProfile?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAssignProject} disabled={!selectedProjectId}>
                  Atribuir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminClients;
