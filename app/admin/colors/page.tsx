"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchColorOptions, createColorOption } from "@/lib/admin-api";
import { CreateColorOptionRequest } from "@/lib/types";
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

export default function ColorsPage() {
  const { token } = useAuth();
  const { data: colors, error, isLoading, mutate } = useSWR("admin-colors", fetchColorOptions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateColorOptionRequest>({
    name: "",
    hexCode: "#000000",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createColorOption(formData, token || undefined);
      mutate();
      setIsDialogOpen(false);
      setFormData({ name: "", hexCode: "#000000" });
    } catch (err) {
      console.error("Failed to create color:", err);
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
        Failed to load colors. Please ensure your backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Color Options</h1>
          <p className="text-muted-foreground">Manage available color options</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Color</DialogTitle>
                <DialogDescription>
                  Create a new color option for chair variants.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Color Name</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Midnight Blue"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>Hex Code</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={formData.hexCode}
                      onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                      className="h-10 w-16 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.hexCode}
                      onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                      placeholder="#000000"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      required
                      className="font-mono"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                  Create Color
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Colors</CardTitle>
          <CardDescription>
            {colors?.length || 0} colors available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {colors && colors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Hex Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell className="font-mono text-sm">{color.id}</TableCell>
                    <TableCell>
                      <div
                        className="h-8 w-8 rounded-full border border-foreground/20"
                        style={{ backgroundColor: color.hexCode }}
                        title={color.hexCode}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{color.name}</TableCell>
                    <TableCell className="font-mono text-sm">{color.hexCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No colors found. Create your first color to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
