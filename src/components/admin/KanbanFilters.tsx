import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter, TrendingUp, Calendar, Building2 } from "lucide-react";

interface KanbanFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  segmentFilter: string;
  onSegmentChange: (value: string) => void;
  scoreFilter: string;
  onScoreChange: (value: string) => void;
  periodFilter: string;
  onPeriodChange: (value: string) => void;
  onClearFilters: () => void;
  segments: string[];
  activeFiltersCount: number;
}

const KanbanFilters = ({
  searchTerm,
  onSearchChange,
  segmentFilter,
  onSegmentChange,
  scoreFilter,
  onScoreChange,
  periodFilter,
  onPeriodChange,
  onClearFilters,
  segments,
  activeFiltersCount,
}: KanbanFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Segment Filter */}
      <Select value={segmentFilter} onValueChange={onSegmentChange}>
        <SelectTrigger className="w-[150px] h-9">
          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Segmento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {segments.map((segment) => (
            <SelectItem key={segment} value={segment}>
              {segment}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AI Score Filter */}
      <Select value={scoreFilter} onValueChange={onScoreChange}>
        <SelectTrigger className="w-[150px] h-9">
          <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="AI Score" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="high">Alto (80+)</SelectItem>
          <SelectItem value="medium">Médio (60-79)</SelectItem>
          <SelectItem value="low">Baixo (&lt;60)</SelectItem>
          <SelectItem value="none">Sem score</SelectItem>
        </SelectContent>
      </Select>

      {/* Period Filter */}
      <Select value={periodFilter} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[150px] h-9">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Esta semana</SelectItem>
          <SelectItem value="month">Este mês</SelectItem>
          <SelectItem value="quarter">Este trimestre</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Filters Badge & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Filter className="h-3 w-3" />
            {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
};

export default KanbanFilters;
