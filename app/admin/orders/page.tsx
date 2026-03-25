"use client";

import { useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { fetchOrderss } from "@/lib/admin-api";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button"; // Assuming you have this shadcn component
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
  
  const [pageIndex, setPageIndex] = useState(0);

  const { data: paginatedData, error, isLoading } = useSWR(
    token ? ["admin-orders", pageIndex, token] : null,
    ([_, page, tkn]) => fetchOrderss(page, 10), 
    { keepPreviousData: true } //
  );

  if (isLoading && !paginatedData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-destructive">
        Failed to load orders. Please ensure your backend is running.
      </div>
    );
  }

  // Safely extract the array of orders from the paginated response
  const orders = paginatedData?.content || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage Comfort Corner orders</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            {/* Show total elements instead of just the current page's length */}
            {paginatedData?.totalElements || 0} total orders found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Order number</TableHead>
                    <TableHead>Date of creation</TableHead>
                    <TableHead>Total amount</TableHead>
                    <TableHead>Current status</TableHead>
                    <TableHead className="text-right">Actions</TableHead> {/* New Header */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${order.totalPrice}</TableCell>
                      <TableCell className="font-medium">{order.currentStatus}</TableCell>
                      {/* Wrapped Link in a TableCell and aligned it to the right */}
                      <TableCell className="text-right">
                        <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 3. Pagination Controls */}
              {paginatedData && paginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Page {paginatedData.number + 1} of {paginatedData.totalPages}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paginatedData.number === 0}
                      onClick={() => setPageIndex((prev) => prev - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paginatedData.number >= paginatedData.totalPages - 1}
                      onClick={() => setPageIndex((prev) => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No orders found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}