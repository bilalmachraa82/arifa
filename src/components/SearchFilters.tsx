import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  locations?: string[];
  activeLocation?: string;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
  locations,
  activeLocation,
  onLocationChange,
  placeholder = "Pesquisar..."
}: SearchFiltersProps) {
  const hasActiveFilters = searchQuery || activeCategory !== "Todos" || (activeLocation && activeLocation !== "Todas");

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("Todos");
    if (onLocationChange) {
      onLocationChange("Todas");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Locations */}
        {locations && locations.length > 0 && onLocationChange && (
          <>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex flex-wrap gap-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => onLocationChange(location)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                    activeLocation === location
                      ? "bg-arifa-teal text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {location}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}