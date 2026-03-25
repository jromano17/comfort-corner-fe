"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchDimensions, createDimension } from "@/lib/admin-api";
import { CreateDimensionRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export default function DimensionsPage() {
  const { data: dimensions, error, isLoading, mutate } = useSWR("admin-dimensions", fetchDimensions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateDimensionRequest>({
    name: "",
    width: 0,
    height: 0,
    depth: 0,
    weightCapacity: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDimension(formData);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", width: 0, height: 0, depth: 0, weightCapacity: 0 });
    } catch (err) {
      console.error("Failed to create dimension:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load dimensions. Please ensure your backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Dimensions</h1>
          <p className="text-muted-foreground">Manage chair size configurations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Dimension
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Dimension</DialogTitle>
                <DialogDescription>
                  Create a new size configuration for chair variants.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Size Name</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Standard, Large, XL"
                    required
                  />
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel>Width (cm)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.width || ""}
                      onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Height (cm)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.height || ""}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Depth (cm)</FieldLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.depth || ""}
                      onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Weight Capacity (kg)</FieldLabel>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.weightCapacity || ""}
                    onChange={(e) => setFormData({ ...formData, weightCapacity: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Create Dimension
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Dimensions</CardTitle>
          <CardDescription>
            {dimensions?.length || 0} size configurations available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dimensions && dimensions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Depth</TableHead>
                  <TableHead>Weight Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dimensions.map((dim) => (
                  <TableRow key={dim.id}>
                    <TableCell className="font-mono text-sm">{dim.id}</TableCell>
                    <TableCell className="font-medium">{dim.name}</TableCell>
                    <TableCell>{dim.width} cm</TableCell>
                    <TableCell>{dim.height} cm</TableCell>
                    <TableCell>{dim.depth} cm</TableCell>
                    <TableCell>{dim.weightCapacity} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No dimensions found. Create your first dimension to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
