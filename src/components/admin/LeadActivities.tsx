import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  StickyNote,
  Calendar,
  MessageSquare,
  ArrowRight,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string | null;
  activity_type: "call" | "email" | "note" | "meeting" | "whatsapp" | "status_change";
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface LeadActivitiesProps {
  leadId: string;
  leadName: string;
}

const activityTypes = [
  { value: "call", label: "Chamada", icon: Phone, color: "bg-blue-500" },
  { value: "email", label: "Email", icon: Mail, color: "bg-green-500" },
  { value: "note", label: "Nota", icon: StickyNote, color: "bg-yellow-500" },
  { value: "meeting", label: "Reunião", icon: Calendar, color: "bg-purple-500" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "bg-emerald-500" },
  { value: "status_change", label: "Mudança de Estado", icon: ArrowRight, color: "bg-orange-500" },
];

const LeadActivities = ({ leadId, leadName }: LeadActivitiesProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [activityType, setActivityType] = useState<string>("note");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchActivities();
  }, [leadId]);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching activities:", error);
    } else {
      setActivities((data as LeadActivity[]) || []);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("lead_activities").insert([{
      lead_id: leadId,
      user_id: user?.id,
      activity_type: activityType as "call" | "email" | "note" | "meeting" | "whatsapp" | "status_change",
      title: title.trim(),
      description: description.trim() || null,
    }]);

    if (error) {
      console.error("Error creating activity:", error);
      toast({
        title: "Erro",
        description: "Não foi possível registar a atividade.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Atividade registada",
        description: "A atividade foi adicionada ao histórico do lead.",
      });
      setTitle("");
      setDescription("");
      setActivityType("note");
      setShowForm(false);
      fetchActivities();
    }

    setSaving(false);
  };

  const getActivityIcon = (type: string) => {
    const activityInfo = activityTypes.find((a) => a.value === type);
    if (!activityInfo) return null;
    const Icon = activityInfo.icon;
    return (
      <div className={`p-2 rounded-full ${activityInfo.color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    );
  };

  const getActivityLabel = (type: string) => {
    return activityTypes.find((a) => a.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Histórico de Interações</h4>
        <Button
          variant={showForm ? "ghost" : "outline"}
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Nova Atividade
            </>
          )}
        </Button>
      </div>

      {/* Activity Form */}
      {showForm && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-3 border">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de atividade" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes
                .filter((t) => t.value !== "status_change")
                .map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${type.color}`} />
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Título (ex: Chamada de follow-up)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Notas ou detalhes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <Button onClick={handleSubmit} disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Registar Atividade
          </Button>
        </div>
      )}

      {/* Activities List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Sem interações registadas.</p>
          <p className="text-xs mt-1">Clique em "Nova Atividade" para adicionar.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-10">
                {/* Icon on timeline */}
                <div className="absolute left-0 top-0">
                  {getActivityIcon(activity.activity_type)}
                </div>

                <div className="bg-card border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getActivityLabel(activity.activity_type)}
                      </Badge>
                      <span className="font-medium text-sm">{activity.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(activity.created_at), "d MMM, HH:mm", { locale: pt })}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadActivities;
