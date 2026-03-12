"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetchChairs } from "@/lib/api";
import { CategoryName } from "@/lib/types";
import { ChairCard } from "./chair-card";
import { CatalogueFilters } from "./catalogue-filters";
import { Spinner } from "@/components/ui/spinner";

export function CatalogueGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);

  const { data: chairs, error, isLoading } = useSWR("chairs", fetchChairs);

  const filteredChairs = useMemo(() => {
    if (!chairs) return [];

    return chairs.filter((chair) => {
      const matchesSearch =
        searchQuery === "" ||
        chair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chair.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || chair.category.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [chairs, searchQuery, selectedCategory]);

  if (error) {
    console.log(error);
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-destructive">Failed to load chairs</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please make sure your backend is running on localhost:8080
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <CatalogueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      ) : filteredChairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">No chairs found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredChairs.length} {filteredChairs.length === 1 ? "chair" : "chairs"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredChairs.map((chair) => (
              <ChairCard key={chair.id} chair={chair} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
