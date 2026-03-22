"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Ruler, Package, Weight, ShoppingCart, Check } from "lucide-react";
import { fetchChairById, fetchChairVariants } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { ChairVariant } from "@/lib/types";
import { ImageGallery } from "./image-gallery";
import { VariantSelector } from "./variant-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface ChairDetailProps {
  chairId: number;
}

export function ChairDetail({ chairId }: ChairDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ChairVariant | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const { data: chair, error: chairError, isLoading: chairLoading } = useSWR(
    `chair-${chairId}`,
    () => fetchChairById(chairId)
  );

  const { data: variants, error: variantsError, isLoading: variantsLoading } = useSWR(
    `chair-variants-${chairId}`,
    () => fetchChairVariants(chairId)
  );

  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants[0]);
    }
  }, [variants, selectedVariant]);

  // Combine chair gallery images with variant images
  const galleryImages = useMemo(() => {
    const images: { url: string; alt: string }[] = [];
    
    // Add chair gallery images first
    if (chair?.galleryImageUrls) {
      chair.galleryImageUrls.forEach((url, index) => {
        images.push({
          url,
          alt: `${chair.name} - Image ${index + 1}`,
        });
      });
    }
    
    // Add variant images
    if (variants) {
      variants.forEach((variant) => {
        images.push({
          url: variant.image,
          alt: `${chair?.name || "Chair"} - ${variant.material.name} in ${variant.colorOption.name}`,
        });
      });
    }
    
    return images;
  }, [chair, variants]);

  const isLoading = chairLoading || variantsLoading;
  const error = chairError || variantsError;

  const handleAddToCart = () => {
    if (selectedVariant && chair) {
      addItem(selectedVariant, chair.name);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !chair) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-destructive">Failed to load chair details</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please make sure your backend is running
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Back to catalogue</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to catalogue
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery images={galleryImages} />

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {chair.category.name}
            </Badge>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {chair.name}
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {chair.description}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            {selectedVariant ? (
              <>
                <span className="font-serif text-3xl font-bold text-primary">
                  ${selectedVariant.finalPrice.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  (Base price: ${chair.basePrice.toLocaleString()})
                </span>
              </>
            ) : (
              <span className="font-serif text-3xl font-bold text-primary">
                From ${chair.basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {variants && variants.length > 0 && (
            <VariantSelector
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
            />
          )}

          {selectedVariant && (
            <div className="rounded-lg border bg-secondary/30 p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Selected Configuration
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">
                      {selectedVariant.material.name}
                    </span>
                    <span className="text-muted-foreground"> in </span>
                    <span className="font-medium text-foreground">
                      {selectedVariant.colorOption.name}
                    </span>
                    {selectedVariant.material.description && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {selectedVariant.material.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Ruler className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-medium text-foreground">
                      {selectedVariant.dimension.name}
                    </span>
                    <p className="text-muted-foreground text-xs mt-1">
                      {selectedVariant.dimension.width}cm W x {selectedVariant.dimension.depth}cm D x {selectedVariant.dimension.height}cm H
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Weight className="h-4 w-4" />
                  <span>Weight Capacity: {selectedVariant.dimension.weightCapacity} kg</span>
                </div>
              </div>
            </div>
          )}

          {selectedVariant && (
            <div className="flex flex-col gap-3 pt-2">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/login">Sign in to Order</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    You need to be logged in to add items to your cart
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
