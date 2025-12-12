import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Settings, Plus, GripVertical, Trash2, Loader2, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LeadStage {
  id: string;
  name: string;
  color: string;
  border_color: string;
  sort_order: number;
  is_active: boolean;
}

const defaultColors = [
  { color: "#3b82f6", border: "#2563eb", name: "Azul" },
  { color: "#22c55e", border: "#16a34a", name: "Verde" },
  { color: "#eab308", border: "#ca8a04", name: "Amarelo" },
  { color: "#f97316", border: "#ea580c", name: "Laranja" },
  { color: "#ef4444", border: "#dc2626", name: "Vermelho" },
  { color: "#a855f7", border: "#9333ea", name: "Roxo" },
  { color: "#ec4899", border: "#db2777", name: "Rosa" },
  { color: "#6366f1", border: "#4f46e5", name: "Índigo" },
  { color: "#14b8a6", border: "#0d9488", name: "Teal" },
  { color: "#64748b", border: "#475569", name: "Cinza" },
];

interface KanbanSettingsProps {
  stages: LeadStage[];
  onStagesChange: () => void;
}

const KanbanSettings = ({ stages, onStagesChange }: KanbanSettingsProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [localStages, setLocalStages] = useState<LeadStage[]>([]);
  const [saving, setSaving] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setLocalStages([...stages]);
    }
  }, [open, stages]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newStages = [...localStages];
    const draggedItem = newStages[draggedIndex];
    newStages.splice(draggedIndex, 1);
    newStages.splice(index, 0, draggedItem);
    
    // Update sort_order
    newStages.forEach((stage, idx) => {
      stage.sort_order = idx;
    });

    setLocalStages(newStages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const addStage = () => {
    if (!newStageName.trim()) return;

    const color = defaultColors[selectedColorIndex];
    const newStage: LeadStage = {
      id: crypto.randomUUID(),
      name: newStageName.trim(),
      color: color.color,
      border_color: color.border,
      sort_order: localStages.length,
      is_active: true,
    };

    setLocalStages([...localStages, newStage]);
    setNewStageName("");
    setSelectedColorIndex((prev) => (prev + 1) % defaultColors.length);
  };

  const removeStage = (id: string) => {
    setLocalStages(localStages.filter((s) => s.id !== id));
  };

  const updateStageName = (id: string, name: string) => {
    setLocalStages(
      localStages.map((s) => (s.id === id ? { ...s, name } : s))
    );
  };

  const updateStageColor = (id: string, colorIndex: number) => {
    const color = defaultColors[colorIndex];
    setLocalStages(
      localStages.map((s) =>
        s.id === id ? { ...s, color: color.color, border_color: color.border } : s
      )
    );
  };

  const toggleStageActive = (id: string) => {
    setLocalStages(
      localStages.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  };

  const saveChanges = async () => {
    setSaving(true);

    try {
      // Delete all existing stages and insert new ones
      const { error: deleteError } = await supabase
        .from("lead_stages")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (deleteError) throw deleteError;

      // Insert all stages
      const { error: insertError } = await supabase
        .from("lead_stages")
        .insert(
          localStages.map((stage) => ({
            id: stage.id,
            name: stage.name,
            color: stage.color,
            border_color: stage.border_color,
            sort_order: stage.sort_order,
            is_active: stage.is_active,
          }))
        );

      if (insertError) throw insertError;

      toast({
        title: "Configurações guardadas",
        description: "As fases do Kanban foram atualizadas com sucesso.",
      });

      onStagesChange();
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving stages:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível guardar as alterações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar Colunas do Kanban</DialogTitle>
          <DialogDescription>
            Personalize as fases do pipeline de leads. Arraste para reordenar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new stage */}
          <div className="flex gap-2">
            <Input
              placeholder="Nome da nova fase..."
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStage()}
            />
            <div className="flex gap-1">
              {defaultColors.slice(0, 5).map((c, idx) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColorIndex === idx
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                />
              ))}
            </div>
            <Button onClick={addStage} size="icon" disabled={!newStageName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Stages list */}
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {localStages.map((stage, index) => (
                <div
                  key={stage.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg border transition-all ${
                    draggedIndex === index ? "opacity-50 scale-95" : ""
                  } ${!stage.is_active ? "opacity-60" : ""}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0" />
                  
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  
                  <Input
                    value={stage.name}
                    onChange={(e) => updateStageName(stage.id, e.target.value)}
                    className="flex-1 h-8"
                  />

                  <div className="flex items-center gap-1">
                    {defaultColors.map((c, idx) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => updateStageColor(stage.id, idx)}
                        className={`w-4 h-4 rounded-full transition-all hover:scale-110 ${
                          stage.color === c.color ? "ring-2 ring-offset-1 ring-foreground" : ""
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.name}
                      />
                    ))}
                  </div>

                  <Switch
                    checked={stage.is_active}
                    onCheckedChange={() => toggleStageActive(stage.id)}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStage(stage.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    disabled={localStages.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveChanges} disabled={saving || localStages.length === 0}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KanbanSettings;
