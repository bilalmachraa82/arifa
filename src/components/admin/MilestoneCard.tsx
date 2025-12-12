import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar, Check, GripVertical, Trash2, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  target_date: string | null;
  completed_date: string | null;
  is_completed: boolean;
  sort_order: number;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function MilestoneCard({ milestone, onToggleComplete, onDelete }: MilestoneCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = milestone.target_date && 
    !milestone.is_completed && 
    new Date(milestone.target_date) < new Date();
  
  const isUpcoming = milestone.target_date && 
    !milestone.is_completed && 
    !isOverdue &&
    new Date(milestone.target_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border rounded-lg p-3 shadow-sm transition-all",
        isDragging && "opacity-50 shadow-lg rotate-2",
        milestone.is_completed && "opacity-60 bg-muted/50",
        isOverdue && !milestone.is_completed && "border-destructive/50 bg-destructive/5",
        isUpcoming && !milestone.is_completed && "border-yellow-500/50 bg-yellow-500/5"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        
        <Checkbox
          checked={milestone.is_completed}
          onCheckedChange={(checked) => onToggleComplete(milestone.id, checked as boolean)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-sm leading-tight",
            milestone.is_completed && "line-through text-muted-foreground"
          )}>
            {milestone.name}
          </p>
          
          {milestone.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {milestone.description}
            </p>
          )}
          
          {milestone.target_date && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs",
              isOverdue ? "text-destructive" : isUpcoming ? "text-yellow-600" : "text-muted-foreground"
            )}>
              {isOverdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span>
                {format(new Date(milestone.target_date), "dd MMM yyyy", { locale: pt })}
              </span>
              {isOverdue && <span className="font-medium">(Atrasado)</span>}
            </div>
          )}
          
          {milestone.is_completed && milestone.completed_date && (
            <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
              <Check className="h-3 w-3" />
              <span>
                Concluído em {format(new Date(milestone.completed_date), "dd MMM yyyy", { locale: pt })}
              </span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(milestone.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
