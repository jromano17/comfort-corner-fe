"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORY_NAMES, CategoryName } from "@/lib/types";

interface CatalogueFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: CategoryName | null;
  onCategoryChange: (category: CategoryName | null) => void;
}

export function CatalogueFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: CatalogueFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search chairs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Category:</span>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Button>
        {CATEGORY_NAMES.map((categoryName) => (
          <Button
            key={categoryName}
            variant={selectedCategory === categoryName ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(categoryName)}
          >
            {categoryName}
          </Button>
        ))}
      </div>
    </div>
  );
}
