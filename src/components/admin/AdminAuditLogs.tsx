import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface AuditLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  table_name: string;
  record_id: string | null;
  action: "INSERT" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changed_fields: string[] | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const PAGE_SIZE = 20;

const actionLabels: Record<string, { label: string; color: string }> = {
  INSERT: { label: "Criação", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  UPDATE: { label: "Atualização", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  DELETE: { label: "Eliminação", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  LOGIN: { label: "Login", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  LOGOUT: { label: "Logout", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
};

const tableLabels: Record<string, string> = {
  profiles: "Perfis",
  leads: "Leads",
  client_messages: "Mensagens",
  client_documents: "Documentos",
  projects: "Projetos",
  blog_posts: "Blog",
  user_roles: "Roles",
  document_versions: "Versões Doc.",
  client_invitations: "Convites",
  auth: "Autenticação",
};

const ActionIcon = ({ action }: { action: string }) => {
  switch (action) {
    case "INSERT":
      return <Plus className="h-4 w-4" />;
    case "UPDATE":
      return <Pencil className="h-4 w-4" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4" />;
    case "LOGIN":
      return <LogIn className="h-4 w-4" />;
    case "LOGOUT":
      return <LogOut className="h-4 w-4" />;
    default:
      return <History className="h-4 w-4" />;
  }
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Filters
  const [searchEmail, setSearchEmail] = useState("");
  const [filterTable, setFilterTable] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");

  useEffect(() => {
    fetchLogs();
  }, [page, filterTable, filterAction, filterDate]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("audit_logs")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      // Apply filters
      if (filterTable !== "all") {
        query = query.eq("table_name", filterTable);
      }

      if (filterAction !== "all") {
        query = query.eq("action", filterAction as "INSERT" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT");
      }

      if (filterDate !== "all") {
        const now = new Date();
        let startDate: Date;

        switch (filterDate) {
          case "today":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = new Date(0);
        }

        query = query.gte("created_at", startDate.toISOString());
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setLogs((data as AuditLog[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchEmail.trim()) {
      fetchLogs();
      return;
    }

    const filteredLogs = logs.filter(
      (log) =>
        log.user_email?.toLowerCase().includes(searchEmail.toLowerCase())
    );
    setLogs(filteredLogs);
  };

  const exportCSV = () => {
    const headers = [
      "Data/Hora",
      "Utilizador",
      "Tabela",
      "Ação",
      "ID Registo",
      "Campos Alterados",
    ];

    const rows = logs.map((log) => [
      format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
      log.user_email || "Sistema",
      tableLabels[log.table_name] || log.table_name,
      actionLabels[log.action]?.label || log.action,
      log.record_id || "-",
      log.changed_fields?.join(", ") || "-",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `auditoria_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: pt });
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const renderDiffValue = (value: unknown): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  if (loading && logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Auditoria de Sistema</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {totalCount} registos • Conformidade RGPD
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={filterTable} onValueChange={setFilterTable}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Tabelas</SelectItem>
                {Object.entries(tableLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                {Object.entries(actionLabels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo o Período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Data/Hora</TableHead>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Tabela</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Nenhum registo de auditoria encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {log.user_email || (
                            <span className="text-muted-foreground italic">
                              Sistema
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {tableLabels[log.table_name] || log.table_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${actionLabels[log.action]?.color || ""}`}
                        >
                          <ActionIcon action={log.action} />
                          {actionLabels[log.action]?.label || log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.changed_fields && log.changed_fields.length > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            {log.changed_fields.slice(0, 3).join(", ")}
                            {log.changed_fields.length > 3 && " ..."}
                          </span>
                        ) : log.action === "INSERT" ? (
                          <span className="text-sm text-muted-foreground">
                            Novo registo
                          </span>
                        ) : log.action === "DELETE" ? (
                          <span className="text-sm text-muted-foreground">
                            Registo eliminado
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {page + 1} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Detalhes do Registo de Auditoria
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Data/Hora
                    </p>
                    <p className="font-mono">
                      {formatDate(selectedLog.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Utilizador
                    </p>
                    <p>{selectedLog.user_email || "Sistema"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tabela
                    </p>
                    <Badge variant="outline">
                      {tableLabels[selectedLog.table_name] || selectedLog.table_name}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ação
                    </p>
                    <Badge
                      variant="outline"
                      className={`gap-1 ${actionLabels[selectedLog.action]?.color || ""}`}
                    >
                      <ActionIcon action={selectedLog.action} />
                      {actionLabels[selectedLog.action]?.label || selectedLog.action}
                    </Badge>
                  </div>
                  {selectedLog.record_id && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        ID do Registo
                      </p>
                      <p className="font-mono text-sm break-all">
                        {selectedLog.record_id}
                      </p>
                    </div>
                  )}
                </div>

                {/* Changed Fields */}
                {selectedLog.changed_fields &&
                  selectedLog.changed_fields.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Campos Alterados
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLog.changed_fields.map((field) => (
                          <Badge key={field} variant="secondary">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Diff View for Updates */}
                {selectedLog.action === "UPDATE" &&
                  selectedLog.old_values &&
                  selectedLog.new_values &&
                  selectedLog.changed_fields && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Alterações
                      </p>
                      <div className="space-y-3">
                        {selectedLog.changed_fields.map((field) => (
                          <div
                            key={field}
                            className="rounded-lg border p-3 space-y-2"
                          >
                            <p className="font-medium text-sm">{field}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="bg-red-500/5 rounded p-2 border border-red-500/20">
                                <p className="text-xs text-red-600 mb-1">
                                  Anterior
                                </p>
                                <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                  {renderDiffValue(
                                    selectedLog.old_values?.[field]
                                  )}
                                </pre>
                              </div>
                              <div className="bg-green-500/5 rounded p-2 border border-green-500/20">
                                <p className="text-xs text-green-600 mb-1">
                                  Novo
                                </p>
                                <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                                  {renderDiffValue(
                                    selectedLog.new_values?.[field]
                                  )}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Full Data View for Insert/Delete */}
                {(selectedLog.action === "INSERT" ||
                  selectedLog.action === "DELETE") && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {selectedLog.action === "INSERT"
                        ? "Dados Inseridos"
                        : "Dados Eliminados"}
                    </p>
                    <pre className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all">
                      {JSON.stringify(
                        selectedLog.action === "INSERT"
                          ? selectedLog.new_values
                          : selectedLog.old_values,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminAuditLogs;
