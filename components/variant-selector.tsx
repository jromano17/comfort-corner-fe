"use client";

import { useMemo } from "react";
import { ChairVariant, Material, ColorOption, Dimension } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ChairVariant[];
  selectedVariant: ChairVariant | null;
  onVariantSelect: (variant: ChairVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantSelect,
}: VariantSelectorProps) {
  // Get unique materials, colors, and dimensions by ID
  const materials = useMemo(() => {
    const uniqueMaterials = new Map<number, Material>();
    variants.forEach((v) => uniqueMaterials.set(v.material.id, v.material));
    return Array.from(uniqueMaterials.values());
  }, [variants]);

  const colors = useMemo(() => {
    const uniqueColors = new Map<number, ColorOption>();
    variants.forEach((v) => uniqueColors.set(v.colorOption.id, v.colorOption));
    return Array.from(uniqueColors.values());
  }, [variants]);

  const dimensions = useMemo(() => {
    const uniqueDimensions = new Map<number, Dimension>();
    variants.forEach((v) => uniqueDimensions.set(v.dimension.id, v.dimension));
    return Array.from(uniqueDimensions.values());
  }, [variants]);

  const selectedMaterialId = selectedVariant?.material.id || materials[0]?.id;
  const selectedColorId = selectedVariant?.colorOption.id || colors[0]?.id;
  const selectedDimensionId = selectedVariant?.dimension.id || dimensions[0]?.id;

  const handleMaterialChange = (materialId: number) => {
    const newVariant = variants.find(
      (v) => v.material.id === materialId && v.colorOption.id === selectedColorId && v.dimension.id === selectedDimensionId
    ) || variants.find(
      (v) => v.material.id === materialId && v.colorOption.id === selectedColorId
    ) || variants.find((v) => v.material.id === materialId);
    if (newVariant) onVariantSelect(newVariant);
  };

  const handleColorChange = (colorId: number) => {
    const newVariant = variants.find(
      (v) => v.colorOption.id === colorId && v.material.id === selectedMaterialId && v.dimension.id === selectedDimensionId
    ) || variants.find(
      (v) => v.colorOption.id === colorId && v.material.id === selectedMaterialId
    ) || variants.find((v) => v.colorOption.id === colorId);
    if (newVariant) onVariantSelect(newVariant);
  };

  const handleDimensionChange = (dimensionId: number) => {
    const newVariant = variants.find(
      (v) => v.dimension.id === dimensionId && v.material.id === selectedMaterialId && v.colorOption.id === selectedColorId
    ) || variants.find(
      (v) => v.dimension.id === dimensionId && v.material.id === selectedMaterialId
    ) || variants.find((v) => v.dimension.id === dimensionId);
    if (newVariant) onVariantSelect(newVariant);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Material</h3>
        <div className="flex flex-wrap gap-2">
          {materials.map((material) => (
            <button
              key={material.id}
              onClick={() => handleMaterialChange(material.id)}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium transition-all",
                selectedMaterialId === material.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
              )}
              title={material.description}
            >
              {material.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorChange(color.id)}
              className={cn(
                "flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-all",
                selectedColorId === color.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-foreground/20"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {dimensions.length > 1 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-foreground">Size</h3>
          <div className="flex flex-wrap gap-2">
            {dimensions.map((dimension) => (
              <button
                key={dimension.id}
                onClick={() => handleDimensionChange(dimension.id)}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm font-medium transition-all",
                  selectedDimensionId === dimension.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                )}
              >
                {dimension.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
