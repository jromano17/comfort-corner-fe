"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  fetchCategories,
  fetchSuppliers,
  createChair,
  uploadChairImages,
  createCategory,
  createSupplier,
} from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function NewChairPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // New category dialog state
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // New supplier dialog state
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [newSupplierCountry, setNewSupplierCountry] = useState("");
  const [creatingSupplier, setCreatingSupplier] = useState(false);

  const { data: categories, mutate: mutateCategories } = useSWR(
    "categories",
    fetchCategories
  );
  const { data: suppliers, mutate: mutateSuppliers } = useSWR(
    token ? ["suppliers", token] : null,
    () => fetchSuppliers(token!)
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateCategory = async () => {
    if (!token || !newCategoryName) return;
    setCreatingCategory(true);
    try {
      const category = await createCategory(
        { name: newCategoryName, description: newCategoryDesc },
        token
      );
      mutateCategories();
      setCategoryId(category.id.toString());
      setShowNewCategory(false);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch {
      setError("Failed to create category");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateSupplier = async () => {
    if (!token || !newSupplierName || !newSupplierEmail) return;
    setCreatingSupplier(true);
    try {
      const supplier = await createSupplier(
        {
          name: newSupplierName,
          contactEmail: newSupplierEmail,
          country: newSupplierCountry,
        },
        token
      );
      mutateSuppliers();
      setSupplierId(supplier.id.toString());
      setShowNewSupplier(false);
      setNewSupplierName("");
      setNewSupplierEmail("");
      setNewSupplierCountry("");
    } catch {
      setError("Failed to create supplier");
    } finally {
      setCreatingSupplier(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setError("");

    try {
      const chair = await createChair(
        {
          name,
          description,
          basePrice: parseFloat(basePrice),
          categoryId: parseInt(categoryId),
          supplierId: parseInt(supplierId),
        },
        token
      );

      if (imageFiles.length > 0) {
        await uploadChairImages(chair.id, imageFiles, token);
      }

      router.push(`/admin/chairs/${chair.id}`);
    } catch {
      setError("Failed to create chair");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/chairs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold">New Chair</h1>
          <p className="text-muted-foreground mt-1">
            Add a new chair to the catalogue
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chair Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Elegance Dining Chair"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the chair..."
                  rows={4}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="basePrice">Base Price ($)</FieldLabel>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="299.99"
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Category</FieldLabel>
                <div className="flex gap-2">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showNewCategory} onOpenChange={setShowNewCategory}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Category</DialogTitle>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Name</FieldLabel>
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Description</FieldLabel>
                          <Textarea
                            value={newCategoryDesc}
                            onChange={(e) => setNewCategoryDesc(e.target.value)}
                            placeholder="Category description"
                          />
                        </Field>
                        <Button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory || !newCategoryName}
                        >
                          {creatingCategory ? (
                            <Spinner className="mr-2 h-4 w-4" />
                          ) : null}
                          Create Category
                        </Button>
                      </FieldGroup>
                    </DialogContent>
                  </Dialog>
                </div>
              </Field>

              <Field>
                <FieldLabel>Supplier</FieldLabel>
                <div className="flex gap-2">
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers?.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id.toString()}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showNewSupplier} onOpenChange={setShowNewSupplier}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Supplier</DialogTitle>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <FieldLabel>Name</FieldLabel>
                          <Input
                            value={newSupplierName}
                            onChange={(e) => setNewSupplierName(e.target.value)}
                            placeholder="Supplier name"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Contact Email</FieldLabel>
                          <Input
                            type="email"
                            value={newSupplierEmail}
                            onChange={(e) => setNewSupplierEmail(e.target.value)}
                            placeholder="contact@supplier.com"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Country</FieldLabel>
                          <Input
                            value={newSupplierCountry}
                            onChange={(e) => setNewSupplierCountry(e.target.value)}
                            placeholder="Country"
                          />
                        </Field>
                        <Button
                          type="button"
                          onClick={handleCreateSupplier}
                          disabled={
                            creatingSupplier || !newSupplierName || !newSupplierEmail
                          }
                        >
                          {creatingSupplier ? (
                            <Spinner className="mr-2 h-4 w-4" />
                          ) : null}
                          Create Supplier
                        </Button>
                      </FieldGroup>
                    </DialogContent>
                  </Dialog>
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary/50 hover:bg-secondary/50"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload images
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="sr-only"
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {error && (
            <p className="mb-4 text-sm text-destructive">{error}</p>
          )}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/chairs">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !name ||
                !description ||
                !basePrice ||
                !categoryId ||
                !supplierId
              }
            >
              {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
              Create Chair
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
