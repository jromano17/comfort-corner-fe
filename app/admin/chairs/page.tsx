"use client";

import Link from "next/link";
import useSWR from "swr";
import { Plus, Edit, Trash2 } from "lucide-react";
import { fetchChairs } from "@/lib/api";
import { deleteChair } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function ChairsListPage() {
  const { token } = useAuth();
  const { data: chairs, error, isLoading, mutate } = useSWR("admin-chairs", fetchChairs);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!token) return;
    setDeletingId(id);
    try {
      await deleteChair(id);
      mutate();
    } catch (err) {
      console.error("Failed to delete chair:", err);
    } finally {
      setDeletingId(null);
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
      <div className="py-20 text-center text-destructive">
        Failed to load chairs
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Chairs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your chair inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/chairs/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Chair
          </Link>
        </Button>
      </div>

      {chairs && chairs.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chairs.map((chair) => (
                <TableRow key={chair.id}>
                  <TableCell className="font-medium">{chair.name}</TableCell>
                  <TableCell>{chair.category.name}</TableCell>
                  <TableCell>{chair.supplier?.name || "-"}</TableCell>
                  <TableCell>${chair.basePrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link href={`/admin/chairs/${chair.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Chair</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{chair.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(chair.id)}
                              disabled={deletingId === chair.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingId === chair.id ? (
                                <Spinner className="h-4 w-4" />
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No chairs yet</p>
          <Button asChild className="mt-4">
            <Link href="/admin/chairs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Chair
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
