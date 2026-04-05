import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Receipt, AlertCircle } from "lucide-react";

interface ClientOdooDataProps {
  projectId: string;
}

export function ClientOdooData({ projectId }: ClientOdooDataProps) {
  const { t } = useLanguage();

  const { data: contracts, isLoading: loadingContracts } = useQuery({
    queryKey: ["odoo-contracts", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("odoo_contracts")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery({
    queryKey: ["odoo-invoices", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("odoo_invoices")
        .select("*")
        .eq("project_id", projectId)
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "paid": case "in_payment": return "default";
      case "pending": return "secondary";
      case "overdue": return "destructive";
      default: return "outline";
    }
  };

  if (loadingContracts || loadingInvoices) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const hasData = (contracts && contracts.length > 0) || (invoices && invoices.length > 0);

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t("client.noOdooData")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("client.odooDataPending")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contracts */}
      {contracts && contracts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            {t("client.contracts")}
          </h3>
          <div className="space-y-3">
            {contracts.map((contract: any) => (
              <Card key={contract.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{contract.title}</p>
                      {contract.contract_number && (
                        <p className="text-sm text-muted-foreground">{contract.contract_number}</p>
                      )}
                      {contract.description && (
                        <p className="text-sm text-muted-foreground mt-1">{contract.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {new Intl.NumberFormat("pt-PT", { style: "currency", currency: contract.currency || "EUR" }).format(contract.total_amount || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            {t("client.invoices")}
          </h3>
          <div className="space-y-3">
            {invoices.map((invoice: any) => (
              <Card key={invoice.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {invoice.invoice_number || invoice.description || "Invoice"}
                      </p>
                      {invoice.issue_date && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(invoice.issue_date).toLocaleDateString("pt-PT")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColor(invoice.payment_status)}>
                        {invoice.payment_status}
                      </Badge>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {new Intl.NumberFormat("pt-PT", { style: "currency", currency: invoice.currency || "EUR" }).format(invoice.total_amount || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
