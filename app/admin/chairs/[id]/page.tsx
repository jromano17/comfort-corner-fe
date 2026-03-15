"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { ArrowLeft, Plus, Trash2, Upload, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { fetchChairById, fetchChairVariants } from "@/lib/api";
import {
  fetchMaterials,
  fetchColorOptions,
  fetchDimensions,
  createChairVariant,
  uploadChairImage,
  uploadVariantImage,
  createMaterial,
  createColorOption,
  createDimension,
  deleteChairVariant,
} from "@/lib/admin-api";
import { ChairVariant, CreateChairVariantRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function AdminChairDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const chairId = Number(params.id);

  const { data: chair, isLoading: chairLoading } = useSWR(
    `admin-chair-${chairId}`,
    () => fetchChairById(chairId)
  );

  const { data: variants, isLoading: variantsLoading } = useSWR(
    `admin-chair-variants-${chairId}`,
    () => fetchChairVariants(chairId)
  );

  const { data: materials } = useSWR("admin-materials", fetchMaterials);
  const { data: colorOptions } = useSWR("admin-colors", fetchColorOptions);
  const { data: dimensions } = useSWR("admin-dimensions", fetchDimensions);

  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [variantForm, setVariantForm] = useState({
    materialId: "",
    colorOptionId: "",
    dimensionId: "",
    price: "",
    stockQuantity: "",
  });
  const [variantImage, setVariantImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // New entity dialogs
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [showColorDialog, setShowColorDialog] = useState(false);
  const [showDimensionDialog, setShowDimensionDialog] = useState(false);

  const [newMaterial, setNewMaterial] = useState({ name: "", description: "" });
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });
  const [newDimension, setNewDimension] = useState({
    name: "",
    width: "",
    height: "",
    depth: "",
    weightCapacity: "",
  });

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantImage) {
      setError("Please select an image for the variant");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Create the variant first
      const request: CreateChairVariantRequest = {
        chairId,
        materialId: Number(variantForm.materialId),
        colorOptionId: Number(variantForm.colorOptionId),
        dimensionId: Number(variantForm.dimensionId),
        finalPrice: Number(variantForm.price),
        stockQuantity: Number(variantForm.stockQuantity),
      };

      const variant = await createChairVariant(request, token || undefined);
      
      // Then upload the image for this variant
      await uploadVariantImage(variant.id, variantImage, token || undefined);
      
      mutate(`admin-chair-variants-${chairId}`);
      setIsAddingVariant(false);
      setVariantForm({
        materialId: "",
        colorOptionId: "",
        dimensionId: "",
        price: "",
        stockQuantity: "",
      });
      setVariantImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create variant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      await deleteChairVariant(variantId, token || undefined);
      mutate(`admin-chair-variants-${chairId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete variant");
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      for (const file of Array.from(files)) {
        await uploadChairImage(chairId, file, token || undefined);
      }
      mutate(`admin-chair-${chairId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      await createMaterial(newMaterial, token || undefined);
      mutate("admin-materials");
      setShowMaterialDialog(false);
      setNewMaterial({ name: "", description: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create material");
    }
  };

  const handleCreateColor = async () => {
    try {
      await createColorOption(newColor, token || undefined);
      mutate("admin-colors");
      setShowColorDialog(false);
      setNewColor({ name: "", hex: "#000000" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create color");
    }
  };

  const handleCreateDimension = async () => {
    try {
      await createDimension({
        name: newDimension.name,
        width: Number(newDimension.width),
        height: Number(newDimension.height),
        depth: Number(newDimension.depth),
        weightCapacity: Number(newDimension.weightCapacity),
      }, token || undefined);
      mutate("admin-dimensions");
      setShowDimensionDialog(false);
      setNewDimension({ name: "", width: "", height: "", depth: "", weightCapacity: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create dimension");
    }
  };

  if (chairLoading || variantsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!chair) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Chair not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/chairs">Back to chairs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/chairs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-bold">{chair.name}</h1>
          <p className="text-muted-foreground">{chair.category.name}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Chair Info */}
      <Card>
        <CardHeader>
          <CardTitle>Chair Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{chair.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base Price</p>
              <p className="text-lg font-semibold">${chair.basePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="secondary">{chair.category.name}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supplier</p>
              <p>{chair.supplier?.name || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>Manage chair gallery images</CardDescription>
          </div>
          <div>
            <input
              type="file"
              id="gallery-upload"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryUpload}
            />
            <Button asChild disabled={isUploadingImage}>
              <label htmlFor="gallery-upload" className="cursor-pointer">
                {isUploadingImage ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Images
              </label>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {chair.gallery && chair.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {chair.gallery.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image src={url} alt={`${chair.name} ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No images uploaded yet</p>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Chair Variants</CardTitle>
            <CardDescription>Manage different configurations of this chair</CardDescription>
          </div>
          <Button onClick={() => setIsAddingVariant(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent>
          {variants && variants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Dimension</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant: ChairVariant) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image src={variant.image} alt="" fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>{variant.material.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: variant.colorOption.hex }}
                        />
                        {variant.colorOption.name}
                      </div>
                    </TableCell>
                    <TableCell>{variant.dimension.name}</TableCell>
                    <TableCell>${variant.finalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={variant.stockQuantity > 0 ? "secondary" : "destructive"}>
                        {variant.stockQuantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVariant(variant.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">No variants yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Variant Dialog */}
      <Dialog open={isAddingVariant} onOpenChange={setIsAddingVariant}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Chair Variant</DialogTitle>
            <DialogDescription>Create a new variant with different material, color, and dimensions</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddVariant} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Material</FieldLabel>
                <div className="flex gap-2">
                  <Select
                    value={variantForm.materialId}
                    onValueChange={(v) => setVariantForm({ ...variantForm, materialId: v })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials?.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowMaterialDialog(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel>Color</FieldLabel>
                <div className="flex gap-2">
                  <Select
                    value={variantForm.colorOptionId}
                    onValueChange={(v) => setVariantForm({ ...variantForm, colorOptionId: v })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                            {c.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowColorDialog(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel>Dimension</FieldLabel>
                <div className="flex gap-2">
                  <Select
                    value={variantForm.dimensionId}
                    onValueChange={(v) => setVariantForm({ ...variantForm, dimensionId: v })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      {dimensions?.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name} ({d.width}x{d.depth}x{d.height}cm)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowDimensionDialog(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Price ($)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Stock Quantity</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    value={variantForm.stockQuantity}
                    onChange={(e) => setVariantForm({ ...variantForm, stockQuantity: e.target.value })}
                    required
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Variant Image</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVariantImage(e.target.files?.[0] || null)}
                  required
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddingVariant(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                Create Variant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Material Dialog */}
      <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                placeholder="e.g., Premium Leather"
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                placeholder="e.g., High-quality genuine leather"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaterialDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateMaterial}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Color Dialog */}
      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Color</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="e.g., Midnight Blue"
              />
            </Field>
            <Field>
              <FieldLabel>Color</FieldLabel>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowColorDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateColor}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dimension Dialog */}
      <Dialog open={showDimensionDialog} onOpenChange={setShowDimensionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Dimension</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                value={newDimension.name}
                onChange={(e) => setNewDimension({ ...newDimension, name: e.target.value })}
                placeholder="e.g., Standard, Large, Compact"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Width (cm)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={newDimension.width}
                  onChange={(e) => setNewDimension({ ...newDimension, width: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Height (cm)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={newDimension.height}
                  onChange={(e) => setNewDimension({ ...newDimension, height: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Depth (cm)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={newDimension.depth}
                  onChange={(e) => setNewDimension({ ...newDimension, depth: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel>Weight Capacity (kg)</FieldLabel>
                <Input
                  type="number"
                  min="0"
                  value={newDimension.weightCapacity}
                  onChange={(e) => setNewDimension({ ...newDimension, weightCapacity: e.target.value })}
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDimensionDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateDimension}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
