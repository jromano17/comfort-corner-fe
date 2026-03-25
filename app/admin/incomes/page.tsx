"use client";

import { useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { fetchIncomes, fetchOrderss } from "@/lib/admin-api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function OrdersPage() {
  const { token } = useAuth();
  const { data: incomes, error, isLoading } = useSWR(
    token ? ["admin-incomes", token] : null,
    ([_, tkn]) => fetchIncomes(), 
    { keepPreviousData: true } 
  );

  if (isLoading && !incomes) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load incomes. Please ensure your backend is running.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Incomes</h1>
          <p className="text-muted-foreground">Manage Comfort Corner incomes</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Incomes</CardTitle>
          <CardDescription>
            total incomes found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incomes && incomes.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date of record</TableHead>
                    <TableHead>Income amount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Net income</TableHead>
                    <TableHead className="text-right">Actions</TableHead> {/* New Header */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes?.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell className="font-mono text-sm">{income.id}</TableCell>
                      <TableCell className="font-medium">{income.orderId}</TableCell>
                      <TableCell className="font-medium">{new Date(income.recordedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${income.incomeAmount}</TableCell>
                      <TableCell className="font-medium">${income.tax}</TableCell>
                      <TableCell className="font-medium">${income.cost}</TableCell>
                      <TableCell className="font-medium">${income.netIncome}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${income.orderId}`} className="text-blue-600 hover:underline">
                          View Order
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No incomes found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}