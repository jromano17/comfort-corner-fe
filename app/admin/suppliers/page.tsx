"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Plus, Trash2, Truck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchSuppliers, createSupplier, deleteSupplier } from "@/lib/admin-api";
import { Supplier } from "@/lib/types";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

export default function AdminSuppliersPage() {
  const { token } = useAuth();
  const { data: suppliers, isLoading } = useSWR(
    token ? "admin-suppliers" : null,
    () => fetchSuppliers(token!)
  );
  const [showDialog, setShowDialog] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", contactEmail: "", country: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createSupplier(newSupplier, token || undefined);
      mutate("admin-suppliers");
      setShowDialog(false);
      setNewSupplier({ name: "", contactEmail: "", country: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await deleteSupplier(id, token || undefined);
      mutate("admin-suppliers");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete supplier");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage chair suppliers</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>Suppliers providing chairs to your store</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-8 w-8 text-primary" />
            </div>
          ) : suppliers && suppliers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier: Supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactEmail}</TableCell>
                    <TableCell>{supplier.country}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(supplier.id)}
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
              <Truck className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">No suppliers yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="e.g., Premium Furniture Co."
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Contact Email</FieldLabel>
                <Input
                  type="email"
                  value={newSupplier.contactEmail}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })}
                  placeholder="contact@supplier.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <Input
                  value={newSupplier.country}
                  onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
                  placeholder="e.g., Germany"
                  required
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
